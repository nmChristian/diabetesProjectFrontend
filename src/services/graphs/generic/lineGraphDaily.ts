import type {Point} from "@/services/core/datatypes";
import {pointIsValid} from "@/services/core/datatypes";
import * as d3 from "d3";
import {CGM_RANGE, COLOR_SCHEME} from "@/services/core/shared";
import {drawXAxis, drawYAxisCGM} from "@/services/core/graph/axisDrawer";
import {generateSVG} from "@/services/core/graphMethods";
import {drawHorizontalCGMIndicatorLines} from "@/services/core/graph/lineDrawer";
import {GraphLayout} from "@/services/core/graphtypes";

export default function lineGraphDaily(points: Point[],
                                       {
                                           graphLayout = new GraphLayout(800,400, 20, 30, 20, 40),
                                       }, xDomain: [number, number] | undefined = undefined)
{
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

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
        .attr("style", "fill: none; stroke: " + COLOR_SCHEME[1] + "; stroke-width: 3;") // + getLinearGradientCGMCSS() + ";")  url(#line-gradient)
        .attr("d", lineGen)


    //drawVerticalLines(svg, xScale, yScale, [12])
    drawHorizontalCGMIndicatorLines(svg, xScale, yScale)

    // Axis
    drawXAxis(svg, xScale, height, (d) => "font-weight: " + (d == 12 ? "bold;" : "normal;") , (d) => d + ":00")
    drawYAxisCGM(svg, yScale)

    return out.node()
}