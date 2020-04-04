<template>
  <div class="card-set">
    <!--<h5>{{mode.toUpperCase()}}</h5>-->

    <b-row v-if="currentTask">
      <b-col v-for="card in cardSet" cols="6" md="3" lg="2" :key="card">
        <CardSetItem :card="card"/>
      </b-col>
    </b-row>
    <div v-else>
      <b-alert variant="warning" show>
        <p class="lead m-0">🔥 Asigna una tarea para empezar a votar</p>
      </b-alert>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { currentCardSet } from '@/utils/definitions'
import CardSetItem from './CardSetItem'

export default {
  name: 'CardSet',
  components: { CardSetItem },
  props: {
    mode: {
      type: String,
      required: true,
      default: ''
    }
  },
  computed: {
    ...mapState(['currentTask']),
    cardSet () {
      return currentCardSet(this.mode).values
    }
  }
}
</script>
