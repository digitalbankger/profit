<template>
    <apexchart ref="areaChart" :options="chartOptions" :series="areaChartSeries" class="graph-all height-60"></apexchart>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    chartOptions: Object,
    areaChartSeries: Array,
  },
};
</script>
  