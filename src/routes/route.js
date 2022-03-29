const express = require("express")
const router=express.Router()
const User=require("../controllers/userController")
const Book = require("../controllers/booksController")
const Review=require("../controllers/reviewController")

//api for user
router.post("/register",User.createUser)
router.post("/login",User.login)

//api for books
router.post("/books",Book.createBook)
router.get("/books",Book.getBook)
router.get("/books/:bookId",Book.getBookById)
router.put("/books/:bookId",Book.updateBook)
router.delete("/books/:bookId",Book.deleteById)

//api for review
router.post("/books/:bookId/review",Review.createReview)
router.put("/books/:bookId/review/:reviewId",Review.updateReview)
router.delete("/books/:bookId/review/:reviewId",Review.deleteReview)




module.exports=router