import * as d3 from "d3";
import type {BucketPoint, Point} from "@/services/core/datatypes";
import {CGM_RANGE, CGM_THRESHOLDS, COLOR_SCHEME} from "@/services/core/shared";
import {generateGradientCGMCSS} from "@/services/graphs/generateGradientCSS";
import {getFontStyle, getLineStyle} from "@/services/core/graphMethods";
import {pointIsValid} from "@/services/core/datatypes";

export function quantileGraph (bucketSeriesOfQuantilesSplitByDayInHour : d3.Series<BucketPoint, number>[],
                               quantilesUsedInBucket : number[],
                               medianPointsSplitByDayInHour : Point[],
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
    //TODO: Add assert that can check if buckets of quantiles is the same size as quantiles

    const n = bucketSeriesOfQuantilesSplitByDayInHour.length
    const centerIndex = Math.floor(n / 2)

    const xScale = d3.scaleLinear( [0, 24], [0, width])
    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])
    const opacityScale = d3.scaleLinear([0, centerIndex, n - 1], [.2, .4, .2])

    const yMin = yScale.range()[1]
    const yMax = yScale.range()[0]
    const xMin = xScale.range()[0]
    const xMax = xScale.range()[1]
    const dateMax = xScale.domain()[1]

    const out = d3.create("svg")
        .attr("width", width+ marginLeft+ marginRight)
        .attr("height", height+ marginTop + marginBottom)
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    const svg = out.append("g")
        .attr("transform",
            "translate(" + marginLeft + "," + marginTop + ")");


    // Horizontal lines
    // Helper function returns the x and y coords for a given line from a stack
    const lineCoords = function (d : any) : [[number, number], [number, number]] {
        let y : number = d.x1 === undefined ? yMax : yScale(d.x1) + .5  // plus by .5 to center it relative to its stroke width
        return [[xMin, y], [xMax,  y]]
    }
    // Draw lines
    svg.append("g")
        .selectAll("path")
        .data(CGM_THRESHOLDS)
        .join("path")
        .attr("d", (d) => d3.line()(lineCoords(d)))
        .attr("style", (d,i) => getLineStyle(i))

    // Vertical lines
    svg.append("g")
        .selectAll("path")
        .data([0, 6, 12, 18, 24])
        .join("path")
        .attr("d", (d,i) => d3.line()([[xScale(d), yMin], [xScale(d), yMax]]))
        .attr("style", "opacity: .1;fill: none; stroke: black;")
        .attr("stroke-width", 1)


    // Area generator
    const areaGenerator = d3.area<d3.SeriesPoint<BucketPoint>>()
        .curve(curveType)
        // Get x value of bucket point
        .x ((d) => xScale(d.data[0]))
        // Get y values
        .y0(([y0]) => yScale(y0))
        .y1(([,y1]) => yScale(y1))

    // Draw Area
    svg.append("g")
        .selectAll("path")
        .data(bucketSeriesOfQuantilesSplitByDayInHour)
        .join("path")
        .attr("d", areaGenerator)
        .attr("style", "fill: " + generateGradientCGMCSS(yScale) + ";")
        .attr("opacity", (d,i) => opacityScale(i))

    // Draw Median
    const medianLineGen = d3.line<Point>()
        .curve(curveType)
        .defined(pointIsValid)
        .x(([x,]) => xScale(x))
        .y(([,y]) => yScale(y))
        (medianPointsSplitByDayInHour)

    svg.append("path")
        .attr("d", medianLineGen)
        .attr("style", "stroke-width: 3;fill: none; stroke: url(#line-gradient);  opacity: 1;")


    // Axises
    svg.append("g")
        .call(d3.axisLeft(yScale).tickValues(CGM_THRESHOLDS.map(d => d.x0)))
        .selectAll("text")
        .attr("style", (d,i) => getFontStyle(i))
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
            .data(CGM_THRESHOLDS)
            .join("rect")
            .attr("x", 0)
            .attr("width", width)
            .attr("y", d => d.x1 === undefined ? yMax : yScale(d.x1) )
            .attr("height", d => yScale(d.x0) - (d.x1 === undefined ? yMax : yScale(d.x1)))
            .attr("fill", (d,i) => COLOR_SCHEME[i])
            .attr("opacity", 0.2)


    }
    return out.node()
}


/**
 * Get the quantiles of all the data in each bucket, and return a bucket with the quantiles
 * Each bucket returned has the size of quantiles.length
 * @param bucketPoints - The buckets with data
 * @param quantiles - The quantiles ex. [0.05, 0.25, 0.75, 0.95]
 */
export function calculateQuantiles (bucketPoints : BucketPoint[], quantiles : number[] = [0.05, 0.25, 0.75, 0.95]) : BucketPoint[] {
    // Sort data in buckets for faster quantile calculation
    const sortedBuckets = bucketPoints.map<BucketPoint>(([x,values]) => [x, values.sort(d3.ascending)])

    // For each bucket point
    return sortedBuckets.map<BucketPoint>(([x, values]) =>
        // Calculate each quantile
        [x, quantiles.map<number>(quantile => d3.quantileSorted(values, quantile) ?? NaN)])
}

/**
 * http://using-d3js.com/05_06_stacks.html
 * Converts a bucketpoint into a d3.Series which is a y0 y1 and a data element, every d3.series is the same index in the bucketpoint array
 * Example: toSeries(bp)[0] is a reference to all
 * @param bucketPoints - The buckets with data (requirement all values has to be the same length)
 */
export function toSeries (bucketPoints : BucketPoint[]) : d3.Series<BucketPoint, number>[] {
    //TODO: Add assert that all items in bucketpoints has the same size
    //TODO: assert bucketpoints is not empty if (bucketPoints.length == 0)

    const n = bucketPoints[0]?.length ?? 0

    return d3.stack<any, any, number>()
        .keys(d3.range(n))
        .order(d3.stackOrderNone)
        .value((bucketPoint, key) => bucketPoint[key]) // Only get the data element from it
        (bucketPoints)

    //out.shift()  // Remove the lowest area from (0%, 5%)
}