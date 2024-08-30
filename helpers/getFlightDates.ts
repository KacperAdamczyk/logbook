import { CalendarDateTime, parseDate, parseTime } from "@internationalized/date";



export const getFlightDates = (date: string, departureTime: string, arrivalTime: string) => {
const baseDate = parseDate(date);
const departure = parseTime(departureTime);
const arrival = parseTime(arrivalTime);

const departureDate = new CalendarDateTime(baseDate.year, baseDate.month, baseDate.day, departure.hour, departure.minute, departure.second);
const arrivalDate = new CalendarDateTime(
  baseDate.year,
  baseDate.month,
  baseDate.day,
  arrival.hour,
  arrival.minute,
  arrival.second
).add({ days: departure.compare(arrival) > 0 ? 1 : 0 });

return [departureDate.toDate('utc'), arrivalDate.toDate('utc')];

}
