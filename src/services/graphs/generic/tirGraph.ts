import {GraphLayout} from "@/services/core/graphtypes";
import {generateSVG} from "@/services/core/graphMethods";
import * as d3 from "d3";
import {COLOR_SCHEME} from "@/services/core/shared";

export default function tirGraph (sizes: number[], colors: string[], {
    graphLayout = new GraphLayout(100, 400, 20, 30, 20, 40),
})
{
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

    // TODO: Force sizes and colors to be the same length
    if (sizes.length != colors.length) {
        console.error("NOT SAME LENGTH")
        return out.node()
    }

    const yScale = d3.scaleLinear([0,1], [height, 0])

    // Gets difference between
    const heights = sizes.map<number>((size) => yScale(1 - size))
    const startPos : number[] = sizes.reduce<number[]>((startPos, _, i) => startPos.concat(i == 0 ? 0 : sizes[i - 1] + startPos[i - 1]), [])

    // Bars
    svg.append("g")
        .selectAll("rect")
        .data(sizes)
        .join("rect")
            .attr("y", (_,i) => yScale(startPos[i]) - heights[i])
            .attr("height", (_, i) => heights[i])
            .attr("width", 50)
            .attr("fill", (_,i) => colors[i])

    return out.node()
}