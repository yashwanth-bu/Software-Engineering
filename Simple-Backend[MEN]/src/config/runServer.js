/**
 * runServer
 * ------------------------
 * A utility function to start the Express server after establishing a database connection.
 * 
 * What it does:
 * - Imports and calls `ConnectDB()` to connect to the MongoDB database.
 * - Awaits the database connection before starting the server.
 * - Starts the Express server on a specified HOST and PORT.
 *   - `PORT` defaults to 5000 if not set in environment variables.
 *   - `HOST` defaults to "0.0.0.0" to allow external access.
 * - Logs a message to the console once the server is running.
 * 
 * Why it’s used:
 * - Ensures the server only starts **after successfully connecting to the database**,
 *   preventing runtime errors from uninitialized DB connections.
 * - Centralizes server startup logic, keeping the main entry file (`index.js` or `server.js`) clean.
 * - Makes it easy to reuse or modify the startup process (e.g., add middlewares, logging, etc.).
 * 
 * Example usage:
 * 
 * import express from "express";
 * import runServer from "./config/runServer.js";
 * 
 * const app = express();
 * runServer(app);
 */


import ConnectDB from "./db.js";

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST_NAME || "0.0.0.0";

async function runServer(server){
    try {
        await ConnectDB();
        server.listen(3000, 'localhost', function () {
            console.log("Server Started Successfully!");
        })
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default runServer;
