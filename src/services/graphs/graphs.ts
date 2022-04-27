import * as d3 from "d3";
import type {Ref} from "vue";

export type DataPoint = {
    x: number,
    y: number
}

type DataCGM = {date: Date, cgm: number}
type RawData = DataCGM[]
type SortedData = DataCGM[]

type DataRange = {hour: number, data: number[]}
type Quantiles = {hour: number, data: number}[]
type QuantileStack = {}

class DataManipulation {

}


export class CGMData {
    public data : RawData
    public n : number

    // Store the daysBack list, todo optimize kinda like fenwick tree or smething,
    // Combine each list when getting the values
    private daysBack = new Map<number, SortedData>()

    constructor(rawData : {date: string, cgm: number}[]) {
        this.data = rawData.map(d => ({date: new Date(d.date), cgm: d.cgm * 18}))
        this.n = this.data.length
    }

    // Returns a list of data that are from now to days back
    // TODO: Could maybe optimize this since the list is most likely sorted by date
    public getDataNDaysBack (days : number) : SortedData | undefined {
        if (!this.daysBack.has(days)) {
            // TODO: WHEN USING REAL DATA, GET RELATIVE TO TIME.NOW INSTEAD OF THE LAST DATA
            const now = this.data[this.n - 1].date.getTime()
            const lastDate = now - days * 24 * 60 * 60 * 1000
            this.daysBack.set(days, this.data.filter(d => d.date.getTime() > lastDate))
        }

        return this.daysBack.get(days)
    }



    /**
     * Returns data that is split into ranges based on seconds during day
     * @param daysBackData - the sortedData
     * @param dataPointsPerHour - the resolution of the graph given in points per hour eg. 2
     */
    public splitByTimeOfDay (daysBackData : SortedData, dataPointsPerHour : number) : DataRange[] | undefined {
        // Split day into ranges based on its time of day
        const ranges = dataPointsPerHour * 24
        const splitData : d3.Bin<DataCGM, number>[] = d3.bin<DataCGM, number>()
            .value(d => this.getTimeOfDayInSeconds(d.date))
            .thresholds(ranges)(daysBackData)

        // Get the hour value for every range, this is done by taking the mean of lower and upper range
        // @ts-ignore
        const hours = splitData.map((a : d3.Bin<DataCGM, number>) => ((a.x0 + a.x1) / 2) / 3600)

        // Create the array of data with its hour value and a list of data
        return splitData.map((a,i) => ({hour:hours[i],  data: a.map(d => d.cgm)}))
    }


    /**
     * Returns the coordinates of every point going n days back and with a resolution of dataPointsPerHours
     * @param daysBackData - the amount of days you want to go back in the data
     * @param dataPointsPerHour - the resolution of the graph given in points per hour eg. 2
     */
    public medianData (daysBackData : SortedData, dataPointsPerHour : number) : DataPoint[] | undefined {
        // Split data
        const splitData = this.splitByTimeOfDay(daysBackData, dataPointsPerHour)
        if (splitData === undefined) {
            return undefined
        }

        // Create a list of coordinates where we convert to the data to a median, if that is not possible then its value is 0
        return splitData.map((a,i) => ({x:a.hour,  y: d3.median(a.data) ?? 0}))
    }


    // Quantile Chart

    // Get the data so it is easy to convert to stack
    public quantileData (daysBackData : SortedData, dataPointsPerHour : number) : {quantiles: number[], values: Quantiles[]} | undefined {
        const qs = [0.05, 0.25, 0.75, 0.95]

        // Split data into ranges
        const splitData = this.splitByTimeOfDay(daysBackData, dataPointsPerHour)
        if (splitData === undefined) {
            return undefined
        }

        // Sort data in ascending order, so it will be fast to calculate quantiles
        const sortedRanges = splitData.map(d => ({hour: d.hour, data: d.data.sort((a,b) => d3.ascending(a, b))}))

        // For every range, calculate its quantiles
        const quantiles = sortedRanges.map(a =>
        {
            // Get value at each of the given quantiles, set to 0 if can't get quantile
            const absQuantiles : number[] = qs.map(q => d3.quantileSorted(a.data, q) ?? 0)

            // Get difference between each quantile, so we can create stack
            return absQuantiles.map((q,i) => ({ hour: a.hour, data: i == 0 ? q : q - absQuantiles[i-1]}))
        })

        // Add range to object
        return {quantiles: qs, values: quantiles}
    }

    public quantileStack (daysBack : number, dataPointsPerHour : number) {
        const quantileData = this.quantileData(daysBack, dataPointsPerHour)
        if (quantileData == undefined) {
            return undefined
        }

        const n = quantileData.quantiles.length
        const out = d3.stack<any, any, number>()
            .keys(d3.range(n))
            .order(d3.stackOrderNone)
            (quantileData.quantiles)


        out.shift()  // Remove the lowest area from (0%, 5%)
        return out
    }


/*
    public getQuantiles (sortedArrays, qs) {
        // For every interval
        const quantiles = sortedArrays.map(a => {
            // Get quantiles
            const absQuantiles = qs.map(q => d3.quantileSorted(a, q, d => d.cgm))
            // get difference between each quantile
            const out = absQuantiles.map((q,i) => i === 0 ? q : q - absQuantiles[i-1])
            out.x0 = a.x0
            out.x1 = a.x1
            return out })

        quantiles.qs = qs

        return quantiles
    }
    */

    // Returns the second of the day
    private getTimeOfDayInSeconds (date : Date) : number { return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() }

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

    /*
    quantileChart (stack, median : DataPoint[], seconds, thresholds,
                     {
                         marginTop = 20, // top margin, in pixels
                         marginRight = 30, // right margin, in pixels
                         marginBottom = 20, // bottom margin, in pixels
                         marginLeft = 40, // left margin, in pixels
                         width = 1000, // outer width, in pixels
                         height = 400, // outer height, in pixels
                         indicators = false
                     })
    {
        const n = stack.length
        const centerIndex = Math.floor(n / 2)

        const xScale = d3.scaleLinear( [0, 24], [0, width])
        const yScale = d3.scaleLinear([0, 350], [height, 0])
        const opacityScale = d3.scaleLinear([0, centerIndex, n - 1], [.2, .4, .2])

        const yMin = yScale.range()[1]
        const yMax = yScale.range()[0]
        const xMax = xScale.range()[1]

        const out = d3.create("svg")
            .attr("width", width+ marginLeft+ marginRight)
            .attr("height", height+ marginTop + marginBottom)
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        const svg = out.append("g")
            .attr("transform",
                "translate(" + marginLeft + "," + marginTop + ")");

        // Threshold colors
        const getThrPercentage = d => d === undefined ? "100%" : 100 * d / yMax + "%"
        const thrColors = thresholds.flatMap((d,i) =>
            [{offset:getThrPercentage(d.x0), color: clrscheme0[i]},{offset:getThrPercentage(d.x1), color: clrscheme0[i]}])


        // Gradient
        const gradient = d3.creator("linearGradient")
        svg.append(gradient)
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", yScale(0))
            .attr("x2", 0).attr("y2", yScale(yMax))
            .selectAll("stop").data(thrColors).join("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color)

        // Horizontal lines
        const isTarget = i => i === 1 || i === 2
        const targetLineStyle = "stroke-width: 1.5; opacity: .5; stroke: " + clrscheme0[2] + ";"
        const otherLineStyle = "stroke-width: 1; opacity: .1; stroke: black;"

        const lineCoords = function (d) {
            let y = d.x1 === undefined ? yMax : yScale(d.x1) + .5  // plus by .5 to center it relative to its stroke width
            return [[xScale(0), y], [xMax,  y]]
        }
        const thresholdLines = svg.append("g")
            .selectAll("path")
            .data(thresholds)
            .join("path")
            .attr("d", (d,i) => d3.line()(lineCoords(d)))
            .attr("style", (d,i) => "fill: none;" + (isTarget(i) ?  targetLineStyle : otherLineStyle))

        // Vertical lines
        svg.append("g")
            .selectAll("path")
            .data([0, 6, 12, 18, 24])
            .join("path")
            .attr("d", (d,i) => d3.line()([[xScale(d), yMin], [xScale(d), yMax]]))
            .attr("style", "opacity: .1;fill: none; stroke: black;")
            .attr("stroke-width", 1)

        // The areas
        const area = d3.area()
            .curve(curveType.value)
            // Convert to hours
            .x((d, i) => xScale(seconds[i] / 3600))
            .y0(d => yScale(d[0]))
            .y1(d => yScale(d[1]))

        const areaPath = svg.append("g")
            .selectAll("path")
            .data(stack)
            .join("path")
            .transition().duration(100)
            .attr("d", area)
            .attr("style", "fill: url(#line-gradient);")
            .attr("opacity", (d,i) => opacityScale(i))

        // DRAW MEDIAN
        const medianLineGen = d3.line()
            .curve(curveType.value)
            .x((d, i) => xScale(seconds[i] / 3600))
            .y(d => yScale(d))
        svg.append("path")
            .transition().duration(200)
            .attr("d", medianLineGen(median))
            .attr("style", "stroke-width: 3;fill: none; stroke: url(#line-gradient);  opacity: 1;")




        // Axises
        svg.append("g")
            .call(d3.axisLeft(yScale).tickValues(thresholds.map(d => d.x0)))
            .selectAll("text")
            .attr("font-size", (d,i) => isTarget(i - 1) ? "12" : "10")
            .attr("font-weight", (d,i) => isTarget(i - 1) ? "bold" : "normal")
        const highlightedTime = d => d % 12 === 0
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickFormat(d => d + ":00"))
            .selectAll("text")
            .attr("font-weight", d => highlightedTime(d) ? "bold" : "normal")
            .attr("font-size", d => highlightedTime(d) ? 12 : 10)

        // mg / dl text
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("font-size", "14")
            .attr("transform", "rotate(-90)")
            .attr("y", -marginLeft + 10)
            .attr("x", -(height / 2) + 70)
            .text("mg/dL")

        if (indicators) {
            const thresholdIndicators = svg.append("g")
                .selectAll("rect")
                .data(thresholds)
                .join("rect")
                .attr("x", 0)
                .attr("width", width)
                .attr("y", d => d.x1 === undefined ? yMax : yScale(d.x1) )
                .attr("height", d => yScale(d.x0) - (d.x1 === undefined ? yMax : yScale(d.x1)))
                .attr("fill", (d,i) => clrscheme0[i])
                .attr("opacity", 0.2)


        }

        return out.node()
    }
*/
    applySVG (ref : Ref<SVGElement | null>, svg : SVGSVGElement | null) {
        if (ref.value != null && svg?.outerHTML != undefined) ref.value.outerHTML = svg.outerHTML
    }

}