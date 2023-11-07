"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const PORT = process.env.PORT;
//database config
const mongose = require('mongoose');
const body_parser_1 = __importDefault(require("body-parser"));
//Swagger
const swaggerAutogen = require('swagger-autogen');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const DATABASEURL = process.env.DataBaseUrl;
const SECRET = process.env.SECRET;
const app = (0, express_1.default)();
// Configure and start session
app.use((0, express_session_1.default)({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    // Additional session options go here, like store, cookie settings, etc.
}));
// Initialize Passport and configure it to use sessions
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//Routes
app
    .use(body_parser_1.default.json())
    .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key' // Corrected the headers list
    );
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Removed spaces
    next();
});
app.use(express_1.default.json());
app.use("/", require("./routes/index"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const allowedOrigins = [
    'http://localhost:5173', // Add any other origins as needed
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use((0, cors_1.default)(corsOptions)); // Use the cors middleware with custom options
let db;
mongose
    .connect(DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "stockinventory",
})
    .then((result) => {
    app.listen(PORT);
    db = result;
    console.log("connection to database successful =>");
})
    .catch((err) => {
    console.log(err);
});
//# sourceMappingURL=app.js.map