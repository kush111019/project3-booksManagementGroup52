const bookModel=require("../models/BookModel")
const userModel=require("../models/UserModel")
const reviewModel=require("../models/ReviewModel")
const validator=require("../validators/validators")
const jwt=require("jsonwebtoken")
const express=require("express")


const createBook=async function(req,res){
    
    try{
    data=req.body;

    if(!validator.isValidRequestBody(data)){

        return res.status(400).send({status:false,msg:"no user details given"})
    }

    let{title,excerpt,userId,ISBN,category,subcategory,isDeleted,releasedAt}=data;
    if(!isDeleted)
    isDeleted=false;
    
    if(isDeleted==true)
    {
   data={
        title,
        excerpt,
        userId,
        ISBN,
        category,
        subcategory,
        reviews:0,
        isDeleted,
        deletedAt:new Date(),
        releasedAt:releasedAt

       }

    }
    else if(isDeleted==false){

        data={
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            reviews:0,
            isDeleted,
            releasedAt:releasedAt
    
           }
     }
      
    if(!validator.isValid(title)){

        return res.status(400).send({status:false,msg:"title is not valid"})
    }

    if(!validator.dateIsValid(releasedAt)){

        return res.status(400).send({status:false,msg:"releasedAt date is not valid"})
    }


    if(!validator.isValid(excerpt)){

        return res.status(400).send({status:false,msg:"excerpt is not valid"})
    }
    

    if(!validator.isValidObjectId(userId)){

        return res.status(400).send({status:false,msg:"userId is not valid"})
    }
    

    if(!validator.isValidIsbn(ISBN)){

        return res.status(400).send({status:false,msg:"ISBN is not valid"})
    }

    
    if(!validator.isValid(category)){

        return res.status(400).send({status:false,msg:"category is not valid"})
    }

    if(!validator.isValid(subcategory)){
      
      return res.status(400).send({status:false,msg:"subcategory is not valid"})

   }

   if(!validator.isDeleted(isDeleted)){
   
    return res.status(400).send({status:false,msg:"deleted is not valid"})
   }

   
  let userExists=await userModel.findById({_id:userId})
  if(!userExists){
    
    return res.status(400).send({status:false,msg:"no user exists with this ID"})

  }
  let isbnExists=await bookModel.findOne({ISBN:ISBN})
  if(isbnExists){

    return res.status(400).send({status:false,msg:"isbn already exist choose other ISBN"})
  }

  let titleExists=await bookModel.findOne({title:title})
  if(titleExists){

    return res.status(400).send({status:false,msg:"title already exists"})
  }

  
  let insertedRecord=await bookModel.create(data)
  if(!insertedRecord){

    return res.status(500).send({status:false,msg:"record is not inserted"})

  }
}catch{
    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

  return res.status(201).send({status:false,msg:"record is inserted",data:insertedRecord})
}

}


const getBooksByFilter=async function(req,res){
try{
let data=req.query;
let records;
let obj;

if(!validator.isValidRequestBody(data)){

    return res.status(400).send({status:false,msg:"no user details given"})
}

let{userId,category,subcategory}=data;

if(userId){
if(!validator.isValidObjectId(userId)){
    
    return res.status(400).send({status:false,msg:"userId is not valid"})
}
}
if(category){
if(!validator.isValid(category)){

    return res.status(400).send({status:false,msg:"category is not valid"})
}
}
if(subcategory){
if(!validator.isValid(subcategory)){
      
    return res.status(400).send({status:false,msg:"subcategory is not valid"})

 }
}

 if(category && subcategory && userId)
 {
  let recordsWithThree=await bookModel.find({userId:userId,category:category,subcategory:subcategory})
  if(recordsWithThree.length==0){
   return res.status(400).send({status:false,msg:"record is not found with these combinations"})
  
 }
  records=await bookModel.find({userId:userId,category:category,subcategory:subcategory})
  console.log(records)
  obj=new Object(records)
   obj._id=records._id;
   obj.title=records.title;
   obj.excerpt=records.excerpt;
   obj.userId=records.userId;
   obj.category=records.category;
   obj.releasedAt=records.releasedAt;
   obj.reviews=records.reviews;
   
 }
 
 else if(category && subcategory){
 let recordsWithBoth=await bookModel.find({category:category,subcategory:subcategory})
 console.log(recordsWithBoth)
 if(recordsWithBoth.length==0){
     return res.status(400).send({status:false,msg:"record is not found with these combinations"})
 }
 records=await bookModel.find({category:category,subcategory:subcategory})
 obj=new Object(records)
 obj._id=records._id;
 obj.title=records.title;
 obj.excerpt=records.excerpt;
 obj.userId=records.userId;
 obj.category=records.category;
 obj.releasedAt=records.releasedAt;
 obj.reviews=records.reviews;
 

 }

 else if(subcategory && userId){
     let recordsWithBoth=await bookModel.find({category:category,subcategory:subcategory})
     if(recordsWithBoth.length){
         return res.status(400).send({staus:false,msg:"records are not found with these combinations"})
     }
    records=await bookModel.find({userId:userId,subcategory:subcategory})
    obj=new Object(records)
    obj._id=records._id;
    obj.title=records.title;
    obj.excerpt=records.excerpt;
    obj.userId=records.userId;
    obj.category=records.category;
    obj.releasedAt=records.releasedAt;
    obj.reviews=records.reviews;
 }

 else if(userId && category){
    let recordWithBoth=await bookModel.find({userId:userId,category:category})
    if(recordWithBoth.length){
        return res.status(400).send({status:false,msg:"records are not found with these combinations"})
    }
    records=await bookModel.find({userId:userId,category})
    obj=new Object(records)
    obj._id=records._id;
    obj.title=records.title;
    obj.excerpt=records.excerpt;
    obj.userId=records.userId;
    obj.category=records.category;
    obj.releasedAt=records.releasedAt;
    obj.reviews=records.reviews;

 }
 else if(userId){
 let userExist=await bookModel.find({userId:userId})
 if(userExist.length){
     return res.status(400).send({status:false,msg:"wrong userId"})
 }
 records =await bookModel.find({userId:userId})
 obj=new Object(records)
 obj._id=records._id;
 obj.title=records.title;
 obj.excerpt=records.excerpt;
 obj.userId=records.userId;
 obj.category=records.category;
 obj.releasedAt=records.releasedAt;
 obj.reviews=records.reviews;
 }
 

 else if(category){
    let categoryExists=await bookModel.find({category:category})
    if(categoryExists.length==0){
        return res.status(400).send({status:false,msg:"wrong category"})
    }
    records=await bookModel.find({category:category})
    obj=new Object(records)
    obj._id=records._id;
    obj.title=records.title;
    obj.excerpt=records.excerpt;
    obj.userId=records.userId;
    obj.category=records.category;
    obj.releasedAt=records.releasedAt;
    obj.reviews=records.reviews;
 }

else if(subcategory){
    let subcategoryExists=await bookModel.find({subcategory:subcategory})
    if(subcategoryExists.length==0){
        return res.status(400).send({status:false,msg:"wrong subcategory"})
    }
    records=await bookModel.find({subcategory:subcategory})
    obj=new Object(records)
    obj._id=records._id;
    obj.title=records.title;
    obj.excerpt=records.excerpt;
    obj.userId=records.userId;
    obj.category=records.category;
    obj.releasedAt=records.releasedAt;
    obj.reviews=records.reviews;
}
if(Object.keys(obj).length<0)
return res.status(400).send({status:false,msg:"no records are found"})
console.log(obj)
return res.status(200).send({status:true,msg:"succcess",obj})
}catch(err){
     
    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

}

}



const getBooksByBookId=async function(req,res){
   

 try{
  bookId=req.params.bookId;
  

  if(!bookId){

    return res.status(400).send({status:false,msg:"bookId is missing"})
  }

  if(!validator.isValidObjectId(bookId)){

    return res.status(400).send({status:false,msg:"userId is not valid"})
  }
   
 let bookData=await bookModel.findById({_id:bookId})
 if(!bookData){
     
    return res.status(400).send({status:false,msg:"no book data is present with theis book Id"})

 }
 
 let reviewData=await reviewModel.find({bookId:bookId})

 let data=new Object(null)
 data.bookData=bookData
 data.reviewData=reviewData;
 if(!data){
     return res.status(400).send({status:false,message:"no data is available for this bookId"})
 }
 return res.status(200).send({status:true,message:"Books list",data:data})

}catch{

    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

}
}

const updateBookByBookId=async function(req,res){
try{
let newRecord;
let bookId=req.params.bookId;
let data=req.body;
let{title,excerpt,ISBN,releasedAt}=data;


if(!bookId){

    return res.status(400).send({status:false,message:"bookId is required"})
}

if(!validator.isValidObjectId(bookId)){

    return res.status(400).send({status:false,msg:"userId is not valid"})
  }
  
let bookIdPresent=await bookModel.findById({_id:bookId})
if(!bookIdPresent){

    return res.status(400).send({status:false,msg:"bookId is not present"})
}
if(bookId.isDeleted){

    return res.status(400).send({status:false,msg:"isDeleted is not false"})
}

  if(title){
  if(!validator.isValid(title)){

    return res.status(400).send({status:false,message:"title is invalid"})
  }
}
  if(excerpt){
  if(!validator.isValid(excerpt)){

    return res.status(400).send({status:false,message:"excerpt is invalid"})
  }
  }
  if(ISBN){
  if(!validator.isValidIsbn(ISBN)){

    return res.status(400).send({status:400,message:"ISBN is invalid"})
  }
}
  if(releasedAt){
  if(!validator.dateIsValid(releasedAt)){

    return res.status(400).send({status:false,msg:"releasedAt date is not valid"})
  }
  }
  
if(ISBN && releasedAt && title && excerpt){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
        {$set:{releasedAt:releasedAt,ISBN:ISBN,title:title,excerpt:excerpt}},
        {new:true,upsert:true}
    )

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})

}
else if(title && excerpt && ISBN){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
       {$set: {ISBN:ISBN,title:title,excerpt:excerpt}},
        {new:true,upsert:true}
    )
   

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})

}

else if(excerpt && ISBN && releasedAt){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
       {$set:{ISBN:ISBN,releasedAt:releasedAt,excerpt:excerpt}},
        {new:true,upsert:true}
    )

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})


}

else if(ISBN && releasedAt && title){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
        {$set:{ISBN:ISBN,releasedAt:releasedAt,title:title}},
        {new:true,upsert:true}
    )


    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})

}


else if(title && excerpt){


    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
       {$set: {title:title,excerpt:excerpt}},
        {new:true,upsert:true}
    )

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})
}

else if(ISBN && excerpt){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
        {$set:{ISBN:ISBN,excerpt:excerpt}},
        {new:true,upsert:true}
    )

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})

}

else if(ISBN && title){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
        {$set:{ISBN:ISBN,title:title}},
        {new:true,upsert:true}
    )

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})
}
else if(ISBN){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
       {$set:{ISBN:ISBN}},
        {new:true,upsert:true}
    )

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})
}
else if(title){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
       {$set: {title:title}},
        {new:true,upsert:true}
    )

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})
}

else if(excerpt){

    newRecord=await bookModel.findOneAndUpdate(
   
        {_id:bookId},
        {$set:{excerpt:excerpt}},
        {new:true,upsert:true}
    )

    if(!newRecord){

        return res.status(400).return({status:false,message:"data is not updated"})
    }
    
    return res.status(200).send({status:true,message:"success",newRecord})

}
}catch(err){
     
    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

}

}


const deleteBookByBookId=async function(req,res){
    
try{
bookId=req.params.bookId;
if(!bookId){

    return res.status(400).send({status:false,msg:"bookId is not available"})
}
if(!validator.isValidObjectId(bookId)){

    return res.status(400).send({status:false,msg:"bookId is invalid"})
}

let bookIdExists=await bookModel.findById({_id:bookId})
if(!bookIdExists){

    return res.status(400).send({status:false,msg:"no book exists with this bookId"})
}

let bookNotDeleted=await bookModel.findById({_id:bookId,isDeleted:false})
if(!bookNotDeleted){
    
    return res.status(400).send({status:false,msg:"book is already deleted"})

}
let updatedBook=await bookModel.findOneAndUpdate(

    {_id:bookId},
    {isDeleted:true,deletedAt:new Date()},
    {new:true,upsert:true}
)

let deleteReview=await reviewModel.updateMany(

    {bookId:bookId},
    {isDeleted:true},
    {new:true,upsert:true}
    )

return res.status(200).send({status:false,msg:"success",updatedBook,deleteReview})
}catch{

    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

}

}



  module.exports={createBook,getBooksByFilter,getBooksByBookId,updateBookByBookId,deleteBookByBookId}














