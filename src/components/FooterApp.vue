<template>
<footer class="footer section d-flex jc-center p-tb-1">
    <div class="container d-flex fd-column jc-space">
      <!-- <div class="d-flex fd-row m-col">
        <div class="col-4 mw-100 text-left">
          <p class="footer-head fw-500 text-light"><span style="color:#07A697;">coin</span>criptamat</p>
          <p class="footer-link text-light m-t-1 width-80">Покупайте криптовалюту быстро и безопасно на coin.criptamat.ru</p>
        </div>

        <div class="col-4 mw-100 text-left text-light">
          <p class="footer-head fw-500 mm-t-2">Меню</p>
          <ul class="d-flex fd-column">
            <li class="text-light footer-link"><router-link to="/crypto">Мой аккаунт</router-link></li>
            <li class="text-light footer-link"><router-link to="/login">Магазин</router-link></li>
            <li class="text-light footer-link"><router-link to="/login">Контакты</router-link></li>
          </ul>
        </div>
           
        <div class="col-4 mw-100 text-left text-light">
          <p class="footer-head fw-500 mm-t-2">О КОМПАНИИ</p>
          <ul class="d-flex fd-column">
            <li class="text-light footer-link"><router-link to="/crypto">ИП: Ревин А. А.</router-link></li>
            <li class="text-light footer-link"><router-link to="/login">ИНН: 773418095504</router-link></li>
            <li class="text-light footer-link"><router-link to="/login">ОГРНИП 323774600081239</router-link></li>
          </ul>
        </div>

        <div class="col-4 mw-100 text-left text-light">
          <p class="footer-head fw-500 mm-t-2">ПОЛЕЗНЫЕ ССЫЛКИ</p>
          <ul class="d-flex fd-column">
            <li class="text-light footer-link"><router-link to="/crypto">Партнерство</router-link></li>
            <li class="text-light footer-link"><router-link to="/login">AML проверка</router-link></li>
            <li class="text-light footer-link"><router-link to="/login">Проверка транзакций</router-link></li>
            <li class="text-light footer-link"><router-link to="/usdt">Политика конфиденциальности</router-link></li>
            <li class="text-light footer-link"><router-link to="/usdt">Договор оферты</router-link></li>
          </ul>
        </div>
        
      </div> -->
      <hr class="" style="width:100%; border-color:#7c849d45">
      <p class="text-mini text-mute text-center m-t-1">
        © ProfitWay 2023. Все права защищены.
      </p>
    </div>
  </footer>
</template>

<script>
export default {
    name: "FooterApp",
    data: () => ({

    })
 
}
</script>

<style scoped>
a {
  color: #fff !important;
}
.footer-link {
  padding-bottom: 5px;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.4;
}
.footer-head {
  margin-bottom: 14px;
  font-family: 'NeueMachina-Medium', sans-serif;
  text-transform: uppercase;
  font-size: 18px;
}
  /* footer {
    width: 100%;
    background-color: #111;
  } */
</style>
