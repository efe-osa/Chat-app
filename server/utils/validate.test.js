// use { } for destructuring from a file with module.exports
const { validateString } = require('./validate')
const expect = require('expect')

describe('validateString', () =>{
  it('should reject non-string values', () => {
    expect(validateString(1) ).toBe(false)
    expect(validateString( {name: "Jenna", room: 10}) ).toBe(false)
    expect(validateString({name: "Jenna", age: true })).toBe(false)
    expect(validateString(true)).toBe(false)
  })
})
describe('validateString', () =>{
  it('should reject string with only spaces', () => {
    expect(validateString(' ')).toBe(false)})
})
describe('validateString', () =>{
  it('should accept string with non-space char', () => {
    expect(validateString('Andy')).toBe(true)})
})