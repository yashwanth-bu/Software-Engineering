import cors from "cors";


const allowedOrigins = [
    "http://localhost:3000",
    "https://yourfrontend.com"
];

const corsOptions = {
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); 
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error("Not allowed by CORS"), false);
        }
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};  

const corsMiddleware = cors(corsOptions)

export default corsMiddleware;