<template>
  <div class="tab">
    <router-link class="tablinks" :to="{ name: 'Comparison' }">Comparison</router-link>
    <router-link class="tablinks" :to="{ name: 'Relationship' }">Relationship</router-link>
    <!--<router-link class="tablinks" :to="{ name: 'Trend' }">Trend</router-link>-->
  </div>
  <!-- Side navigation -->
  <div class="tabcontent">
    <router-view
      :data="data"
      :categorical_options="categorical_options"
      :quantitative_options="quantitative_options"
      :all_options="all_options"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const make_options = (map: Object) => {
  return Object.entries(map).map((entry) => {
    return { label: entry[1], value: entry[0] };
  });
};

export const label_value_map = {
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

export const cateogorical_map = {
  Gender: "Gender",
  Education_Level: "Education",
  Marital_Status: "Marital Status",
  Income_Category: "Income",
};

export const quantitative_map = {
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
  setup() {},
  props: {
    data: Object,
  },
  created() {
  },
  data: () => {
    return {
      all_options: make_options(label_value_map),
      categorical_options: make_options(cateogorical_map),
      quantitative_options: make_options(quantitative_map),
    };
  },
  methods: {
  },
  components: {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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

.content {
  padding-top: 10%;
  padding-left: 320px;
  display: flex;
  justify-content: center;
}

/* Style the tab */
.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

/* Style the buttons inside the tab */
.tab .tablinks {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-size: 17px;
}

/* Change background color of buttons on hover */
.tab .tablinks:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab .tablinks.router-link-active {
  background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}

.select-container {
    display: flex;
    
    flex-direction: column;
}

.chart-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.viz-container {
    display: flex;
    justify-content: space-around;
}
</style>
