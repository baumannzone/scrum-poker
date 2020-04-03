<template>
  <b-container>
    <div v-if="room">
      <div class="d-flex justify-content-between">
        <h3>Room: {{ room.name }} </h3>
        <div>
          <b-badge variant="info"># {{ roomId }}</b-badge>
        </div>
      </div>
      <!--<hr>
      <h5>Info Sala:</h5>
      <ul class="list-unstyled">
        <li>ID: {{ roomId }}</li>
        <li v-for="(item, key) in roomData" :key="key"> {{key}}: {{ item }}</li>
      </ul>-->

      <h5>Usuarios:</h5>
      <ul class="list-unstyled">
        <li v-for="(user, key) in roomUsers" :key="key"> {{ user.name }}</li>
      </ul>

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
import rooms from '@/firebase/rooms'
import { createUserModel, localStorageKey } from '@/utils/definitions'
import CardSet from './CardSet'

export default {
  name: 'Room',
  components: { CardSet },
  data () {
    return {
      modalShow: false,
      room: null,
      modalUserName: '',
      hasFirebaseData: false
    }
  },
  computed: {
    roomId () {
      return this.$route.params.id
    },
    roomData () {
      const { createdAt, updatedAt, mode, name } = this.room
      return {
        createdAt,
        updatedAt,
        mode,
        name
      }
    },
    roomUsers () {
      return this.room.users
    }
  },
  created () {
    this.$store.commit('SET_CURRENT_ROOM', this.$route.params.id)

    // Cambios en tiempo real
    this.realTimeChanges()

    // Antes de salir, borrar el user en firebase
    window.addEventListener('beforeunload', (event) => {
      const users = [...this.room.users]
      const localUser = JSON.parse(localStorage.getItem(localStorageKey))
      const userIndex = users.findIndex(user => user.id === localUser.id)
      // Si el usuario local está en firebase
      if (userIndex > -1) {
        // Borrar de la lista de usuarios
        users.splice(userIndex, 1)
        // Actualiza en Firebase con el usuario borrado
        rooms.updateUsers(this.roomId, { users })
        // console.debug('Borrando user...')
      }
    })
  },
  methods: {
    onSubmit () {
      // Crear modelo del usuario
      const userModel = createUserModel(this.modalUserName)

      // Guarda en Local
      localStorage.setItem(localStorageKey, JSON.stringify(userModel))

      // Traemos todos los users y metemos el nuevo user
      const users = [...this.room.users]
      users.push(userModel)

      // Guarda en Firebase
      rooms.updateUsers(this.roomId, { users })
        .then(() => {
          // console.log('Document successfully written!')
          // Guardar usuario actual
          this.$store.commit('SET_CURRENT_USER', userModel)
          // Limpiar Form
          this.modalUserName = ''
          // Ocultar modal
          this.hideModal()
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
    showModal () {
      this.modalShow = true
    },
    hideModal () {
      this.modalShow = false
    },
    realTimeChanges () {
      // Realtime changes
      rooms.ref.doc(this.roomId)
        .onSnapshot((doc) => {
          // console.log('Current data: ', doc.data())
          this.room = doc.data()
          if (!this.hasFirebaseData) {
            this.hasFirebaseData = true
            this.roomHasData()
          }
        })
    },
    beforeCloseModal (bvModalEvt) {
      // Si no hay nombre en el formulario del modal
      if (!this.modalUserName) {
        // Evitamos cerrar el modal
        bvModalEvt.preventDefault()
        // Enviamos el form, para que salte el error de required
        this.$refs['my-submit'].click()
      }
    },
    saveUserInFirebase (user) {
      const users = [...this.room.users]
      users.push(user)

      // Guarda en Firebase
      rooms.updateUsers(this.roomId, { users })
        .then(() => {
          // console.log('Document successfully written!')
        })
        .catch((error) => {
          this.$bvToast.toast('Error', {
            title: `Error writing document: ${error}`,
            variant: 'danger',
            solid: true
          })
        })
    },
    roomHasData () {
      // Obtener el objeto local
      const localStorageData = localStorage.getItem(localStorageKey)

      // Si no existe, es que no hay usuario guardado en local
      if (!localStorageData) {
        // Abrir modal para guardar el nombre
        this.showModal()
      } else {
        // Si existe en localStorage

        // Traemos el user de localstorage
        const localStorageDataParsed = JSON.parse(localStorageData)

        // Comprobar si el usuario local está en la lista de usuarios firebase
        const users = [...this.room.users]
        const user = users.find(u => u.id === localStorageDataParsed.id)

        // El usuario está en local, pero no en firebase
        if (!user) {
          // Guardar usuario en Firebase
          this.saveUserInFirebase(localStorageDataParsed)
        }
        // Guardar usuario actual
        this.$store.commit('SET_CURRENT_USER', localStorageDataParsed)
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('SET_CURRENT_ROOM', null)
    this.$store.commit('SET_CURRENT_USER', null)

    // Limpiar datos de Firebase
    const users = [...this.room.users]
    const localUser = JSON.parse(localStorage.getItem(localStorageKey))
    const userIndex = users.findIndex(user => user.id === localUser.id)
    // Si el usuario local está en firebase
    if (userIndex !== -1) {
      // Borrar de la lista de usuarios
      users.splice(userIndex, 1)
      // Actualiza en Firebase con el usuario borrado
      rooms.updateUsers(this.roomId, { users })
      // console.debug('Borrando user...')
    }
    next()
  }
}
</script>
