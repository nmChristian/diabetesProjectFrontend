export type {UserDetails, TimeSeries,Diagnosis,Note}

type ExtraData = {HbA1c: number, weight: number, blood_pressure: number}
type UserDetails = {_id : any,
    email: string, profile_picture: string,
    first_name: string, last_name: string, age : number,
    is_doctor : boolean,
    extra_data: ExtraData,
    glycemic_ranges: number[], glycemic_targets: number[]}

type TimeSeries = { t: number, v: number }
type Diagnosis = { "name": string , medicine : Array<string>, _id: {$oid: string}}
type Note = {_id: { $oid: string }, text: string, private: false, writer: {$oid: string},
"timestamp": {
    "$date": "2022-06-08T16:21:42.600Z"
}
}
export type Answer = { success: boolean, errorMessage: string }


export const defaultUserDetails : UserDetails = {
    email: "", profile_picture: "",
    first_name: "", last_name: "", age: 0,
    is_doctor: false, _id: {},
    extra_data: {HbA1c:0, weight: 0, blood_pressure: 0},
    glycemic_ranges: Array(4).fill(NaN),
    glycemic_targets: Array(5).fill(NaN),
}
