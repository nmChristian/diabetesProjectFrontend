import * as d3 from "d3";
import type {Point} from "@/services/core/datatypes"
import {pointIsValid} from "@/services/core/datatypes";
import {CGM_RANGE, HealthLevel, healthLevelToColor} from "@/services/core/shared";
import {generateSVG} from "@/services/core/graphMethods";

/**
 * Draws a small graph given the data (in hours)
 * @param dataInHours - The data in given in hours
 * @param healthLevel - The HealthLevel of the patient
 * @param width - The width of the graph in px
 * @param height - The height of the graph in px
 * @param strokeWidth - The width of line in px
 */
export default function iconGraph(dataInHours: Point[], healthLevel: HealthLevel, {
    width = 80, // outer width, in pixels
    height = 60, // outer height, in pixels
    strokeWidth = 3,    // Background and stroke
}) {
    const clr = healthLevelToColor(healthLevel)
    const {out, svg} = generateSVG(width, height)
    // Draw border
    out.attr("style", "border:" + clr + "  solid " + strokeWidth + "px; border-radius: 20px;")

    const xScale = d3.scaleLinear(
        d3.extent(dataInHours, ([x,]) => x).map(d => d ?? 0), [0, width])
    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])

    // DRAW MEDIAN
    const medianLineGen = d3.line<Point>()
        .defined(pointIsValid)
        .curve(d3.curveLinear)
        .x(([x,]: Point) => xScale(x))
        .y(([, y]: Point) => yScale(y))

    svg.append("path")
        .attr("style", "stroke-width: " + strokeWidth + "; fill: none; stroke: " + clr + ";  opacity: 1;")
        .attr("d", medianLineGen(dataInHours))

    return out.node()
}