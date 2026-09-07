import { promises as fs } from "fs";
import path from "path";
import { liveCatalogPaths } from "@/lib/data/connectors/detect";
import { normalizeCatalog } from "@/lib/data/normalize";
import type { CatalogRepository } from "@/lib/data/types";
import type { CatalogPayload } from "@/types/mall";

function resolvePath(filePath: string) {
  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

/** Read catalog from a JSON file (easiest sync target for any DB dump). */
export function createJsonFileRepository(filePath: string): CatalogRepository {
  return {
    async getCatalog(): Promise<CatalogPayload> {
      const full = resolvePath(filePath);
      const raw = await fs.readFile(full, "utf8");
      return normalizeCatalog(JSON.parse(raw), "json");
    },
  };
}

/** Persist any ecommerce dump + activate live mode for the UI */
export async function writeLiveCatalog(payload: unknown, filePath?: string) {
  const paths = liveCatalogPaths();
  const target = resolvePath(filePath || process.env.MALL_CATALOG_PATH || paths.relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const normalized = normalizeCatalog(payload, "json");
  await fs.writeFile(target, JSON.stringify(normalized, null, 2), "utf8");
  await fs.writeFile(
    paths.marker,
    JSON.stringify({ activatedAt: new Date().toISOString(), path: target }, null, 2),
    "utf8",
  );
  return { path: target, payload: normalized };
}
