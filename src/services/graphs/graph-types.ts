// Author: Jonas
// Description: Types used in graphs

// Is Valid methods
export const dateValueIsValid: (dateValue: DateValue) => boolean = ([date, value]) =>
    !(isNaN(date.getTime()) || isNaN(value))
export const pointIsValid: (point: Point) => boolean = ([x, y]) =>
    !(isNaN(x) || isNaN(y))
export const bucketPointIsValid: (bucketPoint: BucketPoint) => boolean = ([x, values]) =>
    !(isNaN(x) || values.includes(NaN))


// Time
export enum TimeUnit {
    Seconds = 1,
    Minute = 60,
    Hour = 3600,
    Day = 3600 * 24,
}