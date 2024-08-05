<template>
  <div class="risk-block animate width-100 m-tb-1">
    <div class="d-flex fd-row jc-space m-tb-2">
      <div @click="setLong" :class="{'tab tab-active-long text-center col-2 fw-500': !isShort, 'tab text-center col-2': isShort}">Long позиция</div>
      <div @click="setShort" :class="{'tab tab-active-short text-center col-2 fw-500': isShort, 'tab text-center col-2': !isShort}">Short позиция</div>
    </div>

    <div class="d-flex fd-row jc-space m-tb-2">
      <div @click="setDayTrading" :class="{'tab tab-active-day text-center col-2 fw-500 bg-white': !isSwing, 'tab text-center col-2': isSwing}">Дейтрейдинг</div>
      <div @click="setSwingTrading" :class="{'tab tab-active-swing text-center col-2 fw-500 bg-white': isSwing, 'tab text-center col-2': !isSwing}">Свинг-трейдинг</div>
    </div>

    <div class="d-flex fd-row jc-space">
      <div class="col-2 d-flex fd-column jc-space">
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80">
          <span class="fs-18 m-b-05">Ваши средства</span>
          <span class="display-digits">{{ depoAndProfit }} $</span>
        </div>
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80">
          <span class="fs-18 m-b-05">Риск на сделку</span>
          <span class="display-digits">{{ riskPerTrade }} $</span>
        </div>
        <div class="d-flex fd-column card card-risk p-1 text-left m-b-1 width-80">
          <span class="fs-18 m-b-05">Риск на день</span>
          <span class="display-digits">{{ dailyRisk }} $</span>
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

        <button @click="calculateRecommendedStopLoss" class="btn-gen m-tb-2">Рассчитать</button>

        <div class="card-risk ai-center p-l-1 rounded-10">
          <p class="text-mini text-light fw-300 m-t-1 m-b-2 text-left">Если хотите опустить стоп-приказ ниже, понизьте плечо.</p>

          <div class="d-flex fd-row jc-space ai-center">
            <span class="fs-18 m-b-05">Рекомендуемая сумма сделки:</span>
            <span class="display-digits">{{ tradeSize.toFixed(0) }}</span>
          </div>
          <div class="d-flex fd-row jc-space ai-center">
            <span class="fs-18 m-b-05">Рекомендуемый Stop Loss ({{ riskPercentage }}%)</span>
            <span class="display-digits">{{ recommendedStopLossValue.toFixed(0) }}</span>
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
    const entryPoint = ref();
    const leverage = ref(5);
    const isShort = ref(false);
    const isSwing = ref(false);  // Добавлен флаг для режима свинг-трейдинга
    const depoAndProfit = ref(0);
    const userDepo = ref(null);
    const corDepo = ref(null);
    const allMoney = ref(null);
    const btcPrice = ref(0);
    const telegramToken = '6558424850:AAGddwg9Lo6IE8BO7P9w5BFrAE8T94QyqWE';
    const chatId = '-1002244312489';

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

    const sendSetupToTelegram = () => {
      const message = `
        Режим: ${isSwing.value ? '*Свинг-трейдинг*' : '*Дейтрейдинг*'} \n
        *Позиция:* ${isShort.value ? 'Short' : 'Long'}      *Плечо:* ${leverage.value}x \n
        *Цена входа:* ${entryPoint.value}
        *Сумма сделки:* ${tradeSize.value} $
        *Сумма сделки в BTC:* ${tradeSizeInBtc.value.toFixed(6)} BTC
        *Рекомендуемый Stop Loss:* ${(recommendedStopLossValue.value).toFixed(0)} \n
        *Риск на сделку:* ${riskPerTrade.value} $ (${riskPercentage.value}%)
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
      calculateRecommendedStopLoss,
      sendSetupToTelegram,
      recommendedStopLossValue,
      range,
      depoAndProfit,
      riskPerTrade,
      dailyRisk,
      riskPercentage,
      btcPrice
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
