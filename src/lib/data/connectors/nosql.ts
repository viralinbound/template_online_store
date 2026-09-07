import { normalizeCatalog } from "@/lib/data/normalize";
import type { CatalogRepository } from "@/lib/data/types";
import type { CatalogPayload } from "@/types/mall";

/**
 * NoSQL / MongoDB via HTTP Data API (or any document JSON endpoint).
 *
 * Atlas Data API example:
 *   MALL_MONGO_DATA_API_URL=https://data.mongodb-api.com/app/…/endpoint/data/v1/action/find
 *   MALL_MONGO_API_KEY=…
 *   MALL_MONGO_DATASOURCE=Cluster0
 *   MALL_MONGO_DATABASE=megamall
 *   MALL_MONGO_COLLECTION=products
 *
 * Or point MALL_NOSQL_URL at any API that returns documents / products JSON.
 */
export function createNoSqlRepository(): CatalogRepository {
  return {
    async getCatalog(): Promise<CatalogPayload> {
      const simpleUrl = process.env.MALL_NOSQL_URL;
      if (simpleUrl) {
        const res = await fetch(simpleUrl, {
          headers: {
            Accept: "application/json",
            ...(process.env.MALL_NOSQL_TOKEN
              ? { Authorization: `Bearer ${process.env.MALL_NOSQL_TOKEN}` }
              : {}),
          },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`NoSQL HTTP ${res.status}`);
        return normalizeCatalog(await res.json(), "nosql");
      }

      const dataApi = process.env.MALL_MONGO_DATA_API_URL;
      const apiKey = process.env.MALL_MONGO_API_KEY;
      if (!dataApi || !apiKey) {
        throw new Error(
          "NoSQL connector needs MALL_NOSQL_URL or MALL_MONGO_DATA_API_URL + MALL_MONGO_API_KEY",
        );
      }

      const res = await fetch(dataApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          dataSource: process.env.MALL_MONGO_DATASOURCE || "Cluster0",
          database: process.env.MALL_MONGO_DATABASE || "megamall",
          collection: process.env.MALL_MONGO_COLLECTION || "products",
          filter: {},
          limit: Number(process.env.MALL_MONGO_LIMIT || 500),
        }),
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Mongo Data API ${res.status}`);
      const json = (await res.json()) as { documents?: unknown[] };
      return normalizeCatalog({ documents: json.documents ?? json }, "nosql");
    },
  };
}
