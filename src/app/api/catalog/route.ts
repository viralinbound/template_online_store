import { NextResponse } from "next/server";
import { loadCatalog, getCatalogCacheMeta } from "@/lib/data/repository";

/** Full catalog + site config — SQL/NoSQL/JSON/HTTP all normalize here */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("fresh") === "1";
    const catalog = await loadCatalog(force);
    return NextResponse.json(catalog, {
      headers: {
        "Cache-Control": "no-store",
        "X-Mall-Source": catalog.config.dataSource,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Catalog load failed";
    return NextResponse.json(
      { error: message, meta: getCatalogCacheMeta() },
      { status: 500 },
    );
  }
}
