export function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number") {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | null | undefined, digits = 2) {
  if (typeof value !== "number") {
    return "N/A";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function formatSignedNumber(value: number | null | undefined, digits = 2) {
  if (typeof value !== "number") {
    return "N/A";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}`;
}

export function formatOutcomeLabel(value: string | null | undefined) {
  if (!value) {
    return "N/A";
  }

  return value
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "N/A";
  }

  if (/^\d{4}$/.test(value.trim())) {
    return value.trim();
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function formatDateTimeInput(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const pad = (input: number) => input.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
