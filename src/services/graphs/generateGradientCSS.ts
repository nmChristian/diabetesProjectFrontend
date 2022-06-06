// Gradient method
import * as d3 from 'd3';
import {CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";

let svgGradientElement: HTMLDivElement | undefined = undefined
let linearID = 0

// TODO: IDFK Rename this shit
/**
 * Returns the link to the gradient generated example: url(#line-gradient-2)
 * @param svg - The object its going to append to
 * @param yScale - the scale used in the graph, this is used because the gradient works in percentages or something
 */
export function generateGradientCGMCSSApply(svg: d3.Selection<SVGGElement, undefined, null, undefined>, yScale: d3.ScaleLinear<number, number, never>): string {
    const id: string = "line-gradient-" + linearID
    linearID++

    const minYValue = yScale(0)
    const yMax = Math.max(yScale.range()[0], yScale.range()[1])
    const maxYValue = yScale(yMax)

    svg.append("linearGradient")
        .attr("id", id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", minYValue)
        .attr("x2", 0).attr("y2", maxYValue)
        .selectAll("stop").data(cgmThresholdColors(yMax)).join("stop")
        .attr("offset", (d: any) => d.offset)
        .attr("stop-color", (d: any) => d.color)

    return "url(#" + id + ")"
}

// Gradient colors
// Small helper function that converts number to sting
const getCGMThresholdPercentage = (d: any, yMax: number) => d === undefined ? "100%" : 100 * d / yMax + "%"
// @ts-ignore
const cgmThresholdColors = (yMax: number) => CGM_THRESHOLDS.flatMap((d: any, i: any) =>
    [
        {offset: getCGMThresholdPercentage(d.x0, yMax), color: COLOR_SCHEME[i]},
        {offset: getCGMThresholdPercentage(d.x1, yMax), color: COLOR_SCHEME[i]}
    ])
