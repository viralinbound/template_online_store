"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { QuickLook3D } from "@/components/commerce/QuickLook3D";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/types/mall";

type Props = {
  products: Product[];
  currency?: string;
  locale?: string;
  accent?: string;
  title?: string;
  eyebrow?: string;
  onBuyNow?: (p: Product) => void;
};

/**
 * Immersive 3D showroom rail — scroll/drag products in perspective,
 * click opens a centered 3D quick-look popup.
 */
export function Showroom3D({
  products,
  currency = "INR",
  locale = "en-IN",
  accent = "#14999c",
  title = "Showroom",
  eyebrow = "Scroll · 3D stage",
  onBuyNow,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [look, setLook] = useState<Product | null>(null);

  if (!products.length) return null;

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".showroom-card");
    const w = card?.offsetWidth ?? 220;
    el.scrollBy({ left: dir * (w + 18), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>(".showroom-card")];
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const center = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(center - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  return (
    <section className="showroom3d" style={{ ["--a" as string]: accent }}>
      <header className="showroom3d-head">
        <div>
          <p className="orva-land-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="showroom3d-nav">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous">
            ←
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Next">
            →
          </button>
        </div>
      </header>

      <div className="showroom3d-stage">
        <div className="showroom3d-glow" aria-hidden />
        <div className="showroom3d-floor" aria-hidden />
        <div
          ref={scroller}
          className="showroom3d-rail"
          onScroll={onScroll}
          onPointerDown={(e) => {
            (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          }}
        >
          {products.map((p, i) => {
            const offset = i - active;
            return (
              <ShowroomCard
                key={p.id}
                product={p}
                offset={offset}
                active={i === active}
                currency={currency}
                locale={locale}
                onOpen={() => setLook(p)}
              />
            );
          })}
        </div>
        <p className="showroom3d-hint">
          Drag / scroll · tap a piece for centered 3D look · {active + 1}/{products.length}
        </p>
      </div>

      {look && (
        <QuickLook3D
          product={look}
          currency={currency}
          locale={locale}
          accent={accent}
          onClose={() => setLook(null)}
          onBuyNow={() => {
            onBuyNow?.(look);
            setLook(null);
          }}
        />
      )}
    </section>
  );
}

function ShowroomCard({
  product,
  offset,
  active,
  currency,
  locale,
  onOpen,
}: {
  product: Product;
  offset: number;
  active: boolean;
  currency: string;
  locale: string;
  onOpen: () => void;
}) {
  const rotateY = Math.max(-28, Math.min(28, offset * -14));
  const z = active ? 48 : Math.max(-80, -Math.abs(offset) * 36);
  const scale = active ? 1.06 : Math.max(0.82, 1 - Math.abs(offset) * 0.08);
  const opacity = Math.max(0.35, 1 - Math.abs(offset) * 0.22);

  return (
    <motion.button
      type="button"
      className={`showroom-card${active ? " on" : ""}`}
      style={{
        transform: `translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex: 20 - Math.abs(offset),
      }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      onClick={onOpen}
    >
      <span className="showroom-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} loading="lazy" />
        <em>3D look</em>
      </span>
      <span className="showroom-card-body">
        <strong>{product.name}</strong>
        <small>
          {formatMoney(product.price, currency, locale)} · ★ {product.rating.toFixed(1)}
        </small>
      </span>
    </motion.button>
  );
}
