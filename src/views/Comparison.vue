<template>
  <div class="viz-container">
    <div class="select-container">
      <SingleSelect
        :options="quantitative_options"
        label="Y-Axis"
        :default_value="y_axis"
        :onValueChange="(value) => set('y_axis', value)"
      />
      <SingleSelect
        :options="categorical_options"
        label="X-Axis"
        :default_value="x_axis"
        :onValueChange="(value) => set('x_axis', value)"
      />
      <SingleSelect
        :options="categorical_options"
        label="Subsets"
        :default_value="subsets"
        :onValueChange="(value) => set('subsets', value)"
      />

      <h3>Questions</h3>
      <router-link :to="{name: 'Comparison', query: {x:'Gender', y:'Credit_Limit'}}">What is the average credit limit versus gender?</router-link>
      <router-link :to="{name: 'Comparison', query: {x:'Income_Category', y:'Credit_Limit'}}">What is the average credit limit versus income level?</router-link>
      <router-link :to="{name: 'Comparison', query: {x:'Gender', y:'Avg_Utilization_Ratio'}}">Which gender utilizies their credit card more?</router-link>
      <router-link :to="{name: 'Comparison', query: {x:'Income_Category', y:'Avg_Utilization_Ratio'}}">What is the average utilization by income?</router-link>
    </div>
    <div class="chart-container">
      <apexchart
        width="750"
        type="bar"
        :options="bar_chart_options.options"
        :series="bar_chart_options.series"
      ></apexchart>
      <apexchart
        width="750"
        type="bar"
        :options="subset_chart_options.options"
        :series="subset_chart_options.series"
      ></apexchart>
      <apexchart
        width="750"
        type="bar"
        :options="stacked_chart_options.options"
        :series="stacked_chart_options.series"
      ></apexchart>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import SingleSelect from "../components/SingleSelect.vue";
//import {label_value_map, quantitative_map, cateogorical_map} from './Main.vue';

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
    //@ts-ignore
    this.subsets = this.$route.query.subsets || this.subsets;

    this.render();
  },

  data: () => {
    return {
      bar_chart_options: {
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

    subset_chart_options: {
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

     stacked_chart_options: {
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
      subsets: "Education_Level",
    };
  },
  methods: {
    set(key: string, value: any) {
      //@ts-ignore
      this[key] = value;
      this.$router.push({name: 'Comparison', query: {x:this.x_axis, y: this.y_axis, subsets: this.subsets}})
    },
    render() {
      console.log("rendering");
      let categories: { [index: string]: { sum: number; count: number, sets: {[index: string]: {sum: number; count: number;}} } } = {};
      let subset_keys:{[index: string]: Boolean } = {};
      //@ts-ignore
      this.data?.forEach((entry: { [x: string]: any }) => {
        let category = entry[this.x_axis];
        if (category === undefined) {
          return;
        }

        if (!categories[category]) {
          categories[category] = {
            sum: 0,
            count: 0,
            sets: {},
          };
        }

        let set = entry[this.subsets];
        if (set && !categories[category].sets[set]) {
            categories[category].sets[set] = {
                sum: 0,
                count: 0,
            };
        }

        if (set) {
            //@HACK, simple way to flag keys as existing without having to run through a contains check
            subset_keys[set] = true;
            categories[category].sets[set].sum += entry[this.y_axis];
            categories[category].sets[set].count += 1;
        }

        categories[category].sum += entry[this.y_axis];
        categories[category].count += 1;
      });


      let keys = Object.keys(categories);
      let subsets = Object.keys(subset_keys);

      const all_series_data = Object.values(categories).map(
        (value) => value.sum / value.count
      );

      let subset_series: {name: string, data: number[]}[] = subsets.map(value => {
          return {
              name: value,
              data: [],
          }
      });
    let subset_proporition_series: {name: string, data: number[]}[] = subsets.map(value => {
          return {
              name: value,
              data: [],
          }
      });
      let subset_i: {[index: string]: number} = {};
      subsets.forEach((key, index) => {
        subset_i[key] = index;
      });

      Object.values(categories).forEach((value) => {
          //let total = value.count;
          Object.entries(value.sets).forEach((entry) => {
              let [k, v] = entry;
              subset_series[subset_i[k]].data.push(v.sum / v.count);
              subset_proporition_series[subset_i[k]].data.push(v.count);
          })
      });

      this.bar_chart_options = {
        options: {
          chart: {
            id: "vuechart-example",

            //@ts-ignore
            animations: {
              enabled: keys.length > 50 ? false : true,
            },
          },
          title: {
            text: 'Comparison of Averages'
          },
          xaxis: {
            //@ts-ignore
            categories: keys,

            title: {
              text: this.x_axis,
            },
          },

          tickAmount: keys.length > 25 ? 25 : keys.length,
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
            name: this.y_axis,
            data: all_series_data,
          },
        ],
      };

      this.subset_chart_options = {
        series: [
          ...subset_series,
          {
            name: this.y_axis,
            data: all_series_data,
          },
        ],
        options: {
          ...this.bar_chart_options.options,

          title: {
            text: 'Comparison of Averages across subsets'
          },

          chart: {
            id: "vuechart-example",

            //@ts-ignore
            animations: {
              enabled: keys.length > 50 ? false : true,
            },
          },
          dataLabels: {
              enabled: false,
          },
  
        },
      };

    this.stacked_chart_options = {
        series: subset_proporition_series,
        options: {
          ...this.bar_chart_options.options,

          title: {
            text: 'Proportion of Averages across subsets'
          },

          chart: {
            id: "vuechart-example",

            //@ts-ignore
            stacked: false,
            //stackType: '100%',
            //@ts-ignore
            animations: {
              enabled: keys.length > 50 ? false : true,
            },
          },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
                xaxis: {
                //@ts-ignore
                categories: keys,

                title: {
                //@ts-ignore
                text: this.y_axis,
                }
            },

            yaxis: {
                title: {
                //@ts-ignore
                text: this.x_axis,
                },
            },
          dataLabels: {
              enabled: false,
          }
        },
      };
    },
  },
  components: { SingleSelect },
    watch: {
        '$route' (to) {
        if(to.query){ 
            //@ts-ignore
            this.x_axis = to.query.x || this.x_axis;
            //@ts-ignore
            this.y_axis = to.query.y || this.y_axis;
            //@ts-ignore
            this.subsets = to.query.subsets || this.subsets;
            this.render();
        }    
       }
    },

});
</script>

<style>
</style>
