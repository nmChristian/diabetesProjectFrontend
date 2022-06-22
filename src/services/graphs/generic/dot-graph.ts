// Author: Jonas
// Description: Draws a graph where every DateValue value is drawn as a circle
import * as d3 from "d3";
import {svgDrawer} from "@/services/graphs/drawers/svg-drawer";
import {applyAxis} from "@/services/graphs/drawers/axis-drawer";
import {GraphLayout} from "@/services/graphs/models/graph-layout";

export default function dotGraph(dateValues: DateValue[],
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

    // The Line
    svg.append("g")
        .selectAll("circle")
        .data(dateValues)
        .join("circle")
        .style("fill", "black")
        .attr("r", 1.5)
        .attr("cx", ([date,]) => xScale(date))
        .attr("cy", ([, value]) => yScale(value))

    // Axis
    const xAxis = d3.axisBottom(xScale)
    applyAxis(svg, xAxis, {yOffset: height})
    const yAxis = d3.axisLeft(yScale).ticks(3)
    applyAxis(svg, yAxis, {})

    return out
}