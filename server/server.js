const path = require('path')
const http = require('http')
const port = process.env.PORT || 3000
const express = require('express')
const socketIO = require('socket.io')

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { validateString } = require('./utils/validate')
const {Users} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const users = new Users
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('User connected')
  
  socket.on('join', ( {name: name, room}, callback ) => {
    const chatRoom = room.toUpperCase()
      if (!validateString(name) || !validateString(chatRoom)) {
        return callback('Name and chatRoom are required!')
      }
      
      if (users.getUser(null, name, chatRoom) !== undefined) {
        return callback(`You are already in this ${chatRoom.toUpperCase()} chatroom`)
      }

      socket.join(chatRoom)
      users.removeUser(socket.id)
      users.addUser(socket.id, name, chatRoom)
        
      
      // 

      io.to(chatRoom).emit('updateUserList', users.getAllUsers(chatRoom))
      //  Emits a message to everyone including the sender
      socket.emit( 'newMessage', generateMessage('Admin','Welcome to the Chat app') )
      //  Emits a message to everyone but the sender
      socket.broadcast.to(chatRoom).emit( 'newMessage', generateMessage('Admin', `${name} joined`) )
      callback()

  })  

  socket.on('createMessage', ({ text }, callback) => {
    const sender = users.getUser(socket.id)
    if (sender && validateString(text)) {
      io.to(sender.room).emit('newMessage', {from: sender.name, text, createdAt: new Date().getTime() })
      callback() 
      }
    }
  )

  socket.on( 'createLocationMessage', ({ lat, long }) => { 
    const sender = users.getUser(socket.id)
    io.to(sender.room).emit( 'newLocationMessage', generateLocationMessage(sender.name,  lat, long))
   }
  )

  socket.on( 'disconnect', () => {
    const member = users.removeUser(socket.id)
    
    if(member) {
      io.to(member.room).emit('updateUserList', users.getAllUsers(member.room))
      io.to(member.room).emit('newMessage', generateMessage(`${member.name} has left the ${member.room}`))
    }
    console.log('User Disconnected')
    }
  ) 

})


server.listen(port, () => console.log(`Now live on port ${port}`))