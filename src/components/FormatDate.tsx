"use client";

export default function FormatDate({ value }: { value?: string | null }) {
  if (!value) return "—";
  const date = new Date(value);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
}
