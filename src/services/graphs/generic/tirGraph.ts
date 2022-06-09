import {GraphLayout} from "@/services/core/graphtypes";
import {generateSVG} from "@/services/core/graphMethods";
import * as d3 from "d3";

export default function tirGraph (occurrences: number[], colors: string[], {
    graphLayout = new GraphLayout(50, 400, 10, 10, 10, 10),
    offset = 1,
})
{
    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

    // TODO: Force sizes and colors to be the same length
    if (occurrences.length != colors.length) {
        console.error("NOT SAME LENGTH")
        return out.node()
    }

    // HAHA i love js <3, Ok so this will convert NaN to 0, since NaN is false
    const sum = d3.sum(occurrences)
    const frequencies : number[] = occurrences.map<number>(v => v / sum || 0)

    const nOffsets = frequencies.filter(d => d != 0).length - 1
    const totalOffset = nOffsets * offset

    const posScale = d3.scaleLinear([0,1], [height, 0])
    const heightScale = d3.scaleLinear([0,1], [0, height - totalOffset])
    const heights = frequencies.map<number>(heightScale)
    const offsets = frequencies.map<number>(d => (d == 0) ? 0 : offset)
    // startPos = previousPos + previousHeight + previousOffset
    const startPos : number[] = frequencies.reduce<number[]>((startPos, _, i) => startPos.concat(i == 0 ? posScale(0) :  startPos[i - 1] - heights[i - 1] - offsets[i - 1]), [])

    // Bars
    const bars = svg.append("g")
        .selectAll("g")
        .data(frequencies)
        .join("g")

    bars.append("rect")
            .attr("y", (_,i) => startPos[i] - heights[i])
            .attr("height", (_, i) => heights[i])
            .attr("width", width)
            .attr("fill", (_,i) => colors[i])
            .attr("style", "fill-opacity: 0.9;")

    return out.node()
}