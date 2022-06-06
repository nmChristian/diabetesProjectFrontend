// Target is the are which is green
import {CGM_RANGE, CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";
import * as d3 from "d3";
import type {ScaleContinuousNumeric} from "d3";
import {max} from "d3";

const targetLineStyle = "stroke-width: 1.5; opacity: .5; stroke: " + COLOR_SCHEME[COLOR_SCHEME.length / 2 + 1] + ";"
const otherLineStyle = "stroke-width: 1; opacity: .1; stroke: black;"
const isTarget = (i : number) => i === 1 || i === 2

export const getLineStyle = (i : number) =>
    "fill: none;" + (isTarget(i) ?  targetLineStyle : otherLineStyle)
const getFontStyle = (i : number) =>
    "font-size: " + isTarget(i - 1) ? "12" : "10"
    + "; font-weight: " + isTarget(i - 1) ? "bold" : "normal" + ";"

export function drawYAxis (svg : d3.Selection<SVGGElement, undefined, null, undefined>, yScale : d3.ScaleLinear<number, number>) {
    svg.append("g")
        .call(d3.axisLeft(yScale).tickValues(CGM_THRESHOLDS.map(d => d.x0)))
        .selectAll("text")
        .attr("style",(d,i) => getFontStyle(i))
}