// Author: Jonas
// Description: Contains functions and fields, that doesn't really fit in their own file. These are often used in other files
export {COLOR_SCHEME, HealthLevel, healthLevelToColor, dateToSeconds}

// Color Scheme for graphs
const COLOR_SCHEME: string[] = ["#33658a", "#78c0e0", "#5da271", "#dda448", "#92140c"].reverse()
export const LINE_COLOR = "#33658a"

// Health levels
enum HealthLevel {
    VeryLow,
    Low,
    Good,
    High,
    VeryHigh
}
const healthLevelToColor = (healthLevel: HealthLevel): string => COLOR_SCHEME[healthLevel]

// Time
export enum TimeUnit {
    Seconds = 1,
    Minute = 60,
    Hour = 3600,
    Day = 3600 * 24,
}
export const
    SPLIT_BY_HOUR = 3600,
    SPLIT_BY_DAY = SPLIT_BY_HOUR * 24,
    SPLIT_BY_WEEK = SPLIT_BY_DAY * 7
export const TIME_UNIT_DEFAULT = TimeUnit.Hour

// Converts date into seconds
const dateToSeconds = (date: Date): number =>
    date.getDate() * 3600 * 24 +
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds()


