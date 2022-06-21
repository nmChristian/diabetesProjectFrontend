import * as d3 from "d3";
import type {DateValue} from "@/services/core/datatypes";
import {LINE_COLOR} from "@/services/core/shared";
import {generateSVG} from "@/services/core/graph-methods";
import {applyAxis} from "@/services/graphs/auxillary/axis-drawer";
import {GraphLayout} from "@/services/core/graph-types";

export default function barGraph(dateValues: DateValue[],
                                 {
                                     graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                 }) {
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

    const maxDate = d3.max(dateValues, ([date,]) => date)

    const xScale = d3.scaleTime()
        .domain([d3.min(dateValues, ([date,]) => date), maxDate] as [Date, Date])
        .range([0, width])
        .nice()

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dateValues, ([, value]) => value)] as [number, number])
        .range([height, 0])
        .nice()

    // The Bars
    svg.append("g")
        .selectAll("rect")
        .data(dateValues)
        .join("rect")
        .style("fill", LINE_COLOR)
        .attr("x", ([date,]) => xScale(date))
        .attr("height", ([, value]) => yScale(value) - yScale.range()[1])
        .attr("width", 2)
        .attr("y", ([, value]) => yScale.range()[0] - (yScale(value) - yScale.range()[1]))

    // Axis
    const xAxis = d3.axisBottom(xScale)
    applyAxis(svg, xAxis, {yOffset: height})
    const yAxis = d3.axisLeft(yScale).ticks(3)
    applyAxis(svg, yAxis, {})

    return out
}