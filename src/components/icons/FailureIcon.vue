<!-- Author: Niels T. Grønskov, s204510 -->
<!-- Description: An icon used to display an error message to the user -->

<!-- Reference: https://codepen.io/Konrud/pen/mwZXgV -->

<template>
  <section v-show="!!text" class="c-container">
    <div class="o-circle o-circle__sign--failure">
      <div class="o-circle__sign"></div>
    </div>
    <span v-if="!!text" class="text">{{ text }}</span>
  </section>
</template>
<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "failureIcon",
  data() {
    return {
      text: ''
    }
  },
  methods: {
    setText(text: string) {
      this.text = text
    }
  }
})
</script>

<style scoped>

.text {
  margin-top: .45rem;
  display: flex;
  justify-content: center;
  font-weight: bold;
  animation: circle-appearance .8s ease-in-out 1 forwards, set-overflow .1s 1.1s forwards;
}

.o-circle {
  display: flex;
  width: 5rem;
  height: 5rem;
  justify-content: center;
  align-items: flex-start;
  border-radius: 50%;
  animation: circle-appearance .8s ease-in-out 1 forwards, set-overflow .1s 1.1s forwards;
  margin: auto;
}

.o-circle__sign {
  position: relative;
  background: var(--vt-c-white);
  animation-duration: .8s;
  animation-delay: .2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.o-circle__sign::before,
.o-circle__sign::after {
  content: "";
  position: absolute;
  background: inherit;
}

.o-circle__sign::after {
  left: 100%;
  width: 500%;
  height: 95%;
  transform: translateY(4%) rotate(0deg);
  opacity: 0;
  animation: set-shadow 0s 1.13s ease-in-out forwards;
  z-index: -1;
}

.o-circle__sign--failure {
  background: var(--color-error)
}

.o-circle__sign--failure .o-circle__sign {
  width: 1rem;
  height: 3.45rem;
  transform: translateY(25%) rotate(45deg) scale(.1);
  border-radius: 50% 50% 50% 50% / 10%;
  animation-name: failure-sign-appearance;
}

.o-circle__sign--failure .o-circle__sign::before {
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translateY(-50%) rotate(90deg);
  border-radius: inherit;
}

/*--shadow--*/
.o-circle__sign--failure .o-circle__sign::after {
  background: var(--color-error-dark)
}

@keyframes circle-appearance {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.5);
  }

  60% {
    transform: scale(1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes failure-sign-appearance {
  50% {
    opacity: 1;
    transform: translateY(25%) rotate(45deg) scale(1.7);
  }

  100% {
    opacity: 1;
    transform: translateY(25%) rotate(45deg) scale(1);
  }
}

@keyframes set-shadow {
  to {
    opacity: 1;
  }
}

@keyframes set-overflow {
  to {
    overflow: hidden;
  }
}
</style>