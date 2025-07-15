import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
        try{
            const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
            
            console.log(`Database connected successfully || db host : ${connectioninstance.connection.host}`);

        }
        catch(error) {
            console.error("Database connection Failed:", error);
            // Exit process with failure
            // This is useful for production environments where you want to ensure the application does not run without a database connection.
            process.exit(1);

        }}
export default connectDB ;