import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

export function formatPercent(value: number | null, total: number | null): string {
  if (value == null || total == null || total === 0) return "—";
  return `${((value / total) * 100).toFixed(1)}%`;
}
