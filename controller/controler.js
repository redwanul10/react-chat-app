const GoogleUser = require('../model/googleUser')
const Messages = require('../model/messages')
const push = require('web-push')
const Subscribtion = require('../model/subscribtion')


  // This is for Chat app
const addmessage = (req,res)=>{
    const message = new Messages(req.body)
    message.save().then(data =>{
        console.log(data)
        return res.status(200).json({message:data})
    }).catch(err => {
        console.log(err)
        return res.status(400).send(err)
    })
}

const chatlogs = (req,res)=>{
    const {userId} = req.query;
    console.log("message history request received")
    console.log(userId)
    if(!userId) return res.status(400).send("userId is emty")
    Messages.aggregate([
        {$match:{
            $or:[
                { sender: userId },
                { receiverUsername: userId }
            ]
        }},
        {$sort:{createdAt:-1}},
        //{$limit:20},
        {$sort:{createdAt:1}},
        {$group:{"_id":{
            "receiverId":{
                $cond:[
                    {
                        $eq:["$sender",userId]
                    },
                    {$concat:["$receiverUsername"]},
                    {$concat:["$sender"]}
                ]
            },
            "last_message_between":{
                $cond:[
                    {
                        $gt:[
                        {$substr:["$receiver",0,1]},
                        {$substr:["$senderName",0,1]}]
                    },
                    {$concat:["$receiver"," and ","$senderName"]},
                    {$concat:["$senderName"," and ","$receiver"]}
                ]
            },
            
            },
        //    "message":{$first:"$$ROOT"},
            "message":{$push:"$$ROOT"},
            }
        },
        {
            $lookup:{
                from: "googleusers",
                localField: "_id.receiverId",
                foreignField: "username",
                as: "receiver"
            }
        },
        {
            $project:{
                "_id":1,
                "message":1,
                "receiver.imageUrl":1,
                "receiver.name":1,
                "receiver.username":1,
            }
        }
    ])
    .then(msg=>{
        if(!msg){console.log("msg is emty")}
        
        const chatLogs = []
        msg.forEach(item=>{
            const unReadMsgs = item.message.filter(singleMsg => singleMsg.read !== true)
        //    const message = item.message[0]
            const message = item.message[item.message.length - 1]
                let read;
            if(message.sender === userId && !message.read){
                    read = true;
            }else if(message.read){
                    read = true;
            }else{
                    read = false;
            }
            
            const chatLog ={
                read,
                lastUpdated :message.createdAt,
                name        :item.receiver[0].name,
                unReadMsgs,
                username    :item.receiver[0].username,
                typing:false,
                photo       :item.receiver[0].imageUrl,
                conversation:item.message
            }
            chatLogs.push(chatLog)
        })
        
        return res.status(200).json({chatLogs})
    })
    .catch(err=>res.status(400).json(err))
}


const register = (req,res)=>{
    const {username,name,email,googleId,imageUrl} = req.body;

    if(!username||!name||!email||!googleId||!imageUrl){
       return res.status(400).send('field missing please fill all the fields')
    }

    GoogleUser.findOneAndUpdate({googleId},
        {googleId,name,email,username,imageUrl,active:true},{new:true,upsert: true},
        (err,user)=>{
            if(err) return res.status(400).json({err}) 
            if(user == null || !user) return res.status(400).send("error user not found")
        //    saveUser(req,res,{googleId,name,email,username,imageUrl})
            GoogleUser.find({active:true},(error,activeUsers)=>{
                if(err) return res.status(400).json({err})
                return res.status(200).json({user,text:"user exist",activeUsers})
            })
        //    return res.status(200).json({user,text:"user exist"})
            
        
    })

}

const getmessages = (req,res)=> {
    const {firstId,secondId} = req.query;
    console.log(secondId)
    if(!firstId||!secondId) return res.status(400).send('userID is emty')

    Messages.aggregate([
        {$match:{
            $or:[
                {sender:firstId,receiverUsername:secondId},
                {sender:secondId,receiverUsername:firstId}
            ]
        }},
        {$sort:{createdAt:-1}},
        {$limit:20}

    ]).sort({createdAt:1})
    .then(msgs=>{
        if(msgs === null || !msgs){
            return res.status(400).send('not msg found')
        }
        return res.status(200).json({msgs})
    })
    .catch(err=> res.status(400).json({err}))

    
}

const readmessage = (req,res)=>{
    const {senderId,receiverId} = req.body;
    console.log("request received")
//  
    Messages.updateMany({
        sender :{$in:[senderId,receiverId]},
        receiverUsername :{$in:[senderId,receiverId]},
        read:false
    },{read:true},(err,msg)=>{
        if(err) return res.status(400).json({err})
        if(!msg || msg === null) return res.status(400).json({err:'msg not found'})
        
        return res.status(200).json({msg})
    })
}


const subscribe = (req,res)=>{
    console.log(req.body)
    const {subscription,username} = req.body
    if(!subscription.endpoint || !username) return res.status(400).send("subscription or username is emty")

    Subscribtion.findOneAndUpdate({username},{
        subscription:{
            endpoint:subscription.endpoint,
            keys:{
                auth    :   subscription.keys.auth,
                p256dh  :   subscription.keys.p256dh
            }
        },
        username,
    },{new:true,upsert:true},(err,notificationToken)=>{
        console.log(err)
        if(err) return res.status(400).send("subscription or username is emty") 
        console.log(notificationToken)
        return res.status(200).json({notificationToken})
    })

    
}


module.exports = {subscribe,readmessage,chatlogs,register,getmessages,addmessage}