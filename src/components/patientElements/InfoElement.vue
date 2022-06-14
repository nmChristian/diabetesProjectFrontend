<template>
  <div class="infoBox">
    <div class="inderBox" @click="showDataInternal()">
      <p class="title">{{ title }}</p>
      <p class="number">{{ number }}</p>
      <!-- TODO add unit -->
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoElement",
  props: ['title', 'number'],
  methods: {
    showDataInternal() {
      console.log("Vi er i info elementet")
      this.$emit('showData')
    }
  }
}
</script>

<style scoped>
.infoBox {
  flex: 1;
  padding: 5px;
}

.inderBox {
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 5px;
}

.inderBox:hover {
  border-color: #555;
}

.title {
  color: #181818;
}

.number {
  font-size: 30px;
  color: #181818;
}
</style>