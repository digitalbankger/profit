<template>
  <div class="section animate">
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

    <!-- Пятый блок -->
    <section class="d-flex fd-column ai-center jc-center p-1 p-relative">
      <div class="container d-flex fd-column p-1 pm-0">
        <div class="d-flex fd-column jc-space ai-center z-index-1">
          <StatisticsForm />
        </div>
      </div>
    </section>

    <!-- Пятый блок -->
    <section class="d-flex fd-column ai-center jc-center p-1 p-relative">
      <img src="@/assets/img/bg-abstract.png" width="800" class="bg-abstract text-left p-absolut z-index-0">

      <div class="d-flex fd-column p-1 ai-center z-index-1">
        <TradeJournalAdmin @open-lightbox="openLightbox"/>
      </div>
    </section>

    <div v-if="isLightboxOpen" class="light-over">
      <div class="lightbox">
        <div class="lightbox-content">
          <img :src="lightboxImageSrc" alt="Изображение сделки" class="light-img"/>
          <span @click="closeLightbox" class="close-lightbox-button">X</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import TradeJournalAdmin from '@/components/admin-stat/TradeJournalAdmin.vue';
import StatisticsForm from '@/components/admin-stat/statistics/StatisticsForm.vue';
import TradingViewWidget from '@/components/tv-chart/TradingViewWidget.vue';
import RiskManager from '@/components/admin-stat/RiskManager.vue';

export default {
  components: {
    TradeJournalAdmin,
    TradingViewWidget,
    StatisticsForm,
    RiskManager
  },
  setup() {

    const isLightboxOpen = ref(false);
    const lightboxImageSrc = ref('');

    const openLightbox = (imageSrc) => {
      isLightboxOpen.value = true;
      lightboxImageSrc.value = imageSrc;
    };

    const closeLightbox = () => {
      isLightboxOpen.value = false;
      lightboxImageSrc.value = '';
    };

    const state = reactive({
      isLoggedIn: false,
    });

    const handleLogout = () => {
      this.$emit('logout-request');
    };

    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          state.isLoggedIn = true;
        } catch (error) {
          handleLogout();
        }
      }
    };


    checkLoggedIn();

    return { 
      state, 
      handleLogout,

      isLightboxOpen,
      lightboxImageSrc,
      openLightbox,
      closeLightbox
    };
  },
};
</script>

<style>
</style>