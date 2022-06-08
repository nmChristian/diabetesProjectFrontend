<template>
	<img src="@/assets/logo.svg" width="250" height="250" alt=""/>
	<div>
		<animated-text-input label-text="E-mail" v-model='emailValue' ref="email"
							 @input="$refs.email.setError(v$.emailValue.$errors)"/>
	</div>
	<div>
		<animated-text-input label-text="Password" type="password" v-model='passwordValue' ref="password"
							 @input="$refs.password.setError(v$.passwordValue.$errors)"/>
	</div>
	<div class="forgot-link">
		<a href="https://example.com">Forgot your password?</a>
	</div>
	<div>
		<button class="sign-in-button" @click="onSignInClick">Sign-in</button>
	</div>
	<p>Or</p>
	<div class="sing-up-link">
		<a href="/sign-up">SIGN UP</a>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import animatedTextInput from "../../components/input/AnimatedTextInput.vue"
import {signIn} from "@/services/authentication";
import router from "@/router";
import useVuelidate from "@vuelidate/core";
import {required, email} from '@vuelidate/validators'

export default defineComponent({
	name: "sign-in",
	components: {
		animatedTextInput
	},
	setup() {
		return {v$: useVuelidate()}
	},
	data() {
		return {
			emailValue: "",
			passwordValue: "",
			apiKey: null
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
			(this.$refs.password as HTMLFormElement).$emit('input');
			(this.$refs.email as HTMLFormElement).$emit('input');
			if (!this.v$.$invalid) {
				if (await signIn(this.emailValue, this.passwordValue)) {
					await router.push("/")
				}
			}
		}
	}

});
</script>

<style scoped>
img {
	display: block;
	margin: auto;
	padding: 2rem;
}

div {
	display: block;
	margin: auto;
	padding: 0.2em;
}

p {
	top: 80px;
	text-align: center;
}

div a {
	text-decoration: underline;
}

.forgot-link {
	font-size: 0.8rem;
	text-align: center;
	bottom: 12px;
	left: 100px;
}

.sing-up-link {
	top: 80px;
	font-size: 0.8rem;
	text-align: center;
}

.sign-in-button {
	display: block;
	margin: auto;
	top: 20px;
	width: 200px;
	padding-top: 3px;
	padding-bottom: 3px;
	border: 1px solid var(--vt-c-black);
	border-radius: 15px;
	font-size: 150%;
	color: var(--vt-c-white);
	background-size: 300% 100%;
	transition: all .4s ease-in-out;
	background-image: linear-gradient(to right, var(--color-secondary), var(--color-primary-dark), var(--color-secondary-pale), var(--color-primary));
	box-shadow: 0 4px 15px 0 var(--color-primary-light);
}

.sign-in-button:hover {
	background-position: 99% 0;
	transition: all .4s ease-in-out;
}
</style>