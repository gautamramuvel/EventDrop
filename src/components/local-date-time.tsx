"use client";

import { useEffect, useState } from "react";
import { formatLocalDateTime, formatLocalDateTimeRange, formatLocalTime } from "@/lib/dates/display";

export function LocalTime({ value }: { value: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(formatLocalTime(value));
  }, [value]);

  return (
    <time dateTime={value} suppressHydrationWarning>
      {label}
    </time>
  );
}

export function LocalDateTime({ value }: { value: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(formatLocalDateTime(value));
  }, [value]);

  return (
    <time dateTime={value} suppressHydrationWarning>
      {label}
    </time>
  );
}

export function LocalDateTimeRange({ startAt, endAt }: { startAt: string; endAt: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(formatLocalDateTimeRange(startAt, endAt));
  }, [startAt, endAt]);

  return (
    <time dateTime={startAt} suppressHydrationWarning>
      {label}
    </time>
  );
}
