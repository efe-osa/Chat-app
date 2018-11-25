const date = require('moment')()


const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: date.valueOf()
  }
}

const generateLocationMessage = (from, lat, long) => {
  return { 
    from,
    url: `https://www.google.com/maps?q=${lat},${long}`,
    createdAt: date.valueOf()
  }
}


module.exports={
  generateMessage,
  generateLocationMessage
}