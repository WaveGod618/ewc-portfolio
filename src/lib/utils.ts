import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (value === null) {
    return null;
  }

  const normalized = String(value).trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseRequiredNumber(value: FormDataEntryValue | null, label: string) {
  const parsed = parseOptionalNumber(value);

  if (parsed === null) {
    throw new Error(`${label} is required.`);
  }

  return parsed;
}

export function parseOptionalText(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : null;
}

export function parseRequiredText(value: FormDataEntryValue | null, label: string) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

export function toIsoDateTime(value: FormDataEntryValue | null, fallback = new Date()) {
  const normalized = String(value ?? "").trim();
  return normalized ? new Date(normalized).toISOString() : fallback.toISOString();
}

export function truncateText(value: string | null | undefined, length = 96) {
  if (!value) {
    return "";
  }

  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trim()}...`;
}

export function buildTickerOptions(tickers: string[]) {
  return Array.from(new Set(tickers.map((ticker) => ticker.toUpperCase()))).sort();
}
