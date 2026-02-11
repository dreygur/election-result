const PARTY_COLORS: Record<string, string> = {
  "bangladesh-nationalist-party-bnp": "#1B8A2A",
  "jatiya-party-jp": "#D4A017",
  "bangladesh-jamaat-e-islami": "#E85D26",
  "bangladesh-awami-league": "#006A4E",
  "jatiya-samajtantrik-dal-jsd": "#C62828",
  "workers-party-of-bangladesh": "#D32F2F",
  "bangladesh-tarikat-federation": "#6A1B9A",
  "islami-andolan-bangladesh": "#2E7D32",
  "nagorik-oikya": "#0277BD",
  "liberal-democratic-party": "#1565C0",
  independent: "#78909C",
};

export function getPartyColor(slug: string | null): string {
  if (!slug) return "#78909C";
  if (PARTY_COLORS[slug]) return PARTY_COLORS[slug];
  // Hash-based fallback for consistent color
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 50%)`;
}
