import * as d3 from "d3";
import type {Point} from "@/services/core/datatypes"
import {HealthLevel, healthLevelToColor} from "@/services/core/shared";

export default function iconGraph (medianData : Point[], healthLevel : HealthLevel, {
    width = 80, // outer width, in pixels
    height = 60, // outer height, in pixels
    strokeWidth = 3,    // Background and stroke
}) {
    const clr = healthLevelToColor(healthLevel)

    const xScale = d3.scaleLinear( [0, 24], [0, width])
    const yScale = d3.scaleLinear([0, 350], [height, 0])

    const svg = d3.create("svg")
        //const svg = d3.select(svgElement)
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

    svg.attr("style", "border:" + clr + "  solid " + strokeWidth + "px; border-radius: 20px;")

    // DRAW MEDIAN
    const medianLineGen = d3.line<Point>()
        .defined(([x,y] : Point) =>!isNaN(x) && !isNaN(y))
        .curve(d3.curveLinear)
        .x(([x,] : Point) => xScale(x))
        .y(([,y] : Point) => yScale(y))

    svg.append("path")
        .attr("style", "stroke-width: " + strokeWidth + "; fill: none; stroke: " + clr + ";  opacity: 1;")
        .attr("d", medianLineGen(medianData))

    return svg.node()
}