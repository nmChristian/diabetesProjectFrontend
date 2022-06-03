import * as d3 from "d3";
import {dateToSeconds} from "@/services/core/shared";

export type {DateValue, Point, BucketPoint}
export {toData, toBuckets, bucketToMedian, bucketToQuantile}

// The data
type DateValue = [Date, number]

// For graphs
type Point = [number, number]
type BucketPoint = [number, number[]]

enum TimeUnit {
    Seconds = 1,
    Minute = 60,
    Hour = 3600,
    Day = 3600 * 24,
}



const toData = <T>(rawDataArray: T[], conversion: (rawData: T) => DateValue): DateValue[] =>
    rawDataArray.map<DateValue>(conversion)

const binToBuckets = (bins: d3.Bin<DateValue, number>[]): BucketPoint[] =>
    bins.map<BucketPoint>((bin: d3.Bin<DateValue, number>) =>
        // Convert each bin to a bucket, by taking the average of its max and min value
        [
            // @ts-ignore
            (bin.x0 + bin.x1) / 2,
            bin.map<number>((data: DateValue) => data[1])
        ]
    )

export const
    SPLIT_BY_HOUR = 3600,
    SPLIT_BY_DAY = SPLIT_BY_HOUR * 24,
    SPLIT_BY_WEEK = SPLIT_BY_DAY * 7

// Collect data into buckets based on the time of day it was taken
function toBuckets(dateValues: DateValue[],
                   splitAfterSeconds: number, resolution : number,
                   outputUnit: TimeUnit = TimeUnit.Hour): BucketPoint[] {

    // TODO: FIX THIS, UPGRADE THE METHOD SO LONGER SPLIT IS POSSIBLE (HOPEFULLY YEAR)
    if (splitAfterSeconds > SPLIT_BY_DAY * 31)
        console.error("Limited by the dateToSeconds method, since it can only go up to 31. of the month")

    const inc = splitAfterSeconds / resolution
    const ranges = new Array<number>(resolution)
    for (let i = 0; i < resolution; i++)
        ranges[i] = inc * i

    // Splits data into the ranges given
    const bins: d3.Bin<DateValue, number>[] = d3.bin<DateValue, number>()
        .value(([date,] : DateValue) => dateToSeconds(date) % splitAfterSeconds)
        .thresholds(ranges)(dateValues)

    // Set the last range's max value, this needs to be done since the d3.bin method sets the upper threshold of last item to be max value of data.
    // Therefore we artificially increase it, so the graph will go all the way to the end
    bins[resolution - 1].x1 = splitAfterSeconds

    return binToBuckets(bins).map<BucketPoint>(([x, values]) => [x / outputUnit, values])
}

const bucketToMedian = (bucketPoints: BucketPoint[]): Point[] =>
    bucketPoints.map<Point>((d: BucketPoint) => [d[0], d3.median(d[1]) ?? NaN])

function bucketToQuantile(bucketPoints: BucketPoint[], quantiles: number[]): BucketPoint[] {
    // Sort values inside bucket to calculate quantiles faster
    let sortedBucketPoints = bucketPoints.map<BucketPoint>(d => [d[0], d[1].sort(d3.ascending)])

    // For each bucket
    return sortedBucketPoints.map<BucketPoint>((bucketPoint: BucketPoint) =>
        // Generate each quantile based on dataset
        [
            bucketPoint[0],
            quantiles.map<number>((quantile: number) => d3.quantileSorted(bucketPoint[1], quantile) ?? NaN)
        ]
    )
}

// Create a value at 00:00 and 24:00 so that graph line goes all the way to the end


// How do I convert Point to DBType
export class CGMData {

}




