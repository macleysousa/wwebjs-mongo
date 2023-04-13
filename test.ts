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
}

test('8041bd74-563f-4f5f-a3b2-b18c8485ab1d');
test('31377f71-a483-4971-aae8-4b34e045db2a');

