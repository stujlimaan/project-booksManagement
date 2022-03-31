const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const moment = require("moment");
const { isDate } = require("moment");

const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(403)
        .send({ status: false, message: "please provide token in headers" });
    }

    let decodeToken = jwt.verify(token, "tujlimaan");
    // let currentDate = Date.now();
    // var time = moment(currentDate).format("DD-MM-YYYY h:mm:ss");
    // let expired = decodeToken.exp * 1000;
    // var expiredtime = moment(expired).format("DD-MM-YYYY h:mm:ss");
    // var iat = decodeToken.iat;
    // var expirediat = moment(iat).format("DD-MM-YYYY h:mm:ss");

    // console.log(time, "=========", currentDate);
    // console.log(expiredtime, "============", expired);
    // console.log(expirediat);

    // if (currentDate > expired) {
    //   return res
    //     .status(401)
    //     .send({
    //       status: false,
    //       message:
    //         "Unauthorized! Access Token was expired!! Please login again.",
    //     });
    // }
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
    let userBodyId=req.query.userId
    // let userBodyId=req.body.userId
    // let userId = await UserModel.findById(decodeTokenFromUserId);
    // let id = userId._id.toString();
    // console.log(id);
    // console.log(decodeTokenFromUserId);
    if (userBodyId != decodeTokenFromUserId) {
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
