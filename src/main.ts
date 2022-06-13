import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ListViewPatientElement from "@/components/patientElements/ListViewPatientElement.vue";
import InfoElement from "@/components/patientElements/InfoElement.vue";
import GallaeryViewPatientElement from "@/components/patientElements/GallaeryViewPatientElement.vue";
import DisplayPatientsFullList from "@/components/patientElements/DisplayPatientsFullList.vue";
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

console.log(backend.getDataURL())

app.config.globalProperties.msg = "fem"

app.use(router)

app.mount('#app')
