<template>
  <b-container>
    <div v-if="room">
      <h3>Room #{{ room.name || roomId }}</h3>
      <hr>
      <h5>Room Data:</h5>
      <ul class="list-unstyled">
        <li>ID: {{ roomId }}</li>
        <li v-for="(item, key) in roomData" :key="key"> {{key}}: {{ item }}</li>
      </ul>

      <h5>Users:</h5>
      <ul class="list-unstyled">
        <li v-for="(user, key) in roomUsers" :key="key"> {{ user.name }}</li>
      </ul>

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
    <div v-else>Loading...</div>
  </b-container>
</template>

<script>
import rooms from '@/firebase/rooms'
import { localStorageKey, createUserModel } from '@/utils/definitions'

export default {
  name: 'Room',
  data () {
    return {
      modalShow: false,
      room: null,
      modalUserName: '',
      hasFirebaseData: false,
      isMounted: false
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
    // Cambios en tiempo real
    this.realTimeChanges()

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
      }
    })
  },
  mounted () {
    this.isMounted = true
  },
  methods: {
    // getRoom (roomId) {
    //   rooms.get(roomId)
    //     .then((doc) => {
    //       if (doc.exists) {
    //         // console.log('Document data:', doc.data())
    //         this.room = doc.data()
    //       } else {
    //         // doc.data() will be undefined in this case
    //         // console.log('No such document!', 404)
    //       }
    //     })
    //     .catch((error) => {
    //       console.error('Error getting document:', error)
    //     })
    // },
    onSubmit () {
      const userModel = createUserModel(this.modalUserName)

      // Guarda en Local
      localStorage.setItem(localStorageKey, JSON.stringify(userModel))

      const users = [...this.room.users]
      users.push(userModel)

      // Guarda en Firebase
      rooms.updateUsers(this.roomId, { users })
        .then(() => {
          console.log('Document successfully written!')
          this.hideModal()
        })
        .catch((error) => {
          console.error('Error writing document: ', error)
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
          console.log('Data: ', doc.data())
          this.room = doc.data()
          if (!this.hasFirebaseData) {
            this.hasFirebaseData = true
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
          console.log('Document successfully written!')
        })
        .catch((error) => {
          console.error('Error writing document: ', error)
        })
    },
    isMountedAndHasData () {
      const localStorageData = localStorage.getItem(localStorageKey)
      if (!localStorageData) {
        this.showModal()
      } else {
        console.log('Datos locales: ', localStorageData)
        const localStorageDataParsed = JSON.parse(localStorageData)

        // Comprobar si el usuario local está en la lista de usuarios firebase
        const users = [...this.room.users]
        const user = users.find(u => u.id === localStorageDataParsed.id)

        // El usuario está en local, pero no en firebase
        if (!user) {
          // Guardar usuario
          this.saveUserInFirebase(localStorageDataParsed)
        } else {
          console.log('Usuario ya registrado')
        }
      }
    }
  },
  watch: {
    hasFirebaseData (newVal) {
      console.log('CON DATOS')
      // Cuando tengamos los datos de la sala
      if (this.hasFirebaseData && this.isMounted) {
        this.isMountedAndHasData()
      }
    },
    isMounted (newVal) {
      console.log('MONTADO')
      if (this.isMounted && this.hasFirebaseData) {
        this.isMountedAndHasData()
      }
    }
  }
}
</script>

<style scoped>

</style>
