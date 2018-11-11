const path = require('path')
const http = require('http')
const port = process.env.PORT || 3000
const express = require('express')
const socketIO = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/message')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('User connected')
 
  //  Emits a message to everyone including the sender
  socket.emit( 'newMessage', generateMessage('Admin','Welcome to the Chat app') )

  //  Emits a message to everyone but the sender
  socket.broadcast.emit( 'newMessage', generateMessage('Admin','New user joined') )

  socket.on('createMessage', (msg, callback) => {
    io.emit('newMessage', {from: msg.from, text: msg.text, createdAt: new Date().getTime() })
    callback() 
    }
  )

  socket.on( 'createLocationMessage', ({ lat, long }) => { 
      io.emit( 'newLocationMessage', generateLocationMessage('Admin',  lat, long))
   }
  )

  socket.on( 'disconnect', () => {
    console.log('User Disconnected')
    }
  ) 

})


server.listen(port, () => console.log(`Now live on port ${port}`))