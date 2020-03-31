import { db } from '@/firebase/index'
const roomsRef = db.collection('rooms')

export default {
  list () {
    return roomsRef.get()
  },
  create (room) {
    return roomsRef.add(room)
  }
}
