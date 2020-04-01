<template>
  <div id="app">
    <TheNavBar/>
    <router-view/>
  </div>
</template>

<script>
import TheNavBar from './TheNavBar'

export default {
  components: { TheNavBar }
}
</script>

<style lang="stylus">
  #app
    font-family Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color #2c3e50
</style>
