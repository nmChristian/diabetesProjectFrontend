import * as d3 from "d3";
import {getCGMColor} from "@/services/core/datatypes";

const defaultFontColor = "white"
const defaultAltFontColor = "black"

export type ElementRow = {title : string, values: [number, string?][]}
export function elementTable(elements: [Date, ElementRow []] [], columns: number[]) {
    const table = document.createElement("table")
    table.className = "elementTable"

    if (elements.length == 0)
        return table

    // The total amount of cols is based on the first elements count of values
    const nCols = columns.length

    // Add description of time of day
    const head = table.createTHead()
    head.append(createTimeOfDayRow(columns))

    const colGroup = document.createElement("colgroup")
    table.append(colGroup);

    // Create for dates

    ([["col-dates", 1], ["col-data", nCols], ["col-sub-titles", 1],] as [string, number][]).map(([className, columns]) => {
        const col = document.createElement("col")
        col.span = columns
        col.className = className
        colGroup.append(col)
        return col
    })


    elements.forEach(([date, rows]) => {
        const body = table.createTBody()
        rows.forEach(({title, values}, i, a) => {
            const tr = body.insertRow()
            tr.className = i === 0 ? "first-row" : i === (a.length - 1) ? "last-row" : "center-row"

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

            // Add description of values
            const subTitle = document.createElement("th")
            tr.append(subTitle)
            subTitle.innerHTML = title
            subTitle.className = "sub-title"

        })
    })

    const foot = table.createTFoot()
    foot.append(createTimeOfDayRow(columns))

    return table
}

/**
 * Returns tr element with hours in format 12:00
 * @param columns - List of all the hours to draw
 */
function createTimeOfDayRow (columns: number[]) {
    // Add description of time of day
    const row = document.createElement("tr")
    row.className = "time-of-day"
    // Filler cell
    row.append(document.createElement("th"))
    // Draw hours indicator
    columns.forEach(hour => {
        const legend = document.createElement("th")
        row.append(legend)
        legend.innerHTML = hour.toString() + ":00"
    })
    // Filler cell
    row.append(document.createElement("th"))
    return row
}