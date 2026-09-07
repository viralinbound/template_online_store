import { createHttpCatalogRepository } from "@/lib/data/connectors/http";
import { createJsonFileRepository } from "@/lib/data/connectors/jsonFile";
import { createNoSqlRepository } from "@/lib/data/connectors/nosql";
import { createSqlRestRepository } from "@/lib/data/connectors/sql";
import { detectConnector, liveCatalogPaths } from "@/lib/data/connectors/detect";
import { localCatalogRepository } from "@/lib/data/localRepository";
import { resolveCatalogMode, type CatalogRepository } from "@/lib/data/types";

/**
 * One entry point: picks SQL / NoSQL / JSON / HTTP / local automatically.
 */
export function createUniversalRepository(): CatalogRepository {
  const mode = resolveCatalogMode();
  const detected =
    mode === "auto" || mode === "database"
      ? detectConnector()
      : { mode, label: mode, detail: mode };

  switch (detected.mode) {
    case "json": {
      const file =
        process.env.MALL_CATALOG_PATH ||
        (String(detected.detail).includes("live-catalog")
          ? liveCatalogPaths().relative
          : detected.detail) ||
        "data/live-catalog.json";
      return createJsonFileRepository(file);
    }
    case "api":
      if (!process.env.MALL_CATALOG_URL) return localCatalogRepository;
      return createHttpCatalogRepository(process.env.MALL_CATALOG_URL);
    case "sql":
      return createSqlRestRepository();
    case "nosql":
      return createNoSqlRepository();
    case "database":
      if (process.env.MALL_SQL_REST_URL || process.env.SUPABASE_URL) {
        return createSqlRestRepository();
      }
      if (process.env.MALL_CATALOG_PATH) {
        return createJsonFileRepository(process.env.MALL_CATALOG_PATH);
      }
      return {
        async getCatalog() {
          const local = await localCatalogRepository.getCatalog();
          return {
            ...local,
            config: { ...local.config, dataSource: "database" },
          };
        },
      };
    case "local":
    default:
      return localCatalogRepository;
  }
}

export function getActiveConnectorInfo() {
  const mode = resolveCatalogMode();
  if (mode !== "auto" && mode !== "database") {
    return { mode, label: mode, detail: mode, resolved: mode };
  }
  const d = detectConnector();
  return { ...d, resolved: d.mode, requested: mode };
}
