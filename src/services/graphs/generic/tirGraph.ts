import {GraphLayout} from "@/services/core/graphtypes";
import {generateSVG} from "@/services/core/graphMethods";
import * as d3 from "d3";

export default function tirGraph (quantiles : number[], {
    graphLayout = new GraphLayout(800, 400, 20, 30, 20, 40),
})
{
    console.log("asfasf")
    console.log("asfasf")
    console.log("asfasf")
    console.log("asfasf")

    const {width, height} = graphLayout
    const {out, svg} = generateSVG(graphLayout)

    const yScale = d3.scaleLinear([0,1], [height, 0])

    // Gets difference between
    const startPos = quantiles.reduce((previous, current) => current + previous, 0)
    console.log(startPos)
    // Bars
    const bars = svg.append("g")
        .data(quantiles)
        .join("g")

    bars.append("rect")
        .attr("height", q => yScale(q))
        .attr("width", 50)

    return out.node()
}