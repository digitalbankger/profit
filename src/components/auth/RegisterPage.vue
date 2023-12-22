<template>
  <div class="height-head d-flex ai-center">
  <div class="col-md-12 m-tb-5">
    <div class="card card-container">
      <img
        id="profile-img"
        src="@/assets/svg/logo.svg"
        width="100"
      />
      <CustomForm @submit="handleRegister" :validation-schema="schema">
        <div v-if="!successful">
          <div class="form-group">
            <label for="username">Логин</label>
            <Field name="username" type="text" class="form-control" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <Field name="email" type="email" class="form-control" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>
          <!-- <div class="form-group form-promo">
            <label for="promoCode">Промокод</label>
            <Field name="promoCode" type="text" class="form-control" />
          </div> -->

          <div class="form-group mt-3">
            <button class="btn-gen m-auto" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              Зарегистрироваться
            </button>
          </div>
        </div>
      </CustomForm>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ message }}
      </div>
      <div v-if="successful === true">
        <RouterLink to="/login">Войти</RouterLink>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Form as CustomForm, Field, ErrorMessage } from "vee-validate";
import { useRouter } from "vue-router";
import * as yup from "yup";

export default {
  name: "RegisterPage",
  components: {
    CustomForm,
    Field,
    ErrorMessage,
  },
  setup() {
    const schema = yup.object().shape({
      username: yup
        .string()
        .required("Поле Логин обязательное!")
        .min(3, "Минимум 3 символа!")
        .max(20, "Максимум 20 символов!"),
      email: yup
        .string()
        .required("Поле Email обязательное!")
        .email("Email некорректный!")
        .max(50, "Максимум 50 символов!"),
      password: yup
        .string()
        .required("Поле Пароль обязательное!")
        .min(6, "Минимум 6 символов!")
        .max(40, "Максимум 40 символов!"),
    });

    const successful = ref(false);
    const loading = ref(false);
    const message = ref("");
    // const promoCode = ref(""); // Создаем реактивную переменную для промокода
    const router = useRouter();

    // Извлекаем параметр промокода из URL
    onMounted(() => {
      // const urlParams = new URLSearchParams(window.location.search);
      // const partnerParam = urlParams.get("partner");

      // // Если partnerParam не пустой, устанавливаем его в promoCode
      // if (partnerParam) {
      //   promoCode.value = partnerParam;
      // }

      // Другие действия при загрузке страницы
      if (successful.value) {
        router.push("/user");
      }
    });

    const handleRegister = (user) => {
      message.value = "";
      successful.value = false;
      loading.value = true;

      this.$store.dispatch("auth/register", user).then(
        (response) => {
          if (response.success === "registerSuccess") {
            this.message = "Регистрация прошла успешно";
            this.successful = true;
            console.log('reg succes')
          } else if (response === "emailDuplicated") {
            this.message = "Пользователь с таким email уже существует";
            this.successful = false;
            console.log('пользователь существует')
          } else if (response === "usernameDuplicated") {
            this.message = "Пользователь с таким логином уже существует";
            this.successful = false;
            console.log('пользователь существует')
          } else {
            this.message = "Что-то пошло не так";
            this.successful = false;
            console.log('чтоо то не так')
          }
          this.loading = false;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );

      loading.value = false;
    };

    return {
      schema,
      successful,
      loading,
      message,
      handleRegister,
    };
  },
};
</script>

<style>
.height-head {
  height: 100vh;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}


.card-container.card {
  background-color: #131219;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  border-radius: 20px;
  border: 2px solid #3ac0c0;
  border-top: none;
  border-bottom: none;
  box-shadow: 0px 2px 80px #3ac0c04d;
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  opacity: 0.6;
}

.error-feedback {
  color: red;
  text-align: center;
  font-size: 16px;
}
</style>