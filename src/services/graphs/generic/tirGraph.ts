import {GraphLayout} from "@/services/core/graphtypes";
import {generateSVG} from "@/services/core/graphMethods";
import * as d3 from "d3";
import {COLOR_SCHEME} from "@/services/core/shared";

export default function tirGraph (sizes: number[], colors: string[], {
    graphLayout = new GraphLayout(100, 400, 20, 30, 20, 40),
    offset = 5,
})
{
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

    // TODO: Force sizes and colors to be the same length, and also if the sizes are not in percentages
    if (sizes.length != colors.length) {
        console.error("NOT SAME LENGTH")
        return out.node()
    }

    const nOffsets = sizes.filter(d => d != 0).length - 1
    const totalOffset = nOffsets * offset
    const yScale = d3.scaleLinear([0,1], [height, 0])
    const heightScale = d3.scaleLinear([0,1], [0, height - totalOffset])

    // Gets difference between
    const heights = sizes.map<number>(heightScale)
    const offsets = sizes.map<number>((d: number) => (d == 0) ? 0 : offset)
    // startPos = previousPos + previousHeight + previousOffset
    const startPos : number[] = sizes.reduce<number[]>((startPos: number[], d: number, i: number) => startPos.concat(i == 0 ? yScale(0) :  startPos[i - 1] - heights[i - 1] - offsets[i - 1]), [])

    // Bars
    svg.append("g")
        .selectAll("rect")
        .data(sizes)
        .join("rect")
            .attr("y", (_,i) => startPos[i] - heights[i])
            .attr("height", (_, i) => heights[i])
            .attr("width", 50)
            .attr("fill", (_,i) => colors[i])

    return out.node()
}