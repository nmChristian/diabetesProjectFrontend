import * as d3 from "d3";
import {getCGMColor} from "@/services/core/datatypes";

const defaultBackgroundColor = "white"
const defaultFontColor = "white"
const defaultAltFontColor = "black"
// Outputs a list of hours example, getHours(4) = [0, 4, 8, 12, 16, 20], getHours(3) = [0, 3, 6, 9, 12, 15, 18, 21]
const getHourList = (hoursPerRange: number) => [...Array(24 / hoursPerRange).keys()].map<number>(hour => hour * hoursPerRange)

export type ElementRow = {title : string, values: [number, string?][]}
export function elementTable(elements: [Date, ElementRow []] []) {
    const table = document.createElement("table")
    table.className = "elementTable"


    if (elements.length == 0)
        return table


    // Add description of time of day
    const head = table.createTHead()
    const timeOfDay = head.insertRow()
    timeOfDay.className = "time-of-day"
    // Filler cell
    timeOfDay.append(document.createElement("th"))

    // The total amount of cols is based on the first elements count of values
    const hourInterval = 24 / elements[0][1][0].values.length

    const hourList = getHourList(hourInterval)
    hourList.forEach(hour => {
        const legend = document.createElement("th")
        timeOfDay.append(legend)
        legend.innerHTML = hour.toString() + ":00"
    })
    const nCols = hourList.length

    const colGroup = document.createElement("colgroup")
    table.append(colGroup)

    // Create for dates

    const cols = ([["col-dates", 1], ["col-data", nCols], ["col-sub-titles", 1],] as [string, number][]).map(([className, columns]) => {
        const col = document.createElement("col")
        col.span = columns
        col.className = className
        colGroup.append(col)
        return col
    })


    // Filler cell
    timeOfDay.append(document.createElement("th"))

    elements.forEach(([date, rows]) => {
        const body = table.createTBody()
        rows.forEach(({title, values}, i) => {
            const tr = body.insertRow()

            if (i === 0) {
                // Add description of dates
                const day = document.createElement("th")
                tr.append(day)
                day.innerHTML = d3.timeFormat("%a %e/%m")(date)
                day.className = "day"
                day.rowSpan = 0
            }

            values.map(([value, color]) => {
                const td = tr.insertCell()
                if (isNaN(value))
                    return
                td.innerHTML = value.toFixed(0).toString()
                td.style.backgroundColor = color ?? "inherit"
                td.style.color = (color) ? defaultFontColor : defaultAltFontColor
                td.style.fontWeight = (color) ? "bold": "inherit"
            })

            // Add description of dates
            const subTitle = document.createElement("th")
            tr.append(subTitle)
            subTitle.innerHTML = title
            subTitle.className = "sub-title"

        })



    })

    return table
}