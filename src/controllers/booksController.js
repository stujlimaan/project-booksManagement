const BookModel = require("../models/booksModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

const createBook = async function (req, res) {
  try {
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide book details" });
    }
    const { title, excerpt, ISBN, category, subcategory, releasedAt, userId } =
      data;
    if (!title) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide book title" });
    }
    let checkTitle = await BookModel.findOne({ title: title });
    if (checkTitle) {
      return res
        .status(400)
        .send({ status: false, msg: "please fill unique title" });
    }
    if (!excerpt) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide book name" });
    }
    if (!ISBN) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide user ISBN " });
    }
    let checkISBN = await BookModel.findOne({ ISBN: ISBN });
    if (checkISBN) {
      return res.status(400).send({ status: false, msg: "please uniqui" });
    }
    if (!category) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide user category" });
    }
    if (!subcategory) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide user subcategory" });
    }
    if (!releasedAt) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide address" });
    }
    if (!userId) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide userId" });
    }
    let checkUserId = await User.findById(userId);
    if (!checkUserId) {
      return res.status(404).send({ status: false, msg: "user not found" });
    }
    let book = await BookModel.create(data);
    res.status(201).send({ status: true, data: book });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const getBook = async function (req, res) {
  try {
    const data = req.query;
    const { userId, category, subcategory } = data;

    const filterQ = await BookModel.find({
      $or: [
        { userId: userId },
        { category: category },
        { subcategory: subcategory },
        { isDeleted: false },
      ],
    })
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
    if (Object.keys(filterQ).length == 0) {
      return res.status(404).send({ status: false, msg: "not found" });
    }
    res
      .status(200)
      .send({ status: true, message: "Books list", data: filterQ });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const getBookById = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, message: "please provide bookId" });
    }
    let checkBookById = await BookModel.findById({ _id: bookId });
    if (!checkBookById) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid book id" });
    }

    let bookDetails = await BookModel.findOne({ _id: bookId });
    const ReviewsData = await Review
      .find({ bookId: bookId, isDeleted: false })
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
    if (fetchReviewsData) {
      ReviewObj["reviewsData"] = ReviewsData;
    }
    res.status(200).send({ status: true, message: "book details", data: ReviewObj });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateBook = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let { title, excerpt, releasedAt, ISBN } = req.body;

    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide bookid" });
    }

    let checkId = await BookModel.findOne({ _id: bookId });
    if (!checkId) {
      return res.status(404).send({ status: false, message: "not book found" });
    }
    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "title is required" });
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
    let updateBook = await BookModel.findByIdAndUpdate(
      { _id: bookId },
      { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN },
      { new: true }
    );
    res
      .status(200)
      .send({
        status: true,
        message: "successfully updated books",
        data: updateBook,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteById = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    if (!bookId) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide bookid" });
    }
    let checkBook = await BookModel.findOne({ _id: bookId, isDeleted: false });
    if (!checkBook) {
      return res.status(404).send({ status: false, msg: "not exists" });
    }
    let deleted = await BookModel.findByIdAndUpdate(
      { _id: bookId },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    res.status(200).send({status:true,data:deleted});
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createBook = createBook;
module.exports.getBook = getBook;
module.exports.getBookById = getBookById;
module.exports.updateBook = updateBook;
module.exports.deleteById = deleteById;
