<template>
  <div class="section user-table animate p-tb-3">
    <!-- Статистика -->
    <section class="d-flex fd-column ai-center jc-center p-1 p-relative">
      <div class="container d-flex fd-column p-1">
        <div class="d-flex fd-column jc-space ai-center z-index-1">
          <StatisticsForm />
        </div>
      </div>
    </section>

    <!-- TradingView chart -->
    <section class="d-flex fd-column ai-center jc-center p-1 p-relative">
      <div class="container d-flex fd-column p-1">
        <div class="d-flex fd-column ai-center width-100 p-tb-2 z-index-1">
          <TradingViewWidget />
        </div>
      </div>
    </section>

    <!-- RiskManager -->
    <section class="d-flex fd-column ai-center jc-center p-1 p-relative">
      <img src="@/assets/img/bg-abstract-revert.png" width="1000" class="bg-abstract-revert text-left p-absolut z-index-0">

      <div class="container d-flex fd-column p-1">
        <div class="d-flex fd-column jc-center text-center z-index-1 width-100">
          <h2 class="display-1 m-tb-2 pb-sm-3 text-light">Риск менеджер</h2>
          <RiskManager />
        </div>
      </div>
    </section>

    <!-- Пятый блок -->
    <section class="d-flex fd-column ai-center jc-center p-1 p-relative">
      <img src="@/assets/img/bg-abstract.png" width="1000" class="bg-abstract text-left p-absolut z-index-0">

      <div class="container d-flex fd-column p-1">
        <div class="d-flex fd-row jc-center p-t-3 text-center z-index-1">
          <h2 class="display-3 text-light">Журнал сделок</h2>
        </div>
      </div>

      <div class="d-flex fd-column p-1 ai-center z-index-1">
        <TradeJournal />
      </div>
    </section>
  </div>
</template>

<script>
import UserService from '@/services/user.service';
import TradeJournal from '@/components/journal/TradeJournal.vue';
import StatisticsForm from '@/components/statistics/StatisticsForm.vue';
import TradingViewWidget from '@/components/tv-chart/TradingViewWidget.vue';
import RiskManager from '@/components/risk-manager/RiskManager.vue';

export default {
  name: "UserPage",
  data() {
    return {
      user: null,
    };
  },
  components: {
    TradeJournal,
    TradingViewWidget,
    StatisticsForm,
    RiskManager,
  },
  mounted() {
    UserService.getUserBoard().then(
      (response) => {
        this.user = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
};
</script>

