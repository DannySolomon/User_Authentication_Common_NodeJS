const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    //match user
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Email not registered" });
        }

        //match password
        bcrypt.compare(password, user.password, function (err, result) {
          // result == true //ie result is boolean
          if (err) throw err;

          if (result) {
            return done(null, user);
          } else {
            //if password dosent match
            return done(null, false, { message: "Password incorrect" });
          }
        });
      })
      .catch((err) => {
        console.log("Cannot find the user ", err);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.checkAuthentication = function (req, res, next) {
  //if user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  } else {
    //if user not signed in
    req.flash("errorMessage", "Please login to view this resource");
    res.redirect("/users/signin");
  }
};

module.exports = passport;
