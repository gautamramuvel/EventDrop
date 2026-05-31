import { subMinutes } from "date-fns";

export function reminderSendAt(startAt: Date) {
  return subMinutes(startAt, 30);
}
