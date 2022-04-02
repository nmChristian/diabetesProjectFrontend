import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import InfoElement from "@/components/patientElements/InfoElement.vue";
import GallaeryViewPatientElement from "@/components/patientElements/GallaeryViewPatientElement.vue";

const app = createApp(App)

app
    .component("InfoElement",InfoElement)
    .component("GallaeryViewPatientElement",GallaeryViewPatientElement)


app.use(router)

app.mount('#app')
