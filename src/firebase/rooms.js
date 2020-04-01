import { db } from '@/firebase/index'
const roomsRef = db.collection('rooms')

export default {

  ref: roomsRef,

  /**
   * Crea una sala
   * @param room {Object} Datos de la sala
   * @returns {Promise<firebase.firestore.DocumentReference<T>>}
   */
  create (room) {
    return roomsRef.add(room)
  },

  /**
   * Obtiene todas las salas
   * @returns {Promise<firebase.firestore.QuerySnapshot<T>>}
   */
  list () {
    return roomsRef.get()
  },

  /**
   * Obtiene una sala por `id`
   * @param roomId {String}
   * @returns {Promise<firebase.firestore.DocumentSnapshot<T>>}
   */
  get (roomId) {
    return roomsRef.doc(roomId).get()
  },

  /**
   * Actualiza usuarios
   * @param roomId
   * @param users
   * @returns {firebase.firestore.DocumentReference<T>}
   */
  updateUsers (roomId, users) {
    return roomsRef.doc(roomId)
      .set(users, { merge: true })
  }

}
