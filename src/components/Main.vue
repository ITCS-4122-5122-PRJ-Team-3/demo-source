<template>
  <div class="nav">
    <div class="topnav">
      <h3>Visualization Types</h3>
      <a
        v-bind:class="{ active: is_relationship }"
        v-on:click="activate('relationship')"
        >Relationships</a
      >
      <a
        v-bind:class="{ active: is_comparison }"
        v-on:click="activate('comparison')"
        >Comparisons</a
      >
    </div>

    <!-- Side navigation -->
    <div class="sidenav">
      <h3>Project Team 3 Demo Prototype</h3>
      <hr />

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
    <!--
      <SingleSelect
        :options="options_map"
        label="All Options"
        :onValueChange="print_change('all')"
      />
      <SingleSelect
        :options="quantitative_options"
        label="Quantitative Options"
        :onValueChange="print_change('all')"
      />
      <SingleSelect
        :options="cateogorical_options"
        label="Categorical Options"
        default_value="Gender"
        :onValueChange="print_change('all')"
      />
      <MultiSelect
        :options="options_map"
        label="All Options"
        :onValueChange="print_change('all')"
      />
      <MultiSelect
        :options="quantitative_options"
        label="Quantitative Options"
        :onValueChange="print_change('all')"
      />
      <MultiSelect
        :options="cateogorical_options"
        label="Categorical Options"
        :onValueChange="print_change('all')"
      />
      -->
    </div>
  </div>

  <div class="content">
    <div v-if="is_comparison">
      <apexchart
        width="750"
        type="bar"
        :options="chart_options.options"
        :series="chart_options.series"
      ></apexchart>
    </div>
    <div v-if="is_relationship">
      <apexchart
        width="750"
        type="line"
        :options="chart_options.options"
        :series="chart_options.series"
      ></apexchart>
    </div>

    <div v-if="false">
      <MultiSelect
        :options="cateogorical_options"
        label="Categorical Options"
        :onValueChange="print_change('all')"
      />
      </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import MultiSelect from "./MultiSelect.vue";
import SingleSelect from "./SingleSelect.vue";

const print_change = (label: string) => (value: any) => {
  console.log(`[${label}] ${value}`);
};

const make_options = (map: Object) => {
  return Object.entries(map).map((entry) => {
    return { label: entry[1], value: entry[0] };
  });
};

const label_value_map = {
      Customer_Age: "Age",
      Gender: "Gender",
      Dependent_count: "Dependent Count",
      Education_Level: "Education",
      Marital_Status: "Marital Status",
      Income_Category: "Income",
      Months_on_book: "Months",
      Months_Inactive_12_mon: "Inactive Months",
      Contacts_Count_12_mon: "Contact Count",
      Credit_Limit: "Credit Limit",
      Total_Revolving_Bal: "Total Balance",
      Avg_Open_To_Buy: "Average Open To Buy",
      Total_Amt_Chng_Q4_Q1: "Amount Change Q4 Q1",
      Total_Trans_Amt: "Total Transaction Amount",
      Total_Trans_Ct: "Total Transaction Count",
      Total_Ct_Chng_Q4_Q1: "Total Count Change Q4 Q1",
      Avg_Utilization_Ratio: "Average Utilization Ratio",
    };

    const cateogorical_map = {
      Gender: "Gender",
      Education_Level: "Education",
      Marital_Status: "Marital Status",
      Income_Category: "Income",
    };

    const quantitative_map = {
      Customer_Age: "Age",
      Dependent_count: "Dependent Count",
      Months_on_book: "Months",
      Months_Inactive_12_mon: "Inactive Months",
      Contacts_Count_12_mon: "Contact Count",
      Credit_Limit: "Credit Limit",
      Total_Revolving_Bal: "Total Balance",
      Avg_Open_To_Buy: "Average Open To Buy",
      Total_Amt_Chng_Q4_Q1: "Amount Change Q4 Q1",
      Total_Trans_Amt: "Total Transaction Amount",
      Total_Trans_Ct: "Total Transaction Count",
      Total_Ct_Chng_Q4_Q1: "Total Count Change Q4 Q1",
      Avg_Utilization_Ratio: "Average Utilization Ratio",
    };

export default defineComponent({
  setup() {
  },
  props: {
    data: Object,
  },
  created() {
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

      is_comparison: true,
      is_relationship: false,

      print_change: print_change,

      options_map: make_options(label_value_map),
      categorical_options: make_options(cateogorical_map),
      quantitative_options: make_options(quantitative_map),

      x_axis: "Gender",
      y_axis: "Credit_Limit",
    };
  },
  methods: {
    activate(to_activate: String) {
      if (to_activate === "relationship") {
        this.is_relationship = true;
        this.is_comparison = false;
      } else {
        this.is_relationship = false;
        this.is_comparison = true;
      }
    },
    set(key: string, value: any) {
        //@ts-ignore
        this[key] = value;
        this.render();
    },
    render() {
        console.log('rendering');
        let categories: {[index: string]: {sum: number, count: number}} = {};
        this.data?.forEach((entry: { [x: string]: any; }) => {
            let category = entry[this.x_axis];
            if (category === undefined) {
                return;
            }

            if (!categories[category]){
                categories[category] = {
                    sum: 0,
                    count: 0,
                };
            }

            categories[category].sum += entry[this.y_axis];
            categories[category].count += 1;
        });

        console.log(categories);

        const series_data = Object.values(categories).map(value => 
            value.sum / value.count
        );

        this.chart_options =  {
        options: {
          chart: {
            id: "vuechart-example",
          },
          xaxis: {
              //@ts-ignore
            categories: Object.keys(categories),
          },
        },
        series: [
          {
            name: "series-1",
            data: series_data,
          },
        ],
      };


    },
  },
  components: { MultiSelect, SingleSelect },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/* The sidebar menu */
.sidenav {
  height: 100%; /* Full-height: remove this if you want "auto" height */
  width: 320px; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: #aaa;
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 20px;
}

.sidenav label {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 25px;
  color: #2c3e50;
  display: block;
}

/* The navigation menu links */
.sidenav a {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 25px;
  color: #fff;
  display: block;
}

/* Add a black background color to the top navigation */
.topnav {
  background-color: #aaa;
  overflow-x: hidden;
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  top: 0; /* Stay at the top */
  padding: 14px 16px;
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

/* Style the links inside the navigation bar */
.topnav a {
  color: #2c3e50;
  padding-right: 14px;
  padding-left: 14px;
  margin-top: 16px;
  margin-bottom: 16px;
  text-decoration: none;
  cursor: pointer;
}

.topnav h3 {
  margin: 0;
  padding-right: 30px;
}
/* Change the color of links on hover */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}

.topnav a.active {
  border: 0px solid #2e2e2e;
  border-bottom-width: 2px;
}

.content {
  padding-top: 10%;
  padding-left: 320px;
  display: flex;
  justify-content: center;
}
</style>
