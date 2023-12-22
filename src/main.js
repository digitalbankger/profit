import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import '@/assets/css/style.css';

import VueApexCharts from "vue3-apexcharts";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import setupInterceptors from './services/setupInterceptors';

const vuetify = createVuetify({
  components,
  directives,
})

setupInterceptors(store);

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(VueApexCharts)
  .mount("#app");
