import * as d3 from "d3";
import type {DateValue, Point} from "@/services/core/datatypes";
import {CGM_RANGE, CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";
import {getFontStyle, getLineStyle} from "@/services/core/graphMethods";
import {generateGradientCGMCSS} from "@/services/graphs/generateGradientCSS";
import {dateValueIsValid} from "@/services/core/datatypes";

export default function lineGraph (dateValues : DateValue[] ,
                                   {
        marginTop = 20, // top margin, in pixels
        marginRight = 30, // right margin, in pixels
        marginBottom = 20, // bottom margin, in pixels
        marginLeft = 40, // left margin, in pixels
        width = 1200, // outer width, in pixels
        height = 400, // outer height, in pixels
    }) {

    const out = d3.create("svg")
        .attr("width", width+ marginLeft+ marginRight)
        .attr("height", height+ marginTop + marginBottom)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    const svg = out.append("g")
        .attr("transform",
            "translate(" + marginLeft + "," + marginTop + ")");

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
        .y(([,y]) => yScale(y))(dateValues)

    svg.append("path")
        .attr("fill", "none")
        .attr("style", "stroke: "+ generateGradientCGMCSS(yScale) + ";") // + getLinearGradientCGMCSS() + ";")  url(#line-gradient)
        .attr("stroke-width", 3)
        .attr("d", lineGen)

// Gradient colors
// Small helper function that converts number to sting
    const getCGMThresholdPercentage = (d : any) => d === undefined ? "100%" : 100 * d / yMax + "%"
// @ts-ignore
    const cgmThresholdColors = CGM_THRESHOLDS.flatMap((d : any, i : any) =>
        [{offset:getCGMThresholdPercentage(d.x0), color: COLOR_SCHEME[i]},
            {offset:getCGMThresholdPercentage(d.x1), color: COLOR_SCHEME[i]}])

    const gradient = d3.creator("linearGradient")
    svg.append(gradient)
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", yScale(0))
        .attr("x2", 0).attr("y2", yScale(yMax))
        .selectAll("stop").data(cgmThresholdColors).join("stop")
        .attr("offset", (d: any) => d.offset)
        .attr("stop-color", (d: any) => d.color)

    // Horizontal lines
    // Helper function returns the x and y coords for a given line from a stack
    const lineCoords = function (d : any) : [[number, number], [number, number]] {
        let y : number = d.x1 === undefined ? yMax : yScale(d.x1) + .5  // plus by .5 to center it relative to its stroke width
        return [[xMin, y], [xMax,  y]]
    }



    // Draw lines
    svg.append("g")
        .selectAll("path")
        .data(CGM_THRESHOLDS)
        .join("path")
        .attr("d", (d) => d3.line()(lineCoords(d)))
        .attr("style", (d,i) => getLineStyle(i))
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
        .attr("d", (d,i) => d3.line()([[xScale(d) + vertStrokeWidth / 2, yMin], [xScale(d)+vertStrokeWidth / 2, yMax]])) //
        .attr("style", "opacity: .1;fill: none; stroke: black;")
        .attr("stroke-width", vertStrokeWidth)


    // Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))

    svg.append("g")
        .call(d3.axisLeft(yScale).tickValues(CGM_THRESHOLDS.map(d => d.x0)))
        .selectAll("text")
        .attr("style",(d,i) => getFontStyle(i))

    return out.node()
}