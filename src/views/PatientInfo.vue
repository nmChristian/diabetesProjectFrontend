<template>

  <!-- POP UP -->
  <div v-if="$router.currentRoute.value.fullPath.includes('#')" class="popupBackground" @click="closePopUp()"></div>
  <div v-if="$router.currentRoute.value.fullPath.includes('#weight')" class="popup">

    <h1>Ting om vægt</h1>
  </div>

  <div class="navButtons">
    <!-- TODO erstat med smukke symboler :) -->
    <button @click="this.crossClicked()">Kryds</button>
    <button v-if="$router.currentRoute.value.fullPath.toLowerCase().includes('list')" @click="fullScreenClicked()">Fuld
      skærm
    </button>
  </div>

  <div class="tableOfContext">
    <p v-for="(item, index) in elemntsOnPage" @click="scrollToElement(item.id)" :class="{markedTableOfContextItem :(index  === currentViewdElement) , unmarkedTableOfContextItem :(index  !== currentViewdElement) }">  {{item.text}} </p>
  </div>


  <div class=holderInfo>

    <h1>This is patient info for: {{ $route.params.id }} </h1>

    <div class="infoItem startInfoHolderLine" id="summary">
      <info-element :number=0 title="HbALc:" @showData="showElementData('HbALc')"></info-element>
      <info-element :number=1 title="weight:" @showData="$router.replace('#weight')"></info-element>
      <info-element :number=2 title="Hypos:" @showData="showElementData('Hypos')"></info-element>
      <info-element :number=3 title="Hypos:" @showData="showElementData('Hypos')"></info-element>
      <info-element :number=4 title="Hypos:" @showData="showElementData('Hypos')"></info-element>
      <info-element :number=5 title="Hypos:" @showData="showElementData('Hypos')"></info-element>
    </div>

    <div class="infoItem diagnoseAndMedicine" id="diagnoseAndMedicine">
      <p class="diagnoseAndMedicinLabels">Diagnose</p>
      <p class="diagnoseAndMedicinLabels">Medecin</p>

      <template v-for="diag in diagnoser">
        <p class="diagnoseAndMedicinItems">{{ diag.name }}</p>

        <p class="diagnoseAndMedicinItems">{{ listToString(diag.medecin) }}</p>
      </template>
    </div>

    <div class="infoItem" id="forcast" >
      <forecast-series :data="cgmInDateValue"/>
    </div>

    <div class="infoItem" id="testAScroll1">
      <h1>Test a scroll 1</h1>
    </div>

    <div class="infoItem" id="testAScroll2">
      <h1>Test a scroll 2</h1>
    </div>

    <div class="infoItem" id="testAScroll3" >
      <h1>Test a scroll 3</h1>
    </div>

    <div class="infoItem" id="testAScroll4" >
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1><h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
      <h1>Test a scroll 4</h1>
    </div>


  </div>


</template>

<script lang="ts" setup>
import router from "../router";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";
import backend from "../services/backend";
import type {DateValue, Point} from "@/services/core/datatypes"
import {ref, Ref, computed, onMounted, watch, onUpdated} from "vue";
import {
  addEdgesToSplit,
  bucketToMedian,
  mMolPerLToMgPerL,
  SPLIT_BY_DAY,
  timeSeriesToDateValue,
  toBuckets
} from "@/services/core/datatypes";
import type {UserDetails} from "@/services/core/dbtypes";

onMounted(() => {
  loadData()
})

router.afterEach(() => {
  loadData()
})

window.addEventListener("scroll", onScroll)

const elemntsOnPage = [
  {id: "summary",text: "Summary"},
  {id: "diagnoseAndMedicine", text: "Diagnose And Medicine"},
  {id: "forcast", text: "3 week overview"},
  {id: "testAScroll1", text: "testAScroll1"},   {id: "testAScroll2", text: "testAScroll2"},   {id: "testAScroll3", text: "testAScroll3"},   {id: "testAScroll4", text: "testAScroll4"}]

let currentViewdElement = ref(0)

function scrollToElement(id : string){
  if(window.top == undefined){
    return
  }
  let wantedOffset = (document.getElementById(id) as HTMLBodyElement).getBoundingClientRect().top
  window.top.scroll(0,window.top.scrollY + wantedOffset -85)
}

function onScroll(e: any){
  if(window.top == undefined){
    currentViewdElement.value = 0
    return
  }

  for(let i = 0; i < elemntsOnPage.length; i++){
    if ((document.getElementById(elemntsOnPage[i].id) as HTMLBodyElement).getBoundingClientRect().bottom > 70){
      currentViewdElement.value = i;
      break
    }
  }

}

function closePopUp() {
  let currentRoute = router.currentRoute.value.fullPath
  let indexOfHash = currentRoute.indexOf("#")
  let newRoute = currentRoute.substring(0, indexOfHash)
  router.replace(newRoute)
}

let crossClicked = () => {
  if (router.currentRoute.value.fullPath.includes("List")) {
    router.push("/DisplayPatientsList")
  } else {
    router.back()
  }
}

const fullScreenClicked = () => {
  //TODO find noget smartere, så hele siden ikke skal læses igen.
  let current = router.currentRoute.value.fullPath
  let newPath = current.replace("/DisplayPatientsList", "")
  router.push(newPath)
}

function listToString(inListe: string | any[] | undefined) {
  let re = ""
  if (inListe === undefined) {
    return ""
  }
  for (let i = 0; i < inListe.length; i++) {
    re += String(inListe[i])
    if (i < inListe.length - 1) {
      re += ", "
    }
  }
  return re;
}

const diagnoser = [
  {
    name: "Type 2 diabetis", medecin: [
      "Insulin ting", "Andre insulin ting"
    ]
  },
  {
    name: "type 100 diaB", medecin: [
      "Ting 1", "Ting 2", "ting 3"
    ]
  }
]

let cgmInDateValue: Ref<never[] | DateValue[]> = ref([])
let mealsInDateValue: Ref<never[] | DateValue[]> = ref([])
let basalInDateValue: Ref<never[] | DateValue[]> = ref([])
let bolusInDateValue: Ref<never[] | DateValue[]> = ref([])

async function loadData() {
  const response = await backend.getDataPatient(21, ["cgm", "meals", "basal", "bolus"],String(router.currentRoute.value.params.id))
  cgmInDateValue.value = timeSeriesToDateValue(response.cgm, mMolPerLToMgPerL)
  mealsInDateValue.value = timeSeriesToDateValue(response.meals)
  basalInDateValue.value = timeSeriesToDateValue(response.basal)
  bolusInDateValue.value = timeSeriesToDateValue(response.bolus)
}

</script>


<style scoped>
.popupBackground {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  border-radius: 15px;
  z-index: 11;
}

.popup {
  position: fixed;
  left: 15%;
  top: 10%;
  height: 80%;
  width: 70%;
  border-radius: 15px;
  background: pink;
  border: blue 1px dashed;
  z-index: 12;
}

.tableOfContext{
  position: fixed;
  left: 1rem;
  z-index: 1;
}

.unmarkedTableOfContextItem{

}
.unmarkedTableOfContextItem:hover{
  border: black 1px solid;
}
.markedTableOfContextItem{
  text-underline: #764ba2;
  background-color: #2c3e50;
}

.navButtons {
  position: absolute;
  right: 1rem;
  z-index: 1;
}

.infoItem {
  padding: 10px;
  width: 100%;
  border: solid 1px #555;
  min-width: 1020px;
  background-color: #fcfcfc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -o-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 25px;
  margin: 10px;
}

.diagnoseAndMedicin {
  display: grid;
  grid-template-columns: auto auto;
}

.diagnoseAndMedicinLabels {
  font-size: 30px;
  text-decoration: underline rgba(128, 128, 128, 0.62);
}

.diagnoseAndMedicinItems {
  font-size: 15px;

}

.startInfoHolderLine {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
}

.holderInfo {
  max-width: 1100px;
  padding: 2rem;
  margin: auto;
  width: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>