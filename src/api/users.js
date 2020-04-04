import { db } from './index'

const roomsRef = db.collection('rooms')

export default {
  addUser (roomId, userData) {
    return roomsRef.doc(roomId).collection('users').add(userData)
  },

  deleteUser (roomId, userId) {
    return roomsRef.doc(roomId).collection('users').doc(userId).delete()
  }
}
