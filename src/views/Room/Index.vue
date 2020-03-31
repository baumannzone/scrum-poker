<template>
  <div>
    <h3>Room #{{roomId}}</h3>
    <hr>
    <h5>Users:</h5>
    <ul class="list-unstyled">
      <li v-for="(item, idx) in room" :key="idx"> {{ item }}</li>
    </ul>
  </div>
</template>

<script>
import rooms from '@/firebase/rooms'

export default {
  name: 'Room',
  data () {
    return {
      room: {}
    }
  },
  computed: {
    roomId () {
      return this.$route.params.id
    }
  },
  created () {
    rooms.get(this.roomId)
      .then((doc) => {
        if (doc.exists) {
          console.log('Document data:', doc.data())
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!')
        }
      }).catch((error) => {
        console.log('Error getting document:', error)
      })
  }
}
</script>

<style scoped>

</style>
