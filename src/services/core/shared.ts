export const colorScheme : string[] = ["#33658a","#78c0e0","#5da271","#dda448","#92140c"]

export enum HealthLevel {
    VeryLow,
    Low,
    Good,
    High,
    VeryHigh
}
export const healthLevelToColor = (healthLevel : HealthLevel) : string  => colorScheme[healthLevel]

export const thresholds =
    [{x0 : 0, x1 : 54}
        ,{x0 : 54, x1 : 70}
        ,{x0 : 70, x1 : 180}
        ,{x0 : 180, x1 : 250}
        ,{x0 : 250, x1 : undefined}]


// Methods
// Returns the second of the day
export const getTimeOfDayInSeconds = (date : Date) : number =>
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
