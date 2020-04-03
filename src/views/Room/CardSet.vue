<template>
  <div class="card-set">
    <h5>{{mode.toUpperCase()}}</h5>

    <b-row>
      <b-col v-for="card in cardSet" cols="6" md="3" lg="2" :key="card">
        <CardSetItem :card="card"/>
      </b-col>
    </b-row>

  </div>
</template>

<script>
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
    cardSet () {
      return currentCardSet(this.mode).values
    }
  }
}
</script>
