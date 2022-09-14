const jwt = require("jsonwebtoken");

module.exports.body = (req, res, next) => {
  let code = parseInt(new Date().valueOf() / 10000);
  let phrase = "KWanso for F1llyJ0b2 the app good.";
  let secret = phrase;
  console.log(req.body.token)
  const token = req.body.token.replace("Bearer ", "");
   console.log(token);
  try {
    data = jwt.verify(token, secret);
    req.body = data;
    next();
  } catch (error) {
    // console.log(error);
    return res.status(403).json({
      message: "Request Failed",
      error,
    });
  }
};
