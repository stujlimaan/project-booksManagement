const ReviewModel = require("../models/reviewModel");
const BookModel = require("../models/booksModel");
const validator = require("../validator/validator");

const createReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide bookid" });
    }
    let checkBookId = await BookModel.findById(bookId);
    if (!checkBookId) {
      return res.status(400).send({ status: false, message: "No such bookId" });
    }
    let data = req.body;
    let { review, rating, reviewedBy, reviewedAt } = data;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({
          status: false,
          message: "please provide data in request body",
        });
    }
    if (!reviewedBy) {
      return res
        .status(400)
        .send({
          status: false,
          message: "please provide review's name is required",
        });
    }
    if (!reviewedAt) {
      return res
        .status(400)
        .send({
          status: false,
          message: "please provide reviewedAt is required",
        });
    }
    if (!rating) {
      return res
        .status(400)
        .send({ status: false, message: "please provide rating" });
    }
    if (rating > 6 || rating < 0) {
      return res
        .status(400)
        .send({ status: false, message: "give rating 1 t0 5 " });
    }
    let reviewData = await ReviewModel.create(data);
    res
      .status(201)
      .send({
        status: true,
        message: "Review succussfully done",
        data: reviewData,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateReview = async function (req, res) {
  try {
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteReview = async function (req, res) {
  try {
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
