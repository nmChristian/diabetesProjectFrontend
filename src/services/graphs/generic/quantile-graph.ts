// Author: Jonas
// Description: Draws a quantile graph
import * as d3 from "d3";
import {COLOR_SCHEME} from "@/services/graphs/shared";
import {generateGradientCGMCSSApply} from "@/services/graphs/generic/generate-gradient-css";
import {svgDrawer} from "@/services/graphs/drawers/svg-drawer";
import {drawXAxisHighlightEvery12Hours, drawYAxisCGM} from "@/services/graphs/drawers/axis-drawer";
import {drawHorizontalCGMIndicatorLines, drawVerticalLines} from "@/services/graphs/drawers/line-drawer";
import {GraphLayout} from "@/services/graphs/models/graph-layout";
import {pointIsValid} from "@/services/graphs/auxiliary/type-validity";
import type {CGMRanges} from "@/services/graphs/auxiliary/cgm";
import {CGM_RANGE} from "@/services/graphs/auxiliary/cgm";

export function quantileGraph(bucketSeriesOfQuantiles: d3.Series<BucketPoint, number>[],
                              quantilesUsedInBucket: number[],
                              medianPoints: Point[],
                              cgmRanges: CGMRanges,
                              {
                                  graphLayout = new GraphLayout(800, 400, 0, 30, 20, 40),
                                  indicators = false,
                                  curveType = d3.curveMonotoneX,
                              }) {
    const {width, height, marginLeft} = graphLayout
    const {out, svg} = svgDrawer(graphLayout)

    //TODO: Make sure that buckets of quantiles is the same size as quantiles
    const n = bucketSeriesOfQuantiles.length
    const centerIndex = Math.floor(n / 2)

    // Gets the min and max values (if undefined, then default to 0)
    const extents: [number, number][] = [
        d3.extent(bucketSeriesOfQuantiles[0], d => d.data[0]),
        d3.extent(medianPoints, ([x,]) => x)
    ].map(e => e as [number, number])


    const xScale = d3.scaleLinear()
        .domain([d3.min(extents, e => e[0]), d3.max(extents, e => e[1])].map(d => d ?? 0))
        .range([0, width])
    const yScale = d3.scaleLinear(CGM_RANGE, [height, 0])

    // TODO: Make this here customizable
    const opacityScale = d3.scaleLinear([0, centerIndex, n - 1], [.2, .4, .2])

    const yMax = yScale.range()[0]

    // Area generator
    const areaGenerator = d3.area<d3.SeriesPoint<BucketPoint>>()
        .curve(curveType)
        .defined(d => !(isNaN(d[0]) || isNaN(d[1])))
        // Get x value of bucket point
        .x((d) => xScale(d.data[0]))
        // Get y values
        .y0(([y0]) => yScale(y0))
        .y1(([, y1]) => yScale(y1))

    // Draw Area
    const cssIDForGradient = generateGradientCGMCSSApply(svg, 0, height, cgmRanges)
    svg.append("g")
        .selectAll("path")
        .data(bucketSeriesOfQuantiles)
        .join("path")
        .attr("d", areaGenerator)
        .attr("style", "fill: " + cssIDForGradient + ";")
        .attr("opacity", (d, i) => opacityScale(i))

    // Draw Median
    const medianLineGen = d3.line<Point>()
        .curve(curveType)
        .defined(pointIsValid)
        .x(([x,]) => xScale(x))
        .y(([, y]) => yScale(y))
        (medianPoints)

    svg.append("path")
        .attr("d", medianLineGen)
        .attr("style", "stroke-width: 3;fill: none; stroke: " + cssIDForGradient + ";  opacity: 1;")


    // Axises
    drawYAxisCGM(svg, yScale, cgmRanges)
    drawXAxisHighlightEvery12Hours(svg, xScale, height)

    // Draw lines
    drawHorizontalCGMIndicatorLines(svg, xScale, yScale, cgmRanges)
    drawVerticalLines<number, number>(svg, xScale, yScale, [6, 12, 18, 24])


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
            .data(cgmRanges)
            .join("rect")
            .attr("x", 0)
            .attr("width", width)
            .attr("y", d => d[1] === undefined ? yMax : yScale(d[1]))
            .attr("height", d => yScale(d[0]) - (d[1] === undefined ? yMax : yScale(d[1])))
            .attr("fill", (d, i) => COLOR_SCHEME[i])
            .attr("opacity", 0.2)
    }
    return out
}


/**
 * Get the quantiles of all the data in each bucket, and return a bucket with the quantiles
 * Each bucket returned has the size of quantiles.length
 * @param bucketPoints - The buckets with data
 * @param quantiles - The quantiles ex. [0.05, 0.25, 0.75, 0.95]
 */
export function calculateQuantiles(bucketPoints: BucketPoint[], quantiles: number[] = [0.05, 0.25, 0.75, 0.95]): BucketPoint[] {
    // Sort data in buckets for faster quantile calculation
    const sortedBuckets = bucketPoints.map<BucketPoint>(([x, values]) => [x, values.sort(d3.ascending)])

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
export function toBucketSeries(bucketPoints: BucketPoint[]): d3.Series<BucketPoint, number>[] {
    //TODO: Add assert that all items in bucketpoints has the same size
    //TODO: assert bucketpoints is not empty if (bucketPoints.length == 0)


    const n = bucketPoints[0][1]?.length ?? 0

    return d3.stack<any, any, number>()
        .keys(d3.range(n))
        .order(d3.stackOrderNone)
        .value(([x, values], key) => values[key]) // Only get the data element from it
        (bucketPoints)

    //out.shift()  // Remove the lowest area from (0%, 5%)
}