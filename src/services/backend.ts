class Backend {
    public url : string
    constructor() {
        this.url = "http://localhost:5000/api/v1"
    }
    
    public getUrlData () {
        return this.url + "/data/get"
    }

    /**
     * Returns the data type that is used to request the GCM data N days back
     * @param daysBack - The amount of days we have to go back
     */
    public getCGMDaysBack (daysBack : number) {
        const daysSince = (new Date().getTime() - new Date("2022-01-30").getTime()) / (3600 * 1000 * 24)
        return {
            ndays: Math.ceil(daysBack + daysSince),
            show: ["cgm"]
        }
    }

    public getHeader (user : number) {
        let api = this.getHeader0();
        if (user == 200) api = this.getHeader200()

        return {
            headers: api
        }
    }

    readonly LAPTOP = false;
    private getHeader0 () {
        if (this.LAPTOP) return {
            api_key: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYyNzI3ZWNhYWNiNjQzY2FiYzY1Y2Y0ZiIsInRpbWVzdGFtcCI6MTY1MTY3NTUzMn0.7EOfpKouDZYiw5xueIKubKuJyUnj3YXVPfKJfRTCBi0"
        }
        else return {
            api_key: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYyOWExYzAzOTRjMzBhYjMxMTllOWQwNyIsInRpbWVzdGFtcCI6MTY1NDI2NzEwNH0.o_Fggo1_c_8lwgqsy0reabizk4MdFGAWgE91pUjAKVg"
        }
    }
    private getHeader200 () {
        if (this.LAPTOP) return {
            api_key: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYyNzI3ZWNhYWNiNjQzY2FiYzY1ZDAxNyIsInRpbWVzdGFtcCI6MTY1MTY3NjY0NX0.xVffLQzpt0qtkwucOel24WHad_wTM3fGI9INLHCZUxk"
        }
        else return {
            api_key: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjYyOWExYzAzOTRjMzBhYjMxMTllOWRjZiIsInRpbWVzdGFtcCI6MTY1NDI2NzE5NH0.kN4bJCQx9S9Cq-pC6fnhGIG6GM3da8HBce0vUabBxiw"
        }
    }
}

const backend : Backend = new Backend()
export default backend