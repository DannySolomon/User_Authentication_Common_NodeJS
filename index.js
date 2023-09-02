const express = require("express");
const expressRouter = require("./routes/index");
const expressLayouts = require("express-ejs-layouts");

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

//telling express to use express router
// this should be only after ejs & layouts
app.use("/", expressRouter);

app.listen(port, function (err) {
  if (err) {
    return console.log("Error in starting the express server on port: ", port);
  }
  console.log(`Express server is running on port: ${port}`);
});
