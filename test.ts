import { MongoStore } from './lib/MongoStore';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function test(id: string) {
    const MONGODB_URI: string = process.env.MONGODB_URI as string;
    const connect = await mongoose.connect(MONGODB_URI);

    const store = new MongoStore({ mongoose: connect, debug: true });
    const exist = await store.sessionExists({ session: `session-${id}` })
    // console.log(id, exist)
    // const isvalid = await store.validate({ session: `session-${id}`, documentId: '644912ad801e21a154e0c604' });
    // console.log(isvalid);
    await store.extract({ session: `session-${id}`, path: `./session-${id}.zip`, });
    await store.save({ session: `session-${id}` });
    if (exist) {
        // await store.extract({ session: `session-${id}`, path: `./session-${id}.zip`, });
        console.log('saved');
    }
}

test('f507849d-410f-46e4-bfb7-a0424abb26c0');
// test('8041bd74-563f-4f5f-a3b2-b18c8485ab1d');
// test('31377f71-a483-4971-aae8-4b34e045db2a');
