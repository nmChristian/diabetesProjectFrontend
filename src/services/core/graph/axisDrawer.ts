import type {Axis, AxisDomain, AxisScale} from "d3-axis";
import type {ValueFn} from "d3";
import * as d3 from "d3";
import {CGM_THRESHOLDS} from "@/services/core/shared";
import type {SVG} from "@/services/core/graphMethods";
import {isTarget} from "@/services/core/graphMethods";

export {applyAxis, drawXAxisHighlightEvery12Hours, drawYAxisCGM}

export type AxisModifier<Domain extends AxisDomain> = {
    xOffset?: number,
    yOffset?: number,
    textCSS? : ValueFn<d3.BaseType, unknown, string>,
    lineCSS? : ValueFn<d3.BaseType, unknown, string>,
    removeDomain? : boolean,
}

export enum AxisDirection {Top, Right, Left, Bottom}

function applyAxis<Domain extends AxisDomain> (svg: SVG, axis : Axis<Domain>, axisModifier : AxisModifier<Domain>) : d3.Selection<SVGGElement, undefined, null, undefined> {
    const svgAxis = svg.append("g")
        .attr("transform", "translate(" + (axisModifier.xOffset ?? 0) + "," + (axisModifier.yOffset ?? 0) + ")" )
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

function drawYAxisCGM<Domain extends AxisDomain>(svg: SVG, yScale: d3.AxisScale<Domain>) {
    const highlightTarget = (i: number) =>
        "font-size: " + (isTarget(i - 1) ? "12" : "12") + ";" +
        "font-weight: " + (isTarget(i - 1) ? "bold" : "normal") + ";"

    const axis = d3.axisLeft(yScale)
        .tickValues(CGM_THRESHOLDS.map(d => d.x0) as Iterable<Domain>)
    applyAxis(svg, axis, {textCSS : (d, i) => highlightTarget(i)})
}

function drawXAxisHighlightEvery12Hours(svg: SVG, xScale: d3.AxisScale<number>, height: number) {
    const highlightedTime = (d: number) => d % 12 === 0
    const textCSS = (d: any) => (highlightedTime(d) ?
            "font-size: 12; font-weight: bold;" :
            "font-size: 10; font-weight: normal;"
    )
    const axis = d3.axisBottom(xScale)
        .tickFormat(d => d + ":00")
    applyAxis(svg, axis, {yOffset: height, textCSS : textCSS})
}




function toGenerator<Domain extends AxisDomain> (direction: AxisDirection) : (scale: AxisScale<Domain>) => Axis<Domain> {
    switch(direction){
        case AxisDirection.Top:
            return d3.axisTop
        case AxisDirection.Right:
            return d3.axisRight
        case AxisDirection.Left:
            return d3.axisLeft
        case AxisDirection.Bottom:
            return d3.axisBottom
    }
}