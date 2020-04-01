<template>
  <div>
    <h3>Room #{{roomId}}</h3>
    <hr>
    <h5>Users:</h5>
    <ul class="list-unstyled">
      <li v-for="(item, key) in room" :key="key"> {{key}}: {{ item }}</li>
    </ul>

    <b-modal ref="my-modal" hide-footer title="¿Cómo te llamas?">
      <b-form @submit.prevent="onSubmit">
        <b-form-group
          id="input-group-1"
          label="Introduce tu nombre:"
          label-for="input-1"
          description="Con este nombre te indentificaran los demás"
        >
          <b-form-input
            id="input-1"
            v-model="name"
            type="text"
            required
            placeholder="Nombre"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Guardar</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import rooms from '@/firebase/rooms'

export default {
  name: 'Room',
  data () {
    return {
      room: {},
      name: '',
      users: []
    }
  },
  computed: {
    roomId () {
      return this.$route.params.id
    }
  },
  created () {
    // Obtener info de sala
    this.getRoom(this.roomId)

    this.realTimeChanges()
  },
  mounted () {
    if (!localStorage.getItem('_scrum-poker-online-userName')) {
      this.showModal()
    }
  },
  methods: {
    getRoom (roomId) {
      rooms.get(roomId)
        .then((doc) => {
          if (doc.exists) {
            console.log('Document data:', doc.data())
            this.room = doc.data()
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!', 404)
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error)
        })
    },
    onSubmit () {
      const users = this.room.users
      users.push({ name: this.name, created: Date.now() })
      rooms.updateUsers(this.roomId, { users })
        .then(() => {
          localStorage.setItem('_scrum-poker-online-userName', this.name)
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
          console.log('Current data: ', doc.data())
          this.room.users = doc.data().users
        })
    }
  }
}
</script>

<style scoped>

</style>
