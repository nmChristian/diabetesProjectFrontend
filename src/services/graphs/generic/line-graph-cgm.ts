// Author: Jonas
// Description: Draws the DateValues as a line, but with cgm colors
import * as d3 from "d3";
import {svgDrawer} from "@/services/graphs/drawers/svg-drawer";
import {generateGradientCGMCSSApply} from "@/services/graphs/generic/generate-gradient-css";
import {applyAxis, drawYAxisCGM} from "@/services/graphs/drawers/axis-drawer";
import {drawHorizontalCGMIndicatorLines, drawVerticalLines} from "@/services/graphs/drawers/line-drawer";
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {dateValueIsValid} from "@/services/graphs/auxiliary/type-validity";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {CGM_RANGE} from "@/services/graphs/auxiliary/cgm";

export default function lineGraphCGM(dateValues: DateValue[],
                                     cgmRanges: CGMRanges,
                                     {
                                         graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                     }) {
    const {width, height} = graphLayout
    const {out, svg} = svgDrawer(graphLayout)

    const xScale = d3.scaleTime()
        .domain(d3.extent(dateValues, ([date,]) => date) as [Date, Date])
        .range([0, width])

    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])

    // The Line
    const lineGen = d3.line<DateValue>()
        .defined(dateValueIsValid)
        .x(([x,]) => xScale(x))
        .y(([, y]) => yScale(y))
        (dateValues)

    svg.append("path")
        .attr("fill", "none")
        .attr("style", "stroke: " + generateGradientCGMCSSApply(svg, 0, height, cgmRanges) + "; stroke-width: 3;")
        .attr("d", lineGen)


    // Draw lines
    drawHorizontalCGMIndicatorLines(svg, xScale, yScale, cgmRanges)
    // Drawing
    drawVerticalLines<Date, number>(svg, xScale, yScale,
        // List of days between start and stop
        d3.timeDays(xScale.domain()[0], xScale.domain()[1]))

    // Axis
    const xAxis = d3.axisBottom(xScale)
    applyAxis(svg, xAxis, {yOffset: height})
    drawYAxisCGM(svg, yScale, cgmRanges)

    return out
}