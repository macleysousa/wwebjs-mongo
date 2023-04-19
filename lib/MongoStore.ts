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
            var bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, {
                bucketName: `whatsapp-${options.session}`
            });
            return new Promise((resolve, reject) => {
                bucket.openDownloadStreamByName(`${options.session}.zip`)
                    .pipe(fs.createWriteStream(options.path))
                    .on('error', err => reject(err))
                    .on('close', () => resolve());
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

    private async checkValidZip(options: { session: string, documentId: ObjectId, path: string }): Promise<boolean> {
        if (await this.isConnectionReady()) {
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            return new Promise((resolve) => {
                const path = __dirname + `/${options.path}`;
                bucket.openDownloadStream(options.documentId).pipe(fs.createWriteStream(path))
                    .on('error', () => resolve(false))
                    .on('close', async () => {
                        const zip = new AdmZip(path);
                        if (!zip.test())
                            resolve(false)
                        else
                            resolve(true)

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

            const path = `./${newDocument._id}.zip`

            const checaked = await this.checkValidZip({ session: options.session, documentId: newDocument._id, path: path });

            if (!checaked) {
                console.log('File is corrupted, deleting...');

                return bucket.delete(newDocument._id);
            }

            if (documents.length > 1) {
                return documents.filter((doc: any) => doc._id != newDocument._id).map(async (old) => bucket.delete(old._id));
            }
        }
    }
}