import { normalizeCatalog } from "@/lib/data/normalize";
import type { CatalogRepository } from "@/lib/data/types";
import type { CatalogPayload } from "@/types/mall";

/**
 * SQL via REST (works with Supabase, PostgREST, Hasura, Neon HTTP, custom SQL API).
 * Point MALL_SQL_REST_URL at a products table endpoint returning JSON rows.
 *
 * Example Supabase:
 *   MALL_SQL_REST_URL=https://xxx.supabase.co/rest/v1/products?select=*
 *   MALL_SQL_REST_KEY=your-anon-or-service-key
 */
export function createSqlRestRepository(): CatalogRepository {
  return {
    async getCatalog(): Promise<CatalogPayload> {
      const base =
        process.env.MALL_SQL_REST_URL ||
        (process.env.SUPABASE_URL
          ? `${process.env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${process.env.MALL_SQL_TABLE || "products"}?select=*`
          : null);

      if (!base) {
        throw new Error(
          "SQL connector needs MALL_SQL_REST_URL or SUPABASE_URL. See .env.example",
        );
      }

      const key =
        process.env.MALL_SQL_REST_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "";

      const res = await fetch(base, {
        headers: {
          Accept: "application/json",
          ...(key
            ? {
                apikey: key,
                Authorization: `Bearer ${key}`,
              }
            : {}),
          ...(process.env.MALL_SQL_REST_TOKEN
            ? { Authorization: `Bearer ${process.env.MALL_SQL_REST_TOKEN}` }
            : {}),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`SQL REST failed (${res.status}). Check URL/key/table.`);
      }

      const rows = await res.json();
      return normalizeCatalog(
        Array.isArray(rows) ? { products: rows } : rows,
        "sql",
      );
    },
  };
}
