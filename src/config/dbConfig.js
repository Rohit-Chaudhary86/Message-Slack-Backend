import mongoose from 'mongoose'

import { DEV_DB_URL, NODE_ENV, PROD_DB_URL } from './serverConfig.js';

export default async function connectDB(){
    try {
        if (NODE_ENV==='development') {
            await mongoose.connect(DEV_DB_URL)
        }else if(NODE_ENV==='production'){
            await mongoose.connect(PROD_DB_URL)
        }
        console.log(` connected to DB from ${NODE_ENV} environment`)
    } catch (error) {
        console.log("Error in connection to DB",error)
        process.exit(1); // It stops the app if DB connection fails 

    }   
}