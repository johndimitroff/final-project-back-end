require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");

const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const passportSetup = require("./config/passport/passport-setup.js");

mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Allow cross-origin resource sharing (cors)
//(access the API frmo Javascript the front-end Javascript on a different domain/origin)
app.use(
  cors({
    credentials: true,
    //this is the domain we want cookies from (our React app)
    origin: "http://localhost:3000"
  })
);

//session setup AFTER CORS
app.use(
  session({
    secret: "afgsdghsthqehqtgbb3452353756",
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
//passport setup AFTER SESSION
passportSetup(app);

const projectRouter = require("./routes/project-router.js");
app.use("/api", projectRouter);

const authRouter = require("./routes/auth-router.js");
app.use("/api", authRouter);

const fileRouter = require("./routes/file-router.js");
app.use("/api", fileRouter);

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
