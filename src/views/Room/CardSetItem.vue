<template>
  <div class="card-set-item">
    <button class="btn-reset d-block w-100 bg-light p-2 mb-2 h3" @click="onClick(card)">
      {{ card }}
    </button>
  </div>
</template>
<script>
export default {
  name: 'CardSetItem',
  props: {
    card: {
      required: true,
      type: [Number, String]
    }
  },
  methods: {
    onClick (value) {
      console.debug(value)
    }
  }
}
</script>

<style lang="stylus">
  .card-set-item
    .btn-reset
      border none
</style>
