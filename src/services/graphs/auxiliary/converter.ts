// Author: Jonas
// Description: Contains common functions that converts types to other types
import * as d3 from "d3";
import {dateToSeconds, SPLIT_BY_DAY, TIME_UNIT_DEFAULT, TimeUnit} from "@/services/graphs/shared";
import type {TimeSeries} from "@/services/db-types";

// Convert any type to DateValue[]
export const toDateValue = <T>(rawDataArray: T[], conversion: (rawData: T) => DateValue): DateValue[] =>
    rawDataArray.map<DateValue>(conversion)

// Convert a TimeSeries[] to DateValue[]
export const timeSeriesToDateValue = (timeSeries: TimeSeries[],
                               modifyValueBy: (value: number) => number = (v) => v) =>
    toDateValue<TimeSeries>(
        timeSeries,
        ({t, v}) => [new Date(t * 1000), modifyValueBy(v)])

// Collect data into buckets based on the time of day it was taken
export function toBuckets(dateValues: DateValue[],
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

// Get each buckets median
export const bucketToMedian = (bucketPoints: BucketPoint[]): Point[] =>
    bucketPoints.map<Point>((d: BucketPoint) => [d[0], d3.median(d[1]) ?? NaN])
