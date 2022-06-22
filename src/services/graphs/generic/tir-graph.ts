// Author: Jonas
// Description: Draws a TIR graph, with a rectangle for each interval and its size is dependent on the amount of occurrences
//              Also creates a tooltip if not already created that shows the rectangles value when hovered over
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {svgDrawer} from "@/services/graphs/drawers/svg-drawer";
import * as d3 from "d3";

const tooltipId = "tir-tooltip"

export default function tirGraph(occurrences: number[], colors: string[], {
    graphLayout = new GraphLayout(50, 400),
    offset = 2,
    r = 3,
    enableTooltip = true,
    rotate = false,
}) {
    let {width, height} = graphLayout
    const {out, svg} = svgDrawer(graphLayout, rotate)

    const size = rotate ? width : height

    // TODO: Force sizes and colors to be the same length
    if (occurrences.length != colors.length) {
        console.error("NOT SAME LENGTH data length: " + occurrences.length + " - colors length " + colors.length)
        return out
    }

    // HAHA i love js <3, Ok so this will convert NaN to 0, since NaN is false
    const sum = d3.sum(occurrences)
    const frequencies: number[] = occurrences.map<number>(v => v / sum || 0)

    const nOffsets = frequencies.filter(d => d != 0).length - 1
    const totalOffset = nOffsets * offset

    const posScale = d3.scaleLinear([0, 1], [size, 0])
    const sizeScale = d3.scaleLinear([0, 1], [0, size - totalOffset])
    const sizes = frequencies.map<number>(sizeScale)
    const offsets = frequencies.map<number>(d => (d == 0) ? 0 : offset)
    // startPos = previousPos + previousHeight + previousOffset
    const startPos: number[] = frequencies.reduce<number[]>((startPos, _, i) =>
        startPos.concat(i == 0 ? posScale(0) : startPos[i - 1] - sizes[i - 1] - offsets[i - 1]), [])

    // Bars
    const bars = svg.append("g")
        .selectAll("g")
        .data(frequencies)
        .join("g")

    const animationTime = 200;
    const getPos = (index: number) => startPos[index] - sizes[index]
    const barRect = bars.append("rect")
        .style("fill", (_, i) => colors[i])
        .style("fill-opacity", 0.9)
        .attr(rotate ? "height" : "width", "100%")

    if (rotate) {
        barRect
            .attr("x", (_, i) => getPos(i))
    } else {
        barRect
            .attr("y", (_, i) => getPos(i))
    }


    const barTransition = barRect.transition().duration(d => d * animationTime).delay((_, i) => getPos(i) * animationTime / height).ease(d3.easeLinear)
        .attr("rx", r)
        .attr("ry", r)

    barTransition
        .attr(rotate ? "width" : "height", (_, i) => sizes[i])


    // Tooltip
    if (enableTooltip) {
        const tooltip = getToolTip()
        barRect
            .on("mouseover", function (e, d) {
                d3.select(this).transition().duration(300).style("fill-opacity", 0.6)
                showTooltip(tooltip, (d * 100).toFixed(1) + "%")
            })
            .on("mousemove", function (e) {
                moveTooltip(tooltip, e)
            })
            .on("mouseleave", function () {
                d3.select(this).transition().duration(100).style("fill-opacity", 0.9)
                hideTooltip(tooltip)
            })
    }


    return out
}

function getToolTip(): HTMLDivElement {
    let tooltip = document.getElementById(tooltipId)
    if (tooltip === null) {
        tooltip = document.createElement("div")
        tooltip.id = tooltipId
        document.body.append(tooltip)
        tooltip.style.opacity = "0"
        tooltip.style.backgroundColor = "white"
        tooltip.style.border = "solid"
        tooltip.style.borderWidth = "2px"
        tooltip.style.borderRadius = "5px"
        tooltip.style.padding = "5px"
        tooltip.style.position = "fixed"
        tooltip.style.padding = "2px 5px"
    }
    return tooltip as HTMLDivElement
}

function showTooltip(tooltip: HTMLDivElement, text: string) {
    tooltip.style.opacity = "1"
    tooltip.textContent = text
}

function moveTooltip(tooltip: HTMLDivElement, event: any) {
    tooltip.style.left = (event.x + 20) + "px"
    tooltip.style.top = (event.y) + "px"
}

function hideTooltip(tooltip: HTMLDivElement,) {
    tooltip.style.opacity = "0"
}