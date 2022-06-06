import * as d3 from "d3";
import type {SVG} from "@/services/core/graphMethods";
import type {AxisDomain} from "d3-axis";
import type {ValueFn} from "d3";
import {pointIsValid} from "@/services/core/datatypes";

const defaultLineCSS = "stroke-width: 1; opacity: .1;fill: none; stroke: black;"
export function drawVerticalLines<XDomain extends AxisDomain, YDomain> (svg : SVG,
                                                                        xScale : d3.AxisScale<XDomain>, yScale : d3.AxisScale<YDomain>,
                                                                        xCoords : XDomain[],
                                                                        lineCSS?: ValueFn<d3.BaseType, unknown, string>) {

    const yMin = yScale.range()[1]
    const yMax = yScale.range()[0]

    svg.append("g")
        .selectAll("path")
        .data(xCoords)
        .join("path")
        .attr("d", (xCoord) =>
            d3.line().defined(pointIsValid)
            ([[xScale(xCoord)??NaN, yMin], [xScale(xCoord)??NaN, yMax]]))
        .attr("style", lineCSS ?? defaultLineCSS)
}


export function drawHorizontalLines<XDomain extends AxisDomain, YDomain> (svg : SVG,
                                                                        xScale : d3.AxisScale<XDomain>, yScale : d3.AxisScale<YDomain>,
                                                                        yCoords : YDomain[],
                                                                        lineCSS?: ValueFn<d3.BaseType, unknown, string> ) {
    const xMin = xScale.range()[1]
    const xMax = xScale.range()[0]

    svg.append("g")
        .selectAll("path")
        .data(yCoords)
        .join("path")
        .attr("d", (yCoord) =>
            d3.line().defined(pointIsValid)
            ([[xMin, yScale(yCoord)??NaN], [xMax, yScale(yCoord)??NaN]]))
        .attr("style", lineCSS ?? defaultLineCSS)
}