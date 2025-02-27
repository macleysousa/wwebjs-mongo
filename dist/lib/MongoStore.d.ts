/// <reference types="node" />
import { Mongoose } from 'mongoose';
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
export declare class MongoStore extends EventEmitter {
    private mongoose;
    private debug;
    private requiredDirs;
    private deleteFileTemp;
    constructor({ mongoose, debug, deleteFileTemp }: Props);
    isConnectionReady(): Promise<boolean>;
    sessionExists(options: {
        session: string;
    }): Promise<boolean>;
    save(options: {
        session: string;
        dataPath?: string;
    }): Promise<void>;
    extract(options: {
        session: string;
        path: string;
    }): Promise<void>;
    delete(options: {
        session: string;
    }): Promise<void>;
    private validate;
    private deletePrevious;
    private deley;
    on(eventName: 'saved' | 'deleted' | 'extracted' | 'error', listener: (...args: any[]) => void): this;
}
export {};
