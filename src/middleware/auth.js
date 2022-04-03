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

    let decodeToken = jwt.verify(token, "tujlimaan",function(err){
      if(err){
        return res
        .status(401)
        .send({ status: false, message: `token invalid and ${err.message}` });
      }
      else{
        
        next();
        
      }
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
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
    req.userId=decodeTokenFromUserId
   
    next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.authentication = authentication;
module.exports.authorization = authorization;
