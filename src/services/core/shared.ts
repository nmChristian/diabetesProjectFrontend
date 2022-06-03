// Returns the second of the day
export const getTimeOfDayInSeconds = (date : Date) : number =>
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
