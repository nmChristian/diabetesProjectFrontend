import * as d3 from "d3";
import type {DateValue} from "@/services/core/datatypes";
import {dateValueIsValid} from "@/services/core/datatypes";
import {CGM_RANGE, CGM_THRESHOLDS} from "@/services/core/shared";
import {generateSVG, highlightTargetLineStyle} from "@/services/core/graphMethods";
import {generateGradientCGMCSSApply} from "@/services/graphs/generateGradientCSS";
import {drawXAxis, drawYAxisCGM} from "@/services/core/graph/axisDrawer";
import {
    drawHorizontalCGMIndicatorLines,
    drawHorizontalLines,
    drawVerticalLines
} from "@/services/core/graph/lineDrawer";
import {timeDays} from "d3-time";


export default function lineGraph(dateValues: DateValue[],
                                  {
                                      marginTop = 20, // top margin, in pixels
                                      marginRight = 30, // right margin, in pixels
                                      marginBottom = 20, // bottom margin, in pixels
                                      marginLeft = 40, // left margin, in pixels
                                      width = 1200, // outer width, in pixels
                                      height = 400, // outer height, in pixels
                                  }) {


    const {out, svg} = generateSVG(width, height,
        {marginTop, marginRight, marginLeft, marginBottom})

    const xScale = d3.scaleTime()
        .domain(d3.extent(dateValues, ([x,]) => x) as [Date, Date])
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
        .attr("style", "stroke: " + generateGradientCGMCSSApply(svg, yScale) + ";") // + getLinearGradientCGMCSS() + ";")  url(#line-gradient)
        .attr("stroke-width", 3)
        .attr("d", lineGen)


    // Draw lines
    drawHorizontalCGMIndicatorLines(svg, xScale, yScale)
    // Drawing
    drawVerticalLines<Date, number>(svg, xScale, yScale,
        // List of days between start and stop
        d3.timeDays(xScale.domain()[0], xScale.domain()[1]))

    // Axis
    drawXAxis(svg, xScale, height)
    drawYAxisCGM(svg, yScale)

    return out.node()
}