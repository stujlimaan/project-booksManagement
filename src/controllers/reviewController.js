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


    if(checkBookId.isDeleted==true){
      return res.status(400).send({status:false,message:"Already book deleted then you can not add"})
    }
    
    let reviewData=await ReviewModel.create(data)
    if(reviewData){
      await BookModel.findOneAndUpdate({_id:bookId},{$inc:{reviews:1}})
    }
    let RD=await ReviewModel.findOne({_id:reviewData._id}).select({_v:0,createdAt:0,updatedAt:0,isDeleted:0})
    res.status(201).send({status:true,message:"review added",data:RD})
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
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
    if (rating > 6 || rating < 0) {
      return res
        .status(400)
        .send({ status: false, message: "give rating 1 t0 5 " });
    }
    
    let checkBookId=await BookModel.findById(bookId)
    if(!checkBookId){
      return res.status(404).send({status:false,message:"not found bookId"})
    }

    let checkReviewId=await ReviewModel.findById(reviewId)
    if(!checkReviewId){
      return res.status(404).send({status:false,message:"not found reviewId"})

    }

    let checkDeletedOrNot=await ReviewModel.find({_id:reviewId,isDeleted:true})
    if(checkDeletedOrNot.length>0){
      return res.status(200).send({status:true,message:"already deleted"})
    }

    let updateReview = await ReviewModel.findOneAndUpdate(
      { _id: reviewId,isDeleted:false},
      { review: review, rating: rating, reviewedBy: reviewedBy },
      { new: true }
    );
    // console.log(updateReview);
    let UPDR=checkBookId.toObject()
    UPDR['updatedReview']=updateReview
    res
      .status(200)
      .send({ status: true, message: "review updated", data: UPDR });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
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

    let deleteReview = await ReviewModel.findOneAndUpdate(
      { _id: reviewId ,isDeleted:false},
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    // console.log(deleteReview);
    // if(deleteReview){
    //   await BookModel.findOneAndUpdate({_id:bookId},{$inc:{reviews:-1}})
    // }

    //decreasing review count for the book
    let bookReviewCount= await BookModel.findOneAndUpdate(
      {_id:bookId, isDeleted:false}, {$inc: { reviews: -1} }, {new:true});

  return res.status(200).send({status:false, message:'Review Deleted'})

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
