import ConnectDB from "./db.js";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST_NAME || "0.0.0.0";

async function runServer(server){
    try {
        await ConnectDB();
        server.listen(PORT, HOST, function () {
            console.log("Server Started Successfully!");
        })
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default runServer;