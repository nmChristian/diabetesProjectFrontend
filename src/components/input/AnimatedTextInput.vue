<template>
	<div class="form">
		<input class="input" placeholder=" " :type="type" :value='modelValue'
			   @input='$emit("update:modelValue", $event.target.value)'/>
		<label class="label">{{ labelText }}</label>
	</div>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
	name: "animatedTextInput",
	props: {
		labelText: String,
		type: {
			type: String,
			default: 'text'
		},
		modelValue: String
	},

})
</script>

<style scoped>
.form {
	position: relative;
	width: 20rem;
	font-size: 1.4rem;
}

input {
	position: absolute;
	width: 100%;
	padding-left: 0.6rem;
	background: none;
	border-radius: 5px;
	border: 1px solid;
	outline: none;
	font-size: inherit;
	font-family: inherit;
}

label {
	top: -1px;
	left: 0.6rem;
	transition: all .4s;
	background-color: var(--color-background);
	color: var(--vt-c-text-light-2);
	pointer-events: none;
}

input:hover {
	border: 2px solid;
}

input:focus {
	border: 1px solid var(--color-primary);
}

input:focus ~ .label,
.input:not(:placeholder-shown).input:not(:focus) ~ label {
	top: -1.4rem;
	font-size: 50%;
}
</style>