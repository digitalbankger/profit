import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register', '/home'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');


  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;