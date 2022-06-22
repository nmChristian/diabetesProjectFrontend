// Author: Jonas
// Description: File contains methods that is used to check whether a given type should be drawed in a graph
//              For example if a point has the NaN value, then don't draw it

export const dateValueIsValid: (dateValue: DateValue) => boolean = ([date, value]) =>
    !(isNaN(date.getTime()) || isNaN(value))
export const pointIsValid: (point: Point) => boolean = ([x, y]) =>
    !(isNaN(x) || isNaN(y))
export const bucketPointIsValid: (bucketPoint: BucketPoint) => boolean = ([x, values]) =>
    !(isNaN(x) || values.includes(NaN))