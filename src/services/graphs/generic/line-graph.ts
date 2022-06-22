// Author: Jonas
// Description: Draws the DateValues as a line
import * as d3 from "d3";
import {LINE_COLOR} from "@/services/graphs/shared";
import {svgDrawer} from "@/services/graphs/drawers/svg-drawer";
import {applyAxis} from "@/services/graphs/drawers/axis-drawer";
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {dateValueIsValid} from "@/services/graphs/auxiliary/type-validity";

export default function lineGraph(dateValues: DateValue[],
                                  {
                                      graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
                                  }) {
    const {width, height} = graphLayout
    const {out, svg} = svgDrawer(graphLayout)

    const xScale = d3.scaleTime()
        .domain(d3.extent(dateValues, ([date,]) => date) as [Date, Date])
        .range([0, width])


    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dateValues, ([, value]) => value)] as [number, number])
        .range([height, 0])
        .nice()

    // The Line
    const lineGen = d3.line<DateValue>()
        .defined(dateValueIsValid)
        .x(([x,]) => xScale(x))
        .y(([, y]) => yScale(y))
        (dateValues)

    svg.append("path")
        .attr("fill", "none")
        .attr("style", "stroke: " + LINE_COLOR + "; stroke-width: 3;")
        .attr("d", lineGen)

    // Axis
    const xAxis = d3.axisBottom(xScale)
    applyAxis(svg, xAxis, {yOffset: height})
    const yAxis = d3.axisLeft(yScale).ticks(4)
    applyAxis(svg, yAxis, {})

    return out
}