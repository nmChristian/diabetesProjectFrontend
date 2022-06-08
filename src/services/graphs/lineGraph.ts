import * as d3 from "d3";
import type {DateValue} from "@/services/core/datatypes";
import {dateValueIsValid} from "@/services/core/datatypes";
import {CGM_RANGE} from "@/services/core/shared";
import {generateSVG} from "@/services/core/graphMethods";
import {generateGradientCGMCSSApply} from "@/services/graphs/generateGradientCSS";
import {drawXAxis, drawYAxisCGM} from "@/services/core/graph/axisDrawer";
import {drawHorizontalCGMIndicatorLines, drawVerticalLines} from "@/services/core/graph/lineDrawer";
import {GraphLayout} from "@/services/core/graphtypes";


export default function lineGraph(dateValues: DateValue[],
                                  {
                                      graphLayout = new GraphLayout(800,400, 20, 30, 20, 40),
                                  })
{
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)
    console.log(graphLayout)
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
        .attr("style", "stroke: " + generateGradientCGMCSSApply(svg, height) + ";") // + getLinearGradientCGMCSS() + ";")  url(#line-gradient)
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