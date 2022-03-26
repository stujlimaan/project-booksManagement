const express = require("express")
const router=express.Router()
const User=require("../controllers/userController")
const Book = require("../controllers/booksController")
const Review=require("../controllers/reviewController")

router.post("/register",User.createUser)
router.post("/login",User.login)

router.post("/books",Book.createBook)
router.get("/books",Book.getBook)
router.get("/books/:bookId",Book.getBookById)
router.put("/books/:bookId",Book.updateBook)
router.delete("/books/:bookId",)

router.post("/books/:bookId/review")



module.exports=router