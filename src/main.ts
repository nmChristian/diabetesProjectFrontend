import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ListViewPatientElement from "@/components/patientElements/ListViewPatientElement.vue";
import InfoElement from "@/components/patientElements/InfoElement.vue";
import GallaeryViewPatientElement from "@/components/patientElements/GallaeryViewPatientElement.vue";
import IconGraph from "@/components/charts/IconGraph.vue"
import DisplayPatientsFullList from "@/components/patientElements/DisplayPatientsFullList.vue";

const app = createApp(App)

app
    .component("InfoElement",InfoElement)
    .component("ListViewPatientElement",ListViewPatientElement)
    .component("IconGraph",IconGraph)
    .component("GallaeryViewPatientElement",GallaeryViewPatientElement)
    .component("PatientsFullList",DisplayPatientsFullList)


app.use(router)

app.mount('#app')
