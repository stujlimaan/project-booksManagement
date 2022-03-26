const mongoose=require("mongoose");
const objectId=mongoose.Schema.Types.ObjectId

const reviewSchema=new mongoose.Schema({
    
        bookId: {
            type:objectId, 
            required:"please provide bookId", 
            ref:"Book"
        },
        reviewedBy: {
            type:String,
            required:"please reviewed by is required",
             default:'Guest', 
             value: "tujliman"
            },
        reviewedAt: {
            type:Date,required:"reviewedAt is required"
    },
        rating: {type:Number, 
            min:1, 
            max:5,
            required:"rating is required"
        },
        review: {type:String, 
            optional
        },
        isDeleted: {type:Boolean, default: false},
      
}    
,{timestamps:true})

module.exports=mongoose.model("Review",reviewSchema)