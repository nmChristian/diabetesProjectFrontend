// Gradient method
import type * as d3 from "d3"
import {CGM_RANGE, CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";

let linearID = 0

// TODO: IDFK Rename this shit
/**
 * Returns the link to the gradient generated example: url(#line-gradient-2)
 * @param svg - The object its going to append to
 * @param height - the scale used in the graph, this is used because the gradient works in percentages or something
 */
export function generateGradientCGMCSSApply(svg: d3.Selection<SVGGElement, undefined, null, undefined>, height: number): string {
    const id: string = "cgm-gradient-" + linearID
    linearID++

    svg.append("linearGradient")
        .attr("id", id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", height)
        .attr("x2", 0).attr("y2", 0)
        .selectAll("stop").data(cgmThresholdColors(CGM_RANGE[1])).join("stop")
        .attr("offset", (d: any) => d.offset)
        .attr("stop-color", (d: any) => d.color)

    return "url(#" + id + ")"
}

// Gradient colors
// @ts-ignore
const cgmThresholdColors = (maxYValues: number) => CGM_THRESHOLDS.flatMap((d: any, i: any) =>
    [
        {offset: 100 * (d.x0 ?? maxYValues) / maxYValues + "%", color: COLOR_SCHEME[i]},
        {offset: 100 * (d.x1 ?? maxYValues) / maxYValues + "%", color: COLOR_SCHEME[i]}
    ])
