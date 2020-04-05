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
        .then(() => {
          this.$bvToast.toast('👌', {
            title: 'Voto asignado correctamente',
            variant: 'success',
            solid: true,
            autoHideDelay: 1000
          })
        })
        .catch(err => {
          this.$bvToast.toast('Error', {
            title: `Error writing document: ${err}`,
            variant: 'danger',
            solid: true
          })
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
