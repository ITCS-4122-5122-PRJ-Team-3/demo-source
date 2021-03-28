<template>
  <Main msg="Visualization goes here"/>
</template>

<script lang="ts">
import Main from './components/Main.vue'
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {

    },
    props: {
    },
    components: {Main}
});


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
