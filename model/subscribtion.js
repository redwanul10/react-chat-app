const mongoose = require('mongoose')
const schema = mongoose.Schema

const subscribtionSchema = new schema({
    subscription:{
        endpoint    :   {type:String},
        keys:{
            auth    :   {type:String},
            p256dh  :   {type:String}
        }
    },
    username:{type:String}
})

const subscribtion = mongoose.model("subscribtion",subscribtionSchema)
module.exports = subscribtion