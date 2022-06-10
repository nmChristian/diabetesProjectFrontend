// Target is the are which is green
import {COLOR_SCHEME} from "@/services/core/shared";
import * as d3 from "d3";
import {GraphLayout} from "@/services/core/graphtypes";

export type SVG = d3.Selection<SVGGElement, undefined, null, undefined>

const sharedCSS = "stroke-width: 1;"
const targetLineStyle = "opacity: .5; stroke: " + COLOR_SCHEME[2] + ";" + sharedCSS
const otherLineStyle = "opacity: .1; stroke: black;" + sharedCSS
export const isTarget = (i: number) => i === 1 || i === 2

export const highlightTargetLineStyle = (i: number, targetCSS? : string, otherCSS? : string) =>
    "fill: none;" + (isTarget(i) ? (targetCSS ?? targetLineStyle) : (otherCSS ?? otherLineStyle))


export function generateSVG (graphLayout : GraphLayout = new GraphLayout(0,0, 0, 0, 0, 0)) {
    const {width, height, marginTop, marginRight, marginBottom, marginLeft} = graphLayout

    const out = d3.create("svg")
        //.attr("viewBox", "0,0,50, 250")
        .attr("width", width + marginLeft + marginRight)
        .attr("height", height + marginTop + marginBottom)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic; pointer-events:all;")


    const svg = out.append("g")
        .attr("transform",
            "translate(" + marginLeft + "," + marginTop + ")");

    return {out, svg}
}