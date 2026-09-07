"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCatalog } from "@/components/CatalogProvider";
import { MallFooter } from "@/components/MallFooter";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StockPill } from "@/components/ui/StockPill";
import { TrustBar } from "@/components/ui/TrustBar";
import {
  filterShopProducts,
  SHOP_CATEGORIES,
  suggestProducts,
  type ShopSort,
} from "@/lib/catalog";
import type { MallCategory, Product, StoreNode } from "@/types/mall";

type Props = {
  accent: string;
  onOpenProduct: (p: Product) => void;
  onBuy: (p: Product) => void;
  onExploreMall: () => void;
  onOpenStore: (store: StoreNode, floorIndex: number) => void;
  onDirectory: () => void;
  onHelp: (section?: string) => void;
};

export function ShopDestination({
  accent,
  onOpenProduct,
  onBuy,
  onExploreMall,
  onOpenStore,
  onDirectory,
  onHelp,
}: Props) {
  const { floors, config } = useCatalog();
  const [cat, setCat] = useState<MallCategory | "all">("all");
  const [sort, setSort] = useState<ShopSort>("featured");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);

  const products = useMemo(
    () =>
      filterShopProducts(
        {
          category: cat,
          minPrice: 0,
          maxPrice,
          minRating,
          sort,
          inStockOnly,
        },
        48,
        floors,
      ),
    [cat, sort, minRating, maxPrice, inStockOnly, floors],
  );

  const lifestyle = useMemo(() => suggestProducts(8, [], floors), [floors]);
  const boutiques = useMemo(
    () =>
      floors
        .flatMap((f, fi) =>
          f.stores.slice(0, 2).map((s) => ({ store: s, floorIndex: fi, floorLabel: f.label })),
        )
        .slice(0, 8),
    [floors],
  );

  return (
    <motion.section
      className="dest-shop"
      style={{ ["--a" as string]: accent }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dest-hero">
        <p className="dest-kicker">{config.tagline} · Quick shop</p>
        <h2>Shop {config.brandName}</h2>
        <p>
          Full store catalog with mall context — filter by world, sort by price or rating, then open
          any boutique when you want the walk.
        </p>
        <TrustBar points={config.trustPoints} />
        <div className="dest-hero-actions">
          {config.featureFlags.explore && (
            <button type="button" className="primary" onClick={onExploreMall}>
              Explore the mall
            </button>
          )}
          {config.featureFlags.directory && (
            <button type="button" className="ghost-light" onClick={onDirectory}>
              Open directory
            </button>
          )}
          {config.featureFlags.coupons && (
            <span className="dest-deal">ORVA10 · 10% off today</span>
          )}
        </div>
      </div>

      <section className="dest-block">
        <header>
          <h3>Today’s lifestyle edit</h3>
          <p>Editor picks across floors</p>
        </header>
        <div className="dest-rail">
          {lifestyle.map((p) => (
            <article key={p.id} className="dest-product">
              <button type="button" className="dest-product-media" onClick={() => onOpenProduct(p)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} loading="lazy" />
                <ProductBadges badges={p.badges} />
              </button>
              <div>
                <small className="dest-card-cat">{p.category}</small>
                <strong>{p.name}</strong>
                <ProductPrice product={p} currency={config.currency} locale={config.locale} size="sm" />
                <StockPill stock={p.stock} />
                <div className="dest-product-actions">
                  <button type="button" onClick={() => onOpenProduct(p)}>
                    View
                  </button>
                  <button
                    type="button"
                    className="bag"
                    disabled={p.stock === 0}
                    onClick={() => onBuy(p)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dest-block">
        <header>
          <h3>Boutique directory</h3>
          <p>Jump into a store · or open the full map</p>
        </header>
        <div className="dest-boutiques">
          {boutiques.map(({ store, floorIndex, floorLabel }) => (
            <button
              type="button"
              key={store.id}
              className="dest-boutique"
              onClick={() => onOpenStore(store, floorIndex)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={store.doorImage} alt="" />
              <span>
                <em>Floor {floorLabel}</em>
                <strong>{store.name}</strong>
                <small>{store.subcategory}</small>
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="dest-link" onClick={onDirectory}>
          View full directory →
        </button>
      </section>

      <section className="dest-block dest-catalog">
        <header className="dest-catalog-head">
          <div>
            <h3>Quick shop</h3>
            <p>
              {products.length} products · filter & sort like a full store
            </p>
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
        </header>

        <div className="dest-cats" role="tablist" aria-label="Shop categories">
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
              <option value={4.7}>4.7+</option>
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
          <button
            type="button"
            className="linkish"
            onClick={() => {
              setCat("all");
              setSort("featured");
              setMinRating(0);
              setMaxPrice(50000);
              setInStockOnly(false);
            }}
          >
            Reset filters
          </button>
        </div>

        {products.length === 0 ? (
          <div className="fl-empty">
            <p>No products match these filters.</p>
            <button
              type="button"
              className="primary"
              onClick={() => {
                setCat("all");
                setMinRating(0);
                setMaxPrice(50000);
                setInStockOnly(false);
              }}
            >
              Reset and browse all
            </button>
          </div>
        ) : (
          <div className="dest-grid">
            {products.map((p) => (
              <article key={p.id} className="dest-card">
                <button type="button" className="dest-card-media" onClick={() => onOpenProduct(p)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <ProductBadges badges={p.badges} />
                </button>
                <p className="dest-card-cat">
                  {p.category} · ★ {p.rating.toFixed(1)}
                </p>
                <strong>{p.name}</strong>
                <ProductPrice product={p} currency={config.currency} locale={config.locale} size="sm" />
                <StockPill stock={p.stock} />
                <div className="dest-card-row">
                  <button
                    type="button"
                    className="bag"
                    disabled={p.stock === 0}
                    onClick={() => onBuy(p)}
                  >
                    {p.stock === 0 ? "Sold out" : "Add"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <MallFooter
        onShop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onExplore={onExploreMall}
        onDirectory={onDirectory}
        onHelp={onHelp}
      />
    </motion.section>
  );
}
