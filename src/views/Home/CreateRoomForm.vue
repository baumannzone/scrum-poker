<template>
  <b-form @submit.prevent="onSubmit">

    <b-form-group
      id="input-group-1"
      label="Nombre sala:"
      label-for="input-1"
      description="Nombre de la sala"
    >
      <b-form-input
        id="input-1"
        v-model.trim="form.roomName"
        type="text"
        required
        placeholder="Nombre Sala"
      ></b-form-input>
    </b-form-group>

    <b-form-group
      id="input-group-2"
      label="Nombre usuario:"
      label-for="input-2"
      description="Con este nombre te indentificaran los demás"
    >
      <b-form-input
        id="input-1"
        v-model.trim="form.userName"
        type="text"
        required
        min="2"
        placeholder="Tu nombre"
      ></b-form-input>
    </b-form-group>

    <b-form-group
      id="input-group-3"
      label="Set de cartas:"
      label-for="input-3"
      description="Elige el un set de cartas de puntos"
    >
      <b-form-select v-model="form.mode" :options="options" id="input-group-3" required></b-form-select>
    </b-form-group>

    <div class="d-flex justify-content-end">
      <b-button type="submit" variant="primary">Crear sala</b-button>
    </div>
  </b-form>
</template>

<script>
import randomName from '@/mixins/randomName'

import rooms from '@/firebase/rooms'
// import { addUser } from '@/firebase/users'

import { localStorageKey, createRoomModel, cardSets } from '@/utils/definitions'

export default {
  name: 'CreateRoomForm',
  mixins: [randomName],
  data () {
    return {
      form: {
        roomName: '',
        userName: '',
        mode: cardSets.fibonacci.name
      },
      options: [
        {
          value: null,
          text: 'Elige una opción'
        },
        {
          label: cardSets.fibonacci.name.toUpperCase(),
          options: [
            {
              value: cardSets.fibonacci.name,
              text: cardSets.fibonacci.values
            }
          ]
        },
        {
          label: cardSets.decimal.name.toUpperCase(),
          options: [
            {
              value: cardSets.decimal.name,
              text: cardSets.decimal.values
            }
          ]
        }
      ]
    }
  },
  methods: {
    onSubmit () {
      // const userModel = createUserModel(this.form.userName)
      localStorage.setItem(localStorageKey, JSON.stringify({ name: this.form.userName }))

      const room = {
        name: this.form.roomName,
        mode: this.form.mode
      }
      const roomData = createRoomModel(room)
      console.log(roomData)
      console.log('ROOM ID:')
      const roomId = rooms.generateRoomDoc().id
      console.log(roomId)

      const promises = [
        rooms.createRoom(roomId, roomData)
        // addUser(roomId, userModel)
      ]

      Promise.all(promises)
        .then((res) => {
          console.log('res')
          console.log(res)
          // this.$router.push({ name: 'Room', params: { id: roomId } })
        })
        .catch(function (error) {
          // console.error('Error writing document: ', error)
          this.$bvToast.toast('Error', {
            title: `Error writing document: ${error}`,
            variant: 'danger',
            solid: true
          })
        })
    }
  },
  created () {
    this.form.roomName = this.generateName()
    const localStorageData = JSON.parse(localStorage.getItem(localStorageKey))
    if (localStorageData) {
      this.form.userName = localStorageData.name
    }
  }
}
</script>
