<template>
  <header :class="{ 'header': true, 'header-scrolled': isScrolled }" class="header d-flex jc-center">
    <div class="container d-flex fd-row ai-center w-100 jc-space p-tb-05">
      <router-link to="/"><img src="@/assets/svg/logo.svg" width="100" class="logo-img"></router-link>

      <ul class="d-flex fd-row desktop-menu" v-if="!isMobile">
        <li class="menu-gen-link text-light p-lr-1"><router-link to="/crypto">Обо мне</router-link></li>
        <li class="menu-gen-link text-light p-lr-1"><router-link to="/usdt">Статистика</router-link></li>
        <li class="menu-gen-link text-light p-lr-1"><router-link to="/login">Портфель</router-link></li>
      </ul>
      <div class="d-flex fd-row">
        <div class="text-mini m-l-1 d-flex fd-row ai-center">
          <div v-if="currentUser" class="text-mini m-l-1">
            <button @click="handleLogout">Выход</button>
          </div>
          <div v-else class="text-mini m-r-1 d-flex ai-center">
            <img src="@/assets/svg/user.svg" width="40" class="m-r-1-05 pointer"><router-link to="/login">Вход</router-link>
          </div>

          <a v-if="!isMobile" href="" class="btn-gen fw-400 d-flex fd-row ai-center"><img src="@/assets/svg/telegram.svg" width="20" class="m-r-05"><p>Телеграм канал</p></a>

        </div>
        <div class="mobile-menu-icon m-l-1 d-flex jc-center" v-if="isMobile" @click="isMenuOpen = !isMenuOpen">
            <img src="@/assets/img/menu.svg" width="30">
        </div>
      </div>
    </div>
  </header>

  <div class="mobile-menu text-right" :class="{ 'open': isMenuOpen }">
    <span class="close-menu d-block text-light text-left" @click="closeMobileMenu">✕</span>
    <ul class="mobile-menu-list">
      <li class="p-tb-1"><router-link to="/">О нас</router-link></li>
      <li class="p-b-1"><router-link to="/">Для кого</router-link></li>
      <li class="p-b-1"><router-link to="/">Риск-менеджер</router-link></li>
      <li class="p-b-1"><router-link to="/">Журнал</router-link></li>
    </ul>
    <a href="" class="btn-gen fw-400 d-flex fd-row ai-center"><img src="@/assets/svg/telegram.svg" width="20" class="m-r-05"><p>Телеграм канал</p></a>    
  </div>
</template>

<script>
import EventBus from "@/common/EventBus";
import { reactive, onMounted, ref } from 'vue';

export default {
  components: {
  },
  props: {
    currentUser: Object,
  },
  setup() {

    const isMobile = ref(false);
    const isMenuOpen = ref(false);



    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768; 
    };
    const closeMobileMenu = () => {
      isMenuOpen.value = false;
    };


    const state = reactive({
      isLoggedIn: false,
    });

    const handleLogout = () => {
      EventBus.dispatch("logout");

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

    const isScrolled = ref(false);

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 0;
    };

    onMounted(() => {
      handleResize(); 
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);

    });

    const toggleMobileMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };


    return { isMobile, isMenuOpen, closeMobileMenu, toggleMobileMenu, state, handleLogout, isScrolled };
  },
};
</script>

<style scoped>
.header {
  transition: background-color 0.4s ease;
  position: fixed;
  width: 100%;
}

.header-scrolled {
  background-color: #152b31;
  -webkit-box-shadow: 0px 4px 5px 0px rgba(16, 18, 21, 0.536);
  -moz-box-shadow: 0px 4px 5px 0px rgba(16, 18, 21, 0.536);
  box-shadow: 0px 4px 5px 0px rgba(16, 18, 21, 0.536);
}
.header {
  position: fixed;
  width: 100%;
}

.btn-gen {
  padding: 8px 12px;
  font-size: 16px;
  /* background-color: black; */
  border: none;
}
.btn-head {
  border: 1px solid #ffffff;
  border-radius: 10px;
  padding: 6px 16px;
}
.btn-sec {
  padding: 8px;
  font-size: 16px;
  border: none;
}
.phone-text {
  font-size: 12px;
  font-weight: 200;
}
.phone-img {
  margin-right: 10px;
}

/* Стили для корзины */

.cart-icon {
  cursor: pointer;
}

.cart-items-count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #07A697;
  color: #fff;
  padding: 2px 6px;
  border-radius: 50%;
}
.donation-btn {
  background-color: #fff;
  padding: 8px;
  border-radius: 6px;
}

.marquee {
  width: 100%;
  overflow: hidden;
}

.text-container {
  white-space: nowrap;
  animation: marquee 20s linear infinite; /* Начальное значение для анимации */
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>