import type {CGMRanges} from "@/services/core/shared";
import {COLOR_SCHEME} from "@/services/core/shared";
import * as d3 from "d3";

export const mMolPerLToMgPerDL = (cgm: number) => cgm * 18
export const iffcToDCCT = (iffc: number) => (iffc + 23.5) / 10.93
export const cgmBisector = d3.bisector<[number, number?], number>(d => d[0])


export const getCGMColor = (cgm: number, cgmRanges: CGMRanges) => COLOR_SCHEME[cgmBisector.right(cgmRanges, cgm) - 1]

export function getCGMOccurrences(data: DateValue[], cgmRanges: CGMRanges): number[] {
    const occurrences: number[] = Array(cgmRanges.length).fill(0)

    // Place each point based on first value
    const bisect = d3.bisector<[number, number?], number>(d => d[0])

    // Its weight is half the time between each neighbor date
    // For example, if a point is good and the next data is in the bad area in 1 hour, followed by good after 30 mins, then the data will be (30 mins of good, (30 + 15) mins of bad, 15 mins of good)
    data.map<number>(([date, value], i, data) => occurrences[bisect.right(cgmRanges, value) - 1] += (d3.timeSecond.count(data[i - 1]?.[0] ?? date, data[i + 1]?.[0] ?? date) / 2))

    return occurrences
}

