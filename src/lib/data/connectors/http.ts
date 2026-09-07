import { normalizeCatalog } from "@/lib/data/normalize";
import type { CatalogRepository } from "@/lib/data/types";
import type { CatalogPayload } from "@/types/mall";

/** Any HTTP endpoint that returns products / stores / CatalogPayload JSON */
export function createHttpCatalogRepository(url: string): CatalogRepository {
  return {
    async getCatalog(): Promise<CatalogPayload> {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          ...(process.env.MALL_CATALOG_TOKEN
            ? { Authorization: `Bearer ${process.env.MALL_CATALOG_TOKEN}` }
            : {}),
        },
        next: { revalidate: 0 },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Catalog HTTP ${res.status} from ${url}`);
      const data = await res.json();
      return normalizeCatalog(data, "api");
    },
  };
}
