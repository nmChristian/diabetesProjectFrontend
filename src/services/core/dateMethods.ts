import * as d3 from "d3";

export {getLastMondays}

const getLastMondays = (date : Date, weeksBack : number) => d3.timeMonday.offset(d3.timeMonday(date), - weeksBack)