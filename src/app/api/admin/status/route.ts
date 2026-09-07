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
          "Point env vars at your SQL, NoSQL, HTTP, or JSON catalog — the storefront adapts automatically (Shopify-like).",
        steps: [
          "Local demo: edit products in Admin — writes data/live-catalog.json",
          "JSON dump: set MALL_CATALOG_PATH or POST /api/catalog/ingest",
          "HTTP API: set MALL_CATALOG_URL to your products endpoint",
          "SQL (Supabase/PostgREST): set MALL_SQL_REST_URL + key",
          "NoSQL (Mongo Data API): set MALL_NOSQL_* vars",
          "Optional lock: MALL_INGEST_KEY for admin/ingest auth",
        ],
        env: [
          "MALL_DATA_SOURCE",
          "MALL_CATALOG_PATH",
          "MALL_CATALOG_URL",
          "MALL_SQL_REST_URL",
          "MALL_NOSQL_URL",
          "MALL_INGEST_KEY",
          "DATABASE_URL",
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
