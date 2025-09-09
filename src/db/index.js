import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
        try{
            const mongoUri = process.env.MONGODB_URI;
            if (!mongoUri || typeof mongoUri !== "string" || mongoUri.trim() === "") {
                throw new Error(
                    "Missing environment variable MONGODB_URI. Add it to your .env (e.g., MONGODB_URI=mongodb+srv://user:pass@cluster/db)."
                );
            }
            const connectioninstance = await mongoose.connect(mongoUri, {
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