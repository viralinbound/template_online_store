import { NextResponse } from "next/server";
import { getActiveConnectorInfo } from "@/lib/data/connectors";
import { flattenProducts, getCatalogCacheMeta, loadCatalog } from "@/lib/data/repository";

/** Connection health — which DB/source is driving the UI right now */
export async function GET() {
  try {
    const catalog = await loadCatalog(true);
    const products = flattenProducts(catalog.floors);
    return NextResponse.json({
      ok: true,
      live: true,
      connector: getActiveConnectorInfo(),
      source: catalog.config.dataSource,
      brand: catalog.config.brandName,
      currency: catalog.config.currency,
      floors: catalog.floors.length,
      stores: catalog.floors.reduce((n, f) => n + f.stores.length, 0),
      products: products.length,
      generatedAt: catalog.generatedAt,
      cache: getCatalogCacheMeta(),
      pollMs: Number(process.env.NEXT_PUBLIC_MALL_LIVE_POLL_MS || 8000),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        live: false,
        connector: getActiveConnectorInfo(),
        error: err instanceof Error ? err.message : "status failed",
        cache: getCatalogCacheMeta(),
      },
      { status: 503 },
    );
  }
}
