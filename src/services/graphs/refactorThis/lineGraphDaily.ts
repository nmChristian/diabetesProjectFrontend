import {pointIsValid} from "@/services/core/datatypes";
import type {Point} from "@/services/core/datatypes";
import * as d3 from "d3";
import {CGM_RANGE, CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";
import {generateGradientCGMCSSApply} from "@/services/graphs/generateGradientCSS";
import {drawYAxis} from "@/services/core/graphMethods";

export default function lineGraphDaily (points : Point[],
                                   {
                                       marginTop = 20, // top margin, in pixels
                                       marginRight = 30, // right margin, in pixels
                                       marginBottom = 20, // bottom margin, in pixels
                                       marginLeft = 40, // left margin, in pixels
                                       width = 1200, // outer width, in pixels
                                       height  = 400, // outer height, in pixels
                                   }, xDomain : [number, number] | undefined = undefined) {

    const out = d3.create("svg")
        .attr("width", width+ marginLeft+ marginRight)
        .attr("height", height + marginTop + marginBottom)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    const svg = out.append("g")
        .attr("transform",
            "translate(" + marginLeft + "," + marginTop + ")");

    const xScale = d3.scaleLinear()
        // @ts-ignore
        .domain(xDomain??d3.extent(points, ([x,]) => x))//
        .range([0, width])

    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])


    // The Line
    const lineGen = d3.line<Point>()
        .defined(pointIsValid)
        .x(([x,]) => xScale(x))
        .y(([,y]) => yScale(y))
        (points)

    svg.append("path")
        .attr("style", "fill: none; stroke: " + COLOR_SCHEME[2] + "; stroke-width: 3;") // + getLinearGradientCGMCSS() + ";")  url(#line-gradient)
        .attr("d", lineGen)



    // X-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))

    // Y-axis
    // Methode 2
    drawYAxis(svg, yScale)

    /*
    const g = d3.create("g")
    g.call(d3.axisLeft(yScale).tickValues(CGM_THRESHOLDS.map(d => d.x0)))
        .selectAll("text")
        .attr("style",(d,i) => getFontStyle(i))

    svg.append(() => g.node())//*/

    /*
    svg.append("g")
        .call(d3.axisLeft(yScale).tickValues(CGM_THRESHOLDS.map(d => d.x0)))
        .selectAll("text")
        .attr("style",(d,i) => getFontStyle(i))//*/

    return out.node()
}