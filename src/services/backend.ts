import {getApiKey} from "@/services/authentication";
import axios from "axios";

class Backend {
    public url: string

    constructor() {
        this.url = "http://localhost:5000/api/v1"
    }

    public getUrlData() {
        return this.url + "/data/get"
    }
    public getCGMData (daysBack : number) {
        return axios.post(backend.getUrlData(),
            backend.getCGMDaysBack(7),
            backend.generateHeader())
    }
    /**
     * Returns the data type that is used to request the GCM data N days back
     * @param daysBack - The amount of days we have to go back
     */
    public getCGMDaysBack(daysBack: number) {
        const daysSince = (new Date().getTime() - new Date("2022-01-30").getTime()) / (3600 * 1000 * 24)
        return {
            ndays: Math.ceil(daysBack + daysSince),
            show: ["cgm"]
        }
    }

    public generateHeader() : { headers: { api_key: string } } {
        const api : string = getApiKey() ?? ""
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