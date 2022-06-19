export {COLOR_SCHEME, HealthLevel, healthLevelToColor, getCGMTarget, dateToSeconds}
export type {CGMRanges}
// For graphs
export const CGM_RANGE: [number, number] = [0, 350]

// Coloring
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

// Thresholds
type CGMRanges = [number, number?][]
export const CGM_TARGET_INDEX = 2
const getCGMTarget = (cgmRanges : CGMRanges) : [number, number] => [cgmRanges[CGM_TARGET_INDEX][0], cgmRanges[CGM_TARGET_INDEX][1] ?? NaN]

// Methods
// Converts date into seconds
const dateToSeconds = (date: Date): number =>
    date.getDate() * 3600 * 24 +
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds()


