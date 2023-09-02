module.exports.profile = function (req, res) {
  return res.render("profile");
};

module.exports.signin = function (req, res) {
  return res.render("signin");
};

module.exports.signup = function (req, res) {
  return res.render("signup");
};
