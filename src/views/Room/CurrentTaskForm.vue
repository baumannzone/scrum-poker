<template>
  <div class="current-task-form">

    <b-row>

      <b-col sm="12" lg="6">
        <b-form inline @submit.prevent="onSubmit">
          <label class="sr-only" for="task">Tarea</label>
          <b-input-group prepend="#" class="mb-2 mr-sm-2 mb-sm-0">
            <b-input v-model="task" id="task" placeholder="Tarea" required></b-input>
          </b-input-group>

          <b-button type="submit" variant="primary">Actualizar tarea</b-button>
        </b-form>
      </b-col>

      <b-col sm="12" lg="6">
        <div class="mt-3 mt-lg-0" v-show="currentTask">
          <p class="text-monospace"><b>Tarea</b>: {{ currentTask }}</p>
        </div>
      </b-col>

    </b-row>

  </div>
</template>

<script>
export default {
  name: 'CurrentTaskForm',
  data () {
    return {
      task: '',
      currentTask: ''
    }
  },
  methods: {
    onSubmit () {
      this.currentTask = this.task
      this.$store.commit('SET_CURRENT_TASK', this.currentTask)
    }
  }
}
</script>
