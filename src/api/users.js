import { db } from './index'

const roomsRef = db.collection('rooms')

export default {
  addUser (roomId, userData) {
    return roomsRef.doc(roomId)
      .collection('users').add(userData)
  },

  deleteUser (roomId, userId) {
    return roomsRef.doc(roomId)
      .collection('users').doc(userId).delete()
  },

  /**
   *
   * @param roomId {String}
   * @param userId {String}
   * @param userName {String}
   * @returns {Promise<void>}
   */
  editUserName (roomId, userId, userName) {
    return roomsRef.doc(roomId)
      .collection('users').doc(userId).set({ name: userName }, { merge: true })
  }
}
