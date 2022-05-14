const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema(

{ 
    title: {type:String, required:"title is required", enum:['Mr', 'Mrs', 'Miss']},
    name: {type:String, required:"name is required"},
    phone: {type:String, required:"phone is required", unique:true},
    email: {type:String, required:"type is required",  unique:true}, 
    password: {type:String, required:"password is required", minlength: 8, maxlength: 15},
    address: {
      street: {type:String},
      city: {type:String},
      pincode: {type:String}
    },
  }
,{timestamp:true})

module.exports=mongoose.model("User",UserSchema)
