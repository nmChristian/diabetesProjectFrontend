<template>
	<div class="title">
		<label>Sign Up</label>
	</div>
	<img src="@/assets/logo.svg" width="100" height="100" alt=""/>
	<div>
		<animated-text-input ref="firstName" label-text="First name" v-model="firstNameValue"
							 @input="$refs.firstName.setError(v$.firstNameValue.$errors)"/>
	</div>
	<div>
		<animated-text-input ref="lastName" label-text="Last name" v-model="lastNameValue"
							 @input="$refs.lastName.setError(v$.lastNameValue.$errors)"/>
	</div>
	<div class="date">
		<label class="date-label">Date of birth
			<input ref="date" class="date-picker" type="date" v-model="dateValue"/>
		</label>
	</div>
	<div>
		<animated-text-input ref="email" label-text="E-mail" v-model="emailValue"
							 @input="$refs.email.setError(v$.emailValue.$errors)"/>
	</div>
	<div>
		<animated-text-input ref="password" label-text="Password" type="password" v-model="passwordValue"
							 @input="$refs.password.setError(v$.passwordValue.$errors)"/>
	</div>
	<div>
		<animated-text-input ref="passwordRepeat" label-text="Repeat password" type="password"
							 v-model="passwordRepeatValue"
							 @input="$refs.passwordRepeat.setError(v$.passwordRepeatValue.$errors)"/>
	</div>
	<div>
		<button class="sign-up-button" @click="onSignUpClick">Sign up</button>
	</div>
	<p>Or</p>
	<div class="sing-in-link">
		<a href="/sign-in">SIGN IN</a>
	</div>
</template>

<script lang="ts">
import animatedTextInput from "../../components/input/AnimatedTextInput.vue"
import {signIn, signUp} from "@/services/authentication";
import router from "@/router";
import {defineComponent} from "vue";
import useVuelidate from "@vuelidate/core";
import {email, required, sameAs, helpers, between} from "@vuelidate/validators";

export default defineComponent({
	components: {
		animatedTextInput
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
			(this.$refs.firstName as HTMLFormElement).$emit('input');
			(this.$refs.lastName as HTMLFormElement).$emit('input');
			(this.$refs.email as HTMLFormElement).$emit('input');
			(this.$refs.password as HTMLFormElement).$emit('input');
			(this.$refs.passwordRepeat as HTMLFormElement).$emit('input');

			if (!this.v$.$invalid) {
				if (await signUp(this.emailValue, this.firstNameValue, this.lastNameValue, this.dateValue, this.passwordValue, this.passwordRepeatValue)) {
					if (await signIn(this.emailValue, this.passwordValue)) {
						await router.push("/")
					}
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
	display: block;
	margin: auto;
	padding: 10px;
}

.date {
	display: flex;
	margin: auto;
	justify-content: center;
}

p {
	top: 80px;
	text-align: center;
}

div a {
	text-decoration: underline;
}

.title {
	text-align: center;
	margin: auto;
	font-size: 250%;
}

.sing-in-link {
	top: 80px;
	font-size: 0.8rem;
	text-align: center;
	margin-bottom: 100px;
}

.sign-up-button {
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

.sign-up-button:hover {
	background-position: 99% 0;
	transition: all .4s ease-in-out;
}
</style>