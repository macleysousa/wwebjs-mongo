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
        const collectionName = `whatsapp-${options.session}.files`;
        const collections = await this.mongoose.connection.db?.listCollections()?.toArray();
        const collectionExists = collections?.some(collection => collection.name === collectionName);
        return collectionExists;
    }

    async save(options: { session: string }): Promise<void> {
        const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
        return new Promise((resolve, reject) => {
            fs.createReadStream(`${options.session}.zip`)
                .pipe(bucket.openUploadStream(`${options.session}.zip`))
                .on('error', err => reject(err))
                .on('close', async () => {
                    await this.deletePrevious(options);
                    resolve?.call(undefined);
                });
        });
    }

    async extract(options: { session: string, path: string }): Promise<void> {
        const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
        return new Promise((resolve, reject) => {
            bucket.openDownloadStreamByName(`${options.session}.zip`)
                .pipe(fs.createWriteStream(options.path))
                .on('error', err => reject(err))
                .on('close', () => resolve());
        });
    }

    async delete(options: { session: string }) {
        const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
        const documents = await bucket.find({
            filename: `${options.session}.zip`
        }).toArray();

        documents.map(async doc => {
            return bucket.delete(doc._id);
        });
    }

    private async deletePrevious(options: { session: string }) {
        const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
        const documents = await bucket.find({ filename: `${options.session}.zip` }).toArray();
        if (documents.length > 1) {
            const oldSession = documents.reduce((a: any, b: any) => a.uploadDate < b.uploadDate ? a : b);
            return bucket.delete(oldSession._id);
        }
    }
}