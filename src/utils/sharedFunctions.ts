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
  // Append "Z" so the string is parsed as UTC, not local time
  const dateObj = dayjs(dateString + "Z", "YYYY-MM-DD HH:mm:ssZ").toDate();
  return dateObj;
}

export function getDateTimeFormatWithoutSeconds() {
  return "yyyy-MM-dd HH:mm";
}

export function formatToUTC(date: Date | string) {
  console.log(date);
  if (typeof date === "string") {
    return formatInTimeZone(
      formatDateStringToDateObj(date),
      "UTC",
      getDateTimeFormat(),
    );
  }
  return formatInTimeZone(date, "UTC", getDateTimeFormat());
}

export function formatToLocal(date: Date | string) {
  console.log("formatToLocal utc", date);
  if (typeof date === "string") {
    const a = formatInTimeZone(
      formatDateStringToDateObj(date),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      getDateTimeFormat(),
    );
    console.log("formatToLocal local", a);
    return a;
  }
  return formatInTimeZone(
    date,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    getDateTimeFormat(),
  );
}

export function getHtmlStringText(htmlString: string | null | undefined) {
  if (htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.innerText.trim();
  }
  return "";
}

export function formatSecondsToTimer(seconds: number) {
  const totalSeconds = Math.floor(seconds); //remove decimals
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return [
    hrs.toString().padStart(2, "0"),
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
}

export function secondsToHoursMinutes(seconds: number) {
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return { hours, minutes };
}

export function hoursMinutesToSeconds(hours: number, minutes: number) {
  return hours * 3600 + minutes * 60;
}
