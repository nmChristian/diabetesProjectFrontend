export {COLOR_SCHEME, HealthLevel, healthLevelToColor, CGM_THRESHOLDS, CGM_TARGET, dateToSeconds}

// For graphs
export const CGM_RANGE: [number, number] = [0, 350]

// Coloring
const COLOR_SCHEME: string[] = ["#33658a", "#78c0e0", "#5da271", "#dda448", "#92140c"]

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
const CGM_THRESHOLDS =
    [{x0: 0, x1: 54}
        , {x0: 54, x1: 70}
        , {x0: 70, x1: 180}
        , {x0: 180, x1: 250}
        , {x0: 250, x1: undefined}]
const CGM_TARGET_INDEX = 2
const CGM_TARGET: [number, number] = [CGM_THRESHOLDS[CGM_TARGET_INDEX].x0, CGM_THRESHOLDS[CGM_TARGET_INDEX].x1 ?? NaN]

// Methods
// Converts date into seconds
const dateToSeconds = (date: Date): number =>
    date.getDate() * 3600 * 24 +
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds()


