const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const accessTokenHandler = (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        res.status(401);
        throw new Error("user is not Authorized");
      }
      req.user = decode.user;
      next();
    });
  }
};

module.exports = accessTokenHandler;