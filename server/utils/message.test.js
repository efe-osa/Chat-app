const expect = require('expect')
const {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate a message object', () => {
    const from = 'Jenna', text = "a message" , message = generateMessage(from,text)    
    expect(typeof(message.createdAt)).toBe('number')
    expect(message).toMatchObject({ from,text })
  })
})
describe('generateLocationMessage', () => {
  it('should generate a geolocation point', () => {
    const from = 'Jane', lat = 15 , long = 100    
    expect(typeof(generateLocationMessage())).toBe('object')
    // expect(generateLocationMessage(from, lat, long))
    // .toMatchObject({
    //   from,
    //   `https://www.google.com/maps?q=${lat},${long}`,
    //   })
  })
})
