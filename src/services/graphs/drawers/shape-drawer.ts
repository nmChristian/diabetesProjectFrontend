// Author: Jonas
// Description: Contains helper functions that is used when drawing graphs (this is for shapes)

import type {SVG} from "@/services/graphs/drawers/svg-drawer";
import type {AxisDomain} from "d3-axis";
import type {AxisScale} from "d3";

export {fillHorizontalArea}

function fillHorizontalArea<XDomain extends AxisDomain, YDomain extends AxisDomain>(svg: SVG,
                                                                                    xScale: AxisScale<XDomain>,
                                                                                    yScale: AxisScale<YDomain>,
                                                                                    y: YDomain, height: YDomain,
                                                                                    css?: string) {
    const yPixel: number = yScale(y) ?? 0
    const heightPixel: number = yScale(height) ?? 0
    const lowestPoint = Math.min(yPixel, heightPixel) ?? 0
    const diff = Math.abs(yPixel - heightPixel)

    svg.append("rect")
        .attr("y", lowestPoint)
        .attr("height", diff)
        .attr("x", xScale.range()[0])
        .attr("width", xScale.range()[1] - xScale.range()[0])
        .attr("style", css ?? "fill: #69a3b2; opacity: .5; z-index: -1000; ")
}
