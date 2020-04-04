import { db } from './index'

const roomsRef = db.collection('rooms')

export default {

  createRoom (roomData) {
    return roomsRef.add(roomData)
  }
}
