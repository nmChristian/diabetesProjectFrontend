<!-- Author: Niels Torp Grønskov, s204510 -->
<!-- Description: A animated button, designed to be a primary button -->

<template>
  <div>
    <button :type=type>{{ text }}</button>
  </div>
</template>

<script lang="ts">

export default {
  name: "primaryButton",
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'button'
    }
  }
}

</script>

<style scoped>

button {
  display: block;
  margin: auto;
  width: 200px;
  padding-top: 3px;
  padding-bottom: 3px;
  border: 1px solid var(--vt-c-black);
  border-radius: 15px;
  font-size: 130%;
  color: var(--vt-c-white);
  background-size: 300% 100%;
  transition: background-image .4s ease-in-out;
  background-image: linear-gradient(to right, var(--color-secondary), var(--color-primary-dark), var(--color-secondary-pale), var(--color-primary));
  box-shadow: 0 4px 15px 0 var(--color-primary-light);
}

button:hover {
  background-position: 99% 0;
  transition: all .4s ease-in-out;
}

</style>