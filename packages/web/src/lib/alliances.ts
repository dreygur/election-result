export type Alliance = {
  slug: string;
  name: string;
  shortName: string;
  color: string;
  partySlugs: string[];
};

export const ALLIANCES: Alliance[] = [
  {
    slug: "bnp-alliance",
    name: "BNP-led Alliance",
    shortName: "BNP Alliance",
    color: "#1B8A2A",
    partySlugs: [
      "bangladesh-nationalist-party-bnp",
      "jamiate-ulama-e-islam-bangladesh",
      "islami-oikyajote",
      "gonodhikar-parishad-gop",
      "biplabi-workers-party",
      "gonoshonghoti-andolon",
      "nagorik-oikko",
      "jatiyatabadi-ganotantrik-andolon-ndm",
      "national-peoples-party-npp",
    ],
  },
  {
    slug: "jamaat-alliance",
    name: "Jamaat-led 11-Party Alliance",
    shortName: "Jamaat Alliance",
    color: "#E85D26",
    partySlugs: [
      "bangladesh-jamaat-e-islami",
      "jatiyo-nagorik-party-ncp",
      "bangladesh-khelafat-majlis",
      "khelafat-majlis",
      "bangladesh-khilafat-andolan",
      "amar-bangladesh-party-ab-party",
      "bangladesh-nezame-islam-party",
      "liberal-democratic-party-ldp",
      "jatiya-ganatantrik-party-jagpa",
      "bangladesh-development-party",
      "bangladesh-labour-party",
    ],
  },
  {
    slug: "left-duf",
    name: "Left Democratic / DUF",
    shortName: "Left/DUF",
    color: "#C62828",
    partySlugs: [
      "communist-party-of-bangladesh",
      "bangladesh-samajtantrik-dal-basad",
      "workers-party-of-bangladesh",
      "bangladesh-samajtantrik-dal-marxist",
      "jatiya-samajtantrik-dal-jasad",
      "bangladesh-jatiyo-samajtantrik-dal-jasod",
    ],
  },
  {
    slug: "jatiya-party-ndf",
    name: "Jatiya Party / NDF",
    shortName: "JP/NDF",
    color: "#D4A017",
    partySlugs: [
      "jatiya-party",
    ],
  },
];

/** Map from party slug → alliance slug for quick lookup */
const partyToAlliance = new Map<string, string>();
for (const a of ALLIANCES) {
  for (const ps of a.partySlugs) {
    partyToAlliance.set(ps, a.slug);
  }
}

export function getAllianceForParty(partySlug: string | null): Alliance | null {
  if (!partySlug) return null;
  const aSlug = partyToAlliance.get(partySlug);
  return ALLIANCES.find((a) => a.slug === aSlug) ?? null;
}

export function getAllianceSlugForParty(partySlug: string | null): string {
  if (!partySlug) return "others";
  return partyToAlliance.get(partySlug) ?? "others";
}
