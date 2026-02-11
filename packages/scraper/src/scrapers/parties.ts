import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Kysely } from "kysely";
import type { Database } from "@election/db";
import * as cheerio from "cheerio";
import { fetchEcsHtml, downloadFileTo } from "../api/ec-client";
import { slugify } from "../parsers/district-names";
import { upsertParty, logScrape, isScraped } from "../db/upsert";
import { logger } from "../logger";

const TOTAL_PAGES = 7;
const __dirname = dirname(fileURLToPath(import.meta.url));
const SYMBOLS_DIR = resolve(__dirname, "../../../web/public/symbols");

function extractImageUrl(srcAttr: string): string | null {
  // Next.js image: /_next/image?url=https%3A%2F%2Fasset.ecs.gov.bd%2F...&w=64&q=75
  try {
    const url = new URL(srcAttr, "https://ecs.gov.bd");
    const raw = url.searchParams.get("url");
    return raw || null;
  } catch {
    return null;
  }
}

function extractNameEn(href: string): string | null {
  // href: /political-parties/details/০০৭?name=Bangladesh%20Nationalist%20Party%20-%20BNP
  try {
    const url = new URL(href, "https://ecs.gov.bd");
    return url.searchParams.get("name");
  } catch {
    return null;
  }
}

export async function scrapeParties(db: Kysely<Database>) {
  logger.info("Scraping parties from ecs.gov.bd...");

  if (!existsSync(SYMBOLS_DIR)) {
    mkdirSync(SYMBOLS_DIR, { recursive: true });
  }

  let totalUpserted = 0;

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const logKey = `ec-parties-page-${page}`;
    if (await isScraped(db, "ec-parties", logKey)) {
      logger.debug({ page }, "Already scraped, skipping");
      continue;
    }

    try {
      const html = await fetchEcsHtml(`/political-parties?page=${page}`);
      const $ = cheerio.load(html);
      const rows = $("tbody tr").toArray();

      if (rows.length === 0) {
        logger.warn({ page }, "No party rows found");
        await logScrape(db, { entity_type: "ec-parties", entity_id: logKey, status: "empty" });
        continue;
      }

      for (const row of rows) {
        const cells = $(row).find("td");
        if (cells.length < 5) continue;

        const regNo = $(cells[0]).text().trim() || null;
        const nameBn = $(cells[1]).text().trim();
        if (!nameBn) continue;

        const href = $(cells[0]).find("a").attr("href") || "";
        const nameEn = extractNameEn(href);
        const registrationDate = $(cells[2]).text().trim() || null;
        const symbolBn = $(cells[3]).text().trim() || null;

        // Extract symbol image URL from Next.js optimized src
        const img = $(cells[4]).find("img").first();
        const srcSet = img.attr("srcset") || img.attr("src") || "";
        const firstSrc = srcSet.split(",")[0]?.trim().split(" ")[0] || "";
        const symbolImageUrl = extractImageUrl(firstSrc);

        const slug = slugify(nameEn || nameBn) || `party-${regNo || Date.now()}`;

        // Download symbol image (skip if already exists on disk)
        let symbolUrl: string | null = null;
        if (symbolImageUrl) {
          const filename = `${slug}.webp`;
          const dest = resolve(SYMBOLS_DIR, filename);
          if (existsSync(dest)) {
            symbolUrl = `/symbols/${filename}`;
            logger.debug({ slug }, "Symbol already exists, skipping download");
          } else {
            try {
              await downloadFileTo(symbolImageUrl, dest);
              symbolUrl = `/symbols/${filename}`;
            } catch (err) {
              logger.warn({ slug, error: (err as Error).message }, "Failed to download symbol");
            }
          }
        }

        await upsertParty(db, {
          name_bn: nameBn,
          name_en: nameEn,
          short_name: null,
          slug,
          logo_url: null,
          ec_registration_no: regNo,
          registration_date: registrationDate,
          symbol_bn: symbolBn === "-" ? null : symbolBn,
          symbol_url: symbolUrl,
        });
        totalUpserted++;
      }

      await logScrape(db, { entity_type: "ec-parties", entity_id: logKey, status: "success" });
      logger.info({ page, rows: rows.length }, "Parties page scraped");
    } catch (err) {
      logger.error({ page, error: (err as Error).message }, "Failed to scrape parties page");
      await logScrape(db, {
        entity_type: "ec-parties",
        entity_id: logKey,
        status: "error",
        error: (err as Error).message,
      });
    }
  }

  logger.info({ total: totalUpserted }, "All parties done");
}
