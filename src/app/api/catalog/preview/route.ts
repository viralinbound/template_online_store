import { NextResponse } from "next/server";
import { detectSchemaFamily, unwrapEcommercePayload } from "@/lib/data/schemaAdapters";
import { normalizeCatalog } from "@/lib/data/normalize";

/**
 * Dry-run: POST any ecommerce JSON → see detected schema + normalized product count.
 * Does not write live-catalog. Use before connecting a company backend.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schema = detectSchemaFamily(body);
    const unwrapped = unwrapEcommercePayload(body);
    const payload = normalizeCatalog(body, "api");
    const products = payload.floors.reduce(
      (n, f) => n + f.stores.reduce((m, s) => m + s.products.length, 0),
      0,
    );
    const sample = payload.floors[0]?.stores[0]?.products?.[0];

    return NextResponse.json({
      ok: true,
      schema,
      products,
      brand: payload.config.brandName,
      logoUrl: payload.config.logoUrl ?? null,
      theme: payload.config.theme ?? null,
      unwrappedCount: unwrapped.products.length || unwrapped.stores?.length || 0,
      sample: sample
        ? { id: sample.id, name: sample.name, price: sample.price, image: sample.image, category: sample.category }
        : null,
      tip:
        products === 0
          ? "No products found. Set MALL_RESPONSE_PATH (e.g. data.items) or MALL_FIELD_MAP for custom columns."
          : "Looks good — POST the same body to /api/catalog/ingest to go live.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Preview failed" },
      { status: 400 },
    );
  }
}
