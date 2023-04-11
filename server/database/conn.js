import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";
import ENV from '../config.js'

async function connect(){
    // const { MongoMemoryServer } = require('mongodb-memory-server');
    // const mongod = new MongoMemoryServer({
    //     binary: {
    //         downloadUrl: 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.5.zip', // specify the download URL of the binary
    //     },
    // });

    // console.log('Yay');

    // const mongod = await MongoMemoryServer.create();
    // const getUri = mongod.getUri();

    // mongoose.set('strictQuery', true)
    // // const db = await mongoose.connect(getUri);
    const db = await mongoose.connect(ENV.ATLAS_URI);
    console.log("Database Connected");
    return db;
}

export default connect;