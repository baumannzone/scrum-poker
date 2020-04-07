<template>
  <div v-if="hasUsers && currentTaskhasVotes" class="voting-list">
    <div class="d-flex justify-content-between mb-2">
      <h5>Votaciones</h5>
      <b-button size="sm" @click="toggleShowResults">{{ showHideText }} resultados</b-button>
    </div>
    <div>

      <b-list-group>
        <b-list-group-item
          v-for="(vote, userId) in usersWhoVoted"
          class="d-flex justify-content-between align-items-center"
          :key="userId"
        >
          {{ usersObject[userId].name }}
          <b-badge v-if="showResults" variant="primary" pill> {{ vote }}</b-badge>
        </b-list-group-item>
      </b-list-group>

      <div class="results" v-if="showResults">
        <hr>
        <h5>Media:</h5>
        <div class="text-monospace">

          <span class="vote" v-for="(vote, userId) in usersWhoVoted" :key="userId">{{ vote }}</span>
          <span class="vote-sum">{{ sumVotes }}</span>
          <span class="vote-num-elements">{{ voteNumElements }}</span>
          <span class="vote-avg"><strong>{{ voteAvg }}</strong></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rooms from '@/api/rooms'
import { mapState } from 'vuex'

export default {
  name: 'VotingList',
  props: {
    tasks: {
      type: Object,
      default: () => {
      }
    },
    users: {
      type: Array,
      default: () => []
    },
    showResults: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    ...mapState(['currentTask', 'currentRoom']),
    usersWhoVoted () {
      return this.tasks[this.currentTask]
    },
    usersObject () {
      const users = {}
      this.users.forEach((user) => {
        users[user.id] = { ...user }
      })
      return users
    },
    hasUsers () {
      return this.users.length > 0
    },
    currentTaskhasVotes () {
      return Object.keys(this.tasks).length > 0 && !!this.tasks[this.currentTask]
    },
    sumVotes () {
      return Object.keys(this.usersWhoVoted).map(userId => this.usersWhoVoted[userId]).reduce((acc, total) => acc + total, 0)
    },
    voteNumElements () {
      return Object.keys(this.usersWhoVoted).length
    },
    voteAvg () {
      return this.sumVotes / this.voteNumElements
    },
    showHideText () {
      return this.showResults ? 'Ocultar' : 'Mostrar'
    }
  },
  methods: {
    toggleShowResults () {
      rooms.setShowResults(this.currentRoom, !this.showResults)
        .then((res) => {
          // console.log(res)
        })
        .catch((err) => {
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
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }

  .list-enter, .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .results
    .vote + .vote:before
      content " + "

    .vote-sum:before
    .vote-avg:before
      content " = "

    .vote-num-elements:before
      content " / "

</style>
