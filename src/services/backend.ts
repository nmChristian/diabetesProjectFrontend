import {getApiKey} from "@/services/authentication";
import axios from "axios";
import type {DateValue} from "@/services/core/datatypes";
import {mMolPerLToMgPerL, timeSeriesToDateValue} from "@/services/core/datatypes";
import type {UserDetails, Diagnosis, Note} from "@/services/core/dbtypes";
import * as d3 from "d3";

class Backend {
    public url: string

    constructor() {
        this.url = "http://localhost:5000/api/v1"
    }

    public getDataURL = () => this.url + "/data/get"
    public getDataURLPatient = (id: String) => this.url + "/data/" + id + "/get"
    public getNameURL = () => this.url + "/user"
    public getAllDataURL = () => this.url + "/data/get_previews"
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

    public async getDiagnosis(id: string): Promise<Array<Diagnosis>> {
        const response = await axios.get(
            this.getDiagnosisURL(id),
            this.generateHeader())
        return response.data
    }

    public async getUserDetailsForSpecific(id: String): Promise<UserDetails> {
        let users = (await this.getViewvabel())
        for (let i = 0; i < users.length; i++) {
            if (users[i]._id.$oid === id) {
                return users[i]
            }
        }
        return {email: "", first_name: "", last_name: "", is_doctor: false, _id: {}, age: 0, profile_picture: ""}
    }

    public async getViewvabel(): Promise<Array<UserDetails>> {
        const response = await axios.get(
            this.getNameURL(),
            this.generateHeader())
        return response.data.viewable
    }

    public async getCGMDataPatient(daysBack: number, patientId: String): Promise<DateValue[]> {
        const daysSinceLastData = d3.timeDays(new Date("2022-01-29"), new Date()).length

        if (patientId === undefined) {
            return []
        }

        const response = await axios.post(
            this.getDataURLPatient(patientId),
            this.getCGMDaysBack(daysSinceLastData + daysBack),
            this.generateHeader())

        return timeSeriesToDateValue(response.data.cgm, v => v * 18)
    }

    public async getCGMDataMGDL(daysBack: number): Promise<DateValue[]> {
        const daysSinceLastData = d3.timeDays(new Date("2022-01-29"), new Date()).length

        const response = await axios.post(
            this.getDataURL(),
            this.getCGMDaysBack(daysSinceLastData + daysBack),
            this.generateHeader())

        return timeSeriesToDateValue(response.data.cgm, mMolPerLToMgPerL)
    }

    public async getNotes(id: string): Promise<Note[]> {
        console.log(getApiKey())
        const response = await axios.get(
            this.getNotesURL(id),
            this.generateHeader())

        return response.data
    }

    public async postNote(id: string , text: string , isPrivate :boolean ): Promise<Note[]> {
        console.log(getApiKey())
        const response = await axios.post(
            this.getNotesURL(id),
            {text : text , private: isPrivate},
            this.generateHeader())

        return response.data
    }

    public async updateNote(idNote: string , text: string , isPrivate :boolean ): Promise<Note[]> {
        console.log(getApiKey())
        const response = await axios.put(
            this.getNotesURL(idNote),
            {text : text , private: isPrivate},
            this.generateHeader())

        return response.data
    }

    public async getCGMDataMGDLForAllWiewabel(daysBack: number): Promise<{ _id: any, patient: any, values: number[] }[]> {
        const daysSinceLastData = d3.timeDays(new Date("2022-01-29"), new Date()).length

        const response = await axios.post(
            this.getAllDataURL(),
            this.getCGMDaysBack(daysSinceLastData + daysBack),
            this.generateHeader())

        return response.data
    }


    public async getDataPatient(daysBack: number = 7, show: string[] = ["cgm"], patientId: string) {
        if (patientId === undefined) {
            return []
        }
        const daysSinceLastData = d3.timeDays(new Date("2022-01-29"), new Date()).length
        const response = await axios.post(
            this.getDataURLPatient(patientId),
            {ndays: (daysSinceLastData + daysBack), show: show},
            this.generateHeader())

        return response.data
    }

    public async getData(daysBack: number = 7, show: string[] = ["cgm"]) {
        const daysSinceLastData = d3.timeDays(new Date("2022-01-29"), new Date()).length
        const response = await axios.post(
            this.getDataURL(),
            {ndays: (daysSinceLastData + daysBack), show: show},
            this.generateHeader())

        return response.data
    }

    /**
     * Returns the data type that is used to request the GCM data N days back
     * @param daysBack - The amount of days we have to go back
     */
    public getCGMDaysBack = (daysBack: number) => ({ndays: daysBack, show: ["cgm"]})


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