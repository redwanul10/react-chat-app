const express = require('express')
const app = express()
const mongoose = require('mongoose')
const router = require('./router/route')
const bodyparser = require('body-parser')
const cors = require('cors')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const GoogleUsers = require('./model/googleUser')
const path = require('path')
let users={}


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())

if(process.env.NODE_ENV === "production"){
  app.use(express.static('client/build'))
  app.get("/",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"client","build","index.html"))
  })
}

app.use('/',router)

const url = 'mongodb+srv://redwanulislam:123123123@cluster0-9qx0q.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url,{ useNewUrlParser: true },(err)=>{
  if(err) console.log(err)
  console.log("database connected")
})


io.on('connection',(socket)=>{
  console.log('user connected socketio')
  socket.on('send msg',data =>{
    console.log(data)
    io.emit('send msg',data )
  })

  socket.on('set username', user =>{
    socket['username'] = user.username
    users[user.username] = socket
  //  userList.push(user)
    io.emit('active users',user)
  })

  socket.on('private',message =>{
    if(!users[message.receiverUsername]) return console.log("user login msg sent to database")
    users[message.receiverUsername].emit('private',message)
  })

  socket.on('typing',usernames=>{
    console.log(socket.username)
    if(!users[usernames.receiver]) return console.log('user not found socketio')
    users[usernames.receiver].emit("user typing",usernames.sender)
  })

  socket.on('stopTyping',usernames=>{
    console.log(socket.username)
    if(!users[usernames.receiver]) return console.log('user not found socketio')
    users[usernames.receiver].emit("stop typing",usernames.sender)
  })

  socket.on('join',(data)=>{
    console.log('joined')
    socket.join(data)
  })

  socket.on('logout',(username)=>{
    console.log('user logout')
    if(!username) return;
    GoogleUsers.findOneAndUpdate({username,active:true},{active:false},{new:true},(err,user)=>{
      if(err) return res.status(400).json({err})
      console.log(user)
      socket.broadcast.emit('delete users',username)
      delete  users[username];
    })
    
  })

  socket.on('disconnect',()=>{
    console.log("user disconnected")
    if(!socket.username) return;
    GoogleUsers.findOneAndUpdate({username:socket.username,active:true},{active:false},{new:true},(err,user)=>{
      if(err) return res.status(400).json({err})
      console.log(user)
      socket.broadcast.emit('delete users',socket.username)
      delete  users[socket.username];
    })

  })

  

})

http.listen(process.env.PORT || 8000,()=>{console.log("server connected")})
