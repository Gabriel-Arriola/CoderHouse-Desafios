import mongoose from "mongoose";
const dbName = 'ecommerce';

export const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://gabrielarriola:ylYlLQzKWCRNrBAn@cluster0.jf2piol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
            {
                dbName: "ecommerce"
            });
        console.log('DB online...');
    } catch (error) {
        console.log(`Error to connect to DB ${error}`);
        process.exit(1);
    }
}
