import * as d3 from "d3";
export {healthLevelToColor}

// For graphs
export type Point = [number, number | undefined]
// The data
export type Data = [Date, number]

export type BucketPoint = [number, (number | undefined)[]]


export enum HealthLevel {
    VeryLow,
    Low,
    Good,
    High,
    VeryHigh
}

const healthLevelToColor = (healthLevel : HealthLevel) : string  => colorScheme[healthLevel]
const toData = <T>(rawDataArray : T[], conversion : (rawData : T) => Data) : Data[] =>
    rawDataArray.map<Data>(conversion)

const toMedian = (bucketPoints : BucketPoint[]) : Point[] =>
    bucketPoints.map<Point>((d : BucketPoint) => [d[0], d3.median(d[1])])

function toQuantile (bucketPoints : BucketPoint[], quantiles : number[]) : BucketPoint[] {
    // Sort values inside bucket to calculate quantiles faster
    let sortedBucketPoints = bucketPoints.map<BucketPoint>(d => [d[0], d[1].sort(d3.ascending)])

    // For each bucket
    let quantileBucketPoints = sortedBucketPoints.map<BucketPoint>((bucketPoint : BucketPoint) =>
        // Generate each quantile based on dataset
        [
            bucketPoint[0],
            quantiles.map<number | undefined>((quantile : number) => d3.quantileSorted(bucketPoint[1], quantile))
        ]
    )

    return quantileBucketPoints
}

// Create a value at 00:00 and 24:00 so that graph line goes all the way to the end

const colorScheme : string[] = ["#33658a","#78c0e0","#5da271","#dda448","#92140c"]
const thresholds =
    [{x0 : 0, x1 : 54}
    ,{x0 : 54, x1 : 70}
    ,{x0 : 70, x1 : 180}
    ,{x0 : 180, x1 : 250}
    ,{x0 : 250, x1 : undefined}]



// How do I convert Point to DBType
export class CGMData {

}




