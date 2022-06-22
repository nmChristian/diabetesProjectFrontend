// Author: Jonas
// Description: Draws the Points as a line, but with cgm colors
import * as d3 from "d3";
import {LINE_COLOR} from "@/services/graphs/shared";
import {applyAxis, drawYAxisCGM} from "@/services/graphs/drawers/axis-drawer";
import {svgDrawer} from "@/services/graphs/drawers/svg-drawer";
import {drawHorizontalCGMIndicatorLines} from "@/services/graphs/drawers/line-drawer";
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {pointIsValid} from "@/services/graphs/auxiliary/type-validity";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {CGM_RANGE} from "@/services/graphs/auxiliary/cgm";

export default function lineGraphDaily(points: Point[],
                                       cgmRanges: CGMRanges,
                                       {
                                           graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                       }, xDomain: [number, number] | undefined = undefined) {
    const {width, height} = graphLayout
    const {out, svg} = svgDrawer(graphLayout)

    const xScale = d3.scaleLinear()
        // @ts-ignore
        .domain(xDomain ?? d3.extent(points, ([x,]) => x))//
        .range([0, width])

    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])


    // The Line
    const lineGen = d3.line<Point>()
        .defined(pointIsValid)
        .x(([x,]) => xScale(x))
        .y(([, y]) => yScale(y))
        (points)

    svg.append("path")
        .attr("style", "fill: none; stroke: " + LINE_COLOR + "; stroke-width: 3;") // + getLinearGradientCGMCSS() + ";")  url(#line-gradient)
        .attr("d", lineGen)


    //drawVerticalLines(svg, xScale, yScale, [12])
    drawHorizontalCGMIndicatorLines(svg, xScale, yScale, cgmRanges)

    // Axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d => d + ":00")
    applyAxis<number>(svg, xAxis, {yOffset: height, textCSS: d => "font-weight: " + (d == 12 ? "bold;" : "normal;")})
    drawYAxisCGM(svg, yScale, cgmRanges)

    return out
}