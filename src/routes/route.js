const express = require("express")
const router=express.Router();
const userCont=require("../Controllers/UserController")
const bookController=require("../Controllers/BookController")
const reviewController=require("../Controllers/ReviewController")
const middleware=require("../middleware/auth.js")






router.post("/register",userCont.createUser)
router.post("/login",userCont.login)
router.post("/books",middleware.authentication,middleware.autherizationUsingBody,bookController.createBook)
router.get("/books",middleware.authentication,bookController.getBooksByFilter)
router.post("/books/:bookId/review",reviewController.createReviewData)
router.get("/books/:bookId",middleware.authentication,bookController.getBooksByBookId)
router.put("/books/:bookId",middleware.authentication,middleware.autherizationUsingParams,bookController.updateBookByBookId)
router.delete("/books/:bookId",middleware.authentication,middleware.autherizationUsingParams,bookController.deleteBookByBookId)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)





module.exports=router;