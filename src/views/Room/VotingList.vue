<template>
  <div class="voting-list">
    <pre>Tiene votos: {{ hasVotes }}</pre>
    <pre>Tiene users: {{ hasUsers }}</pre>
    <h5>Votaciones</h5>
    <ul v-if="hasUsers && hasVotes" class="list-inline">
      <li v-for="(userId) in usersWhoVoted" class="list-inline-item" :key="userId">
        <span>
          {{userId}}
          <!--<b-badge>{{ usersObject[userId].name }}</b-badge>-->
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'VotingList',
  props: {
    tasks: {
      type: Object,
      default: () => {}
    },
    users: {
      type: Array,
      default: () => []
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
      console.log(users)
      return users
    },
    hasUsers () {
      return this.users.length > 0
    },
    hasVotes () {
      return Object.keys(this.tasks).length > 0
    }
  }
}
</script>
