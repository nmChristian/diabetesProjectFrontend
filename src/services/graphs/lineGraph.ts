import * as d3 from "d3";
import type {DateValue} from "@/services/core/datatypes";
import {dateValueIsValid} from "@/services/core/datatypes";
import {CGM_RANGE, CGM_THRESHOLDS} from "@/services/core/shared";
import {generateSVG, getLineStyle} from "@/services/core/graphMethods";
import {generateGradientCGMCSSApply} from "@/services/graphs/generateGradientCSS";
import {drawXAxis, drawYAxisCGM} from "@/services/core/graph/axisDrawer";


export default function lineGraph(dateValues: DateValue[],
                                  {
                                      marginTop = 20, // top margin, in pixels
                                      marginRight = 30, // right margin, in pixels
                                      marginBottom = 20, // bottom margin, in pixels
                                      marginLeft = 40, // left margin, in pixels
                                      width = 1200, // outer width, in pixels
                                      height = 400, // outer height, in pixels
                                  }) {


    const {out, svg} = generateSVG(width, height,
        {marginTop, marginRight, marginLeft, marginBottom})

    const xScale = d3.scaleTime()
        // @ts-ignore
        .domain(d3.extent(dateValues, ([x,]) => x))
        .range([0, width])

    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])
    const yMin = yScale.range()[1]
    const yMax = yScale.range()[0]
    const xMin = xScale.range()[0]
    const xMax = xScale.range()[1]
    const dateMax = xScale.domain()[1]

    // The Line
    const lineGen = d3.line<DateValue>()
        .defined(dateValueIsValid)
        .x(([x,]) => xScale(x))
        .y(([, y]) => yScale(y))
        (dateValues)

    svg.append("path")
        .attr("fill", "none")
        .attr("style", "stroke: " + generateGradientCGMCSSApply(svg, yScale) + ";") // + getLinearGradientCGMCSS() + ";")  url(#line-gradient)
        .attr("stroke-width", 3)
        .attr("d", lineGen)

    // Horizontal lines
    // Helper function returns the x and y coords for a given line from a stack
    const lineCoords = function (d: any): [[number, number], [number, number]] {
        let y: number = d.x1 === undefined ? yMax : yScale(d.x1) + .5  // plus by .5 to center it relative to its stroke width
        return [[xMin, y], [xMax, y]]
    }


    // Draw lines
    svg.append("g")
        .selectAll("path")
        .data(CGM_THRESHOLDS)
        .join("path")
        .attr("d", (d) => d3.line()(lineCoords(d)))
        .attr("style", (d, i) => getLineStyle(i))
    // Vertical lines

    //const days = Array((ext[1]?.getTime() ?? 0 - (ext[0]?.getTime() ?? 0) / (1000 * 3600 * 24)))

    const days = []
    for (let i = 0; i < days.length; i++) {
        days[i] = new Date(dateMax).setDate(dateMax.getDate() - i + 1)
    }

    const vertStrokeWidth = 1
    svg.append("g")
        .selectAll("path")
        .data(days)
        .join("path")
        .attr("d", (d, i) => d3.line()([[xScale(d) + vertStrokeWidth / 2, yMin], [xScale(d) + vertStrokeWidth / 2, yMax]])) //
        .attr("style", "opacity: .1;fill: none; stroke: black;")
        .attr("stroke-width", vertStrokeWidth)


    // Axis
    drawXAxis(svg, xScale, height)
    drawYAxisCGM(svg, yScale)

    return out.node()
}