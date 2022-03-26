const mongoose = require("mongoose");

const bookSchema= new mongoose.Schema({
    title: {
        type: String,
         required:true, 
         enum:["Mr", "Mrs", "Miss"]},
     name: {
        type: String, 
       required: true
     },
     phone: {
        type: String, 
        required:true,
         unique:true
     },
     email: {
        type:String, 
        required:true, 
      email:{

      }, 
      unique:true
     }, 
     password: {
        type:String,
         required:true, 
        //  minLen:8, maxLen 15},
     },
     address: {
       street: {type:String},
       city: {type:String},
       pincode: {type:String}
     },
     createdAt: {type:Date,default:null},
     updatedAt: {type:Date,default:null}
   }
,{timestamps:true})

module.exports=mongoose.model("Book",bookSchema)