const mongoose = require("mongoose")
const schema = mongoose.Schema

const userSchema = new schema({
    googleId:{
        type:String , 
        required:true
    },
    imageUrl:{
        type:String ,
        required:true
    },
    email:{
        type:String , 
        required:true
    },
    name:{
        type:String , 
        required:true
    },
    username:{
        type:String , 
        required:true
    },
    active:{
        type:Boolean,
        required:true
    }
    
},{timestamps:true})
const googelUser = mongoose.model("googleuser",userSchema)
module.exports = googelUser;