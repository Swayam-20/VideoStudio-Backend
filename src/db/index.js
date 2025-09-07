import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
        try{
            const connectioninstance = await mongoose.connect(process.env.MONGODB_URI, {
                dbName: DB_NAME
            });
            console.log(`Database connected successfully || db host : ${connectioninstance.connection.host}`);
        }
        catch(error) {
            console.error("Database connection Failed:", error);
            process.exit(1);
        }
}
export default connectDB ;