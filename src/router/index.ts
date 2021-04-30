import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Main from '../views/Main.vue';
import Comparison from '../views/Comparison.vue';
import Relationship from '../views/Relationship.vue';
import Trend from '../views/Trend.vue';
//import Landing from '../views/Landing.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/vis',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '',
        /*
        name: 'Landing',
        component: Landing,
        */
       redirect: { name: 'Comparison' }
      },
      {
        path: 'comparison',
        name: 'Comparison',
        component: Comparison,
      },
      {
        path: 'relationship',
        name: 'Relationship',
        component: Relationship,
      },
      {
        path: 'trend',
        name: 'Trend',
        component: Trend,
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
