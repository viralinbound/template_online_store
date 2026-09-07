import { NextResponse } from "next/server";
import { getActiveConnectorInfo } from "@/lib/data/connectors";
import { getCatalogCacheMeta, loadCatalog } from "@/lib/data/repository";
import { flattenProducts } from "@/lib/data/repository";

/** Admin overview — source mode + Shopify-like connect hints */
export async function GET() {
  try {
    const payload = await loadCatalog(true);
    const connector = getActiveConnectorInfo();
    const products = flattenProducts(payload.floors).length;
    return NextResponse.json({
      ok: true,
      brand: payload.config.brandName,
      dataSource: payload.config.dataSource,
      products,
      floors: payload.floors.length,
      stores: payload.floors.reduce((n, f) => n + f.stores.length, 0),
      connector,
      cache: getCatalogCacheMeta(),
      connect: {
        summary:
          "Connect any ecommerce backend schema (Shopify, WooCommerce, Magento, SQL, Mongo, custom REST). Products + brand kit auto-map into the full website.",
        steps: [
          "Dry-run: POST your JSON to /api/catalog/preview — see detected schema + product count",
          "Go live: POST the same body to /api/catalog/ingest — storefront updates automatically",
          "HTTP API: set MALL_CATALOG_URL (optional MALL_RESPONSE_PATH + MALL_FIELD_MAP)",
          "SQL (Supabase/PostgREST): set MALL_SQL_REST_URL + key",
          "NoSQL (Mongo Data API): set MALL_NOSQL_* or MALL_MONGO_* vars",
          "Custom columns: MALL_FIELD_MAP='{\"unit_cost\":\"price\",\"title\":\"name\"}'",
          "Optional lock: MALL_INGEST_KEY for admin/ingest auth",
        ],
        env: [
          "MALL_DATA_SOURCE",
          "MALL_CATALOG_PATH",
          "MALL_CATALOG_URL",
          "MALL_RESPONSE_PATH",
          "MALL_FIELD_MAP",
          "MALL_SQL_REST_URL",
          "MALL_NOSQL_URL",
          "MALL_INGEST_KEY",
          "DATABASE_URL",
        ],
        schemas: [
          "shopify",
          "shopify-graphql",
          "woocommerce",
          "magento",
          "mongodb",
          "sql-rest",
          "generic-products",
          "orva",
        ],
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Status failed" },
      { status: 500 },
    );
  }
}
