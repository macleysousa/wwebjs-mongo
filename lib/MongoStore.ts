import * as fs from 'fs';
import { ConnectionStates, Mongoose } from 'mongoose';
import AdmZip from 'adm-zip';
import { ObjectId } from 'bson';

type Props = {
    mongoose: Mongoose;
};

export class MongoStore {
    private mongoose: Mongoose;

    constructor({ mongoose }: Props) {
        if (!mongoose) throw new Error('A valid Mongoose instance is required for MongoStore.');
        this.mongoose = mongoose;
    }

    async isConnectionReady(): Promise<boolean> {
        while (this.mongoose.connection.readyState !== 1) {
            switch (this.mongoose.connection.readyState) {
                case ConnectionStates.connecting:
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    break;
                case ConnectionStates.disconnecting:
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    break;
                default:
                    throw new Error('Connection to MongoDB was disconnected');
            }
        }
        return true;
    }

    async sessionExists(options: { session: string }): Promise<boolean> {
        if (await this.isConnectionReady()) {
            const collectionName = `whatsapp-${options.session}.files`;
            const collections = await this.mongoose.connection.db?.listCollections()?.toArray();
            const collectionExists = collections?.some(collection => collection.name === collectionName);
            return collectionExists ?? false;
        }
        return false;
    }

    async save(options: { session: string }): Promise<void> {
        if (await this.isConnectionReady()) {
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
    }

    async extract(options: { session: string, path: string }): Promise<void> {
        if (await this.isConnectionReady()) {
            const bucket: any = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            return new Promise((resolve, reject) => {
                bucket.openDownloadStreamByName(`${options.session}.zip`)
                    .pipe(fs.createWriteStream(options.path))
                    .on('error', (err: any) => reject(err))
                    .on('close', async () => {
                        const zip = new AdmZip(options.path);
                        if (!zip.test()) {
                            reject(new Error('The downloaded file is corrupted.'));
                        } else {
                            resolve()
                        }
                    });
            });
        }
    }

    async delete(options: { session: string }) {
        if (await this.isConnectionReady()) {
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            const documents = await bucket.find({
                filename: `${options.session}.zip`
            }).toArray();

            documents.map(async doc => {
                return bucket.delete(doc._id);
            });
        }
    }

    private async checkValidZip(session: string, documentId: ObjectId): Promise<boolean> {
        if (await this.isConnectionReady()) {
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${session}` });
            return new Promise((resolve) => {
                const path = `./${documentId}.zip`;
                bucket.openDownloadStream(documentId).pipe(fs.createWriteStream(path))
                    .on('error', () => resolve(false))
                    .on('close', async () => {
                        const zip = new AdmZip(path);
                        if (!zip.test()) {
                            resolve(false)
                        } else {
                            resolve(true)
                        }
                        fs.rmSync(path);
                    });
            })
        }
        return false;
    }

    private async deletePrevious(options: { session: string }) {
        if (await this.isConnectionReady()) {
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            const documents = await bucket.find({ filename: `${options.session}.zip` }).toArray();

            const newDocument = documents.reduce((a: any, b: any) => a.uploadDate > b.uploadDate ? a : b);
            if (!await this.checkValidZip(options.session, newDocument._id)) {
                console.log('File is corrupted, deleting...');
                return bucket.delete(newDocument._id);
            }

            if (documents.length > 1) {
                const oldSession = documents.reduce((a: any, b: any) => a.uploadDate < b.uploadDate ? a : b);
                return bucket.delete(oldSession._id);
            }
        }
    }
}