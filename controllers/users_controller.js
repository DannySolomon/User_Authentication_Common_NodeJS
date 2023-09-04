const User = require("../models/User");
const bcrypt = require("bcrypt");

const passport = require("passport");

module.exports.profile = function (req, res) {
  console.log(req.user);
  return res.render("profile", { name: req.user.name });
};

module.exports.signin = function (req, res) {
  return res.render("signin");
};

module.exports.signup = function (req, res) {
  return res.render("signup");
};

module.exports.create = function (req, res) {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required fileds
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all the fields" });
  }

  //check password match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 chars long" });
  }

  if (errors.length > 0) {
    res.render("signup", {
      name, //sending name & email, so that even if error is thrown these fields are still filled
      email,
      errors,
    });
  } else {
    //Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already registered!" });
        res.render("signup", {
          errors,
        });
      } else {
        // creates an instance of the UserSchema but does not save it to the MongoDB
        const newUser = new User({
          name: name,
          email,
          password,
        });

        // encrypting password
        //hasing using bcrypt
        bcrypt.hash(newUser.password, 10, function (err, hash) {
          // Store hash in your password DB.
          if (err) throw err;

          //set password to hash
          newUser.password = hash;

          //saving user to mongodb atlas
          newUser
            .save()
            .then((user) => {
              console.log("Saved user successfully to db");
              req.flash(
                "successMessage",
                "Your account is successfully registerd"
              );
              res.redirect("signin");
            })
            .catch((err) => {
              console.log("Error in saving user to db");
              req.flash(
                "errorMessage",
                "Your account couldnt be created. Pls try again"
              );
              res.redirect("signup");
            });
        });
      }
    });
  }
};

//reset passowrd screen
module.exports.displayResetPassword = function (req, res) {
  return res.render("reset");
};

module.exports.resetPassword = function (req, res) {
  const { password1, password2 } = req.body;
  let errors = [];

  //check required fileds
  if (!password1 || !password2) {
    errors.push({ msg: "Please fill in all the fields" });
  }

  //check password match
  if (password1 !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //check password length
  if (password1.length < 6) {
    errors.push({ msg: "Password should be atleast 6 chars long" });
  }

  if (errors.length > 0) {
    res.render("reset", {
      errors,
    });
  } else {
    // encrypting password
    //hasing using bcrypt
    bcrypt.hash(password1, 10, function (err, hash) {
      // Store hash in your password DB.
      if (err) throw err;

      //set password to hash
      let encryptedpassowrd = hash;

      User.findOne({ email: req.user.email })
        .then((user) => {
          if (user) {
            user.password = encryptedpassowrd;
            user
              .save()
              .then(() => {
                console.log("Successfully updated the password");
                req.flash(
                  "successMessage",
                  "The password has been successfully updated"
                );
                res.redirect("reset");
              })
              .catch((err) => {
                console.log("Error in updating the passowrd");
                req.flash("errorMessage", "Your password couldnt be updated");
                res.redirect("reset");
              });
          } else {
            errors.push({ msg: "Error in finding the user" });
            res.render("signin", {
              errors,
            });
          }
        })
        .catch((err) => {
          console.log("Error in accessing db");
          errors.push({ msg: "Error in accessing the db" });
          res.render("signin", {
            errors,
          });
        });
    });
  }
};
