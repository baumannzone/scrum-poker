import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    currentRoom: null
  },
  mutations: {
    SET_CURRENT_USER (state, payload) {
      console.log(payload)
      if (!payload) {
        state.currentUser = null
      } else {
        state.currentUser = payload
      }
    },
    SET_CURRENT_ROOM (state, payload) {
      if (!payload) {
        state.currentRoom = null
      } else {
        state.currentRoom = payload
      }
    }
  }
})
