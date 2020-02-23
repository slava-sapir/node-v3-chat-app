const users = []

// create functions to manage array(data)
//addUser, removeUser, getUser, getUsersInRoom

//clean the data
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

//validate the data
if(!username || !room) {
  return {
      error: 'User name and room is required!'
  }
}

//validate existance of user
const existingUser = users.find((user) => {
    return user.room === room && user.username === username
})

//validate user name
 if(existingUser){
     return {
         error: 'User name is in use!'
     }
 }

 //store user
 const user = { id, username, room }
 users.push(user)
 return { user }

}

//remove user
const removeUser = (id) => {
const index = users.findIndex((user) => user.id === id)

 if(index !== -1){
    return users.splice(index, 1)[0]
  }
}

//get user
const getUser = (id) => {
  return users.find((user) => user.id === id)
}

//get all users in same room
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)   
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}