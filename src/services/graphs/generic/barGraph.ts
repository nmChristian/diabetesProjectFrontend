import * as d3 from "d3";
import type {DateValue} from "@/services/core/datatypes";
import {dateValueIsValid} from "@/services/core/datatypes";
import {CGM_RANGE, COLOR_SCHEME} from "@/services/core/shared";
import {generateSVG} from "@/services/core/graphMethods";
import {generateGradientCGMCSSApply} from "@/services/graphs/generic/generateGradientCSS";
import {applyAxis, drawYAxisCGM} from "@/services/core/graph/axisDrawer";
import {drawHorizontalCGMIndicatorLines, drawVerticalLines} from "@/services/core/graph/lineDrawer";
import {GraphLayout} from "@/services/core/graphtypes";

export default function barGraph(dateValues: DateValue[],
                                 {
                                     graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                 }) {
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

    const maxDate = d3.max(dateValues, ([date,]) => date)

    const xScale = d3.scaleTime()
        .domain([d3.min(dateValues, ([date,]) => date),maxDate] as [Date, Date])
        .range([0, width])
        .nice()

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dateValues, ([, value]) => value)] as [number, number])
        .range([height, 0])
        .nice()

    // The Line
    svg.append("g")
        .selectAll("rect")
        .data(dateValues)
        .join("rect")
            .style("fill", COLOR_SCHEME[0])
            .attr("x", ([date,]) => xScale(date))
            .attr("height", ([,value]) => yScale(value))
            .attr("width", 2)
            .attr("y",([,value]) =>  yScale.range()[0] - yScale(value))

    // Axis
    const xAxis = d3.axisBottom(xScale)
    applyAxis(svg, xAxis, {yOffset: height})
    const yAxis = d3.axisLeft(yScale).ticks(3)
    applyAxis(svg, yAxis, {})

    return out
}