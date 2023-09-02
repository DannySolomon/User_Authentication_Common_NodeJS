const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const usersController = require("../controllers/users_controller");

router.get("/profile", passport.checkAuthentication, usersController.profile);
router.get("/signin", usersController.signin);
router.get("/signup", usersController.signup);

router.post("/signup", usersController.create);
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/signin",
    failureFlash: true, //if failure send a flash message
  })
);
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("successMessage", "You are successfully logged out");
    res.redirect("/users/signin");
  });
});

module.exports = router;
