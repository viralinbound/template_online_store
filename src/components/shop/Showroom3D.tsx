"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QuickLook3D } from "@/components/commerce/QuickLook3D";
import { springSoft } from "@/lib/motion";
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

/** Lifestyle product rail — cinematic focus, photo quick-look (no 3D engine) */
export function Showroom3D({
  products,
  currency = "INR",
  locale = "en-IN",
  accent = "#14999c",
  title = "Showroom",
  eyebrow = "Scroll · lifestyle stage",
  onBuyNow,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [look, setLook] = useState<Product | null>(null);
  const reduce = useReducedMotion();

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
    <section className="showroom3d lifestyle-rail runway-shelf" style={{ ["--a" as string]: accent }}>
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
        <div
          ref={scroller}
          className="showroom3d-rail flat-rail"
          onScroll={onScroll}
        >
          {products.map((p, i) => {
            const offset = i - active;
            const scale = active ? (i === active ? 1.06 : Math.max(0.88, 1 - Math.abs(offset) * 0.05)) : 1;
            const opacity = Math.max(0.45, 1 - Math.abs(offset) * 0.18);
            return (
              <motion.button
                key={p.id}
                type="button"
                className={`showroom-card${i === active ? " on" : ""}`}
                style={{ zIndex: 20 - Math.abs(offset) }}
                animate={reduce ? undefined : { scale, opacity, y: i === active ? -6 : 0 }}
                transition={springSoft}
                onClick={() => setLook(p)}
              >
                <span className="showroom-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <em>{i === active ? "Quick look" : "Look"}</em>
                </span>
                <span className="showroom-card-body">
                  <strong>{p.name}</strong>
                  <small>
                    {formatMoney(p.price, currency, locale)} · ★ {p.rating.toFixed(1)}
                  </small>
                </span>
              </motion.button>
            );
          })}
        </div>
        <p className="showroom3d-hint">
          Scroll · tap for photo look · {active + 1}/{products.length}
        </p>
      </div>

      {look && (
        <QuickLook3D
          product={look}
          currency={currency}
          locale={locale}
          accent={accent}
          initialColor={look.colors[0]}
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
