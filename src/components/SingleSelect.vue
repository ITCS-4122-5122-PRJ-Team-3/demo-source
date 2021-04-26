<template>
  <h3>{{ label }}</h3>
  <div class="multi-select">
    <Multiselect
      v-model="value"
      :placeholder="label"
      :searchable="true"
      :options="options"
      @change="onValueChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Multiselect from "@vueform/multiselect";

export interface SelectEntry {
  value: String;
  label: String;
}

export default defineComponent({
  setup() {
  },
  components: {
    Multiselect,
  },
  created() {
      this.value = this.default_value || null;
  },
  data() {
    return {
      value: this.default_value || null,
    };
  },
  props: {
    default_value: String,
    options: Array,
    label: String,
    onValueChange: Function,
  },
});
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
.multi-select {
  background-color: white;
  margin: 10px;
}
</style>