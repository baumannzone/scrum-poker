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
import rooms from '@/firebase/rooms'
import { localStorageKey, createUserModel, createRoomModel, cardSets } from '@/utils/definitions'

export default {
  name: 'CreateRoomForm',
  data () {
    return {
      form: {
        roomName: 'Random Name',
        userName: '',
        mode: cardSets.fibonacci.name
      },
      options: [
        { value: null, text: 'Elige una opción' },
        {
          label: cardSets.fibonacci.name.toUpperCase(),
          options: [
            { value: cardSets.fibonacci.name, text: cardSets.fibonacci.values }
          ]
        },
        {
          label: cardSets.decimal.name.toUpperCase(),
          options: [
            { value: cardSets.decimal.name, text: cardSets.decimal.values }
          ]
        }
      ]
    }
  },
  methods: {
    onSubmit () {
      // Guarda el user en local storage
      const userModel = createUserModel(this.form.userName)
      localStorage.setItem(localStorageKey, JSON.stringify(userModel))

      const room = {
        name: this.form.roomName,
        mode: this.form.mode
      }
      const roomData = createRoomModel(room, userModel)

      rooms.create(roomData)
        .then((res) => {
          // console.log(res)
          this.$router.push({ name: 'Room', params: { id: res.id } })
        })
        .catch(function (error) {
          console.error('Error writing document: ', error)
        })
    }
  },
  mounted () {
    const localStorageData = JSON.parse(localStorage.getItem(localStorageKey))
    if (localStorageData) {
      this.form.userName = localStorageData.userName
    }
  }
}
</script>
