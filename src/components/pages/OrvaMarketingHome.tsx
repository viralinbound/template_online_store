"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { MallFloorJourney } from "@/components/shop/MallFloorJourney";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { SectionHead } from "@/components/shell/SectionHead";
import { TrustBar } from "@/components/ui/TrustBar";
import { CUSTOMER_PROMISES, HOW_IT_WORKS, LANDING_CHIPS } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";
import type { MallSiteConfig, Product, StoreNode } from "@/types/mall";

export type LandingFloor = {
  label: string;
  title: string;
  categoryName: string;
  hero: string;
  storeCount?: number;
};

type Props = {
  config: MallSiteConfig;
  floors: LandingFloor[];
  boutiques: StoreNode[];
  picks: Product[];
  foodPicks?: Product[];
  foodStores?: StoreNode[];
  loading?: boolean;
  nestInShell?: boolean;
  topBar?: ReactNode;
  onShop: (category?: string) => void;
  onDirectory: () => void;
  onFloors?: () => void;
  onFood?: () => void;
  onOpenFloor?: (index: number) => void;
  onOpenStore?: (store: StoreNode) => void;
  onBuyNow?: (p: Product) => void;
  footer?: ReactNode;
};

/**
 * One professional mall website experience —
 * hero → scroll floors → shop / food / boutiques. No separate “enter 3D” fork.
 */
export function OrvaMarketingHome({
  config,
  floors,
  boutiques,
  picks,
  foodPicks = [],
  foodStores = [],
  loading,
  nestInShell = false,
  topBar,
  onShop,
  onDirectory,
  onFloors,
  onFood,
  onOpenFloor,
  onOpenStore,
  onBuyNow,
  footer,
}: Props) {
  const marquee = useMemo(
    () => [
      config.brandName,
      "Scroll the mall",
      "Enter each floor",
      "Food Court",
      "Guest checkout",
      ...config.trustPoints.slice(0, 3),
    ],
    [config],
  );

  const scrollToMall = () => {
    document.getElementById("mall-journey")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`orva-land dense${nestInShell ? " nested full-bleed" : ""}`}>
      {!nestInShell && topBar}

      <section className="orva-land-hero compact-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          className="orva-land-hero-img"
          src={landingHeroImage()}
          alt=""
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="orva-land-hero-veil" />
        <div className="orva-land-hero-grain" aria-hidden />
        <div className="orva-land-hero-copy">
          <motion.p
            className="orva-land-kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {config.tagline}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {config.brandName}
          </motion.h1>
          <motion.p
            className="orva-land-lead"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            One destination — shop the catalog, scroll floor by floor, enter boutiques, checkout.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <TrustBar points={config.trustPoints} />
          </motion.div>
          <motion.div
            className="orva-land-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
          >
            <button type="button" className="primary" onClick={() => onShop()}>
              Start shopping
            </button>
            <button type="button" className="ghost" onClick={scrollToMall}>
              Enter the mall
            </button>
            <button type="button" className="ghost" onClick={onFood ?? (() => onShop("food"))}>
              Food Court
            </button>
          </motion.div>
          <motion.div
            className="orva-land-chips"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48 }}
          >
            {LANDING_CHIPS.map((c) => (
              <button type="button" key={c.label} onClick={() => onShop(c.category)}>
                {c.label}
              </button>
            ))}
            <button type="button" onClick={onFood ?? (() => onShop("food"))}>
              Café & food
            </button>
          </motion.div>
          {loading && <p className="orva-land-sync">Syncing catalog…</p>}
        </div>
        <button type="button" className="orva-land-scrollcue" onClick={scrollToMall}>
          <span>Scroll into the mall</span>
          <i />
        </button>
      </section>

      <AtmosphereBand items={marquee} />

      <section className="orva-land-block tight">
        <div className="orva-how-inline">
          {HOW_IT_WORKS.map((item) => (
            <article key={item.step} className="orva-how-pill">
              <em>{item.step}</em>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <MallFloorJourney
        floors={floors}
        brandName={config.brandName}
        onEnterFloor={(i) => {
          if (onOpenFloor) onOpenFloor(i);
          else onFloors?.();
        }}
      />

      <section className="orva-land-block tight">
        <SectionHead
          eyebrow="Today’s edit"
          title="Pieces worth opening"
          action={
            <button type="button" className="orva-land-link" onClick={() => onShop()}>
              Full shop →
            </button>
          }
        />
        <div className="pc3d-grid dense-grid">
          {picks.slice(0, 8).map((p) => (
            <ProductCard3D
              key={p.id}
              product={p}
              currency={config.currency}
              locale={config.locale}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </section>

      {(foodPicks.length > 0 || foodStores.length > 0) && (
        <section className="orva-land-block orva-food-band tight-band">
          <div className="orva-food-band-copy">
            <SectionHead eyebrow="Food Court" title="Café heat, atrium sweets" />
            <p>Coffee, bites, dessert desks — same Buy path as the rest of the mall.</p>
            <div className="orva-land-cta">
              <button type="button" className="primary" onClick={onFood ?? (() => onShop("food"))}>
                Open Food Court
              </button>
              <button type="button" className="ghost" onClick={onDirectory}>
                All cafés
              </button>
            </div>
            {foodStores.length > 0 && (
              <div className="orva-food-store-row">
                {foodStores.slice(0, 4).map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className="orva-food-chip"
                    onClick={() => (onOpenStore ? onOpenStore(s) : onDirectory())}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="pc3d-grid dense-grid orva-food-grid">
            {foodPicks.slice(0, 4).map((p) => (
              <ProductCard3D
                key={p.id}
                product={p}
                currency={config.currency}
                locale={config.locale}
                accent="#e88755"
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        </section>
      )}

      <section className="orva-land-block tight">
        <SectionHead
          eyebrow="Why here"
          title={`Why ${config.brandName}`}
        />
        <div className="orva-land-promises dense-promises">
          {CUSTOMER_PROMISES.map((item, i) => (
            <motion.article
              key={item.title}
              className="orva-land-promise"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05 }}
            >
              <em>{String(i + 1).padStart(2, "0")}</em>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="orva-land-block tight">
        <SectionHead
          eyebrow="Boutiques"
          title="Featured doors"
          action={
            <button type="button" className="orva-land-link" onClick={onDirectory}>
              Directory →
            </button>
          }
        />
        <div className="orva-land-boutiques dense-grid">
          {boutiques.slice(0, 8).map((s) => (
            <button
              type="button"
              key={s.id}
              className="orva-land-boutique"
              style={{ ["--a" as string]: s.theme.accent }}
              onClick={() => (onOpenStore ? onOpenStore(s) : onDirectory())}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.doorImage} alt="" />
              <span>
                <em>{s.category}</em>
                <strong>{s.name}</strong>
                <small>{s.subcategory}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="orva-land-finale compact-finale">
        <p className="orva-land-eyebrow">Demo checkout</p>
        <h2>
          Use <em>ORVA10</em> · 10% off
        </h2>
        <p>One bag across shop, floors, and Food Court — guest checkout, no real charges.</p>
        <div className="orva-land-cta">
          <button type="button" className="primary" onClick={() => onShop()}>
            Shop the edit
          </button>
          <button type="button" className="ghost" onClick={scrollToMall}>
            Back to floors
          </button>
        </div>
      </section>

      {footer}
    </div>
  );
}
