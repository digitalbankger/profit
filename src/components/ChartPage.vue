<template>
    <!-- RiskManager -->
    <section class="d-flex fd-column ai-center jc-center p-1 p-relative">
      <img src="@/assets/img/bg-abstract-revert.png" width="700" class="bg-abstract-revert text-left p-absolut z-index-0">

      <div class="container d-flex fd-column p-1 pm-0">
        <div class="d-flex fd-column jc-center text-center z-index-1 width-100">
          <h2 class="display-1 sec-head m-tb-2 pb-sm-3 text-light">Риск менеджер</h2>
          <RiskManager />
        </div>
      </div>
    </section>

    <!-- TradingView chart -->
    <section class="d-flex fd-column ai-center jc-center p-1 p-relative">
      <div class="container d-flex fd-column p-1pm-0">
        <div class="d-flex fd-column ai-center width-100 p-tb-2 z-index-1">
          <TradingViewWidget />
        </div>
      </div>
    </section>

</template>

<script>
import TradingViewWidget from '@/components/tv-chart/TradingViewWidget.vue';
import RiskManager from '@/components/admin-stat/RiskManager.vue';

export default {
  components: {
    TradingViewWidget,
    RiskManager
  },
  setup() {

    return { 
    };
  },
};
</script>

<style>
</style>