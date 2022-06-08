import type {Axis, AxisDomain, AxisScale} from "d3-axis";
import type {BaseType, ValueFn} from "d3";
import * as d3 from "d3";
import {CGM_THRESHOLDS} from "@/services/core/shared";
import type {SVG} from "@/services/core/graphMethods";
import {isTarget} from "@/services/core/graphMethods";

export {applyAxis, drawXAxisHighlightEvery12Hours, drawYAxisCGM}

export type AxisModifier<Domain extends AxisDomain> = {
    xOffset?: number,
    yOffset?: number,
    css? : ValueFn<d3.BaseType, unknown, string>,
}

export enum AxisDirection {Top, Right, Left, Bottom}

function applyAxis<Domain extends AxisDomain> (svg: SVG, axis : Axis<Domain>, axisModifier : AxisModifier<Domain>) {
    svg.append("g")
        .attr("transform", "translate(" + (axisModifier.xOffset ?? 0) + "," + (axisModifier.yOffset ?? 0) + ")" )
        .call(axis)
        .selectAll("text")
        .attr("style", axisModifier.css ?? "")
}

function drawYAxisCGM<Domain extends AxisDomain>(svg: SVG, yScale: d3.AxisScale<Domain>) {
    const highlightTarget = (i: number) =>
        "font-size: " + (isTarget(i - 1) ? "12" : "12") + ";" +
        "font-weight: " + (isTarget(i - 1) ? "bold" : "normal") + ";"

    const axis = d3.axisLeft(yScale)
        .tickValues(CGM_THRESHOLDS.map(d => d.x0) as Iterable<Domain>)
    applyAxis(svg, axis, {css : (d, i) => highlightTarget(i)})
}

function drawXAxisHighlightEvery12Hours(svg: SVG, xScale: d3.AxisScale<number>, height: number) {
    const highlightedTime = (d: number) => d % 12 === 0
    const textCSS = (d: any) => (highlightedTime(d) ?
            "font-size: 12; font-weight: bold;" :
            "font-size: 10; font-weight: normal;"
    )
    const axis = d3.axisBottom(xScale)
        .tickFormat(d => d + ":00")
    applyAxis(svg, axis, {yOffset: height, css : textCSS})
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