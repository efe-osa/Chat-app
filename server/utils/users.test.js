const { Users } = require('./users')
const expect = require('expect')

describe('Users', () => {
  let newUser = new Users();
  beforeEach(()=> {

    newUser.allUsers = [
      { id: '123', name: 'Ada', room: 'The Office Sans'},
      { id: '124', name: 'Efe', room: 'The Tokyo Sans'},
      { id: '125', name: 'Efe', room: 'The Tokyo Sans'}
    ]
  })

  it('should add a new user', () => {
    // const newUser = new Users()
    let user = { id: '126', name: 'Segun', room: 'The Office'}
    const addUser = newUser.addUser(user.id, user.name, user.room)

    expect(newUser.allUsers).toContainEqual(user)
  })

  it('should return names user in Tokyo', () => {

    expect(newUser.getAllUsers('The Tokyo Sans')).toEqual(['Efe','Efe'])
  })
  it('should return names user in Office', () => {

    expect(newUser.getAllUsers('The Office Sans')).toEqual(['Ada'])
  })

  it('should remove a user', () => {
    expect(newUser.removeUser('123').id).toEqual('123')
  })
  
  it('should not remove a user', () => {
    expect(newUser.removeUser('99')).toBeFalsy()
    expect(newUser.allUsers.length).toEqual(3)
  })

  it('should find a user', () => {
    expect((newUser.getUser('123').id)).toEqual('123')
  })
  it('should not find a user', () => {
    expect((newUser.getUser('99'))).toBeFalsy()
  })
})