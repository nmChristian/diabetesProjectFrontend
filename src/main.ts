import {createApp} from 'vue'
import App from './App.vue'
import router from './index'
import ListViewPatientElement from "@/components/patient-elements/ListViewPatientElement.vue";
import InfoElement from "@/components/patient-elements/InfoElement.vue";
import GallaeryViewPatientElement from "@/components/patient-elements/PatientCard.vue";
import DisplayPatientsFullList from "@/components/patient-elements/DisplayPatientsFullList.vue";
import axios from "axios"
import backend from "@/services/backend";

const app = createApp(App)

app
    .component("InfoElement", InfoElement)
    .component("ListViewPatientElement", ListViewPatientElement)
    .component("GallaeryViewPatientElement", GallaeryViewPatientElement)
    .component("PatientsFullList", DisplayPatientsFullList)

app.config.globalProperties.axios = axios
app.config.globalProperties.$backend = backend

app.config.globalProperties.msg = "fem"

app.use(router)

app.mount('#app')
