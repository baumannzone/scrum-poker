<template>
  <div><h1>{{mode}}</h1></div>
</template>

<script>
export default {
  name: 'CardSet',
  props: {
    mode: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>
