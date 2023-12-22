<template>
      <apexchart ref="donutChart" :options="donutChartOptions" :series="donutChartSeries" class="graph-all"></apexchart>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    donutChartOptions: Object,
    donutChartSeries: Array,
  },
};
</script>
  