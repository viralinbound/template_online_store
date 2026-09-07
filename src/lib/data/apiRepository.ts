import { normalizeCatalog } from "@/lib/data/normalize";
import type { CatalogRepository } from "@/lib/data/types";
import type { CatalogPayload } from "@/types/mall";

/**
 * Fetches catalog JSON from MALL_CATALOG_URL (any shape — normalized).
 */
export function createApiCatalogRepository(url: string): CatalogRepository {
  return {
    async getCatalog(): Promise<CatalogPayload> {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          ...(process.env.MALL_CATALOG_TOKEN
            ? { Authorization: `Bearer ${process.env.MALL_CATALOG_TOKEN}` }
            : {}),
        },
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`Catalog API failed: ${res.status}`);
      }
      return normalizeCatalog(await res.json(), "api");
    },
  };
}
