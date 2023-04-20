/// <reference types="node" />
import { Mongoose } from 'mongoose';
import { EventEmitter } from 'events';
type Props = {
    mongoose: Mongoose;
    debug?: boolean;
};
export declare class MongoStore extends EventEmitter {
    private mongoose;
    private debug;
    constructor({ mongoose, debug }: Props);
    isConnectionReady(): Promise<boolean>;
    sessionExists(options: {
        session: string;
    }): Promise<boolean>;
    save(options: {
        session: string;
    }): Promise<void>;
    extract(options: {
        session: string;
        path: string;
    }): Promise<void>;
    delete(options: {
        session: string;
    }): Promise<void>;
    private deletePrevious;
    private deley;
    on(eventName: 'saved' | 'deleted' | 'extracted', listener: (...args: any[]) => void): this;
}
export {};
