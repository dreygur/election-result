import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { ALLIANCES } from "@/lib/alliances";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [constituencies, parties] = await Promise.all([
    db.selectFrom("constituencies").select("slug").execute(),
    db.selectFrom("parties").select("slug").execute(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/constituencies",
    "/parties",
    "/alliances",
    "/search",
    "/gonovote",
  ].map((route) => ({ url: `${SITE_URL}${route}` }));

  const constituencyRoutes: MetadataRoute.Sitemap = constituencies.map(
    (c) => ({ url: `${SITE_URL}/constituencies/${c.slug}` })
  );

  const partyRoutes: MetadataRoute.Sitemap = parties.map((p) => ({
    url: `${SITE_URL}/parties/${p.slug}`,
  }));

  const allianceRoutes: MetadataRoute.Sitemap = ALLIANCES.map((a) => ({
    url: `${SITE_URL}/alliances/${a.slug}`,
  }));

  return [
    ...staticRoutes,
    ...constituencyRoutes,
    ...partyRoutes,
    ...allianceRoutes,
  ];
}
