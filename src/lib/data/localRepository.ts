import { mallFloors } from "@/data/mallData";
import { defaultSiteConfig, type CatalogRepository } from "@/lib/data/types";
import type { CatalogPayload } from "@/types/mall";

/** Built-in demo catalog — zero DB required */
export const localCatalogRepository: CatalogRepository = {
  async getCatalog(): Promise<CatalogPayload> {
    return {
      config: { ...defaultSiteConfig, dataSource: "local" },
      floors: mallFloors,
      generatedAt: new Date().toISOString(),
    };
  },
};
