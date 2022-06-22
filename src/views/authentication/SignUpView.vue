<!-- Author: Niels Torp Grønskov, s204510 -->
<!-- Description: The user sign up page -->

<template>
  <form onsubmit="return false">
    <img alt="" src="@/assets/logo.svg"/>
    <div>
      <animated-text-input ref="firstName" v-model="firstNameValue" label-text="First name"
                           @input="$refs.firstName.setError(v$.firstNameValue.$errors)"/>
    </div>
    <div>
      <animated-text-input ref="lastName" v-model="lastNameValue" label-text="Last name"
                           @input="$refs.lastName.setError(v$.lastNameValue.$errors)"/>
    </div>
    <div class="date">
      <label class="date-label">Date of birth
        <input ref="date" v-model="dateValue" class="date-picker" required type="date"/>
      </label>
    </div>
    <div>
      <animated-text-input ref="email" v-model="emailValue" label-text="E-mail"
                           @input="$refs.email.setError(v$.emailValue.$errors)"/>
    </div>
    <div>
      <animated-text-input ref="password" v-model="passwordValue" label-text="Password" type="password"
                           @input="$refs.password.setError(v$.passwordValue.$errors)"/>
    </div>
    <div>
      <animated-text-input ref="passwordRepeat" v-model="passwordRepeatValue" label-text="Repeat password"
                           type="password"
                           @input="$refs.passwordRepeat.setError(v$.passwordRepeatValue.$errors)"/>
    </div>
    <div>
      <primary-button type="submit" @click="onSignUpClick" text="Sign up"/>
    </div>
    <p>Or</p>
    <div class="sign-in-link">
      <a href="/sign-in">SIGN IN</a>
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
import animatedTextInput from "@/components/input/AnimatedTextInput.vue"
import {signIn, signUp} from "@/services/authentication";
import router from "@/index";
import {defineComponent} from "vue";
import useVuelidate from "@vuelidate/core";
import {email, required, sameAs} from "@vuelidate/validators";
import spinner from "@/components/Spinner.vue";
import failureIcon from "@/components/icons/FailureIcon.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";

export default defineComponent({
  components: {
    PrimaryButton,
    spinner,
    animatedTextInput,
    failureIcon
  },
  setup() {
    return {v$: useVuelidate()}
  },
  data() {
    return {
      firstNameValue: "",
      lastNameValue: "",
      dateValue: "",
      emailValue: "",
      passwordValue: "",
      passwordRepeatValue: "",
      loading: false
    }
  },
  validations() {
    return {
      firstNameValue: {required},
      lastNameValue: {required},
      dateValue: {
        required: required,
      },
      emailValue: {required, email},
      passwordValue: {required},
      passwordRepeatValue: {
        required: required,
        sameAs: sameAs(this.passwordValue)
      }
    }
  },
  methods: {
    onSignUpClick: async function () {
      this.v$.$touch();
      (this.$refs.firstName as typeof animatedTextInput).$emit('input');
      (this.$refs.lastName as typeof animatedTextInput).$emit('input');
      (this.$refs.email as typeof animatedTextInput).$emit('input');
      (this.$refs.password as typeof animatedTextInput).$emit('input');
      (this.$refs.passwordRepeat as typeof animatedTextInput).$emit('input');
      if (!this.v$.$invalid) {
        this.loading = true;
        (this.$refs.failureIcon as typeof failureIcon).setText('')

        const signUpResult = await signUp(this.emailValue, this.firstNameValue, this.lastNameValue, this.dateValue, this.passwordValue, this.passwordRepeatValue)
        if (signUpResult.success) {
          const signInResult = await signIn(this.emailValue, this.passwordValue)
          if (signInResult.success) {
            await router.push("/")
          } else {
            this.loading = false;
            (this.$refs.failureIcon as typeof failureIcon).setText(signInResult.errorMessage)
          }
        } else {
          this.loading = false;
          (this.$refs.failureIcon as typeof failureIcon).setText(signUpResult.errorMessage)
        }
      }
    },
  }
})
</script>

<style scoped>
div {
  display: block;
  margin: auto;
  padding: 0.2em;
}

img {
  width: 175px;
  height: 175px;
  display: flex;
  margin: auto;
  padding: 2rem;
}

.date {
  display: flex;
  margin: auto;
  justify-content: center;
}

p {
  top: 3rem;
  text-align: center;
}

div a {
  text-decoration: underline;
}

.sign-in-link {
  margin-top: 2.75rem;
  font-size: 0.8rem;
  text-align: center;
}

.spinner-container {
  margin-top: 1rem;
}

</style>
