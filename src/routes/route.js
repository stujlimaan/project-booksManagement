const express = require("express")
const router=express.Router()
const User=require("../controllers/userController")
const Book = require("../controllers/booksController")
const Review=require("../controllers/reviewController")
const middleware=require("../middleware/auth")

//api for user
router.post("/register",User.createUser)
router.post("/login",User.login)

//api for books
router.post("/books",middleware.authentication,middleware.authorization, Book.createBook)
router.get("/books",middleware.authentication,Book.getBook)
router.get("/books/:bookId",middleware.authentication,Book.getBookById)
router.put("/books/:bookId",middleware.authentication,middleware.authorization,Book.updateBook)
router.delete("/books/:bookId",middleware.authentication,middleware.authorization,Book.deleteById)

//api for review
router.post("/books/:bookId/review",Review.createReview)
router.put("/books/:bookId/review/:reviewId",Review.updateReview)
router.delete("/books/:bookId/review/:reviewId",Review.deleteReview)




module.exports=router