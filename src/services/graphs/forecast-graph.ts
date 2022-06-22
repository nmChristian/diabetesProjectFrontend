// Author: Jonas
// Description: Draws the forecast graph
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {svgDrawer} from "@/services/graphs/drawers/svg-drawer";
import type {TimeInterval} from "d3";
import * as d3 from "d3"
import {LINE_COLOR} from "@/services/graphs/shared";
import {generateGradientCGMCSSApply} from "@/services/graphs/generic/generate-gradient-css";
import {drawHorizontalLines, drawVerticalLines} from "@/services/graphs/drawers/line-drawer";
import {applyAxis} from "@/services/graphs/drawers/axis-drawer";
import {fillHorizontalArea} from "@/services/graphs/drawers/shape-drawer";
import {dateValueIsValid} from "@/services/graphs/auxiliary/type-validity";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {CGM_RANGE, getCGMTarget} from "@/services/graphs/auxiliary/cgm";

export default function forecastGraph(dateValues: DateValue[], timeInterval: TimeInterval,
                                      cgmRanges: CGMRanges,
                                      {
                                          graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                          onBrushEnd = (event: d3.D3BrushEvent<any>) => {
                                          },
                                          mealsData = [] as DateValue[],
                                          mealMaxValue = undefined as number | undefined
                                      }) {
    const {width, height} = graphLayout
    const {out, svg} = svgDrawer(graphLayout, false)

    const cgmTarget = getCGMTarget(cgmRanges)
    // Show graph within this interval
    const minDate = timeInterval(d3.min(dateValues, ([date,]) => date) as Date)
    const maxDate = timeInterval.offset(minDate, 1)

    const xScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([0, width])


    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])

    // Draw Line
    const lineGen = d3.line<DateValue>()
        .defined(dateValueIsValid)
        .x(([x,]) => xScale(x))
        .y(([, y]) => yScale(y))
        (dateValues)

    const gradientURL = generateGradientCGMCSSApply(svg, 0, height, cgmRanges)
    svg.append("path")
        .attr("style", "fill: none; stroke: " + gradientURL + "; stroke-width: 1.5;")
        .attr("d", lineGen)

    // Draw Area below and above targets
    const areaGen = d3.area<DateValue>()
        .x(([date,]) => xScale(date))
        .y0(([, value]) => yScale(value > cgmTarget[1] ? cgmTarget[1] : Math.min(cgmTarget[0], value)))
        .y1(([, value]) => yScale(value > cgmTarget[1] ? value : cgmTarget[0]))
    svg.append("path")
        .datum(dateValues)
        .attr("fill", gradientURL)
        .attr("style", "opacity: 0.2;")
        .attr("d", areaGen)


    // Draw rectangle to show target area
    fillHorizontalArea<Date, number>(svg, xScale, yScale, cgmTarget[0], cgmTarget[1], "fill: #3c5e66; opacity: .1; ");

    // Draw lines
    const lineCSS = () => "opacity: .3; stroke: black;"
    // @ts-ignore
    const horizontalLines = [yScale.domain(), cgmTarget].flat()
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

    applyAxis(svg, xAxis, {xOffset: 40, yOffset: 0, removeDomain: true})

    const yAxis = d3.axisLeft(yScale)
        .tickSize(0)
        .tickValues(cgmTarget)


    applyAxis(svg, yAxis, {textCSS: () => "font-weight: bold;", removeDomain: true})

    let brush, brushGroup
    // Brush
    if (onBrushEnd !== undefined) {

        brushGroup = svg.append("g")
        brush = d3.brushX<undefined>()
            .extent([[0, 0], [width, height]])
            .on("end", onBrushEnd)

        brushGroup.call(brush)
    }


    if (mealsData !== [] && mealsData.length != 0) {
        // Limit size to the first line
        const yMealScale = d3.scaleLinear([0, mealMaxValue ?? d3.max(mealsData, ([, value]) => value) ?? 0], [height, yScale(cgmTarget[0])])
        svg.append("g")
            .selectAll("rect")
            .data(mealsData)
            .join("rect")
            .style("fill", LINE_COLOR)
            .attr("x", ([date,]) => xScale(date))
            .attr("width", 2)
            .attr("y", () => yMealScale.range()[0])
            .transition().duration(200)
            .attr("height", ([, value]) => yMealScale.range()[0] - yMealScale(value))
            .attr("y", ([, value]) => yMealScale(value))

        // Create axis
        const mealAxis = d3.axisRight(yMealScale)
            .tickValues(yMealScale.domain())

        applyAxis(svg, mealAxis, {xOffset: width})
    }

    return {svg: out, xScale: xScale, brush: brush, brushGroup: brushGroup}
}

