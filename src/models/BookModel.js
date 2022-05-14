const mongoose=require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const BookSchema=new mongoose.Schema({

title:{type:String,required:"title is required",unique:true},
excerpt:{type:String,required:"excerpt is required"},
userId:{type:ObjectId,required:"userId is required",ref:"User"},
ISBN:{type:String,required:"ISBN is required",unique:true},
category:{type:String,required:"category is required"},
subcategory:{type:[],required:"subcategory is required"},
reviews:{type:Number,default:0},
deletedAt:{type:Date},
isDeleted:{type:Boolean,default:false},
releasedAt:{type: String,required:"date is required"}

},{timestamp:true})

module.exports=mongoose.model("Book",BookSchema)
