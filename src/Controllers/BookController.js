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

    if(!validator.isValid(releasedAt)){

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
    
    return res.status(404).send({status:false,msg:"no user exists with this ID"})

  }
  let isbnExists=await bookModel.findOne({ISBN:ISBN})
  if(isbnExists!=null){

    return res.status(404).send({status:false,msg:"isbn already exist choose other ISBN"})
  }

  let titleExists=await bookModel.findOne({title:title})
  if(titleExists!=null){

    return res.status(404).send({status:false,msg:"title already exists"})
  }

  
  let insertedRecord=await bookModel.create(data)
  if(!insertedRecord){

    return res.status(500).send({status:false,msg:"record is not inserted"})

  }
  return res.status(201).send({status:false,msg:"record is inserted",insertedRecord})
}catch{
    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

  
}

}


const getBooksByFilter=async function(req,res){
try{
let data=req.query;
let{userId,category,subcategory}=data;
let count=0;
let records;
let objectKeys=Object.keys(data)
let keys=["userId","category","subcategory"];
for(let i=0;i<objectKeys.length;i++)
{
    for(let j=0;j<keys.length;j++)
    {
        if(objectKeys[i]==keys[j])
        {
        count++;
        break;
        }
    }
} 
if(count!=objectKeys.length)
return res.status(400).send({status:false,msg:"invalid key selection"})
else{
{
if(!validator.isValidRequestBody(data)){

  
        records=await bookModel.find().sort({title:1})
        obj=new Object(records)
        obj._id=records._id;
        obj.title=records.title;
        obj.excerpt=records.excerpt;
        obj.userId=records.userId;
        obj.category=records.category;
        obj.releasedAt=records.releasedAt;
        obj.reviews=records.reviews;
    
    
}



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
  let recordsWithThree=await bookModel.find({userId:userId,category:category,subcategory:subcategory,isDeleted:false})
  if(!recordsWithThree.length){
   return res.status(404).send({status:false,msg:"record is not found with these combinations"})
  
 }
  records=await bookModel.find({userId:userId,category:category,subcategory:subcategory,isDeleted:false}).sort({title:1})
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
 let recordsWithBoth=await bookModel.find({category:category,subcategory:subcategory,isDeleted:false})
 if(!recordsWithBoth.length){
     return res.status(404).send({status:false,msg:"record is not found with these combinations"})
 }
 records=await bookModel.find({category:category,subcategory:subcategory,isDeleted:false}).sort({title:1})
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
     let recordsWithBoth=await bookModel.find({userId:userId,subcategory:subcategory,isDeleted:false})
     if(!recordsWithBoth.length){
         return res.status(404).send({staus:false,msg:"records are not found with these combinations"})
     }
    records=await bookModel.find({userId:userId,subcategory:subcategory,isDeleted:false}).sort({title:1})
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
    let recordWithBoth=await bookModel.find({userId:userId,category:category,isDeleted:false})
    if(!recordWithBoth.length){
        return res.status(404).send({status:false,msg:"records are not found with these combinations"})
    }
    records=await bookModel.find({userId:userId,category:category,isDeleted:false}).sort({title:1})
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
 let userExist=await bookModel.find({userId:userId,isDeleted:false})
 if(!userExist){
     return res.status(404).send({status:false,msg:"no record found"})
 }
 records =await bookModel.find({userId:userId,isDeleted:false}).sort({title:1})
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
    let categoryExists=await bookModel.find({category:category,isDeleted:false})
    if(!categoryExists){
        return res.status(404).send({status:false,msg:"wrong category"})
    }
    records=await bookModel.find({category:category,isDeleted:false}).sort({title:1})
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
    let subcategoryExists=await bookModel.find({subcategory:subcategory,isDeleted:false})
    if(!subcategoryExists){
        return res.status(404).send({status:false,msg:"wrong subcategory"})
    }
    records=await bookModel.find({subcategory:subcategory,isDeleted:false}).sort({title:1})
    obj=new Object(records)
    obj._id=records._id;
    obj.title=records.title;
    obj.excerpt=records.excerpt;
    obj.userId=records.userId;
    obj.category=records.category;
    obj.releasedAt=records.releasedAt;
    obj.reviews=records.reviews;
}
if(Object.keys(obj).length>0)
return res.status(200).send({status:true,msg:"succcess",obj})
else
return res.status(500).send({status:false,msg:"no records are found"})
}
}
}catch(error){
   
    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })


}
}



const getBooksByBookId=async function(req,res){
   

 try{
  bookId=req.params.bookId;
  


  if(!validator.isValidObjectId(bookId)){

    return res.status(400).send({status:false,msg:"userId is not valid"})
  }
   
 let bookData=await bookModel.findOne({_id:bookId})
 if(bookData==null){
     
    return res.status(404).send({status:false,msg:"no book exist with this bookId"})

 }
 let bookIsNotDeleted=await bookModel.findOne({_id:bookId,isDeleted:false})
 if(bookIsNotDeleted==null){
     return res.status(404).send({status:false,msg:"book is deleted with this bookId"})
 }
 
 let reviewData=await reviewModel.find({bookId:bookId})
 if(!reviewData.length){
     return res.status(404).send({status:false,msg:"no review exists with this bookId"})
 }
 let reviewIsDeleted=await reviewModel.find({bookId:bookId,isDeleted:false})
 if(!reviewIsDeleted.length){
    return res.status(404).send({status:false,msg:"review is deleted with this reviewId"})
 }

 let data=new Object(null)
 data.bookData=bookData
 data.reviewData=reviewData;
 if(!data){
     return res.status(404).send({status:false,message:"no data is available for this bookId"})
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



if(!validator.isValidObjectId(bookId)){

    return res.status(400).send({status:false,msg:"userId is not valid"})
  }
  
let bookIdPresent=await bookModel.findOne({_id:bookId})
if(bookIdPresent==null){

    return res.status(404).send({status:false,msg:"no book exists with this bookId"})
}
let bookIsNotDeleted=await bookModel.findOne({_id:bookId,isDeleted:false})
if(bookIsNotDeleted==null){

    return res.status(404).send({status:false,msg:"book is already deleted with this bookId"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

        return res.status(500).return({status:false,message:"data is not updated"})
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

let bookId=req.params.bookId;

if(!validator.isValidObjectId(bookId)){

    return res.status(400).send({status:false,msg:"bookId is invalid"})
}

let bookIdExists=await bookModel.findById({_id:bookId})

if(bookIdExists==null){

    return res.status(404).send({status:false,msg:"no book exists with this bookId"})
}

let bookNotDeleted=await bookModel.findOne({_id:bookId,isDeleted:false})
if(bookNotDeleted==null){
    
    return res.status(404).send({status:false,msg:"book is already deleted"})

}
let updatedBook=await bookModel.findOneAndUpdate(

    {_id:bookId},
    {$set:{isDeleted:true,deletedAt:new Date()}},
    {new:true,upsert:true}
)

let deleteReview=await reviewModel.updateMany(

    {bookId:bookId},
    {$set:{isDeleted:true}},
    {new:true,upsert:true}
    )

return res.status(200).send({status:false,msg:"success",updatedBook,deleteReview})
   }catch{

    console.log("this is the error", error)
    res.status(500).send({ status: false, msg: error.message })

}

}



  module.exports={createBook,getBooksByFilter,getBooksByBookId,updateBookByBookId,deleteBookByBookId}














