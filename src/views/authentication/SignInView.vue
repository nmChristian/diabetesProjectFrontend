<!-- Author: Niels Torp Grønskov, s204510 -->
<!-- Description: The user sign-in page -->

<template>
  <form onsubmit="return false">
    <img alt="" src="@/assets/logo.svg"/>
    <div>
      <animated-text-input ref="email" v-model='emailValue' label-text="E-mail"
                           @input="$refs.email.setError(v$.emailValue.$errors)"/>
    </div>
    <div>
      <animated-text-input ref="password" v-model='passwordValue' label-text="Password" type="password"
                           @input="$refs.password.setError(v$.passwordValue.$errors)"/>
    </div>
    <div class="forgot-link">
      <a href="https://example.com">Forgot your password?</a>
    </div>
    <div>
      <primary-button type="submit" @click="onSignInClick" text="Sign in"/>
    </div>
    <p>Or</p>
    <div class="sign-up-link">
      <a href="/sign-up">SIGN UP</a>
    </div>
    <div class="spinner-container">
      <spinner v-show="loading"></spinner>
    </div>
    <div>
      <failure-icon ref="failureIcon"></failure-icon>
    </div>
  </form>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import animatedTextInput from "@/components/input/AnimatedTextInput.vue"
import {signIn} from "@/services/authentication";
import router from "@/index";
import useVuelidate from "@vuelidate/core";
import {email, required} from '@vuelidate/validators'
import spinner from "@/components/Spinner.vue";
import failureIcon from "@/components/icons/FailureIcon.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";

export default defineComponent({
  name: "sign-in",
  components: {
    PrimaryButton,
    spinner,
    animatedTextInput,
    failureIcon
  },
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  data() {
    return {
      emailValue: "",
      passwordValue: "",
      loading: false
    }
  },
  validations() {
    return {
      emailValue: {required, email},
      passwordValue: {required}
    }
  },
  methods: {
    onSignInClick: async function () {
      this.v$.$touch();
      (this.$refs.password as typeof animatedTextInput).$emit('input');
      (this.$refs.email as typeof animatedTextInput).$emit('input');
      if (!this.v$.$invalid) {
        this.loading = true;
        (this.$refs.failureIcon as typeof failureIcon).setText('')

        const result = await signIn(this.emailValue, this.passwordValue)
        if (result.success) {
          await router.push("/")
        } else {
          this.loading = false;
          (this.$refs.failureIcon as typeof failureIcon).setText(result.errorMessage)
        }
      }
    }
  }

});
</script>

<style scoped>
img {
  width: 175px;
  height: 175px;
  display: flex;
  margin: auto;
  padding: 2rem;
}

div {
  margin: auto;
  padding: 0.2em;
}

p {
  top: 3em;
  text-align: center;
}

div a {
  text-decoration: underline;
}

.spinner-container {
  margin-top: 3rem;
}

.forgot-link {
  top: -0.6rem;
  padding-left: 12rem;
  font-size: 0.8em;
  text-align: center;

}

.sign-up-link {
  top: 3.5em;
  font-size: 0.8em;
  text-align: center;
}

</style>
