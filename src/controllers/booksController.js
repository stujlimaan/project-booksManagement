const BookModel = require("../models/booksModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const moment = require("moment");

//creating books start
const createBook = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide book details" });
    }

    const { title, excerpt, ISBN, category, subcategory, releasedAt, userId } =
      data;

      //authentication
      if(userId!=req.userId){
        return res.status(403).send({status:false,message:"unauthorized user"})
      }

      //validations
    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "please provide book title" });
    }
//search title in database to check title is already used or not to maintain uniqueness 

    let checkTitle = await BookModel.findOne({ title: title });

    if (checkTitle) {
      return res
        .status(400)
        .send({ status: false, message: "please fill unique title" });
    }

    if (!excerpt) {
      return res
        .status(400)
        .send({ status: false, message: "please provide book name" });
    }

    if (!ISBN) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user ISBN " });
    }
//search isbn in database to check isbn is already used or not to maintain uniqueness 
    let checkISBN = await BookModel.findOne({ ISBN: ISBN });

    if (checkISBN) {
      return res.status(400).send({ status: false, message: "please uniqui" });
    }

    if (!category) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user category" });
    }

    if (!subcategory) {
      return res
        .status(400)
        .send({ status: false, message: "please provide user subcategory" });
    }
    if (subcategory.length == 0)
      return res
        .status(400)
        .send({
          status: false,
          message: "Please provide proper subcategory to create.",
        });

    if (!releasedAt) {
      return res
        .status(400)
        .send({ status: false, message: "please provide address" });
    }
    //check date format
    let validity = moment(releasedAt, "YYYY-MM-DD", true).isValid();
    if (!validity)
      return res
        .status(400)
        .send({
          status: false,
          message: "input a valid date in YYYY-MM-DD format.",
        });

  //   if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
  //     return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" this Date format & only number format is accepted ' })
  // }


    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide userId" });
    }
//check userId exists or not (verifying user if not varified then we can not create book in our database)
    let checkUserId = await User.findById(userId);

    if (!checkUserId) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    let bookData = { title, excerpt, ISBN, category, releasedAt, userId };
    if (subcategory) {
      if (Array.isArray(subcategory)) {
        bookData["subcategory"] = [...subcategory];
        subcategory.push(subcategory)
      }
      if (Object.prototype.toString.call(subcategory) === ["object string"]) {
        bookData["subcategory"] = [subcategory];
      }
    }
    let book = await BookModel.create(bookData);
    res
      .status(201)
      .send({ status: true, message: "successfully book created", data: book });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
// =============end===================

//==================================Getting books start===========
const getBook = async function (req, res) {
  try {
    const data = req.query;
    const { userId, category, subcategory } = data;
    let obj = {};
    obj.isDeleted = false;

    if(userId && userId.length!=24){
      return res.status(400).send({status:false,message:"provide valid user id 24"})
    }
   
    if (userId || category || subcategory || obj) {
      if (userId) {
        obj["userId"] = userId;
      }

      if (category) {
        obj["category"] = category;
      }

      // if (subcategory) {
      //   obj["subcategory"] = subcategory;
      // }
      if(subcategory){
        const subArr=subcategory.trim().split(',').map(sub=>sub.trim());
        obj['subcategory']={$all:subArr}
    }

    //authorization
    // let checkUser=await BookModel.findOne(obj)
    // if(!checkUser){
    //   return res.status(404).send({status:false,message:"not found"})
    // }
    // if(checkUser.userId !=req.userId){
    //   return res.status(403).send({status:false,message:"unauthorized user"})
    // }
      // console.log(obj);
      const filterQ = await BookModel.find(obj)
        .select({
          _id: 1,
          title: 1,
          excerpt: 1,
          userId: 1,
          category: 1,
          releasedAt: 1,
          reviews: 1,
        })
        .sort({ title: 1 });
      // console.log(filterQ);
  let count=filterQ.length
      if (filterQ.length == 0) {
        res
          .status(404)
          .send({ status: true, message: "No such data available" });
      } else {
        res
          .status(200)
          .send({ status: true, message: `${count} Books list `, data: filterQ });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//================end====================

//==================Getting books by id====================
const getBookById = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!bookId && bookId.length!=24) {
      return res
        .status(400)
        .send({ status: false, message: "please provide bookId" });
    }

    
    let checkBookById = await BookModel.findById({ _id: bookId });

    if (!checkBookById ) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid book id" });
    }

    let bookDetails = await BookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });

    // if(bookDetails.userId!=req.userId){
    //   return res.status(403).send({status:false,message:"unauthorized user"})
    // }

    let bookDeleted = await BookModel.find({ _id: bookId, isDeleted: true });
    if (bookDeleted.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: "already deleted " });
    }

    

    const ReviewsData = await Review.find({ bookId: bookId, isDeleted: false })
      .select({
        deletedAt: 0,
        isDeleted: 0,
        createdAt: 0,
        __v: 0,
        updatedAt: 0,
      })
      .sort({
        reviewedBy: 1,
      });

    let ReviewObj = bookDetails.toObject();
    if (ReviewsData) {
      ReviewObj["reviewsData"] = ReviewsData;
    }

    res
      .status(200)
      .send({ status: true, message: "book details", data: ReviewObj });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//=======================updating books===================
const updateBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let { title, excerpt, releasedAt, ISBN } = req.body;
    let data=req.body

    if(!data){
      return res.status(400).send({status:false,message:"provide some data in body"})
    }

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide bookid" });
    }

    if(bookId.length!=24){
      return res.status(400).send({status:false,message:"invalid bookId"})
    }
    let checkId = await BookModel.findOne({ _id: bookId });

    if (!checkId) {
      return res.status(404).send({ status: false, message: "not book found" });
    }
    
    if(checkId.userId!=req.userId){
      return res.status(401).send({status:false,message:"unauthorized user"})
    }
    

    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "title is required" });
    }

    let checkTi = await BookModel.find({ title: title, isDeleted: false });
    if (checkTi.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide unique title" });
    }

    if (!excerpt) {
      return res
        .status(400)
        .send({ status: false, message: "excerpt is required" });
    }

    if (!releasedAt) {
      return res
        .status(400)
        .send({ status: false, message: "realeas is required" });
    }

    if (!ISBN) {
      return res
        .status(400)
        .send({ status: false, message: "isbn is required" });
    }

    let checkISBN1 = await BookModel.find({ ISBN: ISBN, isDeleted: false });
    if (checkISBN1.length > 0) {
      return res
        .status(400)
        .send({ status: false, message: "please provide unique ISBN" });
    }

    let checkDeleted = await BookModel.find({ _id: bookId, isDeleted: true });
    if (checkDeleted.length > 0) {
      return res.status(400).send({
        status: false,
        message: "already deleted and you can not update",
      });
    }

    let updateBook = await BookModel.findOneAndUpdate(
      { _id: bookId ,isDeleted:false},
      { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN },
      { new: true }
    );

    res.status(200).send({
      status: true,
      message: "successfully updated books",
      data: updateBook,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//=======================deleting book by id==========================
const deleteById = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide bookid" });
    }

    if(bookId.length !=24){
      return res.status(400).send({status:false,message:"invalid bookid"})
    }

    let checkUser=await BookModel.findById(bookId)
    if(!checkUser){
      return res.status(404).send({status:false,message:"no book found"})
    }
    if(checkUser.userId!=req.userId){
      return res.status(401).send({status:false,message:"unauthorized user"})
    }

    let checkAl = await BookModel.find({ _id: bookId, isDeleted: true });
    if (checkAl.length > 0) {
      return res.status(200).send({ status: true, message: "already deleted" });
    }

    let checkBook = await BookModel.findOne({ _id: bookId, isDeleted: false });

    if (!checkBook) {
      return res.status(404).send({ status: false, message: "not exists" });
    }

    let deleted = await BookModel.findOneAndUpdate(
      { _id: bookId,isDeleted:false },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    let deleteReview = await Review.updateMany(
      { bookId: bookId, isDeleted: false },
      { isDeleted: true,deletedAt:new Date() },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: false, message: "Book and Reviews are Deleted",data:deleted });

    // res.status(200).send({ status: true, data: deleted });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//exporting all function
module.exports.createBook = createBook;
module.exports.getBook = getBook;
module.exports.getBookById = getBookById;
module.exports.updateBook = updateBook;
module.exports.deleteById = deleteById;
