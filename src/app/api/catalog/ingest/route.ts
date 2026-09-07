import { NextResponse } from "next/server";
import { writeLiveCatalog } from "@/lib/data/connectors/jsonFile";
import { detectSchemaFamily } from "@/lib/data/schemaAdapters";
import { invalidateCatalogCache } from "@/lib/data/repository";

/**
 * Push ANY ecommerce dump — Shopify, Woo, Magento, SQL JSON, Mongo, GraphQL.
 * Body shapes: { products }, { items }, { documents }, { data: { products } },
 * GraphQL edges, { floors, config }, or [products]
 *
 * Optional: header x-mall-ingest-key = MALL_INGEST_KEY
 * Optional env: MALL_FIELD_MAP, MALL_RESPONSE_PATH
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
    const schema = detectSchemaFamily(body);
    const result = await writeLiveCatalog(body);
    invalidateCatalogCache();

    const productCount = result.payload.floors.reduce(
      (n, f) => n + f.stores.reduce((m, s) => m + s.products.length, 0),
      0,
    );

    return NextResponse.json({
      ok: true,
      live: true,
      schema,
      path: result.path,
      floors: result.payload.floors.length,
      products: productCount,
      brand: result.payload.config.brandName,
      generatedAt: result.payload.generatedAt,
      message:
        productCount > 0
          ? `Detected ${schema} schema · ${productCount} products live. Storefront updates automatically.`
          : `Detected ${schema} schema but 0 products — check payload keys or set MALL_RESPONSE_PATH / MALL_FIELD_MAP.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ingest failed" },
      { status: 400 },
    );
  }
}
