<template>
    <div class="nav">
    <div class="topnav">
        <h3>Visualization Types</h3>
        <a v-bind:class="{ active: is_relationship }" v-on:click="activate('relationship')">Relationships</a>
        <a v-bind:class="{ active: is_comparison }" v-on:click="activate('comparison')">Comparisons</a>
    </div>

    <!-- Side navigation -->
    <div class="sidenav">
        <h3>Project Team 3 Demo Prototype</h3>
        <hr>

        <label for="example">Example Input</label>
        <select name="example" id="example">
            <option value="variable 1">variable 1</option>
            <option value="variable 2">variable 2</option>
            <option value="variable 3">variable 3</option>
            <option value="variable 4">variable 4</option>
        </select>

        <br/>
        <hr>

        <label for="example2">Example Input 2</label>
        <select name="example2" id="example2">
            <option value="variable 1">variable 1</option>
            <option value="variable 2">variable 2</option>
            <option value="variable 3">variable 3</option>
            <option value="variable 4">variable 4</option>
        </select>
    </div>
    </div>

    <div class="content">
        <div v-if="is_comparison">
            <apexchart width="750" type="bar" :options="options" :series="series"></apexchart>
        </div>
        <div v-if="is_relationship">
            <apexchart width="750" type="line" :options="options" :series="series"></apexchart>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {

        console.log("in Main");
    },
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    data: () => {
        return {
            options: {
                chart: {
                    id: 'vuechart-example'
                },
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
                }
            },
            series: [{
                name: 'series-1',
                data: [30, 40, 45, 50, 49, 60, 70, 91]
            }],

            is_comparison: false,
            is_relationship: true,
        }
    },
    methods: {
        activate(to_activate: String) {
            if (to_activate === 'relationship') {
                this.is_relationship = true;
                this.is_comparison = false;
            } else {
                this.is_relationship = false;
                this.is_comparison = true;
            }
        }
    }
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
  border:0px solid #2e2e2e;
  border-bottom-width: 2px;
}

.content {
    padding-top: 10%;
    padding-left: 320px;
    display: flex;
    justify-content: center;
}
</style>
