const passport = require("passport");
const secretKeys = require("./secret_keys");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const crypto = require("crypto");

passport.use(
  new GoogleStrategy(
    {
      clientID: secretKeys.GOOGLE_CLIENT_ID,
      clientSecret: secretKeys.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://user-authentication-common-nodejs.onrender.com/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value })
        .then((user) => {
          if (user) {
            //if found, set this user as req.user
            return cb(null, user);
          } else {
            //if not found, create a user and set this user as req.user
            User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            })
              .then((user) => {
                return cb(null, user);
              })
              .catch((err) => {
                console.log(
                  "Error in creating user google strategy-passport ",
                  err
                );
                return;
              });
          }
        })
        .catch((err) => {
          console.log("Error in google strategy-passport ", err);
          return;
        });
    }
  )
);

module.exports = passport;
