<template>
  <b-container>
    <div>
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

      <b-modal ref="my-modal" hide-footer title="Scrum Poker" @hide="beforeCloseModal">
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
  </b-container>
</template>

<script>
import rooms from '@/firebase/rooms'
import { localStorageKey, createUserModel } from '@/utils/definitions'

export default {
  name: 'Room',
  data () {
    return {
      room: {},
      modalUserName: '',
      hasLocalUserName: false
    }
  },
  computed: {
    roomId () {
      return this.$route.params.id
    },
    roomData () {
      const { createdAt, updatedAt, mode, roomName } = this.room
      return {
        createdAt,
        updatedAt,
        mode,
        roomName
      }
    },
    roomUsers () {
      return this.room.users
    }
  },
  created () {
    // Obtener info de sala
    this.getRoom(this.roomId)

    // Cambios en tiempo real
    this.realTimeChanges()

    window.addEventListener('beforeunload', (event) => {
      const users = [...this.room.users]
      const localStorageData = JSON.parse(localStorage.getItem(localStorageKey))
      const userIndex = users.findIndex(user => user.id === localStorageData.userId)
      console.log('userIndex')
      console.log(userIndex)
      if (userIndex > -1) {
        users.splice(userIndex, 1)
      }
      console.log('New users...:')
      users.map(u => {
        console.log(u.name, u.id)
      })

      // // Guarda en Firebase
      // rooms.updateUsers(this.roomId, { users })
      //   .then(() => {
      //     this.userNameSaved = true
      //     console.log('Document successfully written!')
      //     this.hideModal()
      //   })
      //   .catch((error) => {
      //     console.error('Error writing document: ', error)
      //   })
    })
  },
  mounted () {
    const localStorageData = localStorage.getItem(localStorageKey)
    if (!localStorageData) {
      this.hasLocalUserName = false
      this.showModal()
    } else {
      this.hasLocalUserName = true
    }
  },
  methods: {
    getRoom (roomId) {
      rooms.get(roomId)
        .then((doc) => {
          if (doc.exists) {
            // console.log('Document data:', doc.data())
            this.room = doc.data()
          } else {
            // doc.data() will be undefined in this case
            // console.log('No such document!', 404)
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error)
        })
    },
    onSubmit () {
      const userModel = createUserModel(this.modalUserName)

      // Guarda en Local
      localStorage.setItem(localStorageKey, JSON.stringify(userModel))

      const users = [...this.room.users]
      users.push(userModel)

      // Guarda en Firebase
      rooms.updateUsers(this.roomId, { users })
        .then(() => {
          this.userNameSaved = true
          console.log('Document successfully written!')
          this.hideModal()
        })
        .catch((error) => {
          console.error('Error writing document: ', error)
        })
    },
    showModal () {
      this.$refs['my-modal'].show()
    },
    hideModal () {
      this.$refs['my-modal'].hide()
    },
    realTimeChanges () {
      // Realtime changes
      rooms.ref.doc(this.roomId)
        .onSnapshot((doc) => {
          // console.log('Current data: ', doc.data())
          this.room.users = doc.data().users
        })
    },
    beforeCloseModal (bvModalEvt) {
      if (!this.userNameSaved) {
        bvModalEvt.preventDefault()
        this.$refs['my-submit'].click()
      }
    }
  }
}
</script>

<style scoped>

</style>
