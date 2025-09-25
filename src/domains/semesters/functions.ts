import dayjs from "dayjs";
import type { Semester } from "./types";

export function formatToSemesterNameAndTimestamps(semester: Semester) {
  return `${semester.name} (${dayjs(semester.startDate).format("MMM D, YYYY")} - ${dayjs(semester.endDate).format("MMM D, YYYY")})`;
}
