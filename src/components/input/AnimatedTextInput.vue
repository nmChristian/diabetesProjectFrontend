<!-- Author: Niels Torp Grønskov, s204510 -->
<!-- Description: An animated input field, for various purposes -->

<template>
  <div class="form">
    <input :class="{error: !!errorText}" :type="type" :value='modelValue' class="input" placeholder=" "
           @input='$emit("update:modelValue", $event.target.value)'/>
    <label class="label">{{ labelText }}</label>
    <span class="error-text"> {{ errorText }}</span>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import type {ErrorObject} from "@vuelidate/core";

export default defineComponent({
  name: "animatedTextInput",
  props: {
    labelText: String,
    type: {
      type: String,
      default: 'text'
    },
    modelValue: String,
  },
  data() {
    return {
      errorText: ''
    }
  },
  methods: {
    setError(errors: ErrorObject[]) {
      if (errors.length > 0) {
        this.errorText = errors[0].$message.toString()
      } else {
        this.errorText = ""
      }
    }
  }

})
</script>

<style scoped>
.form {
  width: 20rem;
  font-size: 1.4rem;
}

input {
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
  position: absolute;
  top: 3px;
  left: 0.6rem;
  transition: all .4s;
  color: var(--vt-c-text-light-2);
  pointer-events: none;
  user-select: none;
}

span {
  display: flex;
  justify-content: right;
  font-size: 0.5em;
  color: var(--color-error)
}

input:hover {
  border: 2px solid;
}

input:focus {
  border: 1px solid var(--color-primary);
}

.error {
  border: 1px solid var(--color-error) !important;
}

input:focus ~ .label,
.input:not(:placeholder-shown).input:not(:focus) ~ label {
  top: -0.35rem;
  height: 13px;
  font-size: 50%;
  background-color: var(--color-background);
}
</style>