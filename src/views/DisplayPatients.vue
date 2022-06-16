<template xmlns="http://www.w3.org/1999/html">
	<div class=outerGridHolder>
		<div v-for="index in Math.floor((Patients.length+1)/2)">
			<div class="column">
				<patient-card
					:id="Patients[(index-1)*2].id"
					:age="Patients[(index-1)*2].age"
					:eGFR="Patients[(index-1)*2].eGFR"
					:hbalc="Patients[(index-1)*2].hbalc"
					:hypos="Patients[(index-1)*2].hypos"
					:name="Patients[(index-1)*2].name"
					:weight="Patients[(index-1)*2].weight">
				</patient-card>
				<div v-if="(index-1)*2 + 1 < Patients.length">
					<patient-card
						:id="Patients[(index-1)*2+1].id"
						:age="Patients[(index-1)*2+1].age"
						:eGFR="Patients[(index-1)*2+1].eGFR"
						:hbalc="Patients[(index-1)*2+1].hbalc"
						:hypos="Patients[(index-1)*2+1].hypos"
						:name="Patients[(index-1)*2+1].name"
						:weight="Patients[(index-1)*2+1].weight">
					</patient-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

import PatientCard from "@/components/patientElements/PatientCard.vue";
import {defineComponent} from "vue";

export default defineComponent({
	name: "DisplayPatients",
	components: {PatientCard},
	data() {
		return {
			Patients: [
				{id: 0, name: "Christian Nykjær", age: 22, weight: 1, hbalc: 76, hypos: 1, eGFR: 100},
				{id: 1, name: "Niels", age: 22, weight: 2, hbalc: 75, hypos: 0, eGFR: 99},
				{id: 2, name: "Alexander", age: 20, weight: 3, hbalc: 77, hypos: 5, eGFR: 98},
				{id: 3, name: "Jonas", age: 21, weight: 4, hbalc: 78, hypos: 4, eGFR: 97},
				{id: 4, name: "Mat", age: 21, weight: 4, hbalc: 78, hypos: 4, eGFR: 97},
			]
		}
	}
})
</script>

<style scoped>
.column {
	display: flex;
}

.outerGridHolder {
	margin: auto;
	padding-top: 20px;
	width: 60%;
	min-width: 740px;
	max-width: 900px;
}
</style>