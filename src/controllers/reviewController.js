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
      return res.status(400).send({
        status: false,
        message: "please provide data in request body",
      });
    }
    if (!reviewedBy) {
      return res.status(400).send({
        status: false,
        message: "please provide review's name is required",
      });
    }
    if (!reviewedAt) {
      return res.status(400).send({
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
    res.status(201).send({
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
    let data = req.body;
    let { review, rating, reviewedBy } = data;
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide bookId" });
    }

    if (!reviewId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide reviewId" });
    }

    let checkDeletedOrNot=await ReviewModel.find({_id:reviewId,isDeleted:true})
    if(checkDeletedOrNot.length>0){
      return res.status(200).send({status:true,message:"already deleted"})
    }

    let updateReview = await ReviewModel.findByIdAndUpdate(
      { _id: reviewId, bookId: bookId },
      { review: review, rating: rating, reviewedBy: reviewedBy },
      { new: true }
    );
    console.log(updateReview);
    res
      .status(200)
      .send({ status: true, message: "review updated", data: updateReview });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteReview = async function (req, res) {
  try {
    let reviewId = req.params.reviewId;
    if (!reviewId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide review Id" });
    }

    let checkId = await ReviewModel.findById(reviewId);
    if (!checkId) {
      return res
        .status(404)
        .send({ status: false, message: "Not found review" });
    }
    let bookId = req.params.bookId;
    let Id = checkId.bookId;
    if (bookId != Id) {
      return res
        .status(404)
        .send({ status: false, message: "please provide valid bookId" });
    }

    let checkDeletedOrNot=await ReviewModel.find({_id:reviewId,isDeleted:true})
    if(checkDeletedOrNot.length>0){
      return res.status(200).send({status:true,message:"already deleted"})
    }

    let deleteReview = await ReviewModel.findByIdAndUpdate(
      { _id: reviewId },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    console.log(deleteReview);
    res
      .status(200)
      .send({ status: true, message: "deleted", data: deleteReview });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
