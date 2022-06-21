// Gradient method
import type {CGMRanges} from "@/services/core/shared";
import {CGM_RANGE, COLOR_SCHEME} from "@/services/core/shared";
import type {SVG} from "@/services/core/graph-methods";

let linearID = 0

// TODO: IDFK Rename this shit
/**
 * Returns the link to the gradient generated example: url(#line-gradient-2)
 * @param svg - The object its going to append to
 * @param yMin - at what pixel it starts
 * @param yMax - height, this is used because the gradient works in percentages or something
 * @param cgmRanges - the CGM ranges
 */
export function generateGradientCGMCSSApply(svg: SVG, yMin: number, yMax: number, cgmRanges: CGMRanges): string {
    const id: string = "cgm-gradient-" + linearID
    linearID++
    svg.append("linearGradient")
        .attr("id", id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", yMax)
        .attr("x2", 0).attr("y2", yMin)
        .selectAll("stop").data(cgmThresholdColors(CGM_RANGE[1], cgmRanges)).join("stop")
        .attr("offset", (d: any) => d.offset)
        .attr("stop-color", (d: any) => d.color)

    return "url(#" + id + ")"
}

// Gradient colors
// @ts-ignore
const cgmThresholdColors = (maxYValues: number, cgmRanges: CGMRanges) => cgmRanges.flatMap((d: any, i: any) =>
    [
        {offset: 100 * (d[0] ?? maxYValues) / maxYValues + "%", color: COLOR_SCHEME[i]},
        {offset: 100 * (d[1] ?? maxYValues) / maxYValues + "%", color: COLOR_SCHEME[i]}
    ])
