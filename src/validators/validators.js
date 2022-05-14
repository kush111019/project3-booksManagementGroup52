const mongoose=require('mongoose')
//validations checking function


const isValidTitle=function(value){

    if(typeof value==='undefined'||value===null) return false
    if(typeof value ==='string' && value.trim().length===0) return false
    if(['Mr','Mrs',"Miss"].indexOf(value)==-1) return false; 

    return true;

}

const isValid=function(value){

 if(typeof value==='undefined'||value===null) return false
 if(typeof value ==='string' && value.trim().length===0) return false

 return true;
}

const isValidMobileNumber=function(mobile){

if(typeof mobile === 'undefined' || mobile===null) return false
if(typeof parseInt(mobile)==='Number' && parseInt(mobile).trim().length===0) return false
if(mobile.length>10 && mobile.length<10) return false
if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) return false
    
 return true;
}
    
const isValidRequestBody=function(requestBody){

    return Object.keys(requestBody).length>0
}

const isValidObjectId=function(ObjectId){

    return  mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidEmail=function(email){

      if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return false

     return true;
}
const isValidPassword=function(value){

    if(typeof value==='undefined'||value===null) return false
    if(typeof value ==='string' && value.trim().length===0) return false
    if(value.length<8 || value.length>15) return false

    return true
   
}
const isValidIsbn=function(value){
let j=0
if(typeof value === 'undefined' || value===null) return false
if(typeof parseInt(value)==='Number' && parseInt(value).trim().length===0) return false;
for(let i=0;i<value.length;i++)
{

    if(value[i]!="-")
    j++;

}
if(j!=13) return false;
return true;    
}


const isValidReview=function(value){
    if(value=="undefined" || value==null) return false;
    if(typeof value!==number) return false;
    return true;

}

const isDeleted=function(value){
    
    if(typeof value!='boolean' && value.toString().trim().length!=0) return false
    if(typeof value ==='boolean' && value.toString().trim().length===0) return false
    return true;
}


const isRatingWithinRange=function(value){

    if(typeof value=="undefined" ||typeof value==null) return false
    if(typeof value!=="number" && value.toString().length!=0) return false
    if(typeof value==='number' && value.toString().length==0) return false
    if(value<1 || value>5) return false
    return true
}

const dateIsValid=function(dateStr){
    if(typeof dateStr==="undefined" || typeof value==null)return false
    if(dateStr==='String' && dateStr==0) return false;
    const regex = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

    if (dateStr.match(regex)=== null) {
      return false;
    }
   else
    return true;

}

module.exports={isValid,isValidRequestBody,isValidObjectId,isValidMobileNumber,isValidEmail,isValidTitle,isValidPassword,isValidIsbn,isValidReview,isDeleted,isRatingWithinRange,dateIsValid}