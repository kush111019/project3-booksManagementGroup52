const userModel=require("../models/UserModel")
const express=require("express")
//const { default: mongoose } = require("mongoose");
const validator=require("../validators/validators")
const jwt=require("jsonwebtoken")
const { off } = require("process")

const createUser=async function(req,res) {
try{
let data=req.body;
let obj;

if(!validator.isValidRequestBody(data)){

    return res.status(400).send({status:false,msg:"no user details given"})
}



let {title,name,phone,email,password,address}=data;
if(!address)
{
    obj=Object.create(null);
    obj.title=title;
    obj.name=name;
    obj.phone=phone;
    obj.email=email;
    obj.password=password;
}
else if(address)
{
    obj=Object.create(null);
    obj.title=title;
    obj.name=name;
    obj.phone=phone;
    obj.email=email;
    obj.password=password;
    obj.address=address;
}
if(!validator.isValidEmail(email)){

    res.status(400).send({status:false,msg:"email is not valid"})
}


if(!validator.isValidTitle(title)){
    return res.status(400).send({status:false,msg:"title is invalid"})
    
}


if(!validator.isValid(name)){

    return res.status(400).send({status:false,msg:"name is not valid"})
}


if(!validator.isValidMobileNumber(phone)){

   return res.status(400).send({status:false,msg:"mobile number is invalid"})
}



if(!validator.isValidPassword(password)){

    return res.status(400).send({status:false,msg:"password is not valid"})
}



let mobileNumberExists=await userModel.findOne({phone:phone})
if(mobileNumberExists){
   return res.status(404).send({status:false,msg:"phone number already exists"})
}


let emailAlreadyExists=await userModel.findOne({email:email})
if(emailAlreadyExists){
    return res.status(404).send({status:false,msg:"email number already used"})
}


let insertedRecord=await userModel.create(obj);
res.status(201).send({status:true,msg:"success",data:insertedRecord})
}catch{
    console.log("this is the error", error)
        res.status(500).send({ status: false, msg: error.message })
}

}


const login=async function(req,res){
 try{
    let data=req.body;


    if(!validator.isValidRequestBody(data)){

        return res.status(400).send({status:false,msg:"no user details given"})
    }


    const{email,password}=data;


    if(!validator.isValidEmail(email)){

      return res.status(400).send({status:false,msg:"email is not valid"})

    }
    
    if(!validator.isValid(password)){

        return res.status(400).send({status:false,msg:"password is not valid"})
    }
    
    let emailExists=await userModel.findOne({email:email})
    if(!emailExists){

        return res.status(404).send({status:false,msg:"email not exist"})
    }
    let passwordExists=await userModel.findOne({password:password})
    if(!passwordExists){

        return res.status(404).send({status:false,msg:"password not exist"})
    }

    const userExist=await userModel.findOne({email:email,password:password})
    if(!userExist){
        return res.status(404).send({status:false,msg:"register first"})
    }

    const token = jwt.sign({
        userId: emailExists._id.toString(),
        group: "group-52",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
    }, "Group-52");
    res.setHeader("x-api-key", token)
    res.status(200).send({status:true,msg:"login is succefull",data:token})

}catch{
    console.log("this is the error", error)
        res.status(500).send({ status: false, msg: error.message })
}
 

}


module.exports={createUser,login};

