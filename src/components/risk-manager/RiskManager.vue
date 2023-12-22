<template>
  <div class="risk-block animate width-100 m-tb-1">
    <div class="d-flex fd-row jc-space m-tb-2">
      <div @click="setLong" :class="{'tab tab-active-long text-center col-2 fw-500': !isShort, 'tab text-center col-2': isShort}">Long позиция</div>
      <div @click="setShort" :class="{'tab tab-active-short text-center col-2 fw-500': isShort, 'tab text-center col-2': !isShort}">Short позиция</div>
    </div>

    <div class="d-flex fd-row jc-space">

      <div class="col-2 d-flex fd-column jc-space">
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80">
            <span class="fs-18 m-b-05">Ваши средства</span>
            <span class="display-digits ">{{ depoAndProfit }} $</span>
            <span class="fs-15 text-mute">10000 ₽</span>
        </div>
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80">
            <span class="fs-18 m-b-05">Риск на сделку</span>
            <span class="display-digits ">{{ (depoAndProfit / 100 / 2).toFixed(0) }} $</span>
            <span class="fs-15 text-mute">100 ₽</span>
        </div>
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80">
            <span class="fs-18 m-b-05">Риск на день</span>
            <span class="display-digits ">{{ (depoAndProfit / 100 / 2 * 5).toFixed(0) }} $</span>
            <span class="fs-15 text-mute">450 ₽</span>
        </div>
      </div>

      <div class="col-2 d-flex fd-column jc-space">
        <div>
          <div>
            <span class="fs-18">Баланс счета:</span>
            <input v-model="depoAndProfit" class="form-control m-t-05" id="accountBalance" type="number" />
          </div>
          <div>
            <span class="fs-18">Плечо (мин. 1x, макс. 20x):</span>
            <select v-model="leverage" class="form-control-select m-t-05">
              <option v-for="value in range(1, 20)" :key="value" :value="value">{{ value }}x</option>
            </select>
          </div>
          <div>
            <span class="fs-18">Цена входа:</span>
            <input v-model="entryPoint" class="form-control m-t-05" id="entryPoint" type="number" />
          </div>
        </div>

        <button @click="calculateRecommendedStopLoss" class="btn-gen m-tb-1">Рассчитать</button>

        <div class="card-risk ai-center p-l-1 rounded-10">
          <p class="text-mini text-light fw-300 m-t-1 m-b-2 text-left">Если хотите опустить стоп-приказ ниже, понизьте плечо.</p>

          <div class="d-flex fd-row jc-space ai-center">
            <span class="fs-18 m-b-05">Рекомендуемая сумма сделки:</span>
            <span class="display-digits ">{{ tradeSize.toFixed(0) }}</span>
          </div>
          <div class="d-flex fd-row jc-space ai-center">
            <span class="fs-18 m-b-05">Рекомендуемый Stop Loss (-0.5%)</span>
            <span class="display-digits ">{{ recommendedStopLossValue }}</span>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useApi } from '@/api/api.js';

export default {
  setup() {
    const { fetchStat } = useApi();
    const entryPoint = ref();
    const leverage = ref(5);
    const isShort = ref(false);
    const depoAndProfit = ref(0);
    const userDepo = ref(null);
    const corDepo = ref(null);
    const allMoney = ref(null);

    const store = useStore();
    const userId = ref(null);

    const fetchCurrentUser = () => {
      userId.value = store.state.auth.user.user.ID;
    };

    const fetchStatData = async () => {
      try {
        const response = await fetchStat(userId.value);
        const tradesData = response.Trades;

        corDepo.value = response.CorrectDepo;    
        allMoney.value = userDepo.value + corDepo.value;
              
        let totalProfit = 0;
        let totalCommission = 0;

        tradesData.forEach((trade) => {
          totalProfit += trade.PNLUSDT;
          totalCommission += trade.CommissionAmount;
        });
        depoAndProfit.value = allMoney.value + totalProfit - totalCommission;

      } catch (error) {
        console.error(error);
      }
    };

    onBeforeMount(() => {
      fetchCurrentUser();
    });
  
    onMounted(() => {
      fetchStatData();
    });

    const tradeSize = computed(() => {
      return depoAndProfit.value * 0.03;
    });

    const recommendedStopLossValue = ref(0);

    const calculateRecommendedStopLoss = () => {
      const riskFromDepo = 0.005;
      const lossStep = (((depoAndProfit.value / 100) * riskFromDepo) / (leverage.value * tradeSize.value) * 100).toFixed(3);
      let stopLoss;
      if (isShort.value) {
        stopLoss = entryPoint.value + ((entryPoint.value * (lossStep * 100)) / 100);
      } else {
        stopLoss = entryPoint.value - ((entryPoint.value * (lossStep * 100)) / 100);
      }

      recommendedStopLossValue.value = stopLoss;
    };

    function range(start, end) {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    const setLong = () => {
      isShort.value = false;
    };

    const setShort = () => {
      isShort.value = true;
    };

    return {
      leverage,
      tradeSize,
      entryPoint,
      isShort,
      setLong,
      setShort,
      calculateRecommendedStopLoss,
      recommendedStopLossValue,
      range,
      depoAndProfit
    };
  },
};
</script>

<style>

</style>
