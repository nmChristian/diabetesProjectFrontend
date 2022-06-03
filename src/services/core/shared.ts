import {SPLIT_BY_DAY} from "@/services/core/datatypes";

export {colorScheme, HealthLevel, healthLevelToColor, thresholds, dateToSeconds}

// For graphs
export const MAX_CGM = 350, MIN_CGM = 0

// Coloring
const colorScheme : string[] = ["#33658a","#78c0e0","#5da271","#dda448","#92140c"]

// Health levels
enum HealthLevel {
    VeryLow,
    Low,
    Good,
    High,
    VeryHigh
}
const healthLevelToColor = (healthLevel : HealthLevel) : string  => colorScheme[healthLevel]

// Thresholds
const thresholds =
    [{x0 : 0, x1 : 54}
        ,{x0 : 54, x1 : 70}
        ,{x0 : 70, x1 : 180}
        ,{x0 : 180, x1 : 250}
        ,{x0 : 250, x1 : undefined}]


// Methods
// Returns the second of the day
const dateToSeconds = (date : Date) : number =>
    date.getDate() * 3600 * 24 +
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds()
