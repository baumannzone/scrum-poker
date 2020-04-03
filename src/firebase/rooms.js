import { db } from '@/firebase/index'

const roomsRef = db.collection('rooms')

export default {
  roomsRef,

  createRoom (roomId, roomData) {
    return roomsRef.doc(roomId).set(roomData)
  },

  list () {
    return roomsRef.get()
  },

  get (roomId) {
    return roomsRef.doc(roomId).get()
  },

  generateRoomDoc () {
    return roomsRef.doc()
  }
}
