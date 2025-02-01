import mongoose from "mongoose";
import { config } from "../config/config.js";

export const dbConnection = async () => {
    try {
        await mongoose.connect(config.MONGO_URL)
        console.log('Database connection successful')
    } catch (error) {
        console.log(`Error connecting to database ${error}`)
        process.exit(1)
    }
}
