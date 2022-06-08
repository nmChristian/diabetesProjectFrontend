import type {DateValue} from "@/services/core/datatypes";
import {dateValueIsValid} from "@/services/core/datatypes";
import {GraphLayout} from "@/services/core/graphtypes";
import {generateSVG} from "@/services/core/graphMethods";
import type {TimeInterval} from "d3";
import * as d3 from "d3";
import {CGM_RANGE, CGM_TARGET} from "@/services/core/shared";
import {generateGradientCGMCSSApply} from "@/services/graphs/generic/generateGradientCSS";
import {drawHorizontalLines, drawVerticalLines} from "@/services/core/graph/lineDrawer";
import {applyAxis} from "@/services/core/graph/axisDrawer";
import {fillHorizontalArea} from "@/services/core/graph/shapeDrawer";

//TODO: Implement måltider
export default function forecastGraph(dateValues: DateValue[], timeInterval : TimeInterval,
                                  {
                                      graphLayout = new GraphLayout(800,400, 20, 30, 20, 40),
                                  })
{
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

    // Show graph within this interval
    const minDate = timeInterval(d3.min(dateValues, ([date,]) => date) as Date)
    const maxDate = timeInterval.offset(minDate, 1)

    const xScale = d3.scaleTime()
        .domain([minDate, maxDate] )
        .range([0, width])


    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])

    // TODO: Set curve type
    // Draw Line
    const lineGen = d3.line<DateValue>()
        .defined(dateValueIsValid)
        .x(([x,]) => xScale(x))
        .y(([, y]) => yScale(y))
        (dateValues)

    const gradientURL = generateGradientCGMCSSApply(svg, height)
    svg.append("path")
        .attr("style", "fill: none; stroke: " + gradientURL + "; stroke-width: 1.5;")
        .attr("d", lineGen)

    // Draw Area below and above targets
    const areaGen = d3.area<DateValue>()
        .x(([date, ]) => xScale(date))
        .y0(([,value]) => yScale(value > CGM_TARGET[1] ? CGM_TARGET[1] : Math.min(CGM_TARGET[0], value)))
        .y1(([,value]) => yScale(value > CGM_TARGET[1] ? value : CGM_TARGET[0]))
    svg.append("path")
        .datum(dateValues)
        .attr("fill", gradientURL)
        .attr("style", "opacity: 0.2;")
        .attr("d", areaGen)



    // Draw rectangle to show target area
    fillHorizontalArea<Date, number>(svg, xScale, yScale, CGM_TARGET[0], CGM_TARGET[1], "fill: #3c5e66; opacity: .1; ");


    // Draw lines
    //@ts-ignore
    const yLines = [yScale.domain(), CGM_TARGET].flat()
    // If it is the target area
    const yCSS = (d : any, i : number) => (i >= yLines.length - CGM_TARGET.length) ?
        "stroke-width: .5; opacity: 1; stroke: black;" :
        "stroke-width: .5; opacity: .2; stroke: black;"
    drawHorizontalLines<Date, number>(svg, xScale, yScale,
        yLines, yCSS)
    drawVerticalLines<Date, number>(svg, xScale, yScale,
        // List of days between start and stop
        xScale.ticks(d3.timeDay))

    // Axis
    console.log(xScale.ticks(d3.timeDay))

    const xAxis = d3.axisTop(xScale)
        .tickValues(xScale.ticks())
        .tickSize(0)
    applyAxis(svg, xAxis, {yOffset: height})

    const yAxis = d3.axisLeft(yScale)
        .tickValues(CGM_TARGET)
    applyAxis(svg, yAxis, { css : () => "font-weight: bold;"} )

    return out.node()
}