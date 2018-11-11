var socket = io();

  socket.on('connect', function () {
    console.log('Connected to Server')
  })

  socket.emit(
    'createMessage',
    {
      from: 'shawn',
      text: 'Hi',
      createdAt: new Date().getTime()
    },
    function () {
      console.log('Got it!')
  })
  document.querySelector('#message-form').addEventListener('submit', function (e) {
    e.preventDefault()
    const msgField = document.getElementById('message')
    socket.emit('createMessage', {
      from: 'User',
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

    // let li = document.createElement('li')
    // li.textContent = `${message.from} (${moment().format('h:mma')}): ${message.text}`
    document.getElementById('messages').innerHTML += html
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
        function (){   
          alert('Unable to fetch location')})
      })
  })

  socket.on( 'newLocationMessage', 
    function (message) {
    let formattedTime = moment(message.createdAt).format('h:mm a')
    let template = document.getElementById('location-message-template').innerHTML
    let html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createdAt: formattedTime
    })
    document.getElementById('messages').innerHTML += html
    }
  )
 
  socket.on('disconnect', function () {
    console.log('Disconnected from Server')
  }) 