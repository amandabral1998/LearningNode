const cookieParser = require("cookie-parser");
const { validateToken } = require("../services/authentication");

function checkForAuthentication(token) {
  return function (req, res, next) {
    const tokenValue = req.cookies[token]

    if (!tokenValue) return next();

    try {
      const tokenValid = validateToken(tokenValue);
      req.user = tokenValid;
    } catch (err) {
      console.log(err);
    }

    next()
  };
};



module.exports = {
    checkForAuthentication
}