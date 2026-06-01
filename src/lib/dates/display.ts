type DisplayOptions = {
  locale?: string;
  timeZone?: string;
};

export function formatLocalTime(value: string, options: DisplayOptions = {}) {
  return new Intl.DateTimeFormat(options.locale, {
    timeStyle: "short",
    timeZone: options.timeZone
  }).format(new Date(value));
}

export function formatLocalDateTime(value: string, options: DisplayOptions = {}) {
  return new Intl.DateTimeFormat(options.locale, {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: options.timeZone
  }).format(new Date(value));
}

export function formatLocalDateTimeRange(startAt: string, endAt: string, options: DisplayOptions = {}) {
  return `${new Intl.DateTimeFormat(options.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: options.timeZone
  }).format(new Date(startAt))} - ${formatLocalTime(endAt, options)}`;
}
