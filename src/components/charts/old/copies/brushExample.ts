import * as d3 from "d3"

const width = 800
const height = 120
const margin = ({top: 10, right: 0, bottom: 20, left: 0})
//@ts-ignore
const interval: d3.TimeInterval = d3.timeHour.every(12)


export function brushExample() {

    const svg = d3.select("svg")
        .attr("viewBox", [0, 0, width, height]);

    const brush = d3.brushX<any>()
        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
        .on("brush", brushed);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(brush);

    function brushed(event: any, d: any) {
        if (!event.sourceEvent) return;
        const d0 = event.selection.map(x.invert);
        const d1 = d0.map(interval.round);

        // If empty when rounded, use floor instead.
        if (d1[0] >= d1[1]) {
            d1[0] = interval.floor(d0[0]);
            d1[1] = interval.offset(d1[0]);
        }

        d3.select(d).call(brush.move, d1.map(x));
    }

    return svg.node();
}


const x = d3.scaleTime()
    .domain([new Date(2013, 7, 1), new Date(2013, 7, width / 60)])
    .rangeRound([margin.left, width - margin.right])
const axisBottom = d3.axisBottom(x)
    .ticks(interval)
    .tickSize(-height + margin.top + margin.bottom)
    .tickFormat(() => "")
const xAxis = (g: any) => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call((g: any) => g.append("g")
        .call(axisBottom)
        .call((g: any) => g.select(".domain")
            .attr("fill", "#ddd")
            .attr("stroke", null))
        .call((g: any) => g.selectAll(".tick line")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", (d: any) => d <= d3.timeDay(d) ? 1 : 0.5)))
    .call((g: any) => g.append("g")
        .call(d3.axisBottom(x)
            .ticks(d3.timeDay)
            .tickPadding(0))
        .attr("text-anchor", null)
        .call((g: any) => g.select(".domain").remove())
        .call((g: any) => g.selectAll("text").attr("x", 6)))