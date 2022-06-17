// Target is the are which is green
import {COLOR_SCHEME} from "@/services/core/shared";
import * as d3 from "d3";
import {GraphLayout} from "@/services/core/graphtypes";

export type SVG = d3.Selection<SVGGElement, undefined, null, undefined>

const sharedCSS = "stroke-width: 1;"
const targetLineStyle = "opacity: .5; stroke: " + COLOR_SCHEME[2] + ";" + sharedCSS
const otherLineStyle = "opacity: .1; stroke: black;" + sharedCSS
export const isTarget = (i: number) => i === 1 || i === 2

export const highlightTargetLineStyle = (i: number, targetCSS?: string, otherCSS?: string) =>
    "fill: none;" + (isTarget(i) ? (targetCSS ?? targetLineStyle) : (otherCSS ?? otherLineStyle))


export function generateSVG(graphLayout: GraphLayout = new GraphLayout(0, 0, 0, 0, 0, 0), flip : boolean = false) {
    const {width, height, marginTop, marginRight, marginBottom, marginLeft} = graphLayout
    const totalWidth = width + marginLeft + marginRight
    const totalHeight = height + marginTop + marginBottom
    const out = d3.create("svg")
        .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("overflow", "visible")

    const svg = out.append("g")
        .attr("transform",
            `translate(${marginLeft} , ${marginTop}) ` + (flip ? `rotate(180 ${totalWidth / 2} ${totalHeight / 2}) ` : ""));
    return {out, svg}
}
