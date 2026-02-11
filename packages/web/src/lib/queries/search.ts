import { sql } from "kysely";
import { db } from "../db";

export type SearchResult = {
  type: "constituency" | "candidate" | "party" | "district";
  id: number;
  label: string;
  sublabel: string | null;
  href: string;
};

export async function search(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const pattern = `%${query}%`;

  const [constituencies, candidates, parties, districts] = await Promise.all([
    db
      .selectFrom("constituencies as c")
      .innerJoin("districts as d", "d.id", "c.district_id")
      .where((eb) =>
        eb.or([
          eb("c.name_en", "ilike", pattern),
          eb("c.name_bn", "like", pattern),
        ])
      )
      .select([
        "c.id",
        "c.name_en",
        "c.slug",
        "d.name_en as districtName",
      ])
      .limit(10)
      .execute(),
    db
      .selectFrom("candidates as c")
      .innerJoin("constituencies as con", "con.id", "c.constituency_id")
      .where((eb) =>
        eb.or([
          eb("c.name_bn", "like", pattern),
          eb("c.name_en", "ilike", pattern),
        ])
      )
      .select([
        "c.id",
        "c.name_bn",
        "c.name_en",
        "con.name_en as constituencyName",
      ])
      .limit(10)
      .execute(),
    db
      .selectFrom("parties")
      .where((eb) =>
        eb.or([
          eb("name_en", "ilike", pattern),
          eb("name_bn", "like", pattern),
          eb("short_name", "ilike", pattern),
        ])
      )
      .select(["id", "name_en", "name_bn", "slug"])
      .limit(10)
      .execute(),
    db
      .selectFrom("districts")
      .where((eb) =>
        eb.or([
          eb("name_en", "ilike", pattern),
          eb("name_bn", "like", pattern),
        ])
      )
      .select(["id", "name_en", "slug"])
      .limit(10)
      .execute(),
  ]);

  const results: SearchResult[] = [];

  for (const d of districts) {
    results.push({
      type: "district",
      id: d.id,
      label: d.name_en,
      sublabel: null,
      href: `/constituencies?district=${d.slug}`,
    });
  }
  for (const c of constituencies) {
    results.push({
      type: "constituency",
      id: c.id,
      label: c.name_en,
      sublabel: c.districtName,
      href: `/constituencies/${c.slug}`,
    });
  }
  for (const p of parties) {
    results.push({
      type: "party",
      id: p.id,
      label: p.name_en || p.name_bn,
      sublabel: null,
      href: `/parties/${p.slug}`,
    });
  }
  for (const c of candidates) {
    results.push({
      type: "candidate",
      id: c.id,
      label: c.name_en || c.name_bn,
      sublabel: c.constituencyName,
      href: `/candidates/${c.id}`,
    });
  }

  return results;
}
