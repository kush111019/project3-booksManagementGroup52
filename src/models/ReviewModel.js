const mongoose=require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const ReviewSchema=new mongoose.Schema({
bookId:{type:ObjectId,ref:"Book",required:"bookId is missing"},
reviewedBy:{type:String,required:"reviewedBy is missing",default:"Guest"},
reviewedAt:{type:Date,required:"reviewedAt is missing"},
rating:{type:Number,minLength:1,maxLength:5,required:"rating is missing"},
review:{type:String},
isDeleted:{type:String,default:false}
})

module.exports=mongoose.model("Review",ReviewSchema)


