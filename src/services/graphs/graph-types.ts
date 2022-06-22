// Author: Jonas
// Description: Types used in graphs


// Time
export enum TimeUnit {
    Seconds = 1,
    Minute = 60,
    Hour = 3600,
    Day = 3600 * 24,
}

export const TIME_UNIT_DEFAULT = TimeUnit.Hour