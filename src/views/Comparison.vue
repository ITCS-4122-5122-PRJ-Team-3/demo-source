<template>
  <div class="viz-container">
    <div class="select-container">
      <SingleSelect
        :options="quantitative_options"
        label="Quantitative Measure"
        :default_value="y_axis"
        :onValueChange="(value) => set('y_axis', value)"
      />
      <SingleSelect
        :options="all_options"
        label="Category"
        :default_value="x_axis"
        :onValueChange="(value) => set('x_axis', value)"
      />
      <div v-if="quantize">
        <SingleSelect
          :options="quantize_options"
          label="Quantization Factor"
          :default_value="quantization_factor"
          :onValueChange="(value) => set('quantization_factor', value)"
        />
      </div>
      <SingleSelect
        :options="all_options"
        label="Subsets"
        :default_value="subsets"
        :onValueChange="(value) => set('subsets', value)"
      />
      <div v-if="sub_quantize">
        <SingleSelect
          :options="quantize_options"
          label="Subsets Quantization Factor"
          :default_value="sub_quantization_factor"
          :onValueChange="(value) => set('sub_quantization_factor', value)"
        />
      </div>

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
        type="pie"
        :options="counts_chart_options.options"
        :series="counts_chart_options.series"
      ></apexchart>
      <apexchart
        width="750"
        type="bar"
        :options="stacked_counts_chart_options.options"
        :series="stacked_counts_chart_options.series"
      ></apexchart>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import SingleSelect from "../components/SingleSelect.vue";
import {quantitative_map, label_value_map} from './Main.vue';

const quantize_options = [
  2, 3, 4, 5, 6, 7, 8, 9, 10
].map(val => String(val));

const income_order = {
  'Less than $40K': 0,
  '$40K - $60K': 1,
  '$60K - $80K': 2,
  '$80K - $120K': 3,
  '$120K +': 4,
  'Unknown': 5,
};

const education_order = {
  'Uneducated': 0,
  'High School': 1,
  'College': 2,
  'Graduate': 3,
  'Doctorate': 4,
  'Post-Graduate': 5,
  'Unknown': 6,
};

const marital_order = {
  'Single': 0,
  'Married': 1,
  'Divorced': 2,
  'Unknown': 3,
};

const key_sort = (category: string) => (first: string, second: string) => {
  if (category === 'Income_Category') {
    //@ts-ignore
    return income_order[first] - income_order[second];
  }

  if (category === 'Education_Level') {
    //@ts-ignore
    return education_order[first] - education_order[second];
  }

  if (category === 'Marital_Status') {
    //@ts-ignore
    return marital_order[first] - marital_order[second];
  }

  //@ts-ignore
  if (quantitative_map[category]) {
    let first_num = Number(first.split('-')[0]);
    let second_num = Number(second.split('-')[0]);
    return first_num - second_num;
  }

  return first.localeCompare(second);
};


const entry_sort = (category: string) => (first: [string, any], second: [string, any]) => {
  return key_sort(category)(first[0], second[0]);
};

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

     counts_chart_options: {
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

     stacked_counts_chart_options: {
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
      quantization_factor: '5',
      quantize: false,
      quantize_options: quantize_options,
      sub_quantization_factor: '5',
      sub_quantize: false,
    };
  },
  methods: {
    set(key: string, value: any) {
      //@ts-ignore
      this[key] = value;
      let route = {name: 'Comparison', query: {x:this.x_axis, y: this.y_axis, subsets: this.subsets}};
     //@ts-ignore
      if (quantitative_map[this.x_axis]) {
        //@ts-ignore
        route.query['quantization'] = this.quantization_factor;
      }
      //@ts-ignore
      if (quantitative_map[this.subsets]) {
        //@ts-ignore
        route.query['sub_quantization'] = this.sub_quantization_factor;
      }
      this.$router.push(route);
    },
    render() {
      console.log("rendering");
      let categories: { [index: string]: { sum: number; count: number, sets: {[index: string]: {sum: number; count: number;}} } } = {};
      let subset_keys:{[index: string]: Boolean } = {};

      //@ts-ignore
      let quantize = quantitative_map[this.x_axis] || false;
      //@ts-ignore
      let sub_quantize = quantitative_map[this.subsets] || false;
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;
      let sub_min = Number.MAX_VALUE;
      let sub_max = Number.MIN_VALUE
      //@ts-ignore
      if (quantize || sub_quantize) {
        console.log('quantizing')

        //@ts-ignore
        this.data?.forEach((entry: { [x: string]: any }) => {
          let value = entry[this.x_axis];        
          if (value > max) {
            max = value;
          }

          if (value < min) {
            min = value;
          }


          value = entry[this.subsets];        
          if (value > sub_max) {
            sub_max = value;
          }

          if (value < sub_min) {
            sub_min = value;
          }
        })
      }

      let quantization_factor = Number(this.quantization_factor);
      let quantize_mod = (max - min) / quantization_factor;

      let sub_quantization_factor = Number(this.sub_quantization_factor);
      let sub_quantize_mod = (sub_max - sub_min) / sub_quantization_factor;

      //@ts-ignore
      this.data?.forEach((entry: { [x: string]: any }) => {
        let category = entry[this.x_axis];
        if (category === undefined) {
          return;
        }

        if (quantize) {
          let bucket = Math.floor((category - min) / quantize_mod);
          if (bucket == quantization_factor) {
            bucket -= 1;
          }
          let lower = min + (quantize_mod * bucket);
          let upper = min + (quantize_mod * (bucket + 1));
          category = `${lower.toFixed(2)} - ${upper.toFixed(2)}`;
        }

        if (!categories[category]) {
          categories[category] = {
            sum: 0,
            count: 0,
            sets: {},
          };
        }

        let set = entry[this.subsets];
        if (sub_quantize) {
          let bucket = Math.floor((set - sub_min) / sub_quantize_mod);
          if (bucket == sub_quantization_factor) {
            bucket -= 1;
          }
          let lower = sub_min + (sub_quantize_mod * bucket);
          let upper = sub_min + (sub_quantize_mod * (bucket + 1));
          set = `${lower.toFixed(2)} - ${upper.toFixed(2)}`;
        }

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


      let keys = Object.keys(categories).sort(key_sort(this.x_axis));
      let subsets = Object.keys(subset_keys).sort(key_sort(this.subsets));

      let sorted_categories = Object.entries(categories).sort(entry_sort(this.x_axis)).map((entry) => entry[1]);

      const all_series_data = sorted_categories.map(
        (entry) => entry.sum / entry.count
      );

      const counts_series_data = sorted_categories.map(entry => entry.count);

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

      let expected_length = 1;
      sorted_categories.forEach((value) => {
          ///let count = value.count;
          Object.entries(value.sets).forEach((entry) => {
              let [k, v] = entry;
              subset_series[subset_i[k]].data.push(v.sum / v.count);
              subset_proporition_series[subset_i[k]].data.push(v.count);
          })

          subset_series.forEach(value => {
            if (value.data.length < expected_length) {
              value.data.push(0);
            }
          })
          subset_proporition_series.forEach(value => {
            if (value.data.length < expected_length) {
              value.data.push(0);
            }
          })

          expected_length += 1;
      });


      this.quantize = quantize;
      this.sub_quantize = sub_quantize;

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
            //@ts-ignore
              text: label_value_map[this.x_axis],
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
            //@ts-ignore
              text: label_value_map[this.y_axis],
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
            name: 'Overall',
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



    this.counts_chart_options = {
        //@ts-ignore
        series: counts_series_data,
        options: {
          ...this.bar_chart_options.options,

          title: {
            text: 'Counts'
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
          labels: keys,
          dataLabels: {
              enabled: true,
          }
        },
      };

    this.stacked_counts_chart_options = {
        series: [
          ...subset_proporition_series,
        ],
        options: {
          ...this.bar_chart_options.options,

          title: {
            text: 'Subset Counts'
          },

          chart: {
            id: "vuechart-example",

            //@ts-ignore
            stacked: true,
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
                text: label_value_map[this.y_axis],
                }
            },

            yaxis: {
                title: {
                //@ts-ignore
                text: label_value_map[this.x_axis],
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
            //@ts-ignore
            this.quantization_factor = to.query.quantization || this.quantization_factor;
            //@ts-ignore
            this.sub_quantization_factor = to.query.sub_quantization || this.sub_quantization_factor;
            this.render();
        }    
       }
    },

});
</script>

<style>
</style>
