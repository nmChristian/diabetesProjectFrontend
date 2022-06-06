import type {AxisDomain} from "d3-axis";
import type {ValueFn} from "d3";
import * as d3 from "d3";
import {CGM_THRESHOLDS} from "@/services/core/shared";
import {isTarget} from "@/services/core/graphMethods";

type SVG = d3.Selection<SVGGElement, undefined, null, undefined>

export function drawXAxis<Domain extends AxisDomain>(svg: SVG, xScale: d3.AxisScale<Domain>, height: number,
                                                     textCSS?: ValueFn<d3.BaseType, unknown, string>,
                                                     textFormat?: (domainValue: Domain, index: number) => string) {

    const axis = d3.axisBottom<Domain>(xScale)
    if (textFormat !== undefined)
        axis.tickFormat(textFormat)

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(axis)
        .selectAll("text")
        .attr("style", textCSS ?? "")
}

function drawYAxis<Domain extends AxisDomain>(svg: SVG, yScale: d3.AxisScale<Domain>,
                                              textCSS?: ValueFn<d3.BaseType, unknown, string>,
                                              values?: Iterable<Domain>) {
    const axis = d3.axisLeft<Domain>(yScale)
    if (values !== undefined)
        axis.tickValues(values)
// d3.axisLeft<Domain>(yScale).tickValues(CGM_THRESHOLDS.map(d => d.x0) as Iterable<Domain>)
    svg.append("g")
        .call(axis)
        .selectAll("text")
        .attr("style", textCSS ?? "")
}

export function drawYAxisCGM<Domain extends AxisDomain>(svg: SVG, yScale: d3.AxisScale<Domain>) {
    const highlightTarget = (i: number) =>
        "font-size: " + (isTarget(i - 1) ? "12" : "12") + ";" +
        "font-weight: " + (isTarget(i - 1) ? "bold" : "normal") + ";"

    drawYAxis<Domain>(svg, yScale,
        (d, i) => highlightTarget(i),
        CGM_THRESHOLDS.map(d => d.x0) as Iterable<Domain>)
}

export function drawXAxisHighlightEvery12Hours(svg: SVG, xScale: d3.AxisScale<number>, height: number) {
    const highlightedTime = (d: number) => d % 12 === 0
    const textCSS = (d: any) => (highlightedTime(d) ?
            "font-size: 12; font-weight: bold;" :
            "font-size: 10; font-weight: normal;"
    )

    const textFormat = (ds: number) => ds + ":00"

    drawXAxis<number>(svg, xScale, height, textCSS, textFormat)
}