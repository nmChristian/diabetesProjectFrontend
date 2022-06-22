// Author: Jonas
// Description: Contains helper functions that is used when drawing graphs (this is for axis')
import type {Axis, AxisDomain} from "d3-axis";
import type {ValueFn} from "d3";
import * as d3 from "d3";
import type {SVG} from "@/services/graphs/drawers/svg-drawer";
import {isTarget} from "@/services/graphs/drawers/line-drawer";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {CGM_RANGE} from "@/services/graphs/auxiliary/cgm";

export {applyAxis, drawXAxisHighlightEvery12Hours, drawYAxisCGM}

export type AxisModifier<Domain extends AxisDomain> = {
    xOffset?: number,
    yOffset?: number,
    textCSS?: ValueFn<d3.BaseType, unknown, string>,
    lineCSS?: ValueFn<d3.BaseType, unknown, string>,
    removeDomain?: boolean,
}

function applyAxis<Domain extends AxisDomain>(svg: SVG, axis: Axis<Domain>, axisModifier: AxisModifier<Domain>): d3.Selection<SVGGElement, undefined, null, undefined> {
    const svgAxis = svg.append("g")
        .attr("transform", "translate(" + (axisModifier.xOffset ?? 0) + "," + (axisModifier.yOffset ?? 0) + ")")
        .call(axis)

    svgAxis
        .selectAll("text")
        .attr("style", axisModifier.textCSS ?? "")

    svgAxis.selectAll(".tick line")
        .attr("style", axisModifier.lineCSS ?? "")

    if (axisModifier.removeDomain === true)
        svgAxis.select(".domain").remove()

    return svgAxis
}

function drawYAxisCGM<Domain extends AxisDomain>(svg: SVG, yScale: d3.AxisScale<Domain>, cgmRange: CGMRanges) {
    const highlightTarget = (i: number) =>
        "font-size: " + (isTarget(i - 1) ? "12" : "12") + ";" +
        "font-weight: " + (isTarget(i - 1) ? "bold" : "normal") + ";"

    const axis = d3.axisLeft(yScale)
        .tickValues([...cgmRange.map(d => d[0]), CGM_RANGE[1]] as Iterable<Domain>)
    applyAxis(svg, axis, {textCSS: (d, i) => highlightTarget(i)})
}

function drawXAxisHighlightEvery12Hours(svg: SVG, xScale: d3.AxisScale<number>, height: number) {
    const highlightedTime = (d: number) => d % 12 === 0
    const textCSS = (d: any) => (highlightedTime(d) ?
            "font-size: 12; font-weight: bold;" :
            "font-size: 10; font-weight: normal;"
    )
    const axis = d3.axisBottom(xScale)
        .tickFormat(d => d + ":00")
    applyAxis(svg, axis, {yOffset: height, textCSS: textCSS})
}

