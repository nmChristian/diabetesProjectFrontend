import * as d3 from "d3";
import type {SVG} from "@/services/core/graphMethods";
import type {AxisDomain} from "d3-axis";
import type {AxisScale, BaseType, ValueFn} from "d3";
import {pointIsValid} from "@/services/core/datatypes";
import {CGM_THRESHOLDS} from "@/services/core/shared";
import {highlightTargetLineStyle} from "@/services/core/graphMethods";

const defaultLineCSS = "opacity: .1; fill: none; stroke: black;"
export function drawVerticalLines<XDomain extends AxisDomain, YDomain> (svg : SVG,
                                                                        xScale : d3.AxisScale<XDomain>,
                                                                        yScale : d3.AxisScale<YDomain>,
                                                                        xCoords : XDomain[],
                                                                        strokeWidth : number = 1,
                                                                        lineCSS?: ValueFn<d3.BaseType, unknown, string>)
{
    const yMin = yScale.range()[1]
    const yMax = yScale.range()[0]


    svg.append("g")
        .selectAll("path")
        .data(xCoords)
        .join("path")
        .attr("d", (x) =>
            d3.line().defined(pointIsValid)
            ([[xScale(x) ?? NaN, yMin], [xScale(x) ?? NaN, yMax]]))
        .attr("style", lineCSS ?? defaultLineCSS)
        .attr("stroke-width", strokeWidth)
}


export function drawHorizontalLines<XDomain extends AxisDomain, YDomain extends AxisDomain>(svg: SVG,
                                                                                            xScale: AxisScale<XDomain>,
                                                                                            yScale: AxisScale<YDomain>,
                                                                                            yCoords: YDomain[],
                                                                                            strokeWidth: number = 1,
                                                                                            lineCSS?: ValueFn<BaseType, unknown, string>)
{
    const xMin = xScale.range()[1]
    const xMax = xScale.range()[0]

    svg.append("g")
        .selectAll("path")
        .data(yCoords)
        .join("path")
        .attr("d", (y) =>
            d3.line().defined(pointIsValid)
            ([[xMin, yScale(y) ?? NaN], [xMax, yScale(y) ?? NaN]]))
        .attr("style", lineCSS ?? defaultLineCSS)
        .attr("stroke-width", strokeWidth)
}

/**
 * Draws the cgm thresholds lines and highlights the lines that enclose the target area
 */
export function drawHorizontalCGMIndicatorLines<XDomain extends AxisDomain> (svg : SVG,
                                                                             xScale : d3.AxisScale<XDomain>,
                                                                             yScale : d3.AxisScale<number>,
                                                                             strokeWidth : number = 1
                                                                             )
{
    drawHorizontalLines<XDomain, number>(svg, xScale, yScale,
        CGM_THRESHOLDS.map<number>(d => d.x1 ?? yScale.domain()[1]),
        strokeWidth,
        (d, i) => highlightTargetLineStyle(i))
}