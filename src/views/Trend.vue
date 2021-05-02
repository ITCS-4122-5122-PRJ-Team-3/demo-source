<template>
<div class="viz-container">
  <div class="select-container">
    <SingleSelect
      :options="quantitative_options"
      label="Predict"
      :default_value="y_axis"
      :onValueChange="(value) => set('y_axis', value)"
    />
    <SingleSelect
      :options="quantitative_options"
      label="Estimator"
      :default_value="x_axis"
      :onValueChange="(value) => set('x_axis', value)"
    />
  </div>
  <div class="chart-container">
    <apexchart
      width="750"
      :options="chart_options.options"
      :series="chart_options.series"
    ></apexchart>
    <apexchart
      width="750"
      :options="line_chart_options.options"
      :series="line_chart_options.series"
    ></apexchart>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SingleSelect from "../components/SingleSelect.vue";
import { quantitative_map, label_value_map } from "./Main.vue";
import { multiply, transpose, inv } from "mathjs";

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
    soa_data: Object,
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

      x_axis: "Avg_Utilization_Ratio",
      y_axis: "Credit_Limit",
      subsets: "Education_Level",
      quantization_factor: "512",
      quantize: false,
      sub_quantization_factor: "100",
      sub_quantize: false,
    };
  },
  methods: {
    set(key: string, value: any) {
      //@ts-ignore
      this[key] = value;
      let route = {
        name: "Trend",
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
      if (!this.x_axis) {
        return
      }

      //@ts-ignore
      let Y = this.soa_data?.[this.y_axis];

      //@ts-ignore
      let X = this.soa_data?.[this.x_axis].map((val) => [1, val]);

      let X_t = transpose(X);

      let X_X_t_inv = inv(multiply(X_t, X));
      let X_t_Y = multiply(X_t, Y);

      let beta_hat = multiply(X_X_t_inv, X_t_Y);
      let intercept = beta_hat[0];
      let slope = beta_hat[1];

      ///let m_hat = multiply(X, beta_hat);

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

      let categories: {
        [index: string]: {
          sum: number;
          count: number;
          sets: { [index: string]: { sum: number; count: number } };
        };
      } = {};
      let subset_keys: { [index: string]: Boolean } = {}

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

      let sorted_categories = Object.entries(categories).sort(
        entry_sort(this.x_axis)
      );

      const line_series_data = sorted_categories.map((entry) => {
        return {
          y: entry[1].sum / entry[1].count,
          x: average_of_range(entry[0]),
        };
      });


      //@ts-ignore
      let pick = quantization_factor / this.data.length;
      let count = 0;
      let scatter_series_data: {x: number, y: number}[] = [];

      let go = () => this.data?.forEach((entry) => {
        if (Math.random() > pick) return;
        count += 1;

        //@ts-ignore
        let x = entry[this.x_axis];
        //@ts-ignore
        let y = entry[this.y_axis];

        scatter_series_data.push(
        {
          y: y, 
          x: x,
        });
      });
    

      while (count < quantization_factor) {
        go();
      }


      this.chart_options = {
        series: [
          {
            name: "Data",
            type: "scatter",
            //@ts-ignore
            data: scatter_series_data,
          },
          {
            name: "Linear Regression",
            type: "line",
            //@ts-ignore
            data: [
            //@ts-ignore
              {
                x: min,
                y: intercept + min * slope,
              },
            //@ts-ignore
              {
                x: max,
                y: intercept + max * slope,
              },
            ],
          },

        ],
        options: {
          chart: {
            //@ts-ignore
            type: "line",
          //@ts-ignore
            animations: {
              enabled: false,
            },
          },
          fill: {
            type: "solid",
          },
          tooltip: {
            shared: false,
            intersect: true,
          },
          legend: {
            show: true,
          },
          markers: {
            size: [3, 0]
          },
          xaxis: {
            //@ts-ignore
            title: {
              //@ts-ignore
              text: label_value_map[this.x_axis],
            },

            //@ts-ignore
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
      };

      this.line_chart_options = {
        series: [
          {
            name: "Average",
            type: "line",
            //@ts-ignore
            data: line_series_data,
          },
          {
            name: "Linear Regression",
            type: "line",
            //@ts-ignore
            data: [
            //@ts-ignore
              {
                x: min,
                y: intercept + min * slope,
              },
            //@ts-ignore
              {
                x: max,
                y: intercept + max * slope,
              },
            ],
          },

        ],
            options: {
            ...this.chart_options.options,
        chart: {
            //@ts-ignore
            type: "line",
          //@ts-ignore
            animations: {
              enabled: true,
            },
          },
              //@ts-ignore
            markers: {
            size: 0
          },

          }


      }
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

