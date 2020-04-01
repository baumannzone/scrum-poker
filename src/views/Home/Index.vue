<template>
  <div class="home-view">

    <b-container>
      <b-row>
        <b-col cols="12" md="6">
          <div>
            <h1>Crear Sala</h1>

            <CreateRoomForm/>

          </div>
        </b-col>

        <b-col cols="12" md="6">
          <div>
            <h1>Unirse</h1>
          </div>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import rooms from '@/firebase/rooms'
import CreateRoomForm from './CreateRoomForm'

export default {
  name: 'Home',
  components: { CreateRoomForm },
  created () {
    rooms.list()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          const roomData = { id: doc.id, ...doc.data() }
          // doc.data() is never undefined for query doc snapshots
          console.log(roomData)
        })
      })
  }
}
</script>
