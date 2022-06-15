<template>
  <div>
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

  <div  v-if="isFullScreen || !$router.currentRoute.value.fullPath.toLowerCase().includes('list')" class="tableOfContext">
    <p v-for="(item, index) in elemntsOnPage" @click="scrollToElement(item.id)" :class="{markedTableOfContextItem :(index  === currentViewdElement) , unmarkedTableOfContextItem :(index  !== currentViewdElement) }">  {{item.text}} </p>
  </div>


    <div class=holderInfo>

      <div class="infoItem" id="summary">
        <div class="basicInfoHolder">
          <img alt="User icon" class=user-icon :src="getProfilePicturePath()" style="max-width: 50px">
          <h1>Name: {{currentUser.first_name}} </h1>
        </div>
        <div class=" startInfoHolderLine">
        <info-element :number=0 title="HbALc:" @showData="showElementData('HbALc')"></info-element>
        <info-element :number=1 title="weight:" @showData="$router.replace('#weight')"></info-element>
        <info-element :number=2 title="Hypos:" @showData="showElementData('Hypos')"></info-element>
        <info-element :number=3 title="Hypos:" @showData="showElementData('Hypos')"></info-element>
        <info-element :number=4 title="Hypos:" @showData="showElementData('Hypos')"></info-element>
        <info-element :number=5 title="Hypos:" @showData="showElementData('Hypos')"></info-element>
        </div>
      </div>

      <div class="infoItem diagnoseAndMedicine" id="diagnoseAndMedicine">
        <p class="diagnoseAndMedicinLabels">Diagnose</p>
        <p class="diagnoseAndMedicinLabels">Medecin</p>

        <template v-if="diagnosis.length !==0" v-for="diag in diagnosis">
          <p class="diagnoseAndMedicinItems">{{ diag.name }}</p>

          <p class="diagnoseAndMedicinItems">{{ listToString(diag.medicine) }}</p>
        </template>
        <p v-else>No diagnosis registered for this patient</p>
      </div>

      <div id="forcast"
           @click="selectInfoSection('forcast')"
           :class="selectedInfoSection !== 'forcast' ? 'infoItem' : 'infoItemSelected'" >
       <forecast-series :cgm="cgmInDateValue" :meals="mealsInDateValue" :showAdvanced="selectedInfoSection === 'forcast'"/>
      </div>

      <div class="infoItem" id="testAScroll1">
        <h1>Test a scroll 1</h1>
      </div>

      <div class="infoItem" id="testAScroll2">
        <h1>Test a scroll 2</h1>
      </div>

      <div id="testAScroll3"
           @click="selectInfoSection('testAScroll3')"
           :class="selectedInfoSection !== 'testAScroll3' ? 'infoItem' : 'infoItemSelected'">
        <h1>Test a scroll 3</h1>
      </div>

      <div id="testAScroll4"
           @click="selectInfoSection('testAScroll4')"
           :class="selectedInfoSection !== 'testAScroll4' ? 'infoItem' : 'infoItemSelected'" >
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
  </div>
</template>

<script lang="ts" setup>
import router from "../router";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";
import backend from "../services/backend";
import type {DateValue} from "@/services/core/datatypes"
import {mMolPerLToMgPerL, timeSeriesToDateValue} from "@/services/core/datatypes";
import {onMounted, Ref, ref} from "vue";
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

function getProfilePicturePath(){
  if(currentUser.value.profile_picture === undefined || currentUser.value.profile_picture === ""){
    return '/src/assets/user.png'
  }
  return currentUser.profile_picture
}

const selectedInfoSection = ref('')

function selectInfoSection(id : string){
  selectedInfoSection.value = id
}

function scrollToElement(id : string){
  if(window.top == null){
    return
  }
  console.log(typeof document.getElementById(id))
  let wantedOffset = (document.getElementById(id) as HTMLDivElement ).getBoundingClientRect().top
  window.top.scroll(0,window.top.scrollY + wantedOffset -85)
}

function onScroll(){
  if(window.top == undefined){
    currentViewdElement.value = 0
    return
  }

  for(let i = 0; i < elemntsOnPage.length; i++){
    if ((document.getElementById(elemntsOnPage[i].id) as HTMLDivElement ).getBoundingClientRect().bottom > 70){
      currentViewdElement.value = i;
      return;
    }
  }
  currentViewdElement.value = elemntsOnPage.length-1;
}

const currentUser = ref({first_name: ""})

function closePopUp() {
  let currentRoute = router.currentRoute.value.fullPath
  let indexOfHash = currentRoute.indexOf("#")
  let newRoute = currentRoute.substring(0, indexOfHash)
  router.replace(newRoute)
}

let crossClicked = () => {
  if (router.currentRoute.value.fullPath.includes("List")) {
    if(isFullScreen.value){
      emit('hideSidebar');
    }
    router.push("/DisplayPatientsList")
  } else {
    router.back()
  }
}

const emit = defineEmits<{
  (e: 'hideSidebar'): void}>()

const isFullScreen = ref(false)

function fullScreenClicked()  {
  isFullScreen.value = !isFullScreen.value
  emit('hideSidebar');
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

let cgmInDateValue: Ref<never[] | DateValue[]> = ref([])
let mealsInDateValue: Ref<never[] | DateValue[]> = ref([])
let basalInDateValue: Ref<never[] | DateValue[]> = ref([])
let bolusInDateValue: Ref<never[] | DateValue[]> = ref([])

const diagnosis = ref([])

async function loadData() {
  //TODO, flyt alt loading af data herind
  let id = String(router.currentRoute.value.params.id)
  backend.getDiagnosis(id).then((response) => {
    diagnosis.value = response
  })

  backend.getUserDetailsForSpecific(String(router.currentRoute.value.params.id)).then((user : UserDetails) => {
    currentUser.value = user
  })

  backend.getDataPatient(21, ["cgm", "meals", "basal", "bolus"],id).then((response) => {
    cgmInDateValue.value = timeSeriesToDateValue(response.cgm, mMolPerLToMgPerL)
    mealsInDateValue.value = timeSeriesToDateValue(response.meals)
    basalInDateValue.value = timeSeriesToDateValue(response.basal)
    bolusInDateValue.value = timeSeriesToDateValue(response.bolus)
  })


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
.basicInfoHolder{
  display: flex;
  flex: border-box;
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
  padding: 5px;
}
.unmarkedTableOfContextItem:hover{
  text-underline: darkblue;
  text-decoration: underline;
}
.markedTableOfContextItem{
  border: #2c3e50 1px solid;
  padding: 5px;
  border-radius: 5px;
}

.navButtons {
  position: absolute;
  right: 1rem;
  z-index: 1;
}

.infoItem {
  max-width: 1200px;
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
.infoItem:hover {
  box-shadow: 0 0 20px black;
}

.infoItemSelected {
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

.diagnoseAndMedicine {
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
  max-width: 75% ;
  padding: 2rem;
  margin: auto;
  width: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}


</style>