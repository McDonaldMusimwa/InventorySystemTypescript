"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("../swagger-output.json"));
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
const corsOptions = {
    origin: '*',
};
app
    .use((0, cors_1.default)(corsOptions))
    .use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use("/", require("./routes/index"));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
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