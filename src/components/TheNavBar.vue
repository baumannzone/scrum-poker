<template>
  <div id="nav" class="py-4 bg-light mb-3">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>
export default {
  name: 'TheNavBar'
}
</script>

<style lang="stylus">
  #nav
    text-align center
</style>
