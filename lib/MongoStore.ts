import fs from 'fs-extra';
import * as path from 'path';
import archiver from 'archiver';
import AdmZip from 'adm-zip';
import { ConnectionStates, Mongoose } from 'mongoose';
import { ObjectId } from 'mongodb';
import { EventEmitter } from 'events';

type Props = {
    mongoose: Mongoose;
    debug?: boolean;
    /**
     * delete the temporary file created to save the session
     * @default true
     */
    deleteFileTemp?: boolean;
};

export class MongoStore extends EventEmitter {
    private mongoose: Mongoose;
    private debug: boolean;
    private requiredDirs = ['Default/IndexedDB', 'Default/Local Storage']; /* => Required Files & Dirs in WWebJS to restore session */
    private deleteFileTemp = false;

    constructor({ mongoose, debug, deleteFileTemp }: Props) {
        super();
        if (!mongoose) throw new Error('A valid Mongoose instance is required for MongoStore.');
        this.mongoose = mongoose;
        this.debug = debug ?? false;
        this.deleteFileTemp = deleteFileTemp ?? true;
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
            if (options?.dataPath) {
                const dirPath = path.resolve(`${options.dataPath}/${options.session}`);
                const filePath = path.resolve(`${options.session}.zip`);
                if (fs.existsSync(filePath)) {
                    await fs.promises.unlink(filePath);
                }

                const stream = fs.createWriteStream(`${options.session}.zip`);
                const archive = archiver('zip', { zlib: { level: 9 } });

                const tempDir = path.resolve(`${options.dataPath}/temp-${options.session}`);
                if (fs.existsSync(`${tempDir}`)) {
                    await fs.promises.rm(`${tempDir}`, { recursive: true });
                }

                await fs.mkdir(`${tempDir}`);

                if (this.debug) { console.log('Copying session files to temp directory'); }

                await fs.copy(`${dirPath}`, tempDir);

                if (this.debug) { console.log('Copying session files to temp directory - Done'); }

                archive.pipe(stream);
                await Promise.all(this.requiredDirs.map(dir => {
                    if (this.debug) { console.log(`${tempDir}/${dir}`, dir); }
                    archive.directory(`${tempDir}/${dir}`, dir);
                }));

                await archive.finalize();
                stream.close();

                if (this.deleteFileTemp)
                    await fs.promises.rm(`${tempDir}`, { recursive: true });
            }

            if (this.debug) { console.log('Saving session to MongoDB'); }
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            return new Promise((resolve, reject) => {
                fs.createReadStream(`${options.session}.zip`)
                    .pipe(bucket.openUploadStream(`${options.session}.zip`))
                    .on('error', err => reject(err))
                    .on('close', async () => {
                        await this.deley(1000 * 10);

                        await this.deletePrevious(options).then(() => {
                            this.emit('saved', options.session);
                            if (this.debug) { console.log('Session saved to MongoDB'); }
                        }).catch((error) => {
                            this.emit('error', error);
                        }).finally(() => {
                            resolve?.call(undefined);
                            const filePath = path.resolve(`${options.session}.zip`);
                            if (fs.existsSync(filePath) && this.deleteFileTemp) { fs.rm(filePath, { recursive: true }) };
                        });
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

    private async validate(options: { session: string, documentId: ObjectId }) {
        if (await this.isConnectionReady()) {
            if (this.debug) { console.log('Validating session in MongoDB'); }
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            const filePath = path.resolve(`./${options.documentId}.zip`);
            const folderPath = path.resolve(`./temp-${options.documentId}`);
            if (this.debug) console.log('folderPath', folderPath, 'filePath', filePath);

            return new Promise((resolve) => {
                bucket.openDownloadStream(options.documentId)
                    .pipe(fs.createWriteStream(filePath))
                    .on('close', async () => {
                        try {
                            const zip = new AdmZip(filePath);
                            zip.extractAllToAsync(folderPath, true, true, (err) => {
                                if (err) {
                                    if (this.debug) {
                                        console.log('Session validation failed in MongoDB');
                                        console.log(err);
                                    }
                                    resolve?.call(undefined, false);
                                }
                                else {
                                    if (this.debug) { console.log('Session validated in MongoDB'); }
                                    resolve?.call(undefined, true);
                                }
                            });
                        }
                        catch (err) {
                            resolve?.call(undefined, false);
                            if (this.debug) {
                                console.log('Session validation failed in MongoDB');
                                console.log(err);
                            }
                        }
                        finally {
                            if (this.deleteFileTemp) {
                                await fs.promises.rm(filePath, { recursive: true });
                                await fs.promises.rm(folderPath, { recursive: true });
                            }
                        }
                    });
            });
        }
        return false;
    }

    private async deletePrevious(options: { session: string }) {
        if (await this.isConnectionReady()) {
            const bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: `whatsapp-${options.session}` });
            const documents = await bucket.find({ filename: `${options.session}.zip` }).toArray();

            const newDocument = documents.reduce((a: any, b: any) => a.uploadDate > b.uploadDate ? a : b);

            const isValid = await this.validate({ session: options.session, documentId: newDocument._id });
            if (documents.length > 1 && isValid == false) {

                if (this.deleteFileTemp)
                    await bucket.delete(newDocument._id);
                if (this.debug)
                    console.log('File is corrupted, deleted from MongoDB');

                throw new Error('File is corrupted, deleted from MongoDB');
            }

            if (documents.length > 1) {
                documents.filter((doc: any) => doc._id != newDocument._id).map(async (old) => bucket.delete(old._id))
            }
        }
    }

    private async deley(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    on(eventName: 'saved' | 'deleted' | 'extracted' | 'error', listener: (...args: any[]) => void) {
        return super.on(eventName, listener);
    }
}