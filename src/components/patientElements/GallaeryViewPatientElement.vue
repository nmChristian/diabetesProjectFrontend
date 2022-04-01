<template>
  <div class="allSides">
    <div class="topDiv" > <!-- Overskrift -->
      <div style="width: 20%; float:left">
        <img src="@/assets/logo.svg">
      </div>

      <div style="width: 80%; float:right">
        <h2 class="name">{{name}}</h2>
        <h2 class="ageAndWheight"> Alder: {{age}} </h2>
        <h2 class="ageAndWheight"> Vægt: {{weight}} </h2>
      </div>
    </div>
    <div class="infoBoxes">
      <info-element title="HbALc:" :number= hbalc></info-element>
      <info-element title="Hypos:" :number= hypos></info-element>
      <info-element title="eGFR:" :number= eGFR></info-element>
    </div>
  </div>
</template>

<script>
export default {
  name: "GallaeryViewPatientElement",
  props: {
    name: String,
    age: Number,
    weight: Number,
    hbalc: Number,
    hypos: Number,
    eGFR: Number,
  }
}
</script>

<style scoped>
.infoBoxes{
  display: flex;
}
  .name{
    color: #181818;
    margin-left: 10px;
  }
  .ageAndWheight{
    size: 12px;
    color: #b4b0b0;
    display: inline;
    margin: 10px;
  }
  .topDiv{
    border-bottom: solid 1px #181818;
    overflow: auto;
  }
  .allSides
  {
    padding: 10px;
    width:350px;height:200px;
    border: solid 1px #555;
    background-color: #ffffff;
    box-shadow:  0 0 10px  rgba(0,0,0,0.6);
    -moz-box-shadow: 0 0 10px  rgba(0,0,0,0.6);
    -webkit-box-shadow: 0 0 10px  rgba(0,0,0,0.6);
    -o-box-shadow: 0 0 10px  rgba(0,0,0,0.6);
    border-radius:25px;
    margin: 10px;
    flex: 1;
  }
</style>