"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { ScrollSection3D, ScrollStage3D } from "@/components/motion/ScrollStage3D";
import { MotionCTA } from "@/components/motion/MotionKit";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import {
  SHOP_CATEGORIES,
  filterShopProducts,
  type ShopSort,
} from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";
import type { MallCategory } from "@/types/mall";

export function ShopPage() {
  const { floors, config } = useCatalog();
  const router = useRouter();
  const params = useSearchParams();
  const initialCat = (params.get("category") as MallCategory | "all") || "all";
  const [cat, setCat] = useState<MallCategory | "all">(
    SHOP_CATEGORIES.some((c) => c.id === initialCat) ? initialCat : "all",
  );
  const [sort, setSort] = useState<ShopSort>("featured");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const products = useMemo(
    () =>
      filterShopProducts(
        { category: cat, minPrice: 0, maxPrice, minRating, sort, inStockOnly },
        24,
        floors,
      ),
    [cat, sort, maxPrice, minRating, inStockOnly, floors],
  );

  return (
    <OrvaShell>
      <ScrollStage3D lite className="orva-land dense lumen-home nested full-bleed">
        <ScrollSection3D lite className="scroll-hero-slot">
          <PageHero
            kicker="Catalog · fast browse"
            title={`Shop ${config.brandName}`}
            lead="Light tilt cards, center 3D look on tap, Buy without leaving the grid."
            image={landingHeroImage()}
            actions={
              <>
                <MotionCTA pulse>
                  <Link href="/cart" className="primary">
                    View bag
                  </Link>
                </MotionCTA>
                <MotionCTA>
                  <Link href="/food" className="ghost">
                    Food
                  </Link>
                </MotionCTA>
              </>
            }
          />
        </ScrollSection3D>
        <AtmosphereBand items={[config.brandName, "Shop fast", "Quick look", "Buy now", "Guest checkout"]} />

        <ScrollSection3D lite>
          <section className="orva-land-block">
            <SectionHead eyebrow="Filters" title={`${products.length} products`} />
            <div className="shop-toolbar">
              <div className="dest-cats">
                {SHOP_CATEGORIES.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className={cat === c.id ? "on" : ""}
                    onClick={() => setCat(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <label className="dest-sort">
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value as ShopSort)}>
                  <option value="featured">Featured</option>
                  <option value="rating">Top rated</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price · low to high</option>
                  <option value="price-desc">Price · high to low</option>
                </select>
              </label>
            </div>

            <div className="dest-filters">
              <label>
                Max {maxPrice.toLocaleString(config.locale)}
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </label>
              <label>
                Min rating
                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                  <option value={0}>Any</option>
                  <option value={4}>4.0+</option>
                  <option value={4.5}>4.5+</option>
                </select>
              </label>
              <label className="dest-check">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In stock only
              </label>
            </div>

            <div className="pc3d-grid">
              {products.map((p) => (
                <ProductCard3D
                  key={p.id}
                  product={p}
                  currency={config.currency}
                  locale={config.locale}
                  variant="light"
                  staticCard
                  onBuyNow={() => router.push("/checkout")}
                />
              ))}
            </div>
          </section>
        </ScrollSection3D>
      </ScrollStage3D>
    </OrvaShell>
  );
}
