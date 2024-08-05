<template>
  <div class="width-100 p-relative">

  </div>
  <div class="width-100">
    <div class="d-flex fd-column jc-space ai-center m-tb-2">
        <div class="d-flex fd-row jc-space width-100">
             <div class="col-4 d-flex fd-column card card-bg p-1 text-left">
                 <span class="fs-18 m-b-05">Депозит</span>
                 <span class="display-digits ">{{ allMoney }} $</span>
                 <span class="fs-15 curtext fw-300 rub-class">Не задано ₽</span>

             </div>

             <div class="col-4 d-flex fd-column card card-bg p-1 text-left">
                 <span class="fs-18 m-b-05">Всего средств</span>
                 <span class="display-digits ">{{ depoAndProfit }} $</span>
                 <span class="fs-15 curtext fw-300 rub-class">Не задано ₽</span>

             </div>

             <div class="col-4 d-flex fd-column card card-bg p-1 text-left">
                 <span class="fs-18 m-b-05">Прибыльные сделки</span>
                 <span class="display-digits ">{{ profit }}</span>

             </div>

             <div class="col-4 d-flex fd-column card card-bg p-1 text-left">
                 <span class="fs-18 m-b-05">Убыточные сделки</span>
                 <span class="display-digits ">{{ losing }}</span>

             </div>
        </div>

        <div class="d-flex fd-row jc-space m-tb-5 width-100">
            <div class="d-flex fd-column ai-center col-2 card p-1 p-relative">
                <span class="fs-18 m-b-05 text-left width-100">Общий счет</span>
                <chart-area 
                :chartOptions="chartOptions" 
                :areaChartSeries="areaChartSeries">
                </chart-area>
            </div>
            <div class="d-flex fd-column col-2 card p-1">
                <span class="fs-18 m-b-05 text-left width-100">Статистика сделок</span>
                <chart-donut 
                :donutChartOptions="donutChartOptions" 
                :donutChartSeries="newSeries">
                </chart-donut>
            </div>
        </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import ChartArea from "./ChartArea.vue"; 
import ChartDonut from "./ChartDonut.vue"; 
import { useApi } from '@/api/api.js';
import { subDays, format } from 'date-fns';

export default {
    components: {
        "chart-area": ChartArea,
        "chart-donut": ChartDonut,
    },
    props: {
      trade: Object,
    },

    setup() {
      const { fetchStat, fetchProfits } = useApi();
      const trades = ref([]);
      const profit = ref(0);
      const losing = ref(0);
      const active = ref(0);
      const profitableTrades = ref(0);
      const losingTrades = ref(0);
      const activeTrades = ref(0);

      const userDepo = ref(null);
      const corDepo = ref(null);
      const allMoney = ref(null);
      const depoAndProfit = ref(0);

      const chartOptions = ref({
        chart: {
            type: 'area',
            background: 'transparent',
            toolbar: {
                show: false,
            },
        },
        xaxis: {
          categories: getLast30Days(),
            labels: {
                style: {
                    colors: '#6e6f83', 
                },
            },
            xisTicks: {
                color: '#79878785'
            },
            axisBorder: {
                color: "#79878785"
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6e6f83',
                },
            },
        },
        fill: {
            type: "gradient",
            gradient: {
            type: "vertical",
            gradientToColors: ["#3ac0c0"],
            inverseColors: true,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 100]
            }
        },
        colors: ['#3ac0c0'],
        stroke: {
            colors: ["#3ac0c0"],
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: 'dark'
        },
        grid: {
            borderColor: '#79878785',
            strokeDashArray: 4, 
        },
    });

    const areaChartSeries = ref([
        {
            name: "Счет",
        },
    ]);
  
      const donutChartOptions = ref({
        chart: {
          type: "bar",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "100%",
          },
        },
        colors: ['#00c0ad', '#ff0000', '#475c5c'],
        stroke: {
          width: 0,
        },
        tooltip: {
          enabled: true,
          theme: 'dark',
          color: '#fff',
        },
        grid: {
          borderColor: '#79878785',
          strokeDashArray: 4,
        },
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: '#76788d',
            },
          },
          xaxisTicks: {
            color: '#79878785'
          },
          axisBorder: {
            color: "#79878785"
          },
        },
        yaxis: {
          max: 100,
          labels: false,
        },
      });
  
      const newSeries = ref([
        {
          name: "Прибыльные",
          data: [profitableTrades.value],
        },
        {
          name: "Убыточные",
          data: [losingTrades.value],
        },
        {
          name: "Активные",
          data: [activeTrades.value],
        },
      ]);

      function getLast30Days() {
        const currentDate = new Date();
        const dates = [];

        for (let i = 0; i <= 30; i++) {
          if (i === 0 || i % 3 === 0) {
            const date = subDays(currentDate, i);
            dates.push(format(date, 'd MMM'));
          }
        }

        return dates;
      }

      const fetchProfitsData = async () => {
        try {
          const response = await fetchProfits(1);
          let accumulatedProfit = 0;
          const accumulatedResponse = [];
          
          for (let i = 0; i < response.length; i++) {
            accumulatedProfit += response[i];
            if (i === 0 || (i + 1) % 3 === 0) {
              accumulatedResponse.push(accumulatedProfit);
            }
          }
          areaChartSeries.value = [
            {
              name: "Профит/Убыток",
              data: accumulatedResponse,
            },
          ];
        } catch (error) {
          console.error(error);
        }
      }

      const fetchStatData = async () => {
        try {
          const response = await fetchStat(1);
          const tradesData = response.Trades;
          corDepo.value = response.CorrectDepo;    
          
          allMoney.value = userDepo.value + corDepo.value;
        
          let totalProfit = 0;
          let totalCommission = 0;

          tradesData.forEach((trade) => {
            if (trade.Status === "Победа") {
              profitableTrades.value++;
            } else if (trade.Status === "Проигрыш") {
              losingTrades.value++;
            } else if (trade.Status === "Активна") {
              activeTrades.value++;
            }

            totalProfit += trade.PNLUSDT;
            totalCommission += trade.CommissionAmount;
          });

          depoAndProfit.value = allMoney.value + totalProfit - totalCommission;

      
          profit.value = profitableTrades.value;
          losing.value = losingTrades.value;
          active.value = activeTrades.value;
      
            const maxAmongThree = Math.max(profit.value, losing.value, active.value);
      
            donutChartOptions.value = {
                xaxis: {
                    max: maxAmongThree
                }
            }
      
          newSeries.value = [
            {
              name: "Прибыльные",
              data: [profitableTrades.value],
            },
            {
              name: "Убыточные",
              data: [losingTrades.value],
            },
            {
              name: "Активные",
              data: [activeTrades.value],
            },
          ];
        } catch (error) {
          console.error(error);
        }
      };

  
      onMounted(() => {
        fetchStatData();
        fetchProfitsData();
      });
  
      return {
        trades,
        chartOptions,
        areaChartSeries,
        donutChartOptions,
        newSeries,
        profit,
        losing,
        userDepo,
        allMoney,
        depoAndProfit,
      };
    }
}
</script>


<style>
    .graph-all {
        width: 100% !important;
        height: auto !important;
    }
    .vue-apexcharts {
        margin-top: 0px !important;
        margin-bottom: 0px !important;
    }
    .apexcharts-legend-text {
        color: #ffffffb2 !important;
        font-family: Montserrat !important;
        font-size: 14px !important;
        font-weight: 300 !important;
    }
    .apexcharts-legend {
        align-content: space-between !important;
        justify-content: space-between !important;
        margin: 0px 10px !important;
        min-height: 50px !important;
    }
    .apexcharts-menu {
        background: #1f1d28bf !important;
        border: 1px solid #1da4a4 !important;
        min-width: 120px !important;
    }
    .apexcharts-theme-light .apexcharts-menu-item:hover {
        background: #2ec8f929 !important;
    }
    #SvgjsG10787 {
        margin-left: -40px !important;
    }
</style>