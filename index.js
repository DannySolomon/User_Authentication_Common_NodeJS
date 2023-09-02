const express = require("express");
const expressRouter = require("./routes/index");

const app = express();
const port = 8000;

app.listen(port, function (err) {
  if (err) {
    return console.log("Error in starting the express server on port: ", port);
  }
  console.log(`Express server is running on port: ${port}`);
});

app.use("/", expressRouter);
