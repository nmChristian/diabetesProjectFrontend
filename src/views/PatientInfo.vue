<template>
	<div :style="paddingElements">
		<div class="navButtons">
			<!-- TODO erstat med smukke symboler :) -->
			<button @click="this.crossClicked()">Kryds</button>
			<button v-if="$router.currentRoute.value.fullPath.toLowerCase().includes('list')"
					@click="fullScreenClicked()">
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

			<div class="infoItem noExpandedView" id="summary">
				<div class="basicInfoHolder">
					<img alt="User icon" class="user-icon" :src="getProfilePicturePath()" style="max-width: 50px">
					<h1> {{ currentPatient.first_name }} </h1>
				</div>
				<div class="startInfoHolderLine">
					<InfoElement :value="currentPatient.value?.extra_data.HbA1c ?? '__'" title="HbALc" unit="mmol/mol"/>
          <InfoElement :value="gmi.toFixed(0)" title="GMI" unit="mg/dL"/>
          <InfoElement :value="currentPatient.value?.extra_data.blood_pressure ?? '__'" title="Blood pressure" unit="mmHg"/>
          <InfoElement :value="currentPatient.value?.extra_data.weight ?? '__'" title="Weight" unit="kg"/>
          <InfoElement value="27" title="Lorem Ipsum" unit="N"/>
          <InfoElement value="12" title="Lorem Ipsum" unit="kg/m"/>
				</div>
			</div>

			<div
				:class="selectedInfoSection === 'notesAndGoals' ? 'smallInfoItemsHolderSelected' : 'smallInfoItemsHolder'">
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

				<div class="infoItemSmall noExpandedView" style="min-width: 260px ">
          <TIROverview style="height: 100%;" :ranges="cgmRanges" :targets="currentPatient.glycemic_targets" :frequencies="frequencies"/>
				</div>

        <div
            id="diagnoseAndMedicine"
             :class="selectedInfoSection !== 'diagnoseAndMedicine' ? 'infoItemSmall' : 'infoItemSelected'"
             style="width: 100%"
             @click="selectInfoSection('diagnoseAndMedicine')">
        <DiagnoseAndMedicine :data="diagnosis"
                             :is-doctor="loggedInUser.is_doctor || false"
                             :id="String(router.currentRoute.value.params.id) || '0'"
                             :showAdvanced="selectedInfoSection === 'notesAndGoals'"
        >

        </DiagnoseAndMedicine>

        </div>

      </div>


			<graph-section
				id="forecast"
				:currently-selected="selectedInfoSection"
				@selected-section="selectInfoSection"
        :show-advanced="selectedInfoSection === 'forecast'">
        <h1>Forecast Series</h1>
				<ForecastSeries
					:cgm="cgmInDateValue"
					:meals="mealsInDateValue"
          :cgm-ranges="cgmRanges"
					:show-advanced="selectedInfoSection === 'forecast'"
				/>
			</graph-section>
			<graph-section
				id="big-table"
				:currently-selected="selectedInfoSection"
				@selected-section="selectInfoSection">
        <h1>Table</h1>
				<ElementTableSeries
					:basal="daysBackData(basalInDateValue, daysBack)"
					:bolus="daysBackData(bolusInDateValue, daysBack)"
					:cgm="daysBackData(cgmInDateValue, daysBack)"
					:meals="daysBackData(mealsInDateValue, daysBack)"
					:dates="dates"
          :cgm-ranges="cgmRanges"
          :days="daysBack"
					:show-advanced="selectedInfoSection === 'big-table'"
				/>
			</graph-section>

			<graph-section
				id="tir-series"
				:currently-selected="selectedInfoSection"
				@selected-section="selectInfoSection">
        <h1>Time in Range per hour</h1>
				<TIRDailySeries
					:data="cgmInDateValue"
          :cgm-ranges="cgmRanges"
					:show-advanced="selectedInfoSection === 'tir-series'"
				/>
			</graph-section>

      <graph-section
          id="quantile-series"
          :currently-selected="selectedInfoSection"
          @selected-section="selectInfoSection">
        <h1>Quantile Graph</h1>
        <QuantileSeries :cgm-ranges="cgmRanges"
                        :cgm="cgmInDateValue"
                        :show-advanced="selectedInfoSection === 'quantile-series'"/>
      </graph-section>

			<graph-section
				id="raw-series"
				:currently-selected="selectedInfoSection"
				@selected-section="selectInfoSection">
        <h1>Raw Data Graph Series</h1>
        <RawSeries
					:basal="daysBackData(basalInDateValue, daysBack)"
					:bolus="daysBackData(bolusInDateValue, daysBack)"
					:cgm="daysBackData(cgmInDateValue, daysBack)"
					:meals="daysBackData(mealsInDateValue, daysBack)"
					:show-advanced="selectedInfoSection === 'raw-series'"
				/>
			</graph-section>
		</div>
	</div>
</template>

<script lang="ts" setup>
import * as d3 from "d3";
import router from "../router";
import backend from "../services/backend";
import type {DateValue} from "@/services/core/datatypes"
import {getCGMOccurrences, mMolPerLToMgPerDL, timeSeriesToDateValue} from "@/services/core/datatypes";
import type {Ref} from "vue"
import {computed, onMounted, ref} from "vue";
import type {CGMRanges} from "@/services/core/shared";
import type {Diagnosis, Note, UserDetails} from "@/services/core/dbtypes";
import ElementTableSeries from "@/components/charts/graphseries/ElementTableSeries.vue"
import NoteViwerAndEditor from "@/components/NoteViwerAndEditor.vue";
import GraphSection from "@/components/patientElements/GraphSection.vue";
import RawSeries from "@/components/charts/graphseries/RawSeries.vue";
import TIRDailySeries from "@/components/charts/graphseries/TIRDailySeries.vue";
import ForecastSeries from "@/components/charts/graphseries/ForecastSeries.vue";
import InfoElement from "@/components/patientElements/InfoElement.vue";
import TIROverview from "@/components/charts/graphseries/TIROverview.vue";
import QuantileSeries from "@/components/charts/graphseries/QuantileSeries.vue";
import DiagnoseAndMedicine from "/src/components/DiagnoseAndMedicine.vue";


const loggedInUser : Ref<UserDetails> = ref({} as UserDetails)
const currentPatient : Ref<UserDetails> = ref({} as UserDetails)

onMounted(() => {
	loadData()
	backend.getUserDetails().then((result) => {
		if (result === null)
			return

		loggedInUser.value = result
	})
})

router.afterEach(() => {
	loadData()
})

window.addEventListener("scroll", onScroll)

const elementsOnPage = [
	{id: "summary", text: "Summary"},
	{id: "notesAndGoals", text: "Goals"},
  {id: "diagnoseAndMedicine", text: "Diagnoses And Medicine"},
	{id: "forecast", text: "3 week overview"},
	{id: "big-table", text: "Table of data"},
	{id: "tir-series", text: "Hourly TIR values"},
	{id: "raw-series", text: "Raw Data (expandable)"},
]

let currentViewedElement = ref(0)

function getProfilePicturePath() {
	if (!currentPatient.value.profile_picture)
		return '/src/assets/user.png'

	return currentPatient.value.profile_picture
}

const selectedInfoSection: Ref<string> = ref('')

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
		router.push("/display-patients-list")
	} else {
		router.back()
	}
}

const emit = defineEmits<{
	(e: 'hideSidebar'): void
}>()

const isFullScreen = ref(false)

const paddingElements = computed(() => {
  if (isFullScreen.value){
    return {'--min-distance-to-wall' : '320px'}
  }else {
    return {'--min-distance-to-wall' : '0px'}
  }
})

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
const occurrences = computed(() => getCGMOccurrences(cgmInDateValueLastSeven.value, cgmRanges.value))
const frequencies = computed(() => { const sum = d3.sum(occurrences.value); return occurrences.value.map(val => val / sum || 0)})

const diagnosis = ref([] as Diagnosis[])
const notes = ref([] as Note[])

function updateNotes() {
	let id = String(router.currentRoute.value.params.id)
	backend.getNotes(id).then((response) => {
		notes.value = response
	})
}

async function loadData() {
  let id = String(router.currentRoute.value.params.id)
  backend.getDiagnosis(id).then((response) => {
    diagnosis.value = response
  })

	updateNotes()

	backend.getUserDetailsForSpecific(String(router.currentRoute.value.params.id)).then((user: UserDetails) => {
    currentPatient.value = user
    currentPatient.value.glycemic_ranges
    console.log(user)
	})

	backend.getDataPatient(21, ["cgm", "meals", "basal", "bolus"], id).then((response) => {

		cgmInDateValue.value = timeSeriesToDateValue(response.cgm, mMolPerLToMgPerDL)
		mealsInDateValue.value = timeSeriesToDateValue(response.meals)
		basalInDateValue.value = timeSeriesToDateValue(response.basal)
		bolusInDateValue.value = timeSeriesToDateValue(response.bolus)

		cgmInDateValueLastSeven.value = cgmInDateValue.value.filter(([date,]) => date > d3.timeDay.offset(new Date(), -7))

	})


}

/* BEHOLD MY STUFF */
const lastDateInDataSet = computed(() => cgmInDateValue.value.length === 0 ? new Date() : cgmInDateValue.value[cgmInDateValue.value.length - 1][0])
const daysBack = 7
const dates = computed(() =>
	[...Array(daysBack).keys()].map<Date>((offset) => d3.timeDay(
		d3.timeDay.offset(lastDateInDataSet.value, -offset))).reverse())

const daysBackData = (data: DateValue[], daysBack: number) =>
	data.filter(([date,]) => date > d3.timeDay.offset(lastDateInDataSet.value, -daysBack))

// Converts user given cgm range
const cgmRanges = computed( () : CGMRanges => {
  // Ignore warning, since the object can be {}, and therefore {}.glycemic_ranges === undefined
  if (currentPatient.value.glycemic_ranges === undefined)
    return Array(5).fill([0, 0])

  const range = [0,...currentPatient.value.glycemic_ranges].map(mMolPerLToMgPerDL)
  return range.map<[number, number?]>((val,i,a) => [val, a[i+1]])
})

const gmi = computed (() => d3.mean(daysBackData(cgmInDateValue.value, 14), ([,value]) => value) ?? 0)
</script>


<style scoped>
.noExpandedView {
  pointer-events: none;
}
.basicInfoHolder {
	display: flex;
	flex: border-box;
}

.smallInfoItemsHolder {
  max-width: calc(( 100% - var(--min-distance-to-wall) ) - 10px );
  width: 1100px;
  margin: 0;
  padding: 0;
	display: flex;
	flex-direction: row;
  align-items: stretch;
}

.smallInfoItemsHolderSelected {
  width: 100%;
  max-width: calc(100% - var(--min-distance-to-wall));
	display: flex;
	flex-direction: column;
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
	max-width: calc(100% - var(--min-distance-to-wall));;
	padding: 10px;
	width: 1100px;
}

.infoItemSmall {
  height: 220px;
}

.infoItemSelected {
  padding: 10px;
  width: 100%;
  max-width: calc(100% - var(--min-distance-to-wall));
}

.infoItem, .infoItemSmall, .infoItemSelected {
  background-color: #fcfcfc;
  border: solid 1px #555;
  border-radius: 4px;
  margin: 10px;

  box-shadow: 0 0 2px rgba(0, 0, 0,0.4);
}
.infoItem:hover, .infoItemSmall:hover{
	box-shadow: 0 0 4px black;
}

.graph-section {
  min-height: 3em;
}
.graph-section h1 {
  font-size: 1.5em;
  text-align: center;
  text-decoration: underline 5px #bbb ;

  font-weight: bold;
}

.graph-section>.slot>*:not(:first-child) {
  margin-top: 20px;
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