const express = require("express");
const expressRouter = require("./routes/index");
const expressLayouts = require("express-ejs-layouts");
const mongodb = require("./config/mongoose");
//save session
const session = require("express-session");
//used to save messages in session for one time display and display even after redirect
const flash = require("connect-flash");

const passport = require("passport");
const passportLocal = require("./config/passport-local");
const passportGoogle = require("./config/passport-google-oauth2");

const app = express();
const port = 8000;

//using express ejs layouts
//this should be always above the ejs setup below or this wont work
app.use(expressLayouts);

//setting ejs as view engine
app.set("view engine", "ejs");

//telling express to look into the views folder for the ejs files
app.set("views", "./views");

//telling express that the static files are in this location
app.use(express.static("./asstes"));

//using bodyparser to get data from the form
app.use(express.urlencoded({ extended: true }));

//express session middleware
app.use(
  session({
    secret: "any key",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.authenticate("session"));

//connect flash middleware
app.use(flash());

//global var ( to use store & use flash message) middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("successMessage");
  res.locals.error_msg = req.flash("errorMessage");
  res.locals.error = req.flash("error"); //for printing error message from login, it will be stored in 'error'
  next(); //to pass the control to the next middleware
});

//telling express to use express router
// this should be only after ejs & layouts
app.use("/", expressRouter);

app.listen(port, function (err) {
  if (err) {
    return console.log("Error in starting the express server on port: ", port);
  }
  console.log(`Express server is running on port: ${port}`);
});
