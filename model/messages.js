const mongoose = require("mongoose")
const schema = mongoose.Schema

const messageSchema = new schema({
    sender:{
        type:String , 
        required:true
    },
    senderName:{
        type:String ,
        required:true
    },
    senderPhoto:{
        type:String , 
        required:true
    },
    text:{
        type:String , 
        required:true
    },
    receiver:{
        type:String , 
        required:true
    },
    type:{
        type:String , 
        required:true
    },
    read:{
        type:Boolean , 
        required:true
    },
    receiverUsername:{
        type:String , 
        required:true
    },
    
},{timestamps:true})
const messsages = mongoose.model("messages",messageSchema)
module.exports = messsages;