import { NextResponse } from "next/server";
import { writeLiveCatalog } from "@/lib/data/connectors/jsonFile";
import { invalidateCatalogCache } from "@/lib/data/repository";

/**
 * Push ANY ecommerce dump (SQL export JSON, Mongo documents, Shopify products…)
 * Body shapes: { products }, { stores }, { documents }, { floors, config }, or [products]
 *
 * Optional: header x-mall-ingest-key = MALL_INGEST_KEY
 */
export async function POST(request: Request) {
  try {
    const required = process.env.MALL_INGEST_KEY;
    if (required) {
      const got = request.headers.get("x-mall-ingest-key");
      if (got !== required) {
        return NextResponse.json({ error: "Unauthorized ingest key" }, { status: 401 });
      }
    }

    const body = await request.json();
    const result = await writeLiveCatalog(body);
    invalidateCatalogCache();

    const productCount = result.payload.floors.reduce(
      (n, f) => n + f.stores.reduce((m, s) => m + s.products.length, 0),
      0,
    );

    return NextResponse.json({
      ok: true,
      live: true,
      path: result.path,
      floors: result.payload.floors.length,
      products: productCount,
      generatedAt: result.payload.generatedAt,
      message: "Catalog live. UI refreshes automatically within a few seconds.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ingest failed" },
      { status: 400 },
    );
  }
}
