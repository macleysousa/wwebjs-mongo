import * as fs from 'fs';
import { Mongoose } from 'mongoose';


type Props = {
    mongoose: Mongoose;
};

export class MongoStore {
    private mongoose: Mongoose;

    constructor({ mongoose }: Props) {
        if (!mongoose) throw new Error('A valid Mongoose instance is required for MongoStore.');
        this.mongoose = mongoose;
    }

    async sessionExists(options: { session: string }): Promise<boolean> {
        const multiDeviceCollection = this.mongoose.connection.db.collection(`whatsapp-${options.session}.files`);
        const hasExistingSession: number = await multiDeviceCollection.countDocuments();
        return !!hasExistingSession;
    }

    async save(options: { session: string, bucket: any }): Promise<void> {
        const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, {
            bucketName: `whatsapp-${options.session}`
        });
        await new Promise((resolve, reject) => {
            fs.createReadStream(`${options.session}.zip`)
                .pipe(bucket.openUploadStream(`${options.session}.zip`))
                .on('error', err => reject(err))
                .on('close', () => resolve);
        });
        options.bucket = bucket;
        await this.deletePrevious(options);
    }

    async extract(options: { session: string, path: string }): Promise<void> {
        const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, {
            bucketName: `whatsapp-${options.session}`
        });
        return new Promise((resolve, reject) => {
            bucket.openDownloadStreamByName(`${options.session}.zip`)
                .pipe(fs.createWriteStream(options.path))
                .on('error', err => reject(err))
                .on('close', () => resolve());
        });
    }

    async delete(options: { session: string }) {
        const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, {
            bucketName: `whatsapp-${options.session}`
        });
        const documents = await bucket.find({
            filename: `${options.session}.zip`
        }).toArray();

        documents.map(async doc => {
            return bucket.delete(doc._id);
        });
    }

    private async deletePrevious(options: { session: string, bucket: any }) {
        const documents = await options.bucket.find({
            filename: `${options.session}.zip`
        }).toArray();
        if (documents.length > 1) {
            const oldSession = documents.reduce((a: any, b: any) => a.uploadDate < b.uploadDate ? a : b);
            return options.bucket.delete(oldSession._id);
        }
    }
}