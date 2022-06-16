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
      <button v-if="$router.currentRoute.value.fullPath.toLowerCase().includes('list')" @click="fullScreenClicked()">
        Fuld
        skærm
      </button>
    </div>

    <div v-if="isFullScreen || !$router.currentRoute.value.fullPath.toLowerCase().includes('list')"
         class="tableOfContext">
      <p v-for="(item, index) in elementsOnPage" @click="scrollToElement(item.id)"
         :class="{markedTableOfContextItem :(index  === currentViewedElement) , unmarkedTableOfContextItem :(index  !== currentViewedElement) }">
        {{ item.text }} </p>
    </div>


    <div class=holderInfo>

      <div class="infoItem" id="summary">
        <div class="basicInfoHolder">
          <img alt="User icon" class=user-icon :src="getProfilePicturePath()" style="max-width: 50px">
          <h1>Name: {{ currentPatient.first_name }} </h1>
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

      <div
          :class="selectedInfoSection === 'notesAndGoals' ? 'smallInfoItemsHolder' : 'smallInfoItemsHolderSelected'">
        <div id="notesAndGoals"
             :class="selectedInfoSection !== 'notesAndGoals' ? 'infoItemSmall' : 'infoItemSelected'"
             @click="selectInfoSection('notesAndGoals')">
          <NoteViwerAndEditor
              @click="selectInfoSection('notesAndGoals')"
              @updateNotes="updateNotes()"
              :data="notes"
              :is-doctor="loggedInUser.is_doctor || false"
              :id="String(router.currentRoute.value.params.id) || '0'"
              :showAdvanced="selectedInfoSection === 'notesAndGoals'"
          ></NoteViwerAndEditor>
        </div>
        <div class="infoItemSmall" style=" width: auto;">
          <t-i-r-graph :rotate="true" :occurrences="frequencies" :colors="COLOR_SCHEME"/>
          <c-g-m-legend/>
        </div>
      </div>


      <graph-section
        id="forecast"
        :currently-selected="selectedInfoSection"
        @selected-section="selectInfoSection">
        <ForecastSeries
          :cgm="cgmInDateValue"
          :meals="mealsInDateValue"
          :showAdvanced="selectedInfoSection === 'forecast'"
        />
      </graph-section>

      <graph-section
          id="big-table"
          :currently-selected="selectedInfoSection"
          @selected-section="selectInfoSection">
        <ElementTableSeries
            :basal="daysBackData(basalInDateValue, daysBack)"
            :bolus="daysBackData(bolusInDateValue, daysBack)"
            :cgm="daysBackData(cgmInDateValue, daysBack)"
            :meals="daysBackData(mealsInDateValue, daysBack)"
            :dates="dates"
            :showAdvanced="selectedInfoSection === 'big-table'"
        />
      </graph-section>

      <graph-section
          id="tir-series"
          :currently-selected="selectedInfoSection"
          @selected-section="selectInfoSection">
        <TIRDailySeries
            :data="cgmInDateValue"
            :showAdvanced="selectedInfoSection === 'tir-series'"
        />
      </graph-section>

    </div>
  </div>
</template>

<script lang="ts" setup>
import TIRDailySeries from "@/components/charts/graphseries/TIRDailySeries.vue";
import router from "../router";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";
import backend from "../services/backend";
import type {DateValue} from "@/services/core/datatypes"
import {getCGMOccurrences, mMolPerLToMgPerL, timeSeriesToDateValue} from "@/services/core/datatypes";
import type {Ref} from "vue"
import {computed, onMounted, ref} from "vue";
import type {Diagnosis, Note, UserDetails} from "@/services/core/dbtypes";
import ElementTableSeries from "@/components/charts/graphseries/ElementTableSeries.vue"
import NoteViwerAndEditor from "@/components/NoteViwerAndEditor.vue";
import TIRGraph from "@/components/charts/generic/TIRGraph.vue";
import * as d3 from "d3";
import {COLOR_SCHEME} from "@/services/core/shared";
import CGMLegend from "@/components/charts/CGMLegend.vue";
import GraphSection from "@/components/patientElements/GraphSection.vue";

const loggedInUser = ref({first_name: ""} as UserDetails)
onMounted(() => {
  loadData()

  backend.getUserDetails().then((result) => {
    if (result === null) {
      return
    }
    loggedInUser.value = result
  })
})

router.afterEach(() => {
  loadData()
})

window.addEventListener("scroll", onScroll)

const elementsOnPage = [
  {id: "summary", text: "Summary"},
  {id: "diagnoseAndMedicine", text: "Diagnose And Medicine"},
  {id: "notesAndGoals", text: "Goals"},
  {id: "forecast", text: "3 week overview"},
  {id: "big-table", text: "Table of data"},
]

let currentViewedElement = ref(0)

function getProfilePicturePath() {
  if (currentPatient.value.profile_picture === undefined || currentPatient.value.profile_picture === "") {
    return '/src/assets/user.png'
  }
  return currentPatient.profile_picture
}

const selectedInfoSection : Ref<string> = ref('')

function selectInfoSection(id: string) {
  selectedInfoSection.value = id
}

function scrollToElement(id: string) {
  if (window.top == null) {
    return
  }
  let wantedOffset = (document.getElementById(id) as HTMLDivElement).getBoundingClientRect().top
  window.top.scroll(0, window.top.scrollY + wantedOffset - 85)
}

function onScroll() {
  if (window.top == undefined) {
    currentViewedElement.value = 0
    return
  }

  for (let i = 0; i < elementsOnPage.length; i++) {
    if ((document.getElementById(elementsOnPage[i].id) as HTMLDivElement).getBoundingClientRect().bottom > 70) {
      currentViewedElement.value = i;
      return;
    }
  }
  currentViewedElement.value = elementsOnPage.length - 1;
}

const currentPatient = ref({first_name: ""})

function closePopUp() {
  let currentRoute = router.currentRoute.value.fullPath
  let indexOfHash = currentRoute.indexOf("#")
  let newRoute = currentRoute.substring(0, indexOfHash)
  router.replace(newRoute)
}

let crossClicked = () => {
  if (router.currentRoute.value.fullPath.includes("List")) {
    if (isFullScreen.value) {
      emit('hideSidebar');
    }
    router.push("/DisplayPatientsList")
  } else {
    router.back()
  }
}

const emit = defineEmits<{
  (e: 'hideSidebar'): void
}>()

const isFullScreen = ref(false)

function fullScreenClicked() {
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

const cgmInDateValue: Ref<DateValue[]> = ref([] as DateValue[])
const cgmInDateValueLastSeven: Ref<DateValue[]> = ref([] as DateValue[])
const mealsInDateValue: Ref<DateValue[]> = ref([] as DateValue[])
const basalInDateValue: Ref<DateValue[]> = ref([] as DateValue[])
const bolusInDateValue: Ref<DateValue[]> = ref([] as DateValue[])
const frequencies = computed(() => getCGMOccurrences(cgmInDateValueLastSeven.value))


const diagnosis = ref([] as Diagnosis[])

const notes = ref([] as Note[])

function updateNotes() {
  let id = String(router.currentRoute.value.params.id)
  console.log("Updating notes")
  backend.getNotes(id).then((response) => {
    notes.value = response
    console.log(response)
  })
}

async function loadData() {
  //TODO, flyt alt loading af data herind
  let id = String(router.currentRoute.value.params.id)
  backend.getDiagnosis(id).then((response) => {
    diagnosis.value = response
  })

  updateNotes()

  backend.getUserDetailsForSpecific(String(router.currentRoute.value.params.id)).then((user: UserDetails) => {
    currentPatient.value = user
    console.log(user)
  })

  backend.getDataPatient(21, ["cgm", "meals", "basal", "bolus"], id).then((response) => {

    cgmInDateValue.value = timeSeriesToDateValue(response.cgm, mMolPerLToMgPerL)
    mealsInDateValue.value = timeSeriesToDateValue(response.meals)
    basalInDateValue.value = timeSeriesToDateValue(response.basal)
    bolusInDateValue.value = timeSeriesToDateValue(response.bolus)

    cgmInDateValueLastSeven.value = cgmInDateValue.value.filter(([date,]) => date > d3.timeDay.offset(new Date(), -7))

  })


}

const lastDateInDataSet = computed(() => cgmInDateValue.value.length === 0 ? new Date() : cgmInDateValue.value[cgmInDateValue.value.length - 1][0])
const daysBack = 7
const dates = computed(() =>
    [...Array(daysBack).keys()].map<Date>((offset) => d3.timeDay(
        d3.timeDay.offset(lastDateInDataSet.value, -offset))).reverse())

const daysBackData = (data: DateValue[], daysBack: number) =>
    data.filter(([date,]) => date > d3.timeDay.offset(lastDateInDataSet.value, -daysBack))


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

.basicInfoHolder {
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

.smallInfoItemsHolder {
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.smallInfoItemsHolderSelected {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.tableOfContext {
  position: fixed;
  padding-top: 10px;
  left: 1rem;
  z-index: 1;
}

.unmarkedTableOfContextItem {
  padding: 5px;
}

.unmarkedTableOfContextItem:hover {
  text-underline: darkblue;
  text-decoration: underline;
}

.markedTableOfContextItem {
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

.infoItemSmall {
  width: min-content;
  border: solid 1px #555;
  background-color: #fcfcfc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -o-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  border-radius: 25px;
  margin: 10px;
}

.infoItemSmall:hover {
  box-shadow: 0 0 20px black;
}

.infoItem:hover {
  box-shadow: 0 0 20px black;
}

.infoItemSelected {
  padding: 10px;
  width: 100%;
  border: solid 1px #555;
  min-width: 1300px;;
  max-width: calc(100% - 320px);
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
  padding: 2rem;
  margin: auto;
  width: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>