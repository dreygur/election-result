const BN_DIGITS: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

export function bnToEn(str: string): string {
  return str.replace(/[০-৯]/g, (ch) => BN_DIGITS[ch] ?? ch);
}

export function parseBnInt(str: string): number | null {
  const cleaned = bnToEn(str.replace(/,/g, "").trim());
  const n = parseInt(cleaned, 10);
  return Number.isNaN(n) ? null : n;
}
