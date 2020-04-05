<template>
  <div class="voting-list">
    <h5>Votaciones</h5>
    <div v-if="hasUsers && currentTaskhasVotes">

      <template v-if="showResults">
        <b-list-group>
          <b-list-group-item
            v-for="(vote, userId) in usersWhoVoted"
            class="d-flex justify-content-between align-items-center"
            :key="userId"
          >
            {{ usersObject[userId].name }}
            <b-badge variant="primary" pill> {{ vote }}</b-badge>
          </b-list-group-item>
        </b-list-group>
      </template>

      <template v-else>
        <ul class="list-inline">
          <transition-group name="list">
            <li v-for="(vote, userId) in usersWhoVoted" :key="userId" class="list-inline-item">
              <b-badge>
                {{ usersObject[userId].name }}
              </b-badge>
            </li>
          </transition-group>
        </ul>
      </template>

      <hr>

      <div class="results">
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
    ...mapState(['currentTask']),
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
