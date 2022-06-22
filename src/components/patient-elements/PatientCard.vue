<!-- Author: Christian -->
<!-- Description: A brief overview of a patient, meant to be used in DisplayPatients.vue -->
<template>
  <div class="container">
    <div class="allSides" @click="mainClicked()">
      <div class="topDiv">
        <div style="width: 20%; float:left">
          <img src="@/assets/user.png" alt="" style="width: 100%">
        </div>

        <div style="width: 80%; float:right">
          <h2 class="name">{{ name }}</h2>
          <h2 class="ageAndWheight"> Alder: {{ age }} </h2>
          <h2 class="ageAndWheight"> Vægt: {{ weight }} </h2>
        </div>
      </div>
      <div class="infoBoxes" v-on:click.stop>
        <info-element :value=hba1c title="HbA1c:" unit=""></info-element>
        <info-element :value=hypos title="GIM:" unit="mg/dL"></info-element>
        <info-element :value=eGFR title="eGFR:" unit="mmHg"></info-element>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router from "@/index";
import {defineComponent} from "vue";

export default defineComponent({
  name: "patientCard",
  props: {
    id: String,
    name: String,
    age: Number,
    weight: String,
    hba1c: String,
    hypos: String,
    eGFR: String,
  },
  methods: {
    mainClicked() {
      router.push('/patient-info/' + this.$props.id)
    }
  }
})
</script>

<style scoped>
.infoBoxes {
  display: flex;
}

.name {
  color: #181818;
  margin-left: 10px;
}

.ageAndWheight {
  size: 12px;
  color: #b4b0b0;
  display: inline;
  margin: 10px;
}

.topDiv {
  border-bottom: solid 1px #181818;
  overflow: auto;
}

.container {
  flex: 1;
}

.allSides {
  padding: 10px;
  width: 350px;
  height: 200px;
  border: solid 1px #555;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -o-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 25px;
  margin: 10px;
}
</style>