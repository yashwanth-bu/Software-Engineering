import express from "express";
import cookieParser from "cookie-parser";

import contactRouter from "./route/contactRoutes.js";
import userRouter from "./route/userRoutes.js";
import runServer from "./config/runServer.js";
import errorHandler from "./middleware/errorHandler.js";
import routerError from "./middleware/routerError.js";
import corsMiddleware from "./middleware/corsHandler.js";

const server = express();

server.use(cookieParser());

server.use(corsMiddleware);

server.use(express.json());

server.use("/api/user", userRouter);

server.use("/api/contect", contactRouter);

server.use(routerError);

server.use(errorHandler);

runServer(server);