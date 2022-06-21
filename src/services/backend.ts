/* Author: Christian, Jonas, Niels */
/* Description: Turns all the api calls into easy usable TS functions */


import {getApiKey} from "@/services/authentication";
import axios from "axios";
import type {DateValue} from "@/services/core/datatypes";
import {mMolPerLToMgPerDL, timeSeriesToDateValue} from "@/services/core/datatypes";
import type {Diagnosis, Note, UserDetails} from "@/services/core/dbtypes";
import * as d3 from "d3";
import router from "@/router";

class Backend {
    public url: string

    constructor() {
        this.url = "http://localhost:5000/api/v1"
    }

    public getDataURL = () => this.url + "/data/get"
    public getDataURLPatient = (id: String) => this.url + "/data/" + id + "/get"
    public getNameURL = () => this.url + "/user"
    public getAllPreviewsURL = () => this.url + "/data/previews"
    public getDiagnosisURL = (id: string) => this.url + "/diagnosis/" + id
    public getNotesURL = (id: string) => this.url + "/note/" + id

    public async getUserDetails(): Promise<UserDetails | null> {
        if (getApiKey() === null) {
            return null;
        }
        const response = await axios.get(
            this.getNameURL(),
            this.generateHeader())
        return response.data.self
    }

    public async saveNewDiagnosis(id: string, diagnosis : string, medecin : string[]){
        const response = await axios.post(
            this.getDiagnosisURL(id),
            {name : diagnosis, medicine: medecin},
            this.generateHeader())
        return response.data
    }

    public async getDiagnosis(id: string): Promise<Array<Diagnosis>> {
        const response = await axios.get(
            this.getDiagnosisURL(id),
            this.generateHeader())
        if(response.status === 404) {
            await router.push('/display-patients-list');
            return []
        }
        return response.data
    }

    public async deleteDiagnosis(id: string): Promise<Array<Diagnosis>> {
        const response = await axios.delete(
            this.getDiagnosisURL(id),
            this.generateHeader())
        return response.data
    }

    public async editDiagnosis(id: string, diagnosis : string, medecin : string[]): Promise<UserDetails> {
        const response = await axios.put(
            this.getDiagnosisURL(id),
            {name : diagnosis, medicine: medecin},
            this.generateHeader())
        return response.data
    }

    public async getUserDetailsForSpecific(id: String): Promise<UserDetails> {
        let users = (await this.getViewabel())
        for (let i = 0; i < users.length; i++) {
            if (users[i]._id.$oid === id) {
                return users[i]
            }
        }

        await router.push('/display-patients-list');

        return {
            glycemic_ranges: [],
            glycemic_targets: [],
            email: "", first_name: "", last_name: "", is_doctor: false, _id: {}, age: 0, profile_picture: "", glycemic_ranges: Array(4).fill(NaN), glycemic_targets: Array(5).fill(NaN)}
    }

    public async getViewabel(): Promise<Array<UserDetails>> {
        const response = await axios.get(
            this.getNameURL(),
            this.generateHeader())
        if(response.status === 404) {
            await router.push('/display-patients-list');
            return []
        }
        return response.data.viewable
    }


    public async getNotes(id: string): Promise<Note[]> {
        const response = await axios.get(
            this.getNotesURL(id),
            this.generateHeader())

        if(response.status === 404) {
            await router.push('/display-patients-list');
            return []
        }
        return response.data
    }

    public async postNote(id: string , text: string , isPrivate :boolean ): Promise<Note[]> {
        const response = await axios.post(
            this.getNotesURL(id),
            {text : text , private: isPrivate},
            this.generateHeader())

        return response.data
    }

    public async updateNote(idNote: string , text: string , isPrivate :boolean ): Promise<Note[]> {
        const response = await axios.put(
            this.getNotesURL(idNote),
            {text : text , private: isPrivate},
            this.generateHeader())

        return response.data
    }

    public async deleteNote(idNote: string): Promise<Note[]> {
        const response = await axios.delete(
            this.getNotesURL(idNote),
            this.generateHeader())

        return response.data
    }

    public async getPreviews(): Promise<{ _id: any, patient: any, values: number[] , problems : number[] }[]> {
        const response = await axios.get(
            this.getAllPreviewsURL(),
            this.generateHeader())
        return response.data
    }


    public async getDataPatient(daysBack: number = 7, show: string[] = ["cgm"], patientId: string) {
        if (patientId === undefined) {
            return []
        }
        const response = await axios.post(
            this.getDataURLPatient(patientId),
            {ndays: (daysBack), show: show},
            this.generateHeader())

        if(response.status === 404) {
            await router.push('/display-patients-list');
            return []
        }
        return response.data
    }

    public async getData(daysBack: number = 7, show: string[] = ["cgm"]) {
        const response = await axios.post(
            this.getDataURL(),
            {ndays: (daysBack), show: show},
            this.generateHeader())

        if(response.status === 404) {
            await router.push('/display-patients-list');
            return []
        }

        return response.data
    }

    public generateHeader(): { headers: { api_key: string } } {
        const api: string = getApiKey() ?? ""
        return {
            headers: {api_key: api}
        }
    }


    /*
    *   import cgm_083 from "@/assets/demo/users/cgm_083.json"  // 95% 5%
        import cgm_123 from "@/assets/demo/users/cgm_123.json"  // 76% 21% 3%
        import cgm_200 from "@/assets/demo/users/cgm_200.json"  // 2% 80% 15% 4%
        import cgm_538 from "@/assets/demo/users/cgm_538.json"  // Lowest and nice 100%
    * */
}

const backend: Backend = new Backend()
export default backend