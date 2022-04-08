import * as d3 from "d3";
import type {Ref} from "vue";

type Data = {
    date: Date,
    value: number
}
export type DataPoint = {
    x: number,
    y: number
}
export class DataEdit {


    getDataNDaysBack = (data : Data [], days : number) => data.filter(d => (d.date).getTime() > data[data.length - 1].date.getTime() - days * 24 * 60 * 60 * 1000)
    getTimeOfDayInSeconds = (date : Date) => date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()

    medianData (data : Data [], daysBack : number, dataPointsPerHour : number) {
        const splitByTimeOfDayData : d3.Bin<Data, number>[] = d3.bin<Data, number>()
            .value(d  => this.getTimeOfDayInSeconds(d.date))
            .thresholds(dataPointsPerHour * 24)
            (this.getDataNDaysBack(data, daysBack))

        // @ts-ignore
        const hours = splitByTimeOfDayData.map((a : d3.Bin<Data, number>) => ((a.x0 + a.x1) / 2) / 3600)

        return splitByTimeOfDayData.map((a,i) => ({x:hours[i],  y: d3.median(a, d => d.value) ?? 0}) )
    }


}
export class GraphDrawer {
    readonly colorScheme : string[] = ["#33658a","#78c0e0","#5da271","#dda448","#92140c"]

    iconChart (medianData : DataPoint[], clr : string, {
        width = 80, // outer width, in pixels
        height = 60, // outer height, in pixels
        strokeWidth = 3,    // Background and stroke
    }) {

        const xScale = d3.scaleLinear( [0, 24], [0, width])
        const yScale = d3.scaleLinear([0, 350], [height, 0])

        const svg = d3.create("svg")
            //const svg = d3.select(svgElement)
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

        svg.attr("style", "border:" + clr + "  solid " + strokeWidth + "px; border-radius: 20px;")

        // DRAW MEDIAN
        const medianLineGen = d3.line<DataPoint>()
            .curve(d3.curveLinear)
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
        svg.append("path")
            .attr("style", "stroke-width: " + strokeWidth + "; fill: none; stroke: " + clr + ";  opacity: 1;")
            .attr("d", medianLineGen(medianData))

        return svg.node()
    }

    applySVG (ref : Ref<SVGElement | null>, svg : SVGSVGElement | null) {
        if (ref.value != null && svg?.outerHTML != undefined) ref.value.outerHTML = svg.outerHTML
    }

}