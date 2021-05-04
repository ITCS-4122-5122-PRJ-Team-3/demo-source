<template>
  <div class="home">
    <p>
    Welcome to project team 3’s final project for ITCS 4122/5122 - Visual Analytics class of Spring 2021. We are Zachary Onisick, Iryna Naminat, Alec Goncharow, and Rachel Conforti.
    </p>

  <h3>Background:</h3>
  <p>
  The dataset we have chosen is called <a href="https://www.kaggle.com/sakshigoyal7/credit-card-customers">'Credit Card customers' from Kaggle</a>, this dataset has information on over ten thousand customers on various categories such as age, salary, marital status, education levels, dependents, credit card limit, and income category. 
  We picked this dataset because there is a large amount of information we can pull from this dataset that will allow us to show insightful information on the topic of credit card use.
  For example, we can make inferences about how different groups of customers handle their money, potential contributing factors, what factors contribute to credit card limits or usage, etc.
  Our main goal with our project is to give the user the ability to answer their questions and give them as much freedom to do so. The user will be presented the data displayed in multiple different ways,
  to really help users come to their own conclusions and hopefully find answers to questions they never knew they had. We have laid out our visualizations into three sections under  <router-link to="/vis">'Visualizations'</router-link>: <router-link :to="{ name: 'Comparison' }">comparisons</router-link>, <router-link :to="{ name: 'Relationship' }">relationships</router-link>, and <router-link :to="{ name: 'Trend' }">linear regression</router-link>.
  The comparison tab will allow users to see multiple visualizations to compare and contrast different categories within the dataset. And for the relationship tab, we have placed two visualizaiton to show the relationshp between variables.
  Lastly, the linear regression tab has our linear regressions; we have one backed by a scatter plot and another backed by a line graph.
  </p>

  <h3>How we built our project:</h3>
  <p>
  We decided to use <a href="https://v3.vuejs.org/">Vue 3</a>  to build our project because it is very versatile. It allowed us to combine what we learned in class, such as <a href="https://apexcharts.com/">ApexCharts</a>, and bring new elements into our project. 
  We also liked Vue because of its adaptability and how easy it is to work with outside libraries which allowed us to easily intergrate multiple libraries into our project. 
  And lastly, we liked the look and feel that Vue could bring us with the animations and layout of our project since we wanted it to be very user-focused and allow them to use multiple visualizations 
  at once.
  </p>

  <h3>Who can use this information:</h3>
  <p>
  We believe this visualization could be used by many different groups/types of people. It can be used by banks to figure out patterns within different groups of customers, show insightful information, and see potential contributing
  factors to credit limit, credit balance, etc. Another use can be to educate students, customers, or employees on credit card usage scenarios. And lastly, any user interested in credit trends and contributing factors 
  can use these visualizations to answer questions, find new questions, or just to see how different factors work together within the dataset.
  </p>

  </div>
</template>

<script>

export default {
  name: "Home",
  components: {},
};
</script>

<style>
.home {
  margin: 0 20%;
}

.question-container {
    display: flex;
    flex-direction: column;
}

.question-container a {
  margin: 5px;
}
</style>
