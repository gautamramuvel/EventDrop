export function toIsoDateTimeLocal(value: FormDataEntryValue | null) {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
}
