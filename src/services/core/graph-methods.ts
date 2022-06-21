import * as d3 from "d3";
import {GraphLayout} from "@/services/graphs/models/graph-layout";

export type SVG = d3.Selection<SVGGElement, undefined, null, undefined>

export function generateSVG(graphLayout: GraphLayout = new GraphLayout(0, 0, 0, 0, 0, 0), flip: boolean = false) {
    const {width, height, marginTop, marginRight, marginBottom, marginLeft} = graphLayout
    const totalWidth = width + marginLeft + marginRight
    const totalHeight = height + marginTop + marginBottom
    const out = d3.create("svg")
        .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("overflow", "visible")
        .style("max-width", "100%")
        .style("max-height", "100%")

    const svg = out.append("g")
        .attr("transform",
            `translate(${marginLeft} , ${marginTop}) ` + (flip ? `rotate(180 ${totalWidth / 2} ${totalHeight / 2}) ` : ""));
    return {out, svg}
}
