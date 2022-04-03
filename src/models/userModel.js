const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "user title is required",
      enum: ["Mr", "Mrs", "Miss"],
      trim:true
    },
    name: {
      type: String,
      required: "user name is required",
      trim:true
    },
    phone: {
      type: String,
      required: "user phone is required",
      //   unique:true,
      trim:true,

      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not valid phone number`,
      },
      required: [true, "user phone number required"],
    },
    email: {
      type: String,
      required: "user email is required",
      validate: {
        validator: validator.isEmail,
        message: `{VALUE} is not a valid email`,
        isAsync: false,
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: "user password is requires",
      //    minLen 8, maxLen 15
    },
    address: {
      street: { type: String },
      city: { type: String },
      pincode: { type: String },
    },
    createdAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
