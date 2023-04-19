import * as fs from 'fs';
import { ConnectionStates, Mongoose } from 'mongoose';
import AdmZip from 'adm-zip';
import { ObjectId } from 'bson';

type Props = {
    mongoose: Mongoose;
    debug?: boolean;
};

export class MongoStore {
    private mongoose: Mongoose;
    private debug: boolean;

    constructor({ mongoose, debug }: Props) {
        if (!mongoose) throw new Error('A valid Mongoose instance is required for MongoStore.');
        this.mongoose = mongoose;
        this.debug = debug ?? false;
    }

    async isConnectionReady(): Promise<boolean> {
        if (this.debug) { console.log('Checking connection to MongoDB'); }

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
            if (this.debug) { console.log('Checking if session exists in MongoDB'); }
            const collectionName = `whatsapp-${options.session}.files`;
            const collections = await this.mongoose.connection.db?.listCollections()?.toArray();
            const collectionExists = collections?.some(collection => collection.name === collectionName);
            return collectionExists ?? false;
        }
        return false;
    }

    async save(options: { session: string }): Promise<void> {
        if (await this.isConnectionReady()) {
            if (this.debug) { console.log('Saving session to MongoDB'); }

            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            return new Promise((resolve, reject) => {
                fs.createReadStream(`${options.session}.zip`)
                    .pipe(bucket.openUploadStream(`${options.session}.zip`))
                    .on('error', err => reject(err))
                    .on('close', async () => {
                        await this.deletePrevious(options);
                        resolve?.call(undefined);
                        if (this.debug) { console.log('Session saved to MongoDB'); }
                    });
            });
        }
    }

    async extract(options: { session: string, path: string }): Promise<void> {
        if (await this.isConnectionReady()) {
            if (this.debug) { console.log('Extracting session from MongoDB'); }

            var bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, {
                bucketName: `whatsapp-${options.session}`
            });
            return new Promise((resolve, reject) => {
                bucket.openDownloadStreamByName(`${options.session}.zip`)
                    .pipe(fs.createWriteStream(options.path))
                    .on('error', err => reject(err))
                    .on('close', () => {
                        resolve?.call(undefined);
                        if (this.debug) { console.log('Session extracted from MongoDB'); }
                    });
            });
        }
    }

    async delete(options: { session: string }) {
        if (await this.isConnectionReady()) {
            if (this.debug) { console.log('Deleting session from MongoDB'); }

            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            const documents = await bucket.find({
                filename: `${options.session}.zip`
            }).toArray();

            documents.map(async doc => {
                return bucket.delete(doc._id);
            });

            if (this.debug) { console.log('Session deleted from MongoDB'); }
        }
    }

    private async checkValidZip(options: { session: string, documentId: ObjectId }): Promise<boolean> {
        if (await this.isConnectionReady()) {
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            return new Promise((resolve) => {
                const path = __dirname + `${options.documentId}.zip`;

                if (this.debug) { console.log(path); }

                bucket.openDownloadStream(options.documentId).pipe(fs.createWriteStream(path))
                    .on('error', () => resolve(false))
                    .on('close', async () => {
                        if (fs.existsSync(path) == false) {
                            resolve(false);
                            throw new Error('File not found');
                        }

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

            const valid = await this.checkValidZip({ session: options.session, documentId: newDocument._id });

            if (valid == false) {
                console.log('File is corrupted, deleting...');

                return bucket.delete(newDocument._id);
            }

            if (documents.length > 1) {
                return documents.filter((doc: any) => doc._id != newDocument._id).map(async (old) => bucket.delete(old._id));
            }
        }
    }
}