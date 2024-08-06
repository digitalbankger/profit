<template>
  <div class="risk-block animate width-100 m-tb-1">
    <div class="d-flex fd-row jc-space m-tb-2">
      <div @click="setLong" :class="{'tab tab-active-long text-center col-2 fw-500': !isShort, 'tab text-center col-2': isShort}">Long позиция</div>
      <div @click="setShort" :class="{'tab tab-active-short text-center col-2 fw-500': isShort, 'tab text-center col-2': !isShort}">Short позиция</div>
    </div>

    <div class="d-flex fd-row jc-space m-tb-2">
      <div @click="setDayTrading" :class="{'tab tab-active-day text-center col-2 fw-500 bg-white regim': !isSwing, 'tab text-center col-2 regim': isSwing}">Дейтрейдинг</div>
      <div @click="setSwingTrading" :class="{'tab tab-active-swing text-center col-2 fw-500 bg-white regim': isSwing, 'tab text-center col-2 regim': !isSwing}">Свинг-трейдинг</div>
    </div>

    <div class="d-flex fd-row jc-space md-col">
      <div class="col-2 mcol-1 d-flex fd-column jc-start gap-3">
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80 mw-100">
          <span class="fs-18 m-b-05">Ваши средства</span>
          <span class="display-digits">{{ depoAndProfit }} $</span>
        </div>
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80 mw-100">
          <span class="fs-18 m-b-05">Риск на сделку</span>
          <span class="display-digits">{{ riskPerTrade }} $</span>
        </div>
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80 mw-100">
          <span class="fs-18 m-b-05">Риск на день</span>
          <span class="display-digits">{{ dailyRisk }} $</span>
        </div>
      </div>

      <div class="col-2 mcol-1 d-flex fd-column jc-space">
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

          <div class="d-flex fd-row jc-space gap-3 m-tb-1">
            <div class="">
              <span class="sl-rec fs-18">Тейк профит 1 (70%):</span>
              <input v-model="takeProfit1" class="form-control m-t-05" type="number" />
            </div>
            <div class="">
              <span class="sl-rec fs-18">Тейк профит 2 (100%):</span>
              <input v-model="takeProfit2" class="form-control m-t-05" type="number" />
            </div>
          </div>
        </div>

        <button @click="calculateValues" class="btn-gen m-tb-2">Рассчитать</button>

        <div class="card-risk ai-center p-l-1 rounded-10">
          <p class="text-mini text-light fw-300 m-t-1 m-b-2 text-left">Если хотите опустить стоп-приказ ниже, понизьте плечо.</p>

          <div class="d-flex fd-row jc-space ai-center">
            <span class="sl-rec fs-18">Рекомендуемая сумма сделки:</span>
            <span class="display-digits">{{ tradeSize.toFixed(0) }}</span>
          </div>
          <div class="d-flex fd-row jc-space ai-center">
            <span class="sl-rec fs-18">Рекомендуемый Stop Loss ({{ riskPercentage }}%)</span>
            <span class="display-digits">{{ recommendedStopLossValue.toFixed(0) }}</span>
          </div>

          <div class="d-flex fd-row gap-3">
            <div class="col-2 m-t-1 d-flex fd-row jc-space ai-center">
              <span class="fs-18 m-r-2">TP 1:</span>
              <span class="display-digits">{{ formattedTakeProfit1 }}</span>
            </div>
            <div class="col-2 m-t-1 d-flex fd-row jc-space ai-center">
              <span class="fs-18 m-r-2">TP 2:</span>
              <span class="display-digits">{{ formattedTakeProfit2 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button @click="sendSetupToTelegram" class="btn-sec m-t-5 mx-auto">Отправить сетап</button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useApi } from '@/api/api.js';
import axios from 'axios';

export default {
  setup() {
    const { fetchStat } = useApi();
    const entryPoint = ref(0);
    const leverage = ref(5);
    const isShort = ref(false);
    const isSwing = ref(false); 
    const depoAndProfit = ref(0);
    const userDepo = ref(0);
    const corDepo = ref(0);
    const allMoney = ref(0);
    const btcPrice = ref(0);
    const telegramToken = '';
    const chatId = '';
    const takeProfit1 = ref();
    const takeProfit2 = ref();

    const recommendedTakeProfit1 = ref(0);
    const recommendedTakeProfit2 = ref(0);

    const fetchBtcPrice = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        btcPrice.value = response.data.bitcoin.usd;
      } catch (error) {
        console.error('Error fetching BTC price:', error);
      }
    };

    const fetchStatData = async () => {
      try {
        const response = await fetchStat(1);
        const tradesData = response.Trades;

        userDepo.value = response.UserDepo || 0;
        corDepo.value = response.CorrectDepo || 0;
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
  
    onMounted(() => {
      fetchStatData();
      fetchBtcPrice();
    });

    const riskPercentage = computed(() => (isSwing.value ? 1 : 0.5));  // 1% для свинг-трейдинга и 0.5% для дейтрейдинга

    const tradeSize = computed(() => {
      return depoAndProfit.value * 0.03;
    });

    const tradeSizeInBtc = computed(() => {
      if (btcPrice.value === 0) return 0;
      return (tradeSize.value / btcPrice.value) * leverage.value;
    });

    const riskPerTrade = computed(() => {
      return ((depoAndProfit.value / 100) * riskPercentage.value).toFixed(0);
    });

    const dailyRisk = computed(() => {
      return (riskPerTrade.value * 5).toFixed(0);
    });

    const recommendedStopLossValue = ref(0);

    const calculateRecommendedStopLoss = () => {
      const riskFromDepo = riskPercentage.value / 100;
      const lossStep = (((depoAndProfit.value * riskFromDepo) / (leverage.value * tradeSize.value)) * 100).toFixed(3);
      let stopLoss;
      if (isShort.value) {
        stopLoss = entryPoint.value + ((entryPoint.value * lossStep) / 100);
      } else {
        stopLoss = entryPoint.value - ((entryPoint.value * lossStep) / 100);
      }

      recommendedStopLossValue.value = stopLoss;
    };

    const calculateTakeProfits = () => {
      let tradeSize70 = tradeSize.value * 0.7;

      let movingPercentShort70 = (100 - ((takeProfit1.value / entryPoint.value) * 100)) * leverage.value;
      let movingPercentLong70 = ((takeProfit1.value - entryPoint.value) / entryPoint.value) * 100;

      let movingPercentShort100 = (100 - ((takeProfit2.value / entryPoint.value) * 100)) * leverage.value;
      let movingPercentLong100 = ((takeProfit2.value - entryPoint.value) / entryPoint.value) * 100;

      if (isShort.value) {
        recommendedTakeProfit1.value = tradeSize70 * (movingPercentShort70 / 100);
        recommendedTakeProfit2.value = tradeSize.value * (movingPercentShort100 / 100);
      } else {
        recommendedTakeProfit1.value = ((tradeSize70 * leverage.value) * movingPercentLong70) / 100;
        recommendedTakeProfit2.value = ((tradeSize.value * leverage.value) * movingPercentLong100) / 100;
      }
    };

    const calculateValues = () => {
      calculateRecommendedStopLoss();
      calculateTakeProfits();
    };

    const formattedTakeProfit1 = computed(() => {
      return recommendedTakeProfit1.value ? recommendedTakeProfit1.value.toFixed(2) : '0.00';
    });

    const formattedTakeProfit2 = computed(() => {
      return recommendedTakeProfit2.value ? recommendedTakeProfit2.value.toFixed(2) : '0.00';
    });

    const sendSetupToTelegram = () => {
      const message = `
        *Режим:* ${isSwing.value ? 'Свинг-трейдинг' : 'Дейтрейдинг'}\n
        *Позиция:* ${isShort.value ? 'Short' : 'Long'}\n
        *Плечо:* ${leverage.value}x      *Цена входа:* ${entryPoint.value}\n   
        *Сумма сделки:* ${tradeSize.value.toFixed(0)} $
        *Сумма сделки в BTC:* ${tradeSizeInBtc.value.toFixed(6)} BTC\n
        *Рекомендуемый Stop Loss:* ${recommendedStopLossValue.value.toFixed(0)}
        *Риск на сделку:* ${riskPerTrade.value} $ - (\n
        *Тейк профит (100%):*  *${takeProfit2.value}* - ${formattedTakeProfit2.value} $
        *Тейк профит (70%):* *${takeProfit1.value}* - ${formattedTakeProfit1.value} $      
      `;
      axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
      .then(response => {
        console.log('Message sent successfully:', response);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
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

    const setDayTrading = () => {
      isSwing.value = false;
    };

    const setSwingTrading = () => {
      isSwing.value = true;
    };

    return {
      leverage,
      tradeSize,
      tradeSizeInBtc,
      entryPoint,
      isShort,
      isSwing,
      setLong,
      setShort,
      setDayTrading,
      setSwingTrading,
      calculateValues,
      sendSetupToTelegram,
      recommendedStopLossValue,
      formattedTakeProfit1,
      formattedTakeProfit2,
      takeProfit1,
      takeProfit2,
      range,
      depoAndProfit,
      riskPerTrade,
      dailyRisk,
      riskPercentage,
      btcPrice,
    };
  },
};
</script>

<style>
.risk-block {
  background-color: #1f1d28;
  border-radius: 10px;
  padding: 20px;
}
.tab {
  background-color: #fc0101;
  cursor: pointer;
  color: #fff;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 10px;
}
.tab-active {
  background-color: #1da4a4;
  box-shadow: none;
}
.card-risk {
  border-left: 2px solid #1da4a4;
}

.style-el {
  border-left: 1px solid #1da4a4;
  border-bottom: 1px solid #1da4a4;
  box-shadow: rgba(13, 16, 18, 0.56) 0px 0px 26px 3px;
}
</style>
