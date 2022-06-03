<template xmlns="http://www.w3.org/1999/html">

  <!-- TODO Måske lav en fom for overskift -->

<div class = outerGridHolder>
    <div v-for="index in Math.floor((Patients.length+1)/2)">
      <div class="collum">
        <gallaery-view-patient-element
            :id ="Patients[(index-1)*2].id"
            :name="Patients[(index-1)*2].name"
            :age = "Patients[(index-1)*2].age"
            :weight = "Patients[(index-1)*2].weight"
            :hbalc = "Patients[(index-1)*2].hbalc"
            :hypos = "Patients[(index-1)*2].hypos"
            :eGFR = "Patients[(index-1)*2].eGFR">

        </gallaery-view-patient-element>
        <div v-if="(index-1)*2 + 1 < Patients.length">
          <gallaery-view-patient-element
              :id ="Patients[(index-1)*2+1].id"
              :name="Patients[(index-1)*2+1].name"
              :age = "Patients[(index-1)*2+1].age"
              :weight = "Patients[(index-1)*2+1].weight"
              :hbalc = "Patients[(index-1)*2+1].hbalc"
              :hypos = "Patients[(index-1)*2+1].hypos"
              :eGFR = "Patients[(index-1)*2+1].eGFR">

          </gallaery-view-patient-element>
          <!--<gallaery-view-patient-element :name="Patients[(index-1)*2+1].name" :age = "index"></gallaery-view-patient-element>
        -->
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "DisplayPatients",
  data(){
    return{
      Patients: [
        {id: 0, name: "Christian Nykjær", age: 22, weight: 1, hbalc: 76, hypos: 1, eGFR: 100},
        {id: 1, name: "Niels" ,           age: 22, weight: 2, hbalc: 75, hypos: 0, eGFR: 99},
        {id: 2, name: "Alexander" ,       age: 20, weight: 3, hbalc: 77, hypos: 5, eGFR: 98},
        {id: 3, name: "Jonas" ,           age: 21, weight: 4, hbalc: 78, hypos: 4, eGFR: 97},
        {id: 4, name: "Mat" ,           age: 21, weight: 4, hbalc: 78, hypos: 4, eGFR: 97},
      ]
    }
  },
  methods: {
    dataPopup(){
      console.log("Vi er ude i display patients")
      alert(2)
    }
  }

}
</script>

<style scoped>
.collum{
  display: flex;
}

.outerGridHolder{
  margin: auto;
  padding-top: 20px;
  width: 60%;
  min-width: 740px;
  max-width: 900px;
}
</style>