import { createApiCatalogRepository } from "@/lib/data/apiRepository";
import { createUniversalRepository } from "@/lib/data/connectors";
import type { CatalogRepository } from "@/lib/data/types";

/**
 * @deprecated Prefer createUniversalRepository() — kept for older imports.
 */
export const databaseCatalogRepository: CatalogRepository = {
  async getCatalog() {
    if (process.env.MALL_CATALOG_URL) {
      return createApiCatalogRepository(process.env.MALL_CATALOG_URL).getCatalog();
    }
    return createUniversalRepository().getCatalog();
  },
};
