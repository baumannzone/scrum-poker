<template>
  <div id="app">
    <TheNavBar/>
    <div class="mb-footer">
      <router-view/>
    </div>
    <TheFooter/>
  </div>
</template>

<script>
import TheNavBar from './components/TheNavBar'
import TheFooter from './components/TheFooter'

export default {
  components: { TheNavBar, TheFooter }
}
</script>

<style lang="stylus">
  #app
    font-family Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color #2c3e50
    .mb-footer
      margin-bottom 120px
</style>
