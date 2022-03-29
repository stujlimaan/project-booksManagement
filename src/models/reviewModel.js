const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: objectId,
      required: "please provide bookId",
      ref: "Book",
    },
    reviewedBy: {
      type: String,
      required: "please reviewed by is required",
      default: "Guest",
    },
    reviewedAt: {
      type: String,
      required: "reviewedAt is required",
    },
    rating: { type: Number, required: "rating is required" },
    review: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
