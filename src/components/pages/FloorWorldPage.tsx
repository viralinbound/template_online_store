"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { SectionHead } from "@/components/shell/SectionHead";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { findFloorBySlug, floorHref, floorSlug, storeHref } from "@/lib/catalog";
import type { MallCategory, StoreNode } from "@/types/mall";

type CatFilter = MallCategory | "all";

/** Floor → category → shops → subcategory → products (fast, clickable) */
export function FloorWorldPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { floors, config } = useCatalog();

  const floor = useMemo(
    () => findFloorBySlug(String(params.slug ?? ""), floors),
    [params.slug, floors],
  );

  const [category, setCategory] = useState<CatFilter>("all");
  const [shopId, setShopId] = useState<string | "all">("all");
  const [subcategory, setSubcategory] = useState<string | "all">("all");

  useEffect(() => {
    setCategory("all");
    setShopId("all");
    setSubcategory("all");
  }, [floor?.id]);

  const categories = useMemo(() => {
    if (!floor) return [] as MallCategory[];
    return [...new Set(floor.stores.map((s) => s.category))];
  }, [floor]);

  const shops = useMemo(() => {
    if (!floor) return [] as StoreNode[];
    return floor.stores.filter((s) => category === "all" || s.category === category);
  }, [floor, category]);

  useEffect(() => {
    if (shopId !== "all" && !shops.some((s) => s.id === shopId)) {
      setShopId("all");
      setSubcategory("all");
    }
  }, [shops, shopId]);

  const selectedShop = useMemo(
    () => (shopId === "all" ? null : shops.find((s) => s.id === shopId) ?? null),
    [shops, shopId],
  );

  const subcategories = useMemo(() => {
    const pool = selectedShop ? [selectedShop] : shops;
    return [...new Set(pool.map((s) => s.subcategory).filter(Boolean))];
  }, [shops, selectedShop]);

  useEffect(() => {
    if (subcategory !== "all" && !subcategories.includes(subcategory)) {
      setSubcategory("all");
    }
  }, [subcategories, subcategory]);

  const products = useMemo(() => {
    const pool = selectedShop ? [selectedShop] : shops;
    return pool
      .flatMap((s) => s.products.map((p) => ({ ...p, _shopSub: s.subcategory })))
      .filter((p) => {
        if (subcategory === "all") return true;
        return p.subcategory === subcategory || p._shopSub === subcategory;
      });
  }, [shops, selectedShop, subcategory]);

  if (!floor) {
    return (
      <OrvaShell>
        <section className="orva-land-block">
          <SectionHead eyebrow="Mall" title="Floor not found" />
          <p>That level isn’t in the atrium.</p>
          <Link href="/floors" className="primary">
            Back to atrium
          </Link>
        </section>
      </OrvaShell>
    );
  }

  const hero = floor.heroImage ?? floor.stores[0]?.doorImage ?? "";
  const visibleProducts = products.slice(0, 24);

  const pickCategory = (c: CatFilter) => {
    setCategory(c);
    setShopId("all");
    setSubcategory("all");
  };

  const pickShop = (id: string | "all") => {
    setShopId(id);
    setSubcategory("all");
  };

  return (
    <OrvaShell>
      <section className="floor-drill">
        <div className="floor-drill-hero">
          <div className="floor-drill-hero-media" aria-hidden>
            {hero ? <img src={hero} alt="" /> : null}
          </div>
          <div className="floor-drill-hero-copy">
            <p className="orva-land-eyebrow">
              Floor {floor.label} · {floor.categoryName}
            </p>
            <h1>{floor.title}</h1>
            <p>
              {floor.stores.length} shops · pick a category, open a shop, then shop by subcategory.
            </p>
            <div className="orva-land-cta">
              <Link href="/floors" className="ghost">
                All floors
              </Link>
              <Link href="/shop" className="ghost">
                Full catalog
              </Link>
              <Link href="/cart" className="primary">
                View bag
              </Link>
            </div>
          </div>
        </div>

        <nav className="floor-world-switcher floor-drill-switcher" aria-label="Mall floors">
          {floors.map((f) => (
            <Link
              key={f.id}
              href={floorHref(f)}
              className={floorSlug(f) === floorSlug(floor) ? "on" : ""}
            >
              <em>{f.label}</em>
              {f.title}
            </Link>
          ))}
        </nav>

        <div className="floor-drill-crumb" aria-label="Browse path">
          <span>{floor.title}</span>
          <i>/</i>
          <span>{category === "all" ? "All categories" : category}</span>
          <i>/</i>
          <span>{shopId === "all" ? "All shops" : selectedShop?.name ?? "Shop"}</span>
          <i>/</i>
          <span>{subcategory === "all" ? "All subcategories" : subcategory}</span>
        </div>

        <section className="floor-drill-block">
          <SectionHead eyebrow="1 · Category" title="Floor categories" />
          <div className="floor-drill-chips" role="group" aria-label="Categories">
            <button
              type="button"
              className={category === "all" ? "on" : ""}
              onClick={() => pickCategory("all")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                className={category === c ? "on" : ""}
                onClick={() => pickCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="floor-drill-block">
          <SectionHead
            eyebrow="2 · Shops"
            title={category === "all" ? "Shops on this floor" : `${category} shops`}
            action={
              selectedShop ? (
                <Link href={storeHref(selectedShop)} className="orva-land-link">
                  Open store page →
                </Link>
              ) : null
            }
          />
          <div className="floor-drill-shops">
            <button
              type="button"
              className={`floor-drill-shop${shopId === "all" ? " on" : ""}`}
              onClick={() => pickShop("all")}
            >
              <strong>All shops</strong>
              <span>{shops.length} open</span>
            </button>
            {shops.map((s) => (
              <div
                key={s.id}
                className={`floor-drill-shop${shopId === s.id ? " on" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => pickShop(s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pickShop(s.id);
                  }
                }}
              >
                <img src={s.doorImage} alt="" loading="lazy" />
                <div>
                  <strong>{s.name}</strong>
                  <span>
                    {s.subcategory} · {s.products.length} products
                  </span>
                </div>
                <Link
                  href={storeHref(s)}
                  className="floor-drill-shop-enter"
                  onClick={(e) => e.stopPropagation()}
                >
                  Enter
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="floor-drill-block">
          <SectionHead eyebrow="3 · Subcategory" title="Narrow the edit" />
          <div className="floor-drill-chips" role="group" aria-label="Subcategories">
            <button
              type="button"
              className={subcategory === "all" ? "on" : ""}
              onClick={() => setSubcategory("all")}
            >
              All
            </button>
            {subcategories.map((sub) => (
              <button
                type="button"
                key={sub}
                className={subcategory === sub ? "on" : ""}
                onClick={() => setSubcategory(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </section>

        <section className="floor-drill-block">
          <SectionHead
            eyebrow="4 · Products"
            title={
              products.length > visibleProducts.length
                ? `${visibleProducts.length} of ${products.length} products`
                : `${visibleProducts.length} products`
            }
            action={
              <button
                type="button"
                className="orva-land-link"
                onClick={() => {
                  setCategory("all");
                  setShopId("all");
                  setSubcategory("all");
                }}
              >
                Reset filters
              </button>
            }
          />
          {visibleProducts.length === 0 ? (
            <p className="floor-drill-empty">
              No products in this path — reset filters or pick another shop.
            </p>
          ) : (
            <div className="pc3d-grid dense-grid floor-drill-grid">
              {visibleProducts.map((p) => (
                <ProductCard3D
                  key={p.id}
                  product={p}
                  currency={config.currency}
                  locale={config.locale}
                  variant="light"
                  staticCard
                  accent={selectedShop?.theme.accent ?? shops[0]?.theme.accent}
                  onBuyNow={() => router.push("/checkout")}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </OrvaShell>
  );
}
