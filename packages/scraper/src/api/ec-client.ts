import { exec } from "node:child_process";
import { promisify } from "node:util";
import pLimit from "p-limit";
import { logger } from "../logger";

const execAsync = promisify(exec);

const BASE_80 = "http://103.183.38.66";
const BASE_81 = "http://103.183.38.66:81";
const ELECTION_ID = 478;
const CONCURRENCY = 3;
const DELAY_MS = 300;
const MAX_RETRIES = 3;

const limit = pLimit(CONCURRENCY);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  retries = MAX_RETRIES,
  headers?: Record<string, string>,
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, headers ? { headers } : undefined);
      if (!res.ok && res.status >= 500 && i < retries) {
        const delay = DELAY_MS * Math.pow(2, i);
        logger.warn({ url, status: res.status, retry: i + 1, delay }, "Retrying");
        await sleep(delay);
        continue;
      }
      return res;
    } catch (err) {
      if (i < retries) {
        const delay = DELAY_MS * Math.pow(2, i);
        logger.warn({ url, error: (err as Error).message, retry: i + 1, delay }, "Retrying");
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }
  throw new Error(`Failed after ${retries} retries: ${url}`);
}

/** Fetch JSON from port 81 API */
export async function fetchJson81<T>(path: string): Promise<T> {
  return limit(async () => {
    const url = `${BASE_81}${path}`;
    logger.debug({ url }, "Fetching JSON (81)");
    const res = await fetchWithRetry(url);
    return res.json() as Promise<T>;
  });
}

/** Fetch HTML from port 80 (candidate info) */
export async function fetchHtml80(path: string): Promise<string> {
  return limit(async () => {
    const url = `${BASE_80}${path}`;
    logger.debug({ url }, "Fetching HTML (80)");
    await sleep(DELAY_MS);
    const res = await fetchWithRetry(url);
    return res.text();
  });
}

/** Fetch HTML from port 81 (center results) */
export async function fetchHtml81(path: string): Promise<string> {
  return limit(async () => {
    const url = `${BASE_81}${path}`;
    logger.debug({ url }, "Fetching HTML (81)");
    await sleep(DELAY_MS);
    const res = await fetchWithRetry(url);
    return res.text();
  });
}

const ECS_BASE = "https://ecs.gov.bd";
const CURL_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/** Fetch HTML from ecs.gov.bd via curl (site blocks Node fetch) */
export async function fetchEcsHtml(path: string): Promise<string> {
  return limit(async () => {
    const url = `${ECS_BASE}${path}`;
    logger.debug({ url }, "Fetching HTML (ecs.gov.bd)");
    await sleep(DELAY_MS);
    const { stdout } = await execAsync(
      `curl -s -A "${CURL_UA}" "${url}"`,
      { maxBuffer: 10 * 1024 * 1024 },
    );
    if (!stdout || stdout.length < 100) throw new Error(`Empty response for ${url}`);
    return stdout;
  });
}

/** Download file via curl directly to disk */
export async function downloadFileTo(url: string, dest: string): Promise<void> {
  return limit(async () => {
    logger.debug({ url, dest }, "Downloading file");
    await sleep(DELAY_MS);
    await execAsync(
      `curl -s -A "${CURL_UA}" -o "${dest}" "${url}"`,
    );
  });
}

export { ELECTION_ID };
