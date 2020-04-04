<template>
  <div class="current-task-form">

    <div>
      <b-form @submit.prevent="onSubmit">
        <div class="d-flex">
          <div class="flex-grow-1 mr-2">
            <label class="sr-only" for="task">Tarea</label>
            <b-input-group prepend="#" class="mb-2 mr-sm-2 mb-sm-0">
              <b-input v-model="task" id="task" placeholder="Tarea a votar" required></b-input>
            </b-input-group>
          </div>
          <b-button type="submit" variant="primary">Actualizar tarea</b-button>
        </div>
      </b-form>
    </div>

    <br>

    <b-card border-variant="info"
      header="TAREA ACTUAL"
      header-bg-variant="info"
      header-text-variant="white"
      align="center">
      <b-card-text>
        <h3># {{ currentTask }}</h3>
      </b-card-text>
    </b-card>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CurrentTaskForm',
  data () {
    return {
      task: ''
    }
  },
  computed: {
    ...mapState(['currentTask'])
  },
  methods: {
    onSubmit () {
      this.$store.commit('SET_CURRENT_TASK', this.task)
      this.task = ''
    }
  }
}
</script>
