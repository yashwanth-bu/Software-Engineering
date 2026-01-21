import mongoose from "mongoose";

async function ConnectDB(retries = 5, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(process.env.MONGOOSE_URI);
            console.log("Database connected successfully!");
            return;
        } catch (err) {
            console.error(`DB connection failed. Retry ${i + 1}/${retries} in ${delay / 1000}s`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
    console.error("Database connection failed after multiple attempts. Exiting.");
    process.exit(1);
}

export default ConnectDB;