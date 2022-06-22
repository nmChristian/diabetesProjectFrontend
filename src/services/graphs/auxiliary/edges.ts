// Author: Jonas
// Description: Contains functions that add edges to graphs. An edge is the point at start and end of a timeinterval (0:00 and 24:00 for example)
//              This is because otherwise the graph won't draw a line from 0:00 or to 24:00
import {TIME_UNIT_DEFAULT, TimeUnit} from "@/services/graphs/shared";

// For points
export function addEdgesToSplit(points: Point[], splitAfterSeconds: number, timeUnit: TimeUnit = TIME_UNIT_DEFAULT) {
    const [, start] = points[0]
    const [, stop] = points[points.length - 1]
    const edge = (start + stop) / 2

    // Add edge values
    points.splice(0, 0, [0, edge])
    points.push([splitAfterSeconds / timeUnit, edge])
}

// For buckets
export function addEdgesToSplitBucket(bucketPoints: BucketPoint[], splitAfterSeconds: number, timeUnit: TimeUnit = TIME_UNIT_DEFAULT) {
    const [, startValues] = bucketPoints[0]
    const [, stopValues] = bucketPoints[bucketPoints.length - 1]
    const edge = startValues.map<number>((_, i) => (startValues[i] + stopValues[i]) / 2)

    // Add edge values
    bucketPoints.splice(0, 0, [0, edge])
    bucketPoints.push([splitAfterSeconds / timeUnit, edge])
}
