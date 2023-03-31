type options = {
    session?: string,
    path?: string,
}

export class MongoStore {

    constructor({ mongoose, connection, mongo }: { mongoose?: any, connection?: any, mongo?: any });

    sessionExists(session: options): Promise<boolean>;
    save(options: options): Promise<void>;
    extract(options: options): Promise<any>;
    delete(options: options): Promise<void>;
};
