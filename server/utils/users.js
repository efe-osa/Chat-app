[{
  id: '/#1234reed',
  name: 'Mead',
  room: 'The Office Sans'
}]

//addUser(id, name, room )
//removeUser(id)
//getuser(id)
//getAllUsers(room)

class Users {
  constructor(id, name, room) {
    this.allUsers = []
  }

  addUser( id, name, room ) {
    const newUser = { id, name, room }
      this.allUsers.push(newUser)
      return newUser 
    
  }

  removeUser(id)  {
    const user = this.getUser(id)
    if (user) {
        this.allUsers = this.allUsers.filter( user => user.id !== id )
    }
    return user
  }

  getUser(id,name, room) {
      return this.allUsers.filter( user =>  user.name === name && user.room === room ||user.id === id )[0]
  }

  getAllUsers(room) {
    let users = this.allUsers.filter( user => user.room === room )
    let namesArray = users.map(user => user.name)
    return namesArray
  }
}

module.exports = { Users }