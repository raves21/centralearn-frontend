import { isEqual, sortBy } from "lodash";
import { formatInTimeZone } from "date-fns-tz";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export function isArrayEqualRegardlessOfOrder(arr1: any, arr2: any) {
  return isEqual(sortBy(arr1), sortBy(arr2));
}

export function getDateTimeFormat() {
  return "yyyy-MM-dd HH:mm:ss";
}

export function formatDateStringToDateObj(dateString: string) {
  dayjs.extend(customParseFormat);
  const dateObj = dayjs(dateString, "YYYY-MM-DD HH:mm:ss").toDate();
  return dateObj;
}

export function getDateTimeFormatWithoutSeconds() {
  return "yyyy-MM-dd HH:mm";
}

export function formatToUTC(date: Date | string) {
  if(typeof date === "string"){
    return formatInTimeZone(formatDateStringToDateObj(date), "UTC", getDateTimeFormat()); 
  }
  return formatInTimeZone(date, "UTC", getDateTimeFormat());
}

export function formatToLocal(date: Date) {
  return formatInTimeZone(
    date,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    getDateTimeFormat(),
  );
}
