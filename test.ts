import { MongoStore } from './lib/MongoStore';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function test(id: string) {
    const MONGODB_URI: string = process.env.MONGODB_URI as string;
    const connect = await mongoose.connect(MONGODB_URI);

    const store = new MongoStore({ mongoose: connect });
    const exist = await store.sessionExists({ session: `RemoteAuth-${id}` })
    console.log(id, exist)
    if (exist) {
        // await store.extract({ session: `RemoteAuth-${id}`, path: `./RemoteAuth-${id}.zip`, });
        //  await store.save({ session: `RemoteAuth-${id}` });
        // console.log('saved');
    }
}

// test('752a9323-cb9d-40f1-85ff-e918ab337220');
//test('8041bd74-563f-4f5f-a3b2-b18c8485ab1d');
