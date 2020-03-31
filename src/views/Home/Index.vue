<template>
  <div class="home">

    <b-form @submit.prevent="onSubmit">
      <b-form-group
        id="input-group-1"
        label="Nombre"
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

      <b-button type="submit" variant="primary">Crear sala</b-button>
    </b-form>
  </div>
</template>

<script>
import rooms from '@/firebase/rooms'

export default {
  name: 'Home',
  data () {
    return {
      name: ''
    }
  },
  created () {
    rooms.list()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          const roomData = { id: doc.id, ...doc.data() }
          // doc.data() is never undefined for query doc snapshots
          console.log(roomData)
        })
      })
  },
  methods: {
    onSubmit () {
      const now = Date.now()
      const room = {
        created: now,
        updated: now,
        users: [{ name: this.name, created: now }]
      }

      localStorage.setItem('_scrum-poker-online-userName', this.name)

      rooms.create(room)
        .then((res) => {
          this.$router.push({ name: 'Room', params: { id: res.id } })
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    }
  }
}
</script>
