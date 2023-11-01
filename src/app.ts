import express from 'express';
require('dotenv').config();
const PORT = process.env.PORT;
//database config
const mongose = require('mongoose');
import bodyParser from 'body-parser';
//Swagger
import swaggerUi from 'swagger-ui-express'
const swaggerDocument = require('../swagger-output.json');
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';


const DATABASEURL = process.env.DataBaseUrl;
const SECRET = process.env.SECRET;



const app = express();

// Configure and start session
app.use(session({
  secret: SECRET, // Replace with a strong and secure secret
  resave: false,
  saveUninitialized: true,
  // Additional session options go here, like store, cookie settings, etc.
}));

// Initialize Passport and configure it to use sessions
app.use(passport.initialize());
app.use(passport.session());

//Routes
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key' // Corrected the headers list
    );
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Removed spaces
    next();
  });
app.use(express.json())

app.use("/", require("./routes/index"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const allowedOrigins = [

  'http://localhost:5173', // Add any other origins as needed
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions)); // Use the cors middleware with custom options


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
