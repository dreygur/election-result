import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IMAGE_BASE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imageUrl(path: string): string {
  return `${IMAGE_BASE}${path}`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

export function formatPercent(value: number | null, total: number | null): string {
  if (value == null || total == null || total === 0) return "—";
  return `${((value / total) * 100).toFixed(1)}%`;
}
