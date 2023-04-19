import { Mongoose } from 'mongoose';
type Props = {
    mongoose: Mongoose;
    debug?: boolean;
};
export declare class MongoStore {
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
    private checkValidZip;
    private deletePrevious;
    private deley;
}
export {};
