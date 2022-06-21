import * as d3 from "d3";
import type {DateValue} from "@/services/graphs/datatypes";
import {dateValueIsValid} from "@/services/graphs/datatypes";
import type {CGMRanges} from "@/services/core/shared";
import {CGM_RANGE} from "@/services/core/shared";
import {generateSVG} from "@/services/core/graph-methods";
import {generateGradientCGMCSSApply} from "@/services/graphs/generic/generate-gradient-css";
import {applyAxis, drawYAxisCGM} from "@/services/graphs/drawers/axis-drawer";
import {drawHorizontalCGMIndicatorLines, drawVerticalLines} from "@/services/graphs/drawers/line-drawer";
import {GraphLayout} from "@/services/graphs/models/graph-layout";

export default function lineGraphCGM(dateValues: DateValue[],
                                     cgmRanges : CGMRanges,
                                     {
                                         graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                     }) {
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

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