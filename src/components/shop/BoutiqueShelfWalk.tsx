"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { QuickLook3D } from "@/components/commerce/QuickLook3D";
import { mediaForColor, productHref } from "@/lib/catalog";
import { useMallStore } from "@/store/useMallStore";
import type { Product, StoreNode } from "@/types/mall";

type Props = {
  store: StoreNode;
  currency?: string;
  locale?: string;
  onBuyNow?: (p: Product) => void;
};

/** Boutique shelf walk — photo focus stage (no 3D) */
export function BoutiqueShelfWalk({
  store,
  currency = "INR",
  locale = "en-IN",
  onBuyNow,
}: Props) {
  const products = useMemo(
    () => [...store.products].sort((a, b) => a.shelfIndex - b.shelfIndex),
    [store.products],
  );
  const scroller = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(0);
  const [walking, setWalking] = useState(true);
  const [quick, setQuick] = useState<Product | null>(null);
  const addToBag = useMallStore((s) => s.addToBag);

  if (products.length < 2) return null;

  const active = products[Math.min(focus, products.length - 1)];
  const accent = store.theme.accent;

  const go = (dir: -1 | 1) => {
    setFocus((i) => {
      const next = Math.max(0, Math.min(products.length - 1, i + dir));
      const el = scroller.current?.children[next] as HTMLElement | undefined;
      el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      return next;
    });
  };

  return (
    <section className="shelf-walk" style={{ ["--a" as string]: accent }}>
      <header>
        <div>
          <p className="home-kicker">Shelf walk</p>
          <h2>Walk the shelves</h2>
          <p className="muted">Scroll the boutique line — photo focus, quick look, buy.</p>
        </div>
        <div className="shelf-walk-tools">
          <button type="button" className={walking ? "on" : ""} onClick={() => setWalking((v) => !v)}>
            {walking ? "Hide stage" : "Open stage"}
          </button>
          <button type="button" onClick={() => go(-1)} aria-label="Previous shelf">
            ←
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next shelf">
            →
          </button>
        </div>
      </header>

      <div className="shelf-rail" ref={scroller}>
        {products.map((p, i) => (
          <button
            type="button"
            key={p.id}
            className={`shelf-item${i === focus ? " on" : ""}`}
            onClick={() => {
              setFocus(i);
              setWalking(true);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaForColor(p, p.colors[0])} alt="" />
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {walking && active && (
        <div className="shelf-stage">
          <motion.div
            className="shelf-stage-photo"
            key={active.id}
            initial={{ opacity: 0.6, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaForColor(active, active.colors[0])} alt={active.name} />
          </motion.div>
          <div className="shelf-stage-info">
            <p className="home-kicker">
              Shelf {active.shelfIndex + 1} · {active.subcategory}
            </p>
            <h3>{active.name}</h3>
            <p className="muted">★ {active.rating.toFixed(1)}</p>
            <div className="home-cta">
              <button type="button" className="primary" onClick={() => setQuick(active)}>
                Quick look
              </button>
              <button
                type="button"
                onClick={() => {
                  addToBag(active);
                  onBuyNow?.(active);
                }}
              >
                Buy now
              </button>
              <Link href={productHref(active)} className="ghost">
                Full page
              </Link>
            </div>
          </div>
        </div>
      )}

      {quick && (
        <QuickLook3D
          product={quick}
          currency={currency}
          locale={locale}
          accent={accent}
          onClose={() => setQuick(null)}
          onBuyNow={() => onBuyNow?.(quick)}
        />
      )}
    </section>
  );
}
