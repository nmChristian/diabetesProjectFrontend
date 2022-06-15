import {GraphLayout} from "@/services/core/graphtypes";
import {generateSVG} from "@/services/core/graphMethods";
import * as d3 from "d3";
import {setDevtoolsHook} from "vue";

const tooltipDistance = 10
const tooltipWidth = 45
const tooltipHeight = 35

export default function tirGraph(occurrences: number[], colors: string[], {
    graphLayout = new GraphLayout(50, 400, 10, 10, 10, 10),
    offset = 2,
    rx = 3, ry = 3
}) {
    const {width, height} = graphLayout
    graphLayout.width += tooltipDistance + tooltipWidth
    const {out, svg} = generateSVG(graphLayout)

    // TODO: Force sizes and colors to be the same length
    if (occurrences.length != colors.length) {
        console.error("NOT SAME LENGTH data length: " +  occurrences.length + " - colors length "  +  colors.length)
        return out
    }

    // HAHA i love js <3, Ok so this will convert NaN to 0, since NaN is false
    const sum = d3.sum(occurrences)
    const frequencies: number[] = occurrences.map<number>(v => v / sum || 0)

    const nOffsets = frequencies.filter(d => d != 0).length - 1
    const totalOffset = nOffsets * offset

    const posScale = d3.scaleLinear([0, 1], [height, 0])
    const heightScale = d3.scaleLinear([0, 1], [0, height - totalOffset])
    const heights = frequencies.map<number>(heightScale)
    const offsets = frequencies.map<number>(d => (d == 0) ? 0 : offset)
    // startPos = previousPos + previousHeight + previousOffset
    const startPos: number[] = frequencies.reduce<number[]>((startPos, _, i) =>
        startPos.concat(i == 0 ? posScale(0) : startPos[i - 1] - heights[i - 1] - offsets[i - 1]), [])

    // Bars
    const bars = svg.append("g")
        .selectAll("g")
        .data(frequencies)
        .join("g")

    const animationTime = 200;
    const getY = (index: number) => startPos[index] - heights[index]
    const barRect = bars.append("rect")
        .attr("width", width)
        .attr("y", (_, i) => getY(i))
        .style("fill", (_, i) => colors[i])
        .style("fill-opacity", 0.9)
        .on("mouseover", function (e, d) {
            d3.select(this).transition().duration(300).style("fill-opacity", 0.6)
            showTooltip(tooltip, (d * 100).toFixed(1).toString() + "%")
        })
        .on("mouseleave", function () {
            d3.select(this).transition().duration(100).style("fill-opacity", 0.9)
            //hideTooltip(tooltip)
        })
        .transition().duration(d => d * animationTime).delay((_, i) => getY(i) * animationTime / height).ease(d3.easeLinear)
        .attr("height", (_, i) => heights[i])
        .attr("rx", rx)
        .attr("ry", ry)


    const tooltip = svg.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("x", width + tooltipDistance)
        .attr("rx", rx)
        .attr("ry", ry)
        .style("stroke", "black")
        .style("fill", "transparent")

    tooltip.append("text")


    return out
}

function showTooltip (tooltip : d3.Selection<SVGRectElement, undefined, null, undefined>, text : string) {
    tooltip.style("visibility", "visible")
    console.log(tooltip);
    console.log(tooltip.select("text"));
    tooltip.select("text").text(text)
}
function hideTooltip (tooltip : d3.Selection<SVGRectElement, undefined, null, undefined>) {
    tooltip.style("visibility", "hidden")
}