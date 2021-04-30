<template>
  <div class="select-container">
    <SingleSelect
      :options="quantitative_options"
      label="Y-Axis"
      :default_value="y_axis"
      :onValueChange="(value) => set('y_axis', value)"
    />
    <SingleSelect
      :options="all_options"
      label="X-Axis"
      :default_value="x_axis"
      :onValueChange="(value) => set('x_axis', value)"
    />
  </div>
  <div class="chart-container">
    <apexchart
      width="750"
      type="scatter"
      :options="chart_options.options"
      :series="chart_options.series"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SingleSelect from "../components/SingleSelect.vue";

export default defineComponent({
  props: {
    categorical_options: Array,
    quantitative_options: Array,
    all_options: Array,
    data: Array,
  },
  setup() {},
  created() {
    //@ts-ignore
    this.x_axis = this.$route.query.x || this.x_axis;
    //@ts-ignore
    this.y_axis = this.$route.query.y || this.y_axis;
    this.render();
  },
  data: () => {
    return {
      chart_options: {
        options: {
          chart: {
            id: "vuechart-example",
          },
          xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
          },
        },
        series: [
          {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91],
          },
        ],
      },

      x_axis: "Gender",
      y_axis: "Credit_Limit",
    };
  },
  methods: {
    set(key: string, value: any) {
      //@ts-ignore
      this[key] = value;
      this.render();
    },
    render() {
      console.log("rendering");
      //@ts-ignore
      const series_data = this.data?.map( (entry: { [x: string]: any }) => {
          let x = entry[this.x_axis];
          let y = entry[this.y_axis];

          return [x, y];
      });

      this.chart_options = {
        options: {
          chart: {
            id: "vuechart-example",
          },
          xaxis: {
            //@ts-ignore
            title: {
              text: this.x_axis,
            },
          },

         // tickAmount: keys.length > 25 ? 25 : keys.length,

/*
          animations: {
            enabled: keys.length > 50 ? false : true,
          },
          */

          dataLabels: {
            formatter: (label: string) => {
              let num = Number(label);
              if (!isNaN(num)) {
                return num.toFixed(2);
              } else {
                return label;
              }
            },
          },

          yaxis: {
            labels: {
              formatter: (label: string) => {
                let num = Number(label);
                if (!isNaN(num)) {
                  return num.toFixed(2);
                } else {
                  return label;
                }
              },
            },

            title: {
              text: this.y_axis,
            },
          },
        },
        series: [
          {
            name: "series-1",
            //@ts-ignore
            data: series_data,
          },
        ],
      };
    },
  },
  components: { SingleSelect },
});
</script>

