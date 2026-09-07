import { NextResponse } from "next/server";
import { filterShopProducts, type ShopSort } from "@/lib/catalog";
import { loadCatalog } from "@/lib/data/repository";
import type { MallCategory } from "@/types/mall";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const catalog = await loadCatalog();
    const category = (searchParams.get("category") ?? "all") as MallCategory | "all";
    const sort = (searchParams.get("sort") ?? "featured") as ShopSort;
    const minRating = Number(searchParams.get("minRating") ?? 0);
    const maxPrice = Number(searchParams.get("maxPrice") ?? 1_000_000);
    const inStockOnly = searchParams.get("inStock") === "1";
    const limit = Math.min(Number(searchParams.get("limit") ?? 48), 120);
    const q = searchParams.get("q")?.trim();

    let products = filterShopProducts(
      { category, minPrice: 0, maxPrice, minRating, sort, inStockOnly },
      limit,
      catalog.floors,
    );

    if (q) {
      const needle = q.toLowerCase();
      products = products.filter((p) =>
        `${p.name} ${p.brand ?? ""} ${p.description}`.toLowerCase().includes(needle),
      );
    }

    return NextResponse.json({
      currency: catalog.config.currency,
      locale: catalog.config.locale,
      count: products.length,
      products,
      source: catalog.config.dataSource,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Products load failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
