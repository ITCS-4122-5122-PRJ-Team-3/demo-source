<template>
  <Main :csv_wrapper="data"/>
</template>

<script lang="ts">
import Main from './components/Main.vue'
import { defineComponent } from 'vue'
import Papa from 'papaparse';
import DataString from './assets/data.csv';

export default defineComponent({
    data() {
      const csv = Papa.parse(DataString, {
          header: true,
          dynamicTyping: true,
      });
      console.log(csv);

      /* this geneates an SoA representation of the data, this is useuful for quickly iterating
      through specific attributes of all data at a time, however I am not sure of the specific use
      case at the moment as the chart API's seem to not leverage this representation, I assume it
      can be useful at some point but not sure at the moment.

      let struct_of_arrays: {[index: string]: any[]} = {};

      //@ts-ignore
      Object.keys(csv.data[0]).forEach(key => {
        struct_of_arrays[key] = csv.data.map(entry => {
          //@ts-ignore
          return entry[key];
        })
      });

      console.log(struct_of_arrays);
      */

      return {
        data: csv,
      }
    },
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
