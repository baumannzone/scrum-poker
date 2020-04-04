<template>
  <div class="card-set-item">
    <button class="btn-reset d-block w-100 bg-light p-2 mb-2 h3" @click="onClick(card)">
      {{ card }}
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import tasks from '@/api/tasks'

export default {
  name: 'CardSetItem',
  props: {
    card: {
      required: true,
      type: [Number, String]
    }
  },
  computed: {
    ...mapState({
      roomId: 'currentRoom',
      currentUser: 'currentUser',
      currentTask: 'currentTask'
    })
  },
  methods: {
    onClick (value) {
      const voteData = { [this.currentUser.id]: value }
      tasks.setVote(this.roomId, this.currentTask, voteData)
        .then(res => {
          console.log('<<<<<<<<<<<<<<<<res>>>>>>>>>>>>>>>>')
          console.log(res)
        })
        .catch(err => {
          console.warn(err)
        })
    }
  }
}
</script>

<style lang="stylus">
  .card-set-item
    .btn-reset
      border none
</style>
