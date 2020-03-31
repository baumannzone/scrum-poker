import { db } from '@/firebase/index'
const roomsRef = db.collection('rooms')

export default {
  list () {
    return roomsRef.get()
  },
  create (room) {
    return roomsRef.add(room)
  },
  get (roomId) {
    return roomsRef.doc(roomId).get()
  }
}
