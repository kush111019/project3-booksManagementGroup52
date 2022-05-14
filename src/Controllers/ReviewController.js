const bookModel=require("../models/BookModel")
const userModel=require("../models/UserModel")
const reviewModel=require("../models/ReviewModel")
const validator=require("../validators/validators")
const express=require("express")



const createReviewData=async function(req,res){
try{
let data=req.body;
let bookId=req.params.bookId
let updateReviewInBookModelAlso;

if(!validator.isValidRequestBody(data)){

    return res.status(400).send({status:false,msg:"no user details given"})
}


if(!validator.isValidObjectId(bookId)){

    return res.status(400).send({status:false,msg:"invalid bookId"})

}


let bookExists=await bookModel.findOne({_id:bookId})
if(!bookExists){

    return res.status(400).send({status:false,msg:"book not exist with this bookId"})
}

let bookIsNotDeleted=await bookModel.findOne({isDeleted:false})
if(!bookIsNotDeleted){
    return res.status(400).send({status:false,msg:"the book is already deleted"})
}

let{review, rating, reviewedBy,isDeleted}=data;

if(!reviewedBy && !review && !isDeleted && reviewedBy){
    
     data={

            bookId,
            reviewedBy:"Guest",
            reviewedAt:new Date(),
            rating,
            isDeleted:false
            
          }

}

else if(!review && !isDeleted){

    data={

        bookId,
        reviewedBy,
        reviewedAt:new Date(),
        rating,
        isDeleted:false
        
      }
    }
else if(!review){

    data={

        bookId,
        reviewedBy,
        reviewedAt:new Date(),
        rating,
        isDeleted
      }


}

else if(!isDeleted){

    data={

        bookId,
        reviewedBy,
        reviewedAt:new Date(),
        rating,
        review,
        isDeleted:false
      }

}
data.reviewedAt=new Date();


if(!validator.isValid(reviewedBy)){

    return res.status(400).send({status:false,msg:"reviewedBy is not valid"})
}

if(!validator.isRatingWithinRange(rating)){

  return res.status(400).send({status:false,msg:"rating is not valid"})

}

let newRecord=await reviewModel.create(data)

if(!newRecord){

    return res.status(400).send({status:false,msg:"record not inserted"})
}
else{
 updateReviewInBookModelAlso=await bookModel.findOneAndUpdate(
    
    {_id:bookId},
    {$inc : {'reviews' : 1}},
    {new:true,upsert:true}
  )
}
if(updateReviewInBookModelAlso){
    return res.status(200).send({status:true,msg:"success",data:newRecord}) 
}

}catch{
    console.log("this is the error", error)
     res.status(500).send({ status: false, msg: error.message })


}

}

const updateReview=async function(req,res){
try{

 let bookId=req.params.bookId;
 let reviewId=req.params.reviewId;
 let data=req.body;
 if(!validator.isValidRequestBody){
     
    return res.status(400).send({status:false,msg:"body is missing"}) 

 }
 if(!bookId){

     return res.status(400).send({status:false,msg:"bookId is missing"})
 }
 
 if(!validator.isValidObjectId(bookId)){
   
    return res.status(400).send({status:false,msg:"bookId is not valid"})

 }
 
 if(!reviewId){

    return res.status(400).send({status:false,msg:"reviewId is missing"})
 }
 

 if(!validator.isValidObjectId(reviewId)){

    return res.status(400).send({status:false,msg:"reviewId is not valid"})
 }
 


 let{review,rating,reviewedBy}=data;

if(!reviewedBy){
    reviewedBy="Guest";
}
 
if(reviewedBy){
    if(!validator.isValid(reviewedBy)){
    
          return res.status(400).send({status:false,msg:"reviewedBy is not valid"})
    
    }
    }

if(review){
if(!validator.isValid(review)){
      
    return res.status(400).send({status:false,msg:"review is not valid"})

}
}

if(rating){
if(!validator.isRatingWithinRange(rating)){

  return res.status(400).send({status:false,msg:"rating is not valid"})

}
}

let bookIdExists=await bookModel.findOne({_id:bookId})
if(!bookIdExists){

   return res.status(400).send({status:false,msg:"no book exist with this bookId"})

}


let reviewExists=await reviewModel.findOne({_id:reviewId})
if(!reviewExists){

    return res.status(400).send({status:false,msg:"no review exists with this reviewId"})
}


if(review && rating && reviewedBy){

let updateReview=await reviewModel.findOneAndUpdate(

    {_id:reviewId},
    {$set:{review:review,rating:rating,reviewedBy:reviewedBy,reviewedAt:new Date()}},
    {new:true,upsert:true}
)
reviewExists={
  
        _id:bookId,
        title:bookIdExists.title,
        excerpt:bookIdExists.excerpt,
        userId:bookIdExists.userId,
        ISBN:bookIdExists.ISBN,
        category:bookIdExists.category,
        subcategory:bookIdExists.subcategory,
        releasedAt:bookIdExists.releasedAt,
        reviews:bookIdExists.reviews,
        isDeleted:bookIdExists.isDeleted,
        createdAt:bookIdExists.createdAt,
        updatedAt:bookIdExists.updatedAt,
        reviewsData:new Array()
    }

   reviewExists.reviewsData.push(updateReview);
   return res.status(200).send({status:true,message:"Books list",reviewExists})
}
else if(review && rating){

    let updateReview=await reviewModel.findOneAndUpdate(

        {_id:reviewId},
        {$set:{review:review,rating:rating,reviewedAt:new Date()}},
        {new:true,upsert:true}
    )
    reviewExists={
      
            _id:bookId,
            title:bookIdExists.title,
            excerpt:bookIdExists.excerpt,
            userId:bookIdExists.userId,
            ISBN:bookIdExists.ISBN,
            category:bookIdExists.category,
            subcategory:bookIdExists.subcategory,
            releasedAt:bookIdExists.releasedAt,
            reviews:bookIdExists.reviews,
            isDeleted:bookIdExists.isDeleted,
            createdAt:bookIdExists.createdAt,
            updatedAt:bookIdExists.updatedAt,
            reviewsData:new Array()
        }
    
       reviewExists.reviewsData.push(updateReview);
       return res.status(200).send({status:true,message:"Books list",reviewExists})

}
else if(rating && reviewedBy){

    let updateReview=await reviewModel.findOneAndUpdate(

        {_id:reviewId},
        {$set:{reviewedBy:reviewedBy,rating:rating,reviewedAt:new Date()}},
        {new:true,upsert:true}
    )
    reviewExists={
      
            _id:bookId,
            title:bookIdExists.title,
            excerpt:bookIdExists.excerpt,
            userId:bookIdExists.userId,
            ISBN:bookIdExists.ISBN,
            category:bookIdExists.category,
            subcategory:bookIdExists.subcategory,
            releasedAt:bookIdExists.releasedAt,
            reviews:bookIdExists.reviews,
            isDeleted:bookIdExists.isDeleted,
            createdAt:bookIdExists.createdAt,
            updatedAt:bookIdExists.updatedAt,
            reviewsData:new Array()
        }
    
       reviewExists.reviewsData.push(updateReview);
       return res.status(200).send({status:true,message:"Books list",reviewExists})


}
else if(review && reviewedBy){


    let updateReview=await reviewModel.findOneAndUpdate(

        {_id:reviewId},
        {$set:{review:review,reviewedBy:reviewedBy,reviewedAt:new Date()}},
        {new:true,upsert:true}
    )
    reviewExists={
      
            _id:bookId,
            title:bookIdExists.title,
            excerpt:bookIdExists.excerpt,
            userId:bookIdExists.userId,
            ISBN:bookIdExists.ISBN,
            category:bookIdExists.category,
            subcategory:bookIdExists.subcategory,
            releasedAt:bookIdExists.releasedAt,
            reviews:bookIdExists.reviews,
            isDeleted:bookIdExists.isDeleted,
            createdAt:bookIdExists.createdAt,
            updatedAt:bookIdExists.updatedAt,
            reviewsData:new Array()
        }
    
       reviewExists.reviewsData.push(updateReview);
       return res.status(200).send({status:true,message:"Books list",reviewExists})


}

else if(review){


    let updateReview=await reviewModel.findOneAndUpdate(

        {_id:reviewId},
        {$set:{review:review,reviewedAt:new Date()}},
        {new:true,upsert:true}
    )
    reviewExists={
      
            _id:bookId,
            title:bookIdExists.title,
            excerpt:bookIdExists.excerpt,
            userId:bookIdExists.userId,
            ISBN:bookIdExists.ISBN,
            category:bookIdExists.category,
            subcategory:bookIdExists.subcategory,
            releasedAt:bookIdExists.releasedAt,
            reviews:bookIdExists.reviews,
            isDeleted:bookIdExists.isDeleted,
            createdAt:bookIdExists.createdAt,
            updatedAt:bookIdExists.updatedAt,
            reviewsData:new Array()
        }
    
       reviewExists.reviewsData.push(updateReview);
       return res.status(200).send({status:true,message:"Books list",reviewExists})
}

else if(reviewedBy){



    let updateReview=await reviewModel.findOneAndUpdate(

        {_id:reviewId},
        {$set:{reviewedBy:reviewedBy,reviewedAt:new Date()}},
        {new:true,upsert:true}
    )
    reviewExists={
      
            _id:bookId,
            title:bookIdExists.title,
            excerpt:bookIdExists.excerpt,
            userId:bookIdExists.userId,
            ISBN:bookIdExists.ISBN,
            category:bookIdExists.category,
            subcategory:bookIdExists.subcategory,
            releasedAt:bookIdExists.releasedAt,
            reviews:bookIdExists.reviews,
            isDeleted:bookIdExists.isDeleted,
            createdAt:bookIdExists.createdAt,
            updatedAt:bookIdExists.updatedAt,
            reviewsData:new Array()
        }
    
       reviewExists.reviewsData.push(updateReview);
       return res.status(200).send({status:true,message:"Books list",reviewExists})
}

else if(rating){

    let updateReview=await reviewModel.findOneAndUpdate(

        {_id:reviewId},
        {$set:{rating:rating,reviewedAt:new Date()}},
        {new:true,upsert:true}
    )
    reviewExists={
      
            _id:bookId,
            title:bookIdExists.title,
            excerpt:bookIdExists.excerpt,
            userId:bookIdExists.userId,
            ISBN:bookIdExists.ISBN,
            category:bookIdExists.category,
            subcategory:bookIdExists.subcategory,
            releasedAt:bookIdExists.releasedAt,
            reviews:bookIdExists.reviews,
            isDeleted:bookIdExists.isDeleted,
            createdAt:bookIdExists.createdAt,
            updatedAt:bookIdExists.updatedAt,
            reviewsData:new Array()
        }
    
       reviewExists.reviewsData.push(updateReview);
       return res.status(200).send({status:true,message:"Books list",reviewExists})
}
}catch(err){
     
    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

}

}



const deleteReview=async function(req,res){
try{
 let bookId=req.params.bookId;
 let reviewId=req.params.reviewId;
 

 if(!validator.isValidObjectId(bookId)){

    return res.status(400).send({status:false,msg:"bookId is invalid"})
 }

  
 if(!validator.isValidObjectId(reviewId)){

    return res.status(400).send({status:false,msg:"reviewId is invalid"})

}

let bookExistsWithThisBookId=await bookModel.findOne({_id:bookId})

if(!bookExistsWithThisBookId){

    return res.status(400).send({status:false,msg:"no book exist with this bookId"})
}

let reviewExistsWithThisReviewId=await reviewModel.findOne({_id:reviewId});

if(!reviewExistsWithThisReviewId){

    return res.status(400).send({status:false,msg:"no review exists with this reviewId"})
}

let updatedReviewRecord=await reviewModel.findOneAndUpdate(

  {_id:reviewId},
  {$set:{isDeleted:true}},
  {new:true,upsert:true}
)

let updatedBookRecord=await bookModel.findOneAndUpdate(

  {_id:bookId},
  {$inc : {'reviews' : -1}},
  {new:true,upsert:true}
)
let obj=new Object(null);
obj.newReview=updatedReviewRecord;
obj.newBook=updatedBookRecord;
return res.status(200).send({status:true,msg:"success",obj});
}catch(err){
     
    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

}

}






module.exports={createReviewData,updateReview,deleteReview}

