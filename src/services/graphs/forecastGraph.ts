import type {DateValue} from "@/services/core/datatypes";
import {dateValueIsValid} from "@/services/core/datatypes";
import {GraphLayout} from "@/services/core/graphtypes";
import {generateSVG} from "@/services/core/graphMethods";
import type {TimeInterval} from "d3";
import * as d3 from "d3"
import {CGM_RANGE, CGM_TARGET} from "@/services/core/shared";
import {generateGradientCGMCSSApply} from "@/services/graphs/generic/generateGradientCSS";
import {drawHorizontalLines, drawVerticalLines} from "@/services/core/graph/lineDrawer";
import {applyAxis} from "@/services/core/graph/axisDrawer";
import {fillHorizontalArea} from "@/services/core/graph/shapeDrawer";

//TODO: Implement måltider
export default function forecastGraph(dateValues: DateValue[], timeInterval: TimeInterval,
                                      {
                                          graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                          onBrushEnd = (event: d3.BrushBehavior<any>, graphData: any) => {
                                          },
                                      }) {
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

    // Show graph within this interval
    const minDate = timeInterval(d3.min(dateValues, ([date,]) => date) as Date)
    const maxDate = timeInterval.offset(minDate, 1)

    const xScale = d3.scaleTime()
        .domain([minDate, maxDate])
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
        .x(([date,]) => xScale(date))
        .y0(([, value]) => yScale(value > CGM_TARGET[1] ? CGM_TARGET[1] : Math.min(CGM_TARGET[0], value)))
        .y1(([, value]) => yScale(value > CGM_TARGET[1] ? value : CGM_TARGET[0]))
    svg.append("path")
        .datum(dateValues)
        .attr("fill", gradientURL)
        .attr("style", "opacity: 0.2;")
        .attr("d", areaGen)


    // Draw rectangle to show target area
    fillHorizontalArea<Date, number>(svg, xScale, yScale, CGM_TARGET[0], CGM_TARGET[1], "fill: #3c5e66; opacity: .1; ");

    // Draw lines
    const lineCSS = () => "opacity: .3; stroke: black;"
    // @ts-ignore
    const horizontalLines = [yScale.domain(), CGM_TARGET].flat()
    drawHorizontalLines(svg, xScale, yScale, horizontalLines, lineCSS)

    const verticalLines = xScale.ticks(d3.timeDay)
    drawVerticalLines(svg, xScale, yScale, verticalLines, lineCSS)


    // Axis
    // Remove last day of the week
    const xAxisValues = xScale.ticks(d3.timeDay)
    xAxisValues.pop()

    const xAxis = d3.axisTop<Date>(xScale)
        .tickValues(xAxisValues)
        .tickSize(0)
        .tickFormat(d => d3.timeFormat("%A")(d))

    // TODO: Fix this hack where you just offset the label
    applyAxis(svg, xAxis, {xOffset: 40, yOffset: 0, removeDomain: true})

    const yAxis = d3.axisLeft(yScale)
        .tickSize(0)
        .tickValues(CGM_TARGET)


    applyAxis(svg, yAxis, {textCSS: () => "font-weight: bold;", removeDomain: true})

    // Brush
    if (onBrushEnd !== undefined) {
        const group = svg.append("g")
        const brush = d3.brushX<undefined>()
            .extent([[0, 0], [width, height]])
            .on("end", (event) => onBrushEnd(event, {group: group, xScale: xScale}))

        group
            .call(brush)
    }


    return out
}