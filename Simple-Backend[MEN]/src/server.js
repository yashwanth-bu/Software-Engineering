import express from "express";
import dotenv from 'dotenv';

import router from "./route/notesRoutes.js";
import runServer from "./config/runServer.js";
import errorHandler from "./Middleware/errorHandler.js";
import routerError from "./Middleware/routerError.js";
import corsMiddleware from "./Middleware/cors.js";

dotenv.config();

const server = express();

server.use(corsMiddleware);

server.use(express.json());

server.use("/notes", router);

server.use(routerError);

server.use(errorHandler);

runServer(server);