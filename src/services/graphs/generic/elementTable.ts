import * as d3 from "d3";
import {getCGMColor} from "@/services/core/datatypes";

// Outputs a list of hours example, getHours(4) = [0, 4, 8, 12, 16, 20], getHours(3) = [0, 3, 6, 9, 12, 15, 18, 21]
const getHourList = (hoursPerRange : number ) =>[...Array(24 / hoursPerRange).keys()].map<number>(hour => hour * hoursPerRange)
export default function elementTable(elements: [Date, number[]][]) {
    const table = document.createElement("table")
    table.className = "elementTable"

    if (elements.length == 0)
        return table

    // Add description of time of day
    const timeOfDay = table.insertRow()
    timeOfDay.className ="time-of-day"
    // Filler cell
    timeOfDay.append(document.createElement("th"))


    getHourList(24 / elements[0][1].length).forEach(hour => {
        const legend = document.createElement("th")
        timeOfDay.append(legend)
        legend.innerHTML = hour.toString() + ":00"
    })

    elements.forEach( ([date, values]) => {
        const tr = table.insertRow()

        // Add description of dates
        const day = document.createElement("th")
        tr.append(day)
        day.innerHTML = d3.timeFormat("%a %e/%m")(date)
        day.className = "day"


        values.forEach((value) => {
            const td = tr.insertCell()
            if (isNaN(value))
                return
            td.innerHTML = value.toFixed(0).toString()
            td.style.backgroundColor = getCGMColor(value)
        })


    })

    return table
}