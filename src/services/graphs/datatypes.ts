import * as d3 from "d3";
import type {CGMRanges} from "@/services/core/shared";
import {COLOR_SCHEME, dateToSeconds} from "@/services/core/shared";
import type {TimeSeries} from "@/services/core/db-types";
import {TimeUnit} from "@/services/graphs/graph-types";

export {toDateValue, timeSeriesToDateValue, toBuckets, bucketToMedian}
export {addEdgesToSplit, addEdgesToSplitBucket}
export {getCGMOccurrences}

const toDateValue = <T>(rawDataArray: T[], conversion: (rawData: T) => DateValue): DateValue[] =>
    rawDataArray.map<DateValue>(conversion)

const timeSeriesToDateValue = (timeSeries: TimeSeries[],
                               modifyValueBy: (value: number) => number = (v) => v) =>
    toDateValue<TimeSeries>(
        timeSeries,
        ({t, v}) => [new Date(t * 1000), modifyValueBy(v)])

// Buckets
export const
    SPLIT_BY_HOUR = 3600,
    SPLIT_BY_DAY = SPLIT_BY_HOUR * 24,
    SPLIT_BY_WEEK = SPLIT_BY_DAY * 7

const TIME_UNIT_DEFAULT = TimeUnit.Hour

// Collect data into buckets based on the time of day it was taken
function toBuckets(dateValues: DateValue[],
                   splitAfterSeconds: number, resolution: number,
                   outputUnit: TimeUnit = TIME_UNIT_DEFAULT): BucketPoint[] {

    // TODO: FIX THIS, UPGRADE THE METHOD SO LONGER SPLIT IS POSSIBLE (HOPEFULLY YEAR)
    if (splitAfterSeconds > SPLIT_BY_DAY * 31)
        console.error("Limited by the dateToSeconds method, since it can only go up to 31. of the month")

    const inc = splitAfterSeconds / resolution
    const ranges = new Array<number>(resolution)
    for (let i = 0; i < resolution; i++)
        ranges[i] = inc * i

    // Splits data into the ranges given
    const bins: d3.Bin<DateValue, number>[] = d3.bin<DateValue, number>()
        .value(([date,]: DateValue) => dateToSeconds(date) % splitAfterSeconds)
        .thresholds(ranges)(dateValues)

    // Set the last range's max value, this needs to be done since the d3.bin method sets the upper threshold of last item to be max value of data.
    // Therefore we artificially increase it, so the graph will go all the way to the end
    bins[resolution - 1].x1 = splitAfterSeconds

    // Bin To Bucket, by taking the average of its max and min value
    const unconvertedBuckets: BucketPoint[] = bins.map<BucketPoint>((bin: d3.Bin<DateValue, number>) =>
        [
            // @ts-ignore
            (bin.x0 + bin.x1) / 2,
            bin.map<number>(([, value]) => value)
        ]
    )
    // Convert to timeunit
    return unconvertedBuckets.map<BucketPoint>(([x, values]) => [x / outputUnit, values])
}


function addEdgesToSplit(points: Point[], splitAfterSeconds: number, timeUnit: TimeUnit = TIME_UNIT_DEFAULT) {
    const [, start] = points[0]
    const [, stop] = points[points.length - 1]
    const edge = (start + stop) / 2

    // Add edge values
    points.splice(0, 0, [0, edge])
    points.push([splitAfterSeconds / timeUnit, edge])
}

function addEdgesToSplitBucket(bucketPoints: BucketPoint[], splitAfterSeconds: number, timeUnit: TimeUnit = TIME_UNIT_DEFAULT) {
    const [, startValues] = bucketPoints[0]
    const [, stopValues] = bucketPoints[bucketPoints.length - 1]
    const edge = startValues.map<number>((_, i) => (startValues[i] + stopValues[i]) / 2)

    // Add edge values
    bucketPoints.splice(0, 0, [0, edge])
    bucketPoints.push([splitAfterSeconds / timeUnit, edge])
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

function getCGMOccurrences(data: DateValue[], cgmRanges: CGMRanges): number[] {
    const occurrences: number[] = Array(cgmRanges.length).fill(0)

    // Place each point based on first value
    const bisect = d3.bisector<[number, number?], number>(d => d[0])

    // Its weight is half the time between each neighbor date
    // For example, if a point is good and the next data is in the bad area in 1 hour, followed by good after 30 mins, then the data will be (30 mins of good, (30 + 15) mins of bad, 15 mins of good)
    data.map<number>(([date, value], i, data) => occurrences[bisect.right(cgmRanges, value) - 1] += (d3.timeSecond.count(data[i - 1]?.[0] ?? date, data[i + 1]?.[0] ?? date) / 2))

    return occurrences
}

export const mMolPerLToMgPerDL = (cgm: number) => cgm * 18
export const iffcToDCCT = (iffc : number) => (iffc + 23.5)/10.93
const cgmBisector = d3.bisector<[number,number?], number>(d => d[0])
export const getCGMColor = (cgm: number, cgmRanges: CGMRanges) => COLOR_SCHEME[cgmBisector.right(cgmRanges, cgm) - 1]
