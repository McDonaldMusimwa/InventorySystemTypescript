import express from 'express';
require('dotenv').config();
const PORT = process.env.PORT;
//database config
const mongose = require('mongoose');
import bodyParser from 'body-parser';
//Swagger
import swaggerUi from 'swagger-ui-express' 
const swaggerDocument = require( '../swagger-output.json');
import passport from 'passport';
import session from 'express-session';



const DATABASEURL =process.env.DataBaseUrl;
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
app.use(bodyParser.json());
app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", require("./routes/index"));

let db ;
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
