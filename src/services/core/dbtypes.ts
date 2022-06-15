export type {UserDetails, TimeSeries,Diagnosis}

type UserDetails = { email: string, first_name: string, last_name: string , is_doctor : boolean, _id : any, age : number, profile_picture: string}
type TimeSeries = { t: number, v: number }
type Diagnosis = { "name": "string" , medicine : Array<string>}
export type Answer = { success: boolean, errorMessage: string }