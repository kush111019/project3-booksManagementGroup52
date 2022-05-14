const jwt = require("jsonwebtoken");
const bookModel=require("../models/BookModel")
const userModel=require("../models/UserModel")
const reviewModel=require("../models/ReviewModel")
const userController=require("../Controllers/UserController")
const bookController=require("../Controllers/BookController")
const reviewController=require("../Controllers/reviewController")


let authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key'];
        if (!token) return res.status(403).send({ status: false, message: "Please Enter your Given Token if not then login first" });
        let decode = jwt.verify(token, "Group-52");
        if (!decode) return res.status(401).send({ status: false, message: "Your are not Authenticate to Enter" })
        next();
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

let autherizationUsingBody = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key'];
    
        if (!token) return res.status(400).send({ status: false, message: "Please enter your token" })

        let userId=req.body.userId;

        let decode = jwt.verify(token, "Group-52");
        if (!decode) return res.status(400).send({ status: false, message: "inavalid token" })
        let logged = decode.userId

        if (logged != userId) return res.status(401).send({ status: false, message: "You are not Autherizsed to make changes" })

        next();

    } catch (err) {

        res.status(500).send({ status: false, message: err.message });
    }
};

let autherizationUsingParams=async function(req,res,next){

    try {
        let token = req.headers['x-api-key'];
    
        if (!token) return res.status(400).send({ status: false, message: "Please enter your token" })
        let bookId=req.params.bookId;
        let book=await bookModel.findOne({_id:bookId})

        let userId=book.userId;

        let decode = jwt.verify(token, "Group-52");
        if (!decode) return res.status(400).send({ status: false, message: "inavalid token" })
        let logged = decode.userId

        if (logged != userId) return res.status(401).send({ status: false, message: "You are not Autherizsed to make changes" })

        next();

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};


module.exports={authentication,autherizationUsingBody,autherizationUsingParams}

