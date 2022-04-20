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

type DataCGM = {date: Date, cgm: number}
export class CGMData {
    public data : DataCGM[]
    public n : number

    // Store the daysBack list, todo optimize kinda like fenwick tree or smething,
    // Combine each list when getting the values
    private daysBack = new Map<number, DataCGM[]>()

    constructor(rawData : {date: string, cgm: number}[]) {
        this.data = rawData.map(d => ({date: new Date(d.date), cgm: d.cgm * 18}))
        this.n = this.data.length
    }

    // TODO: Could maybe optimize this since the list is most likely sorted by date
    public getDataNDaysBack (days : number) {
        if (!this.daysBack.has(days)) {
            const lastDate = this.data[this.n - 1].date.getTime() - days * 24 * 60 * 60 * 1000
            this.daysBack.set(days, this.data.filter(d => d.date.getTime() > lastDate))
        }

        return this.daysBack.get(days)
    }


    public getTimeOfDayInSeconds (date : Date) {
        return date.getHours() * 3600
            + date.getMinutes() * 60
            + date.getSeconds()
    }

    public medianData (daysBack : number, dataPointsPerHour : number) : DataPoint[] {
        const daysBackData = this.getDataNDaysBack(daysBack)

        if (daysBackData != undefined) {
            const splitData: d3.Bin<DataCGM, number>[] = d3.bin<DataCGM, number>()
                .value(d => this.getTimeOfDayInSeconds(d.date))
                .thresholds(dataPointsPerHour * 24)
                (daysBackData)
            // This is a list of the time for each dataset []
            // @ts-ignore
            const hours = splitData.map((a : d3.Bin<DataCGM, number>) => ((a.x0 + a.x1) / 2) / 3600)


            return splitData.map((a,i) => ({x:hours[i],  y: d3.median(a, d => d.cgm) ?? 0}))
        }

        return []


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
            .defined(d => d.y != 0)
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