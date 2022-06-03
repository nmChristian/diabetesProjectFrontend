import * as d3 from "d3";
import {getTimeOfDayInSeconds} from "@/services/core/shared";

export type {Data, Point, BucketPoint}
export {toData, dataToBucketByTimeOfDay, bucketToMedian, bucketToQuantile}

// The data
type Data = [Date, number]

// For graphs
type Point = [number, number]
type BucketPoint = [number, number[]]


const toData = <T>(rawDataArray : T[], conversion : (rawData : T) => Data) : Data[] =>
    rawDataArray.map<Data>(conversion)

const binToBucketPoints = (bins : d3.Bin<Data, number>[]) : BucketPoint[] =>
    bins.map<BucketPoint>((bin : d3.Bin<Data, number>) =>
            // Convert each bin to a bucket, by taking the average of its max and min value
            [
                // @ts-ignore
                (bin.x0 + bin.x1) / 2,
                bin.map<number>((data : Data) => data[1])
            ]
    )

// Collect data into buckets based on the time of day it was taken
function dataToBucketByTimeOfDay (data : Data[], dataPointsPerHour : number) : BucketPoint[] {
    const nRanges = dataPointsPerHour * 24
    const inc = 3600 / dataPointsPerHour
    const ranges = new Array<number>(nRanges)
    for (let i = 0; i < nRanges; i++)
        ranges[i] = inc * i

    // Splits data into the ranges given
    const bins : d3.Bin<Data, number>[] = d3.bin<Data, number>()
        .value((d : Data) => getTimeOfDayInSeconds(d[0]))
        .thresholds(ranges)(data)

    // Set the last range's max value to be second of day, this needs to be done since the d3.bin method sets the upper threshold of last item to be max value of data.
    // Therefore we artificially increase it to be the last second, so the graph will go all the way to the end
    bins[nRanges - 1].x1 = 3600 * 24

    return binToBucketPoints(bins)
}

const bucketToMedian = (bucketPoints : BucketPoint[]) : Point[] =>
    bucketPoints.map<Point>((d : BucketPoint) => [d[0], d3.median(d[1]) ?? NaN])

function bucketToQuantile (bucketPoints : BucketPoint[], quantiles : number[]) : BucketPoint[] {
    // Sort values inside bucket to calculate quantiles faster
    let sortedBucketPoints = bucketPoints.map<BucketPoint>(d => [d[0], d[1].sort(d3.ascending)])

    // For each bucket
    return sortedBucketPoints.map<BucketPoint>((bucketPoint : BucketPoint) =>
        // Generate each quantile based on dataset
        [
            bucketPoint[0],
            quantiles.map<number>((quantile : number) => d3.quantileSorted(bucketPoint[1], quantile) ?? NaN)
        ]
    )
}

// Create a value at 00:00 and 24:00 so that graph line goes all the way to the end



// How do I convert Point to DBType
export class CGMData {

}




