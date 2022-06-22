<!-- Author: Niels Torp Grønskov, s204510 -->
<!-- Description: A loading icon used when waiting for data -->

<!-- Reference: https://github.com/nguyenvanduocit/vue-loading-spinner -->

<template>
  <div class="spinner spinner--circle-2" v-bind:style="styles"></div>
</template>
<script>
export default {
  props: {
    size: {
      default: '40px'
    },
    background: {
      default: 'var(--theme-color)'
    },
    color: {
      default: 'var(--color-primary)'
    },
    stroke: {
      default: '5px'
    }
  },
  computed: {
    styles() {
      return {
        width: this.size,
        height: this.size,
        border: this.stroke + ' solid ' + this.background,
        borderTopColor: this.color
      }
    }
  }
}
</script>
<style scoped>
.spinner {
  box-sizing: border-box;
  border-radius: 100%;
  border: 10px solid rgba(255, 255, 255, 0.2);
  animation: circle-2-spin 1s infinite linear;
}

@keyframes circle-2-spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>