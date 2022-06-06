import type {Point} from "@/services/core/datatypes";
import {pointIsValid} from "@/services/core/datatypes";
import * as d3 from "d3";
import {CGM_RANGE, COLOR_SCHEME} from "@/services/core/shared";
import {drawXAxis, drawYAxisCGM} from "@/services/core/graph/axisDrawer";
import {generateSVG} from "@/services/core/graphMethods";

export default function lineGraphDaily(points: Point[],
                                       {
                                           marginTop = 20, // top margin, in pixels
                                           marginRight = 30, // right margin, in pixels
                                           marginBottom = 20, // bottom margin, in pixels
                                           marginLeft = 40, // left margin, in pixels
                                           width = 1200, // outer width, in pixels
                                           height = 400, // outer height, in pixels
                                       }, xDomain: [number, number] | undefined = undefined) {

    const {out, svg} = generateSVG(width, height,
        {marginTop, marginRight, marginLeft, marginBottom})


    const xScale = d3.scaleLinear()
        // @ts-ignore
        .domain(xDomain ?? d3.extent(points, ([x,]) => x))//
        .range([0, width])

    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])


    // The Line
    const lineGen = d3.line<Point>()
        .defined(pointIsValid)
        .x(([x,]) => xScale(x))
        .y(([, y]) => yScale(y))
        (points)

    svg.append("path")
        .attr("style", "fill: none; stroke: " + COLOR_SCHEME[2] + "; stroke-width: 3;") // + getLinearGradientCGMCSS() + ";")  url(#line-gradient)
        .attr("d", lineGen)


    // Axis
    drawXAxis(svg, xScale, height)
    drawYAxisCGM(svg, yScale)

    return out.node()
}