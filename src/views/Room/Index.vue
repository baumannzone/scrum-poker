<template>
  <b-container>
    <div v-if="room">
      <div class="d-flex justify-content-between">
        <h3>Room: {{ room.name }} </h3>
        <div>
          <b-badge variant="info"># {{ roomId }}</b-badge>
        </div>
      </div>
      <b-row v-if="2<0">
        <hr>
        <b-col cols="12" md="6">
          <h5>Usuarios:</h5>
          <ul class="list-unstyled">
            <li v-for="(user, key) in users" :key="key"> {{ user.name }}</li>
          </ul>
        </b-col>
        <b-col cols="12" md="6">
          <h5>Info Sala:</h5>
          <ul class="list-unstyled">
            <li v-for="(item, key) in room" :key="key"> {{key}}: {{ item }}</li>
          </ul>
        </b-col>
      </b-row>

      <hr class="my-5">

      <CurrentTaskForm/>

      <hr class="my-5">

      <CardSet :mode="room.mode"/>

      <b-modal v-model="modalShow" hide-footer title="Scrum Poker" @hide="beforeCloseModal">
        <b-form @submit.prevent="onSubmit">
          <b-form-group
            id="input-group-1"
            label="Introduce tu nombre:"
            label-for="input-1"
            description="Con este nombre te indentificaran los demás"
          >
            <b-form-input
              id="input-1"
              v-model="modalUserName"
              type="text"
              required
              placeholder="Nombre"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary" ref="my-submit">Guardar</b-button>
        </b-form>
      </b-modal>

    </div>
    <div v-else class="text-center">
      <b-spinner label="Loading"></b-spinner>
      <h2 class="mt-3">Cargando...</h2>
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../../api/index'
import users from '../../api/users'

import { createUserModel, localStorageKey } from '@/utils/definitions'

import CardSet from './CardSet'
import CurrentTaskForm from './CurrentTaskForm'

const roomsRef = db.collection('rooms')

export default {
  name: 'Room',
  components: { CurrentTaskForm, CardSet },
  data () {
    return {
      modalShow: true,
      modalUserName: '',
      userSaved: false,
      room: null,
      users: null
    }
  },
  computed: {
    ...mapState({
      roomId: 'currentRoom',
      currentUser: 'currentUser'
    })
  },
  created () {
    const localUserName = localStorage.getItem(localStorageKey)
    if (localUserName) {
      this.modalUserName = JSON.parse(localUserName).name
    }

    // Guarda el ID de la sala
    this.$store.commit('SET_CURRENT_ROOM', this.$route.params.id)

    // Cambios en tiempo real
    this.realTimeChanges()

    // Antes de salir, borrar el user en firebase
    window.addEventListener('beforeunload', (event) => {
      users.deleteUser(this.roomId, this.currentUser.id)
    })
  },
  methods: {
    realTimeChanges () {
      // Room Data
      roomsRef.doc(this.roomId)
        .onSnapshot((doc) => {
          this.room = doc.data()
        }, function (error) {
          this.$bvToast.toast('Error', {
            title: `Error onSnapshot: ${error}`,
            variant: 'danger',
            solid: true
          })
        })

      // Users
      roomsRef.doc(this.roomId).collection('users')
        .onSnapshot((querySnapshot) => {
          const users = []
          querySnapshot.forEach(doc => {
            users.push({ ...doc.data(), id: doc.id })
          })
          this.users = users
        }, function (error) {
          this.$bvToast.toast('Error', {
            title: `Error onSnapshot: ${error}`,
            variant: 'danger',
            solid: true
          })
        })
    },
    onSubmit () {
      // Crear modelo del usuario
      const userModel = createUserModel(this.modalUserName)

      // Guarda en Local
      const userName = { name: this.modalUserName }
      localStorage.setItem(localStorageKey, JSON.stringify(userName))

      // Guarda en Firebase
      users.addUser(this.roomId, userModel)
        .then((res) => {
          this.$store.commit('SET_CURRENT_USER', { ...userModel, id: res.id })
          this.userSaved = true
          this.modalShow = false
        })
        .catch((error) => {
          // console.error('Error writing document: ', error)
          this.$bvToast.toast('Error', {
            title: `Error writing document: ${error}`,
            variant: 'danger',
            solid: true
          })
        })
    },
    beforeCloseModal (bvModalEvt) {
      // Si no se ha guardado el nombre
      if (!this.userSaved) {
        // Evitamos cerrar el modal
        bvModalEvt.preventDefault()
        // Enviamos el form, para que salte el error de required
        this.$refs['my-submit'].click()
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    users.deleteUser(this.roomId, this.currentUser.id)
    this.$store.commit('SET_CURRENT_ROOM', null)
    this.$store.commit('SET_CURRENT_USER', null)
    next()
  }
}
</script>
