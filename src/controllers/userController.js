const UserModel = require("../models/userModel");
const validator = require("../validator/validator");
const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {
  try {
    let user = req.body;
    let { title, name, phone, email, password, address } = user;
    if (Object.keys(user).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user details" });
    }
    if (!validator.isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user title" });
    }

    if (!validator.isValidTitle(title)) {
      return res.status(400).send({
        status: false,
        message: "please provide user enum mr mrs miss title",
      });
    }

    if (!validator.isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user name" });
    }
    if (!validator.isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user phone" });
    }
    if (!/\d{10}/.test(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide 10 digits number" });
    }
    let uniPhone = await UserModel.find({ phone: phone });
    if (Object.keys(uniPhone).length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${phone} already exists number` });
    }
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user email" });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: `${email} is not a valid email.` });
    }
    let uniEmail = await UserModel.find({ email: email });
    if (Object.keys(uniEmail).length > 0) {
      return res
        .status(400)
        .send({ status: false, message: `${email} already exists` });
    }
    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user password" });
    }
    //password.length>=8 && password.length<=15
    if (!/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,15}$/.test(password)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide 8 to 15 " });
    }
    // if (!validator.isValid(address)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "please provide user address" });
    // }

    if (address) {
      if (typeof address != "object") {
        return res
          .status(400)
          .send({ status: false, message: "address only will accept object." });
      }
      if (!address.street) {
        return res
          .status(400)
          .send({ status: false, message: "Street not empty." });
      }
      if (!address.city) {
        return res
          .status(400)
          .send({ status: false, message: "City not empty." });
      }
      if (!address.pincode) {
        return res
          .status(400)
          .send({ status: false, message: "Pincode not empty." });
      }
    }

    let userdata = await UserModel.create(user);
    res
      .status(201)
      .send({ status: true, message: "user successfully created", data: userdata });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const login = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide details" });
    }
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user email" });
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user password" });
    }
    let checkUser = await UserModel.findOne({
      email: email,
      password: password,
    });
    if (!checkUser) {
      return res
        .status(404)
        .send({ status: false, message: "Invalid email password" });
    }
    let id = checkUser._id;
    let token = jwt.sign(
      {
        userId: id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 60,
      },
      "tujlimaan"
    );
    res.setHeader("x-api-token", token);
    res
      .status(200)
      .send({ status: true, message: "users successfully login", data: token });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createUser = createUser;
module.exports.login = login;
