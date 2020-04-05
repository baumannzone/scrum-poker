import { db } from './index'

const roomsRef = db.collection('rooms')

export default {

  createRoom (roomData) {
    return roomsRef.add(roomData)
  },

  /**
   * Establece el id de la tarea actual a votar y resetea el showResults a false
   * @param roomId {String}
   * @param taskId {String}
   * @returns {Promise<void>}
   */
  setCurrentTask (roomId, taskId) {
    return roomsRef.doc(roomId)
      .set({ currentTaskId: taskId, showResults: false }, { merge: true })
  },

  /**
   * Define si deben mostrarse los resultados o no. Una vez que hayan votado todas las personas,
   * se modifica para mostrar los valores
   * @param roomId {String}
   * @param value {Boolean}
   * @returns {Promise<void>}
   */
  setShowResults (roomId, value) {
    return roomsRef.doc(roomId)
      .set({ showResults: value }, { merge: true })
  }
}
