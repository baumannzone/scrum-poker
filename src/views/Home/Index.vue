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
import CreateRoomForm from './CreateRoomForm'

export default {
  name: 'Home',
  components: { CreateRoomForm }
}
</script>
