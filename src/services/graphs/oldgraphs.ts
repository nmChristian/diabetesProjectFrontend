import * as d3 from "d3";
import type {Ref} from "vue";
import {quantile} from "d3";

export type DataPoint = {
    x: number,
    y: number
}

type DataCGM = {date: Date, cgm: number}
type RawData = DataCGM[]
export type SortedData = DataCGM[]

type DataBucket = {hour: number, data: number[]}
type BucketQuantiles = {hour: number, data: number}[]
export type QuantileStack = d3.Series<any, Number>[]

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
    public splitByTimeOfDay (daysBackData : SortedData, dataPointsPerHour : number) : DataBucket[] | undefined {
        // Split day into ranges based on its time of day
        const nRanges = dataPointsPerHour * 24
        const inc = 3600 / dataPointsPerHour
        const ranges = new Array<number>(nRanges)
        for (let i = 0; i < nRanges; i++) {
            ranges[i] = inc * i
        }

        const splitData : d3.Bin<DataCGM, number>[] = d3.bin<DataCGM, number>()
            .value(d => CGMData.getTimeOfDayInSeconds(d.date))
            .thresholds(ranges)(daysBackData)

        console.log("SPLITTING DATA")
        console.log(splitData[nRanges - 1])

        // Set the last range max to be last hour, this needs to be done since the d3.bin method sets the upper threshold of last item to be max value of data.
        // Therefore we artificially set it to be the last hour, so the graph will go all the way to the end
        splitData[nRanges - 1].x1 = 3600 * 24


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
        const medData = splitData.map((a,i) => ({x:a.hour,  y: d3.median(a.data) ?? 0}))

        // Add zero value as first element and last element to make the graph go from start to finish
        const zeroVal = (medData[0].y + medData[medData.length - 1].y)/2
        medData.splice(0, 0, {x:0, y:zeroVal})
        medData.push({x:24, y:zeroVal})

        return medData
    }


    // Quantile Chart

    // Get the data so it is easy to convert to stack
    private quantileData (daysBackData : SortedData, dataPointsPerHour : number, qs : number[]) : {quantileData: BucketQuantiles[], quantiles: number[]} | undefined {

        // Split data into ranges
        const dataBuckets = this.splitByTimeOfDay(daysBackData, dataPointsPerHour)
        if (dataBuckets === undefined) {
            return undefined
        }

        // Sort data in ascending order, so it will be fast to calculate quantiles
        const sortedBuckets = dataBuckets.map(d => ({hour: d.hour, data: d.data.sort((a,b) => d3.ascending(a, b))}))

        // For every bucket, calculate its quantiles
        const quantileData = sortedBuckets.map(a =>
        {
            // Get value at each of the given quantiles, set to 0 if can't get quantile
            const absQuantiles : number[] = qs.map(q => d3.quantileSorted(a.data, q) ?? 0)

            // Get difference between each quantile, so we can create stack
            return absQuantiles.map((q,i) => ({ hour: a.hour, data: i == 0 ? q : q - absQuantiles[i-1]}))
        })


        // Add zero value as first element and last element to make the graph go from start to finish
        const zeroVal = new Array<number>(qs.length)
        for (let i = 0; i < zeroVal.length; i++) {
            zeroVal[i] = (quantileData[0][i].data + quantileData[quantileData.length - 1][i].data) / 2
        }
        quantileData.splice(0, 0, zeroVal.map(d => ({hour: 0, data:d})))
        quantileData.push(zeroVal.map(d => ({hour: 24, data:d})))


        // Return the quantiles calculated and its reference
        return {quantileData: quantileData, quantiles: qs}
    }

    public quantileStack (daysBackData : SortedData, dataPointsPerHour : number) : QuantileStack | undefined {

        // The quantile values we want, [5%, 25%, 75%, 95%]
        const qs = [0.05, 0.25, 0.75, 0.95]

        const quantileData = this.quantileData(daysBackData, dataPointsPerHour, qs)
        if (quantileData == undefined) {
            return undefined
        }

        const n = quantileData.quantiles.length
        const out = d3.stack<any, any, number>()
            .keys(d3.range(n))
            .order(d3.stackOrderNone)
            .value((obj, key) => obj[key].data) // Only get the data element from it
            (quantileData.quantileData)
        out.shift()  // Remove the lowest area from (0%, 5%)
        return out
    }

    // Returns the second of the day
    private static getTimeOfDayInSeconds (date : Date) : number { return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() }

}

export class GraphDrawer {
    readonly colorScheme : string[] = ["#33658a","#78c0e0","#5da271","#dda448","#92140c"]
    readonly thresholds = [{x0 : 0, x1 : 54}
    ,{x0 : 54, x1 : 70}
    ,{x0 : 70, x1 : 180}
    ,{x0 : 180, x1 : 250}
    ,{x0 : 250, x1 : undefined}]


    // Target is the are which is green
    private targetLineStyle = "stroke-width: 1.5; opacity: .5; stroke: " + this.colorScheme[this.colorScheme.length / 2 + 1] + ";"
    private otherLineStyle = "stroke-width: 1; opacity: .1; stroke: black;"
    private isTarget = (i : number) => i === 1 || i === 2
    private getLineStyle = (i : number) => "fill: none;" + (this.isTarget(i) ?  this.targetLineStyle : this.otherLineStyle)
    private getFontStyle = (i : number) =>
        "font-size: " + this.isTarget(i - 1) ? "12" : "10"
        + "; font-weight: " + this.isTarget(i - 1) ? "bold" : "normal" + ";"


    public quantileChart (quantileStack : QuantileStack, median : DataPoint[],
                     {
                         marginTop = 20, // top margin, in pixels
                         marginRight = 30, // right margin, in pixels
                         marginBottom = 20, // bottom margin, in pixels
                         marginLeft = 40, // left margin, in pixels
                         width = 1000, // outer width, in pixels
                         height = 400, // outer height, in pixels
                         indicators = false,
                         curveType = d3.curveMonotoneX
                     })
    {

        const n = quantileStack.length
        const centerIndex = Math.floor(n / 2)

        const xScale = d3.scaleLinear( [0, 24], [0, width])
        const yScale = d3.scaleLinear([0, 350], [height, 0])
        const opacityScale = d3.scaleLinear([0, centerIndex, n - 1], [.2, .4, .2])

        const yMin = yScale.range()[1]
        const yMax = yScale.range()[0]
        const xMin = xScale.range()[0]
        const xMax = xScale.range()[1]

        const out = d3.create("svg")
            .attr("width", width+ marginLeft+ marginRight)
            .attr("height", height+ marginTop + marginBottom)
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        const svg = out.append("g")
            .attr("transform",
                "translate(" + marginLeft + "," + marginTop + ")");

        // Gradient colors
        // Small helper function that converts number to sting
        const getThrPercentage = (d : any) => d === undefined ? "100%" : 100 * d / yMax + "%"
        // @ts-ignore
        const thrColors = this.thresholds.flatMap((d : any, i : any) =>
            [{offset:getThrPercentage(d.x0), color: this.colorScheme[i]},{offset:getThrPercentage(d.x1), color: this.colorScheme[i]}])

        const gradient = d3.creator("linearGradient")
        svg.append(gradient)
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", yScale(0))
            .attr("x2", 0).attr("y2", yScale(yMax))
            .selectAll("stop").data(thrColors).join("stop")
            .attr("offset", (d : any) => d.offset)
            .attr("stop-color", (d : any) => d.color)

        // Horizontal lines
        // Helper function returns the x and y coords for a given line from a stack
        const lineCoords = function (d : any) : [[number, number], [number, number]] {
            let y : number = d.x1 === undefined ? yMax : yScale(d.x1) + .5  // plus by .5 to center it relative to its stroke width
            return [[xMin, y], [xMax,  y]]
        }
        // Draw lines
        svg.append("g")
            .selectAll("path")
            .data(this.thresholds)
            .join("path")
            .attr("d", (d) => d3.line()(lineCoords(d)))
            .attr("style", (d,i) => this.getLineStyle(i))

        // Vertical lines
        svg.append("g")
            .selectAll("path")
            .data([0, 6, 12, 18, 24])
            .join("path")
            .attr("d", (d,i) => d3.line()([[xScale(d), yMin], [xScale(d), yMax]]))
            .attr("style", "opacity: .1;fill: none; stroke: black;")
            .attr("stroke-width", 1)


        // Area generator
        const areaGenerator = d3.area<d3.SeriesPoint<BucketQuantiles>>()
            .curve(curveType)
            .x ((d) => xScale(d.data[0].hour))
            .y0((d) => yScale(d[0]))
            .y1((d) => yScale(d[1]))

        // Draw Area
        svg.append("g")
            .selectAll("path")
            .data(quantileStack)
            .join("path")
            .attr("d", areaGenerator)
            .attr("style", "fill: url(#line-gradient);")
            .attr("opacity", (d,i) => opacityScale(i))

        // DRAW MEDIAN
        const medianLineGen = d3.line<DataPoint>()
            .curve(curveType)
            .defined(d => d.y != 0)
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))

        svg.append("path")
            .attr("d", medianLineGen(median))
            .attr("style", "stroke-width: 3;fill: none; stroke: url(#line-gradient);  opacity: 1;")


        // Axises
        svg.append("g")
            .call(d3.axisLeft(yScale).tickValues(this.thresholds.map(d => d.x0)))
            .selectAll("text")
            .attr("style", (d,i) => this.getFontStyle(i))
        const highlightedTime = (d : number) => d % 12 === 0
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickFormat(d => d + ":00"))
            .selectAll("text")
            .attr("style", (d : any) => (highlightedTime(d) ? "font-size: 12; font-weight: bold;" : "font-size: 10; font-weight: normal;"))

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
                .data(this.thresholds)
                .join("rect")
                .attr("x", 0)
                .attr("width", width)
                .attr("y", d => d.x1 === undefined ? yMax : yScale(d.x1) )
                .attr("height", d => yScale(d.x0) - (d.x1 === undefined ? yMax : yScale(d.x1)))
                .attr("fill", (d,i) => this.colorScheme[i])
                .attr("opacity", 0.2)


        }
        return out.node()
    }


    public lineChart (data : SortedData,
              {
                  marginTop = 20, // top margin, in pixels
                  marginRight = 30, // right margin, in pixels
                  marginBottom = 20, // bottom margin, in pixels
                  marginLeft = 40, // left margin, in pixels
                  width = 1000, // outer width, in pixels
                  height = 400, // outer height, in pixels
              }) {

        const out = d3.create("svg")
            .attr("width", width+ marginLeft+ marginRight)
            .attr("height", height+ marginTop + marginBottom)
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        const svg = out.append("g")
            .attr("transform",
                "translate(" + marginLeft + "," + marginTop + ")");


        const ext = d3.extent(data, (d: DataCGM) => d.date)
        if (ext === [undefined, undefined]) {
            console.log("Can't find extent, cannot create the graph")
            return out.node()
        }

        // @ts-ignore
        const xScale = d3.scaleTime().domain(ext).range([0, width])

        const yScale = d3.scaleLinear([0, 350], [height, 0])
        const yMin = yScale.range()[1]
        const yMax = yScale.range()[0]
        const xMin = xScale.range()[0]
        const xMax = xScale.range()[1]
        const dateMax = xScale.domain()[1]


        // The Line
        const lineGen = d3.line<DataCGM>()
            .x(d => xScale(d.date))
            .y(d => yScale(d.cgm))(data)
        svg.append("path")
            .attr("fill", "none")
            .attr("style", "stroke: url(#line-gradient);")
            .attr("stroke-width", 3)
            .attr("d", lineGen)


        // Horizontal lines
        // Helper function returns the x and y coords for a given line from a stack
        const lineCoords = function (d : any) : [[number, number], [number, number]] {
            let y : number = d.x1 === undefined ? yMax : yScale(d.x1) + .5  // plus by .5 to center it relative to its stroke width
            return [[xMin, y], [xMax,  y]]
        }

        // Draw lines
        svg.append("g")
            .selectAll("path")
            .data(this.thresholds)
            .join("path")
            .attr("d", (d) => d3.line()(lineCoords(d)))
            .attr("style", (d,i) => this.getLineStyle(i))
        // Vertical lines

        //const days = Array((ext[1]?.getTime() ?? 0 - (ext[0]?.getTime() ?? 0) / (1000 * 3600 * 24)))
        const days = []
        for (let i = 0; i < days.length; i++) {
            days[i] = new Date(dateMax).setDate(dateMax.getDate() - i + 1)
        }


        const vertStrokeWidth = 1
        svg.append("g")
            .selectAll("path")
            .data(days)
            .join("path")
            .attr("d", (d,i) => d3.line()([[xScale(d) + vertStrokeWidth / 2, yMin], [xScale(d)+vertStrokeWidth / 2, yMax]])) //
            .attr("style", "opacity: .1;fill: none; stroke: black;")
            .attr("stroke-width", vertStrokeWidth)

        // Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))

        svg.append("g")
            .call(d3.axisLeft(yScale).tickValues(this.thresholds.map(d => d.x0)))
            .selectAll("text")
            .attr("style",(d,i) => this.getFontStyle(i))

        return out.node()
    }
    applySVG (ref : Ref<SVGElement | null>, svg : SVGSVGElement | null) {
        if (ref.value != null && svg?.outerHTML != undefined) ref.value.outerHTML = svg.outerHTML
    }

}