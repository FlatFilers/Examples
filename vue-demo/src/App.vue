<template>
  <div id="app">
    <Welcome />
  </div>
</template>

<script>
import Welcome from './components/Welcome.vue'

export default {
  name: 'app',
  components: {
    Welcome
  }
}
</script>

<style>

body {
  background: #fff;
  color: #3c4151;
  font-family: 'Gotham Pro', Arial, serif;
}

</style>
