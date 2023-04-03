import { Mongoose } from 'mongoose';
type Props = {
    mongoose: Mongoose;
};
export declare class MongoStore {
    private mongoose;
    constructor({ mongoose }: Props);
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
}
export {};
