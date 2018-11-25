var socket = io();
var messages
var chatRooms = []

function scrollToBottom() {
  //selectors
  messages = document.getElementById('messages')
  var newMessage = messages.querySelector('li:last-child')
  var newMessageHeight = newMessage.clientHeight
  var lastMessageHeight = newMessage.previousElementSibling ? newMessage.previousElementSibling.clientHeight : 0

  //height
  var clientHeight = messages.clientHeight,  scrollTop = messages.scrollTop, scrollHeight = messages.scrollHeight

  if ((clientHeight + scrollTop + newMessageHeight +lastMessageHeight ) >= scrollHeight) {
    messages.scrollTop = scrollHeight
  }
}

  socket.on('connect', function () {
    let paramVal = {}
    const params = new URLSearchParams(window.location.search)
    for (let key of params.keys()) {
      paramVal[key] = params.get(key)
    }
    
    socket.emit('join', paramVal, function(err) {
      if (err) { 
        alert(err)
        window.location.href= "/"
       } 
       else {
         console.log('no error')
      }
    })

    console.log('connected to server')
  })



  document.querySelector('#message-form').addEventListener('submit', function (e) {
    e.preventDefault()
    const msgField = document.getElementById('message-field')
    
    socket.emit('createMessage', {
      text: msgField.value
    },
    function () {
      msgField.value = ''
    })
  })


  socket.on('newMessage', function (message) {
    let formattedTime = moment(message.createdAt).format('h:mm a'),
    template = document.getElementById('message-template').innerHTML
    let html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    })

   document.getElementById('messages').innerHTML += html
    scrollToBottom()
  })

  const locationButton = document.getElementById('send-location')
  locationButton.addEventListener('click', function (e) {
    if(!navigator.geolocation) {
      return alert('Oops! Geolocation not supported by your browser.')
    }
      locationButton.setAttribute('disabled','disabled')
      locationButton.textContent = 'Sending Location...'

      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude, long = position.coords.longitude 
        locationButton.removeAttribute('disabled')
        locationButton.textContent = 'Send location'
        
        socket.emit('createLocationMessage', { lat,long },
        function (){ alert('Unable to fetch location')})
      })
  })

  socket.on( 'newLocationMessage', 
    function (message) {
      let formattedTime = moment(message.createdAt).format('h:mm a'),
         template = document.getElementById('location-message-template').innerHTML
      let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
      })
    document.getElementById('messages').innerHTML += html
    scrollToBottom()
    }
  )

  socket.on('updateUserList', function (users) {
    let ol = document.createElement('ul')
    
    users.forEach( user => {
    let li = document.createElement('li')
      li.textContent = user
      ol.appendChild(li)
    })
    document.getElementById('users').innerHTML = ''
    document.getElementById('users').appendChild(ol)
  })

  socket.on('disconnect', function () {
    console.log('Disconnected from Server')
  }) 

 