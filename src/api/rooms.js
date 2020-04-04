import { db } from './index'

const roomsRef = db.collection('rooms')

export default {

  createRoom (roomData) {
    return roomsRef.add(roomData)
  },

  setCurrentTask (roomId, taskId) {
    return roomsRef.doc(roomId).set({ currentTaskId: taskId }, { merge: true })
  }
}
