<template>
  <div class="section animate">
    <div class="general d-flex jc-center" :style="{ backgroundImage: 'url(' + require('@/assets/img/bg.jpg') + ')'}">
      <div class="container d-flex m-col first-screen m-jc-center fd-row ai-end jc-center mp-tb-3">

      </div>
    </div>

    <!-- Третий блок -->
    <!-- <section class="d-flex jc-center">
      <div class="container d-flex fd-row m-col ai-start jc-space p-tb-3 text-center m-text-left">
        <div class="col-3 mw-100">
          <h4 class="pb-2 pb-sm-3">ПРОЗРАЧНОСТЬ</h4>
          <p class="fs-15 fw-300 m-t-1 m-b-2">Криптовалюта абсолютно законна, вы можете легко и без каких либо последствий пользоваться нашими услугами</p>
        </div>
        <div class="col-3 mw-100">
          <h4 class="pb-2 pb-sm-3">ПРОСТОТА ИСПОЛЬЗОВАНИЯ</h4>
          <p class="fs-15 fw-300 m-t-1 m-b-2">Мы сделали покупку криптовалюты максимально легкой для наших клиентов</p>
        </div>
        <div class="col-3 mw-100">
          <h4 class="pb-2 pb-sm-3">РАСШИРЕНИЕ ГРАНИЦ</h4>
          <p class="fs-15 fw-300 m-t-1 m-b-2">Пользуясь крипто продуктами у вас появляется возможность взаимодействия по всему миру</p>
        </div>
      </div>
    </section> -->

    <!-- Четвертый блок -->
    <!-- <section class="d-flex jc-center" style="background-color: black;">
      <div class="container d-flex fd-row m-col jc-center ai-center jc-space p-tb-5">

        <div class="col-2 mw-100 d-flex jc-start p-relative video-background">
          <video ref="videoPlayer" autoplay loop muted width="800">
            <source :src="videoSrc" type="video/mp4">
          </video>
        </div>

        <div class="col-2 mw-100 d-flex fd-column text-left steps-text">
            <div class="display-1 number pb-2 pb-sm-3 text-light opacity-05 m-t-1">№1</div>
            <h2 class="display-3 pb-2 pb-sm-3 text-light">Bitcoin And Trading!</h2>
            <p class="text-mini text-light fw-300 m-t-1 m-b-2">Bitcoin is the currency of the future. In order to understand it and be aware of the formation of its price, I advise you to engage in trading.<br><br>Trading is also an opportunity to become financially independent if you approach it wisely.</p>
        </div>

      </div>
    </section> -->

  <!-- Четвертый №2 блок -->
  <section class="d-flex fd-column jc-center ai-center p-relative">
    <!-- <img src="@/assets/img/frame.png" width="550" class="frame"/>
    <img src="@/assets/svg/circle.svg" width="350" class="blure"/>

    <div class="container d-flex fd-column jc-center ai-center p-tb-3 m-t-5 z-index-1">

      <div class="w-100 d-flex fd-column text-center steps-text">
          <h1 class="display-1 gen-head pt-3 pb-sm-3 text-light" >ТОРГОВЫЙ ЖУРНАЛ</h1>
          <div class="display-4 gen-desc number pb-2 pb-sm-3 curtext">ВАШ ПУТЬ К УСПЕШНОЙ ТОРГОВЛЕ</div>
      </div>

      <div class="ymw-100 d-flex jc-center p-relative">
        <img src="@/assets/img/general1.png" class="width-90 coin-btc text-right">
      </div>

    </div> -->

    <div class="container d-flex fd-row jc-center ai-center">
        <div class="box">
            <div class="content-para d-flex fd-row ai-center"><img src="@/assets/svg/check.svg" width="25" class="opacity-04 m-r-05"/> Усреднение от &lt; к ></div>
        </div>
        <div class="box">
            <div class="content-para d-flex fd-row ai-center"><img src="@/assets/svg/check.svg" width="25" class="opacity-04 m-r-05"/>Диверсификация</div>
        </div>
        <div class="box">
            <div class="content-para d-flex fd-row ai-center"><img src="@/assets/svg/check.svg" width="25" class="opacity-04 m-r-05"/>Профит</div>
        </div>
    </div>


  </section>

    <section class="d-flex fd-column jc-center ai-center">

      <div class="container d-flex fd-row m-col jc-center ai-center jc-space p-tb-3 m-t-3 z-index-1">

        <div class="col-2 mw-100 d-flex jc-start p-relative">
          <img src="@/assets/img/sec3.png" width="600" class="text-left z-index-0">
        </div>

        <div class="col-2 mw-100 d-flex fd-column text-left steps-text">
            <h2 class="display-1 sec-head pb-2 pb-sm-3 text-light">Инвестируй <br>как умные дяди</h2>
            <p class="text-mini sec-desc text-light fw-300 m-t-1 m-b-2">Поскольку мы уже одной ногой наступили в будущее, я являюсь сторонником инвестирования в высокотехнологичные компании с прозрачными цифрами и цифровые активы.<br><br>Лично я еще не обладаю достаточно внушительным капиталом и пока инвестирую только в криптовалюту.</p>
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