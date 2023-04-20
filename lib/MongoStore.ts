import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import { ConnectionStates, Mongoose } from 'mongoose';
import { EventEmitter } from 'events';

type Props = {
    mongoose: Mongoose;
    debug?: boolean;
};

export class MongoStore extends EventEmitter {
    private mongoose: Mongoose;
    private debug: boolean;
    private requiredDirs = ['Default/IndexedDB', 'Default/Local Storage']; /* => Required Files & Dirs in WWebJS to restore session */

    constructor({ mongoose, debug }: Props) {
        super();
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

    async save(options: { session: string, dataPath?: string }): Promise<void> {
        if (await this.isConnectionReady()) {
            if (this.debug) { console.log('Saving session to MongoDB'); }

            if (options?.dataPath) {
                const dirPath = path.resolve(`${options.dataPath}/${options.session}`);
                const filePath = path.resolve(`${options.session}.zip`);
                if (fs.existsSync(filePath)) {
                    await fs.promises.unlink(filePath);
                }

                const stream = fs.createWriteStream(`${options.session}.zip`);
                const archive = archiver('zip', { zlib: { level: 9 } });
                archive.pipe(stream);
                await Promise.all(this.requiredDirs.map(dir => {
                    console.log(`${dirPath}/${dir}`);
                    archive.directory(`${dirPath}/${dir}`, dir)
                })
                );
                await archive.finalize();
                stream.close();
            }

            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            return new Promise((resolve, reject) => {
                fs.createReadStream(`${options.session}.zip`)
                    .pipe(bucket.openUploadStream(`${options.session}.zip`))
                    .on('error', err => reject(err))
                    .on('close', async () => {
                        await this.deletePrevious(options);
                        resolve?.call(undefined);
                        this.emit('saved');
                        const filePath = path.resolve(`${options.session}.zip`);
                        if (fs.existsSync(filePath)) {
                            setTimeout(() => fs.promises.rm(`${options.session}.zip`, { recursive: true }), 1000 * 2);
                        }
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
                    .pipe(fs.createWriteStream(options.path ?? `${options.session}.zip`))
                    .on('error', err => reject(err))
                    .on('close', async () => {
                        await this.deley(1000 * 5);
                        resolve?.call(undefined);
                        if (this.debug) { console.log('Session extracted from MongoDB'); }
                        this.emit('extracted');
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
            this.emit('deleted');
        }
    }

    private async deletePrevious(options: { session: string }) {
        if (await this.isConnectionReady()) {
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            const documents = await bucket.find({ filename: `${options.session}.zip` }).toArray();

            const newDocument = documents.reduce((a: any, b: any) => a.uploadDate > b.uploadDate ? a : b);

            if (documents.length > 1) {
                documents.filter((doc: any) => doc._id != newDocument._id).map(async (old) => bucket.delete(old._id))
            }
        }
    }

    private async deley(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    on(eventName: 'saved' | 'deleted' | 'extracted', listener: (...args: any[]) => void) {
        return super.on(eventName, listener);
    }
}