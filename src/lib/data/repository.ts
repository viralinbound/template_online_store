import { createUniversalRepository, getActiveConnectorInfo } from "@/lib/data/connectors";
import type { CatalogRepository } from "@/lib/data/types";
import type { CatalogPayload, MallFloor, Product } from "@/types/mall";

let cached: { at: number; payload: CatalogPayload; fingerprint: string } | null = null;

function cacheMs() {
  return Number(process.env.MALL_CATALOG_CACHE_MS || 5_000);
}

export function getCatalogRepository(): CatalogRepository {
  return createUniversalRepository();
}

/** Server-side catalog. Short cache; pass force=true after ingest / for live UI. */
export async function loadCatalog(force = false): Promise<CatalogPayload> {
  const now = Date.now();
  if (!force && cached && now - cached.at < cacheMs()) {
    return cached.payload;
  }
  const payload = await getCatalogRepository().getCatalog();
  const fingerprint = `${payload.generatedAt}:${payload.floors.length}:${payload.config.dataSource}`;
  cached = { at: now, payload, fingerprint };
  return payload;
}

export function invalidateCatalogCache() {
  cached = null;
}

export function getCatalogCacheMeta() {
  return {
    cachedAt: cached?.at ?? null,
    fingerprint: cached?.fingerprint ?? null,
    connector: getActiveConnectorInfo(),
    cacheMs: cacheMs(),
  };
}

export function flattenProducts(floors: MallFloor[]): Product[] {
  return floors.flatMap((f) => f.stores.flatMap((s) => s.products));
}
