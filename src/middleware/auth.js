const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "please provide token in headers" });
    }

    let decodeToken = jwt.verify(token, "tujlimaan");
    let currentDate = Date.now();
    let expired = decodeToken.exp;
    console.log(currentDate.getTime())
    console.log(expired.getTime())

    if (currentDate > expired) {
      return res
        .status(403)
        .send({ status: false, message: "token expired! Please login again." });
    }
    next();

  } catch (err) {
    return res
      .status(401)
      .send({ status: false, message: `token invalid and ${err.message}` });
  }
};

const authorization = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "please provide token" });
    }
    let decodeToken = jwt.verify(token, "tujlimaan");
    let decodeTokenFromUserId = decodeToken.userId;

    let userId = await UserModel.findById(decodeTokenFromUserId);
    let id = userId._id.toString();
    console.log(id);
    console.log(decodeTokenFromUserId);
    if (id != decodeTokenFromUserId) {
      return res
        .status(401)
        .send({ status: false, message: "unauthorized access" });
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.authentication = authentication;
module.exports.authorization = authorization;
