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
        :options="quantitative_options"
        label="Variable"
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
      <div class="question-container">
      <router-link :to="{name: 'Relationship', query: {x:'Dependent_count', y: 'Avg_Utilization_Ratio', subsets: 'Gender', quantization: 10}}">What is the relationship between average utilization ratio and dependent count? 
</router-link>
      <router-link :to="{name: 'Relationship', query: {x:'Customer_Age', y: 'Total_Trans_Amt', subsets: 'Total_Revolving_Bal', quantization: 10, sub_quantization: 2}}">What is the relationship between transaction count, age, and total balance? 
</router-link>
      <router-link :to="{name: 'Relationship', query: {x:'Total_Revolving_Bal', y: 'Credit_Limit', subsets: 'Income_Category', quantization: 5}}">What is the relationships between credit limit, total balance, and income?
</router-link>
    </div>
    </div>
    <div class="chart-container">
      <apexchart
        width="750"
        type="line"
        :options="line_chart_options.options"
        :series="line_chart_options.series"
      ></apexchart>
      <apexchart
        width="750"
        type="line"
        :options="subset_chart_options.options"
        :series="subset_chart_options.series"
      ></apexchart>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import SingleSelect from "../components/SingleSelect.vue";
import { quantitative_map, label_value_map } from "./Main.vue";

const quantize_options = [
  2,
  4,
  5,
  8,
  10,
  16,
  20,
  25,
  30,
  32,
  40,
  50,
  64,
  75,
  100,
  128,
  256,
  512,
  1024,
  "None",
].map((val) => String(val));

const income_order = {
  "Less than $40K": 0,
  "$40K - $60K": 1,
  "$60K - $80K": 2,
  "$80K - $120K": 3,
  "$120K +": 4,
  Unknown: 5,
};

const education_order = {
  Uneducated: 0,
  "High School": 1,
  College: 2,
  Graduate: 3,
  Doctorate: 4,
  "Post-Graduate": 5,
  Unknown: 6,
};

const marital_order = {
  Single: 0,
  Married: 1,
  Divorced: 2,
  Unknown: 3,
};

const key_sort = (category: string) => (first: string, second: string) => {
  if (category === "Income_Category") {
    //@ts-ignore
    return income_order[first] - income_order[second];
  }

  if (category === "Education_Level") {
    //@ts-ignore
    return education_order[first] - education_order[second];
  }

  if (category === "Marital_Status") {
    //@ts-ignore
    return marital_order[first] - marital_order[second];
  }

  //@ts-ignore
  if (quantitative_map[category]) {
    let first_num = Number(first.split("-")[0]);
    let second_num = Number(second.split("-")[0]);
    return first_num - second_num;
  }

  return first.localeCompare(second);
};

const entry_sort = (category: string) => (
  first: [string, any],
  second: [string, any]
) => {
  return key_sort(category)(first[0], second[0]);
};

const average_of_range = (range: string) => {
  let split = range.split("-");
  if (split.length === 1) {
    return Number(split[0]);
  }

  let first_num = Number(split[0]);
  let second_num = Number(split[1]);
  return (first_num + second_num) / 2;
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
    //@ts-ignore
    this.quantization_factor =
      this.$route.query.quantization || this.quantization_factor;
    //@ts-ignore
    this.sub_quantization_factor =
      this.$route.query.sub_quantization || this.sub_quantization_factor;

    this.render();
  },

  data: () => {
    return {
      line_chart_options: {
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

      x_axis: "Avg_Utilization_Ratio",
      y_axis: "Credit_Limit",
      subsets: "Education_Level",
      quantization_factor: "100",
      quantize: false,
      quantize_options: quantize_options,
      sub_quantization_factor: "100",
      sub_quantize: false,
    };
  },
  methods: {
    set(key: string, value: any) {
      //@ts-ignore
      this[key] = value;
      let route = {
        name: "Relationship",
        query: { x: this.x_axis, y: this.y_axis, subsets: this.subsets },
      };
      //@ts-ignore
      if (quantitative_map[this.x_axis]) {
        //@ts-ignore
        route.query["quantization"] = this.quantization_factor;
      }
      //@ts-ignore
      if (quantitative_map[this.subsets]) {
        //@ts-ignore
        route.query["sub_quantization"] = this.sub_quantization_factor;
      }
      this.$router.push(route);
    },
    render() {
      let categories: {
        [index: string]: {
          sum: number;
          count: number;
          sets: { [index: string]: { sum: number; count: number } };
        };
      } = {};
      let subset_keys: { [index: string]: Boolean } = {};

      //@ts-ignore
      let quantize = quantitative_map[this.x_axis] || false;
      quantize = this.quantization_factor == "None" ? false : quantize;
      //@ts-ignore
      let sub_quantize = quantitative_map[this.subsets] || false;
      sub_quantize =
        this.sub_quantization_factor == "None" ? false : sub_quantize;
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;
      let sub_min = Number.MAX_VALUE;
      let sub_max = Number.MIN_VALUE;
      //@ts-ignore
      if (quantize || sub_quantize) {
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
        });
      }

      let quantization_factor = Number(
        this.quantization_factor == "None" ? "1" : this.quantization_factor
      );
      let quantize_mod = (max - min) / quantization_factor;

      let sub_quantization_factor = Number(
        this.sub_quantization_factor == "None"
          ? "1"
          : this.sub_quantization_factor
      );
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
          let lower = min + quantize_mod * bucket;
          let upper = min + quantize_mod * (bucket + 1);
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
          let lower = sub_min + sub_quantize_mod * bucket;
          let upper = sub_min + sub_quantize_mod * (bucket + 1);
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

      let sorted_categories = Object.entries(categories).sort(
        entry_sort(this.x_axis)
      );

      const all_series_data = sorted_categories.map((entry) => {
        return {
          y: entry[1].sum / entry[1].count,
          x: average_of_range(entry[0]),
        };
      });

      let subset_series: { name: string; data: any[] }[] = subsets.map(
        (value) => {
          return {
            name: value,
            data: [],
          };
        }
      );

      let subset_i: { [index: string]: number } = {};
      subsets.forEach((key, index) => {
        subset_i[key] = index;
      });

      let expected_length = 1;
      sorted_categories.forEach((value) => {
        ///let count = value.count;
        Object.entries(value[1].sets).forEach((entry) => {
          let [k, v] = entry;
          subset_series[subset_i[k]].data.push({
            y: v.sum / v.count,
            x: average_of_range(value[0]),
          });
        });

        subset_series.forEach((inner) => {
          if (inner.data.length < expected_length) {
            inner.data.push({
              y: 0,
              x: average_of_range(value[0])
            });
          }
        });

        expected_length += 1;
      });

      //@ts-ignore
      this.quantize = quantitative_map[this.x_axis] || false;
      //@ts-ignore
      this.sub_quantize = quantitative_map[this.subsets] || false;

      this.line_chart_options = {
        options: {
          chart: {
            id: "vuechart-example",

            //@ts-ignore
            animations: {
              enabled: keys.length > 50 ? false : true,
            },
          },
          markers: {
            size: 0,
          },
          title: {
            //@ts-ignore
            text: `${label_value_map[this.x_axis]} vs ${
              //@ts-ignore
              label_value_map[this.y_axis]
            }`,
          },
          xaxis: {
            //@ts-ignore
            title: {
              //@ts-ignore
              text: label_value_map[this.x_axis],
            },

            //@ts-ignore
            type: "numeric",
            min: min,
            max: max,
            tickAmount: 12,
          },

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

            stroke: {
              curve: "smooth",
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
            //@ts-ignore
            data: all_series_data,
          },
        ],
      };

      this.subset_chart_options = {
        series: [
          ...subset_series,
          {
            name: "Overall",
            data: all_series_data,
          },
        ],
        options: {
          ...this.line_chart_options.options,

          title: {
            text: "Averages across subsets",
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
    },
  },
  components: { SingleSelect },
  watch: {
    $route(to) {
      if (to.query) {
        //@ts-ignore
        this.x_axis = to.query.x || this.x_axis;
        //@ts-ignore
        this.y_axis = to.query.y || this.y_axis;
        //@ts-ignore
        this.subsets = to.query.subsets || this.subsets;
        //@ts-ignore
        this.quantization_factor =
          to.query.quantization || this.quantization_factor;
        //@ts-ignore
        this.sub_quantization_factor =
          to.query.sub_quantization || this.sub_quantization_factor;
        this.render();
      }
    },
  },
});
</script>

<style>
</style>

