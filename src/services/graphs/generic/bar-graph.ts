// Author: Jonas
// Description: Draws a graph where every DateValue value is drawn as a bar
import * as d3 from "d3";
import {LINE_COLOR} from "@/services/graphs/shared";
import {svgDrawer} from "@/services/graphs/drawers/svg-drawer";
import {applyAxis} from "@/services/graphs/drawers/axis-drawer";
import {GraphLayout} from "@/services/graphs/models/graph-layout";

export default function barGraph(dateValues: DateValue[],
                                 {
                                     graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                 }) {
    const {width, height} = graphLayout
    const {out, svg} = svgDrawer(graphLayout)

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