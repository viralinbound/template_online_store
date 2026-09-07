"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QuickLook3D } from "@/components/commerce/QuickLook3D";
import { formatMoney } from "@/lib/money";
import { orbitPoint } from "@/lib/motion";
import { useMallStore } from "@/store/useMallStore";
import type { Product } from "@/types/mall";

type Props = {
  products: Product[];
  currency?: string;
  locale?: string;
  title?: string;
  eyebrow?: string;
  onBuyNow?: (p: Product) => void;
};

/**
 * Orbit Stage — unique Orva product opener.
 * SKUs float on a 2.5D ellipse; center piece breathes; click → morph quick-look.
 */
export function OrbitStage({
  products,
  currency = "INR",
  locale = "en-IN",
  title = "Orbit the edit",
  eyebrow = "Signature · 2.5D stage",
  onBuyNow,
}: Props) {
  const reduce = useReducedMotion();
  const addToBag = useMallStore((s) => s.addToBag);
  const items = useMemo(() => products.slice(0, 6), [products]);
  const [rot, setRot] = useState(0);
  const [active, setActive] = useState(0);
  const [look, setLook] = useState<Product | null>(null);
  const [glow, setGlow] = useState({ x: 50, y: 40 });
  const [inView, setInView] = useState(true);
  const drag = useRef<{ x: number; r: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView || items.length < 2) return;
    const t = window.setInterval(() => {
      setRot((r) => r + (Math.PI * 2) / items.length);
      setActive((a) => (a + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [reduce, inView, items.length]);

  useEffect(() => {
    if (!items.length) return;
    // Keep active in sync with which product is nearest front
    let best = 0;
    let bestZ = -Infinity;
    items.forEach((_, i) => {
      const { z } = orbitPoint(i, items.length, rot);
      if (z > bestZ) {
        bestZ = z;
        best = i;
      }
    });
    setActive(best);
  }, [rot, items]);

  if (!items.length) return null;

  const center = items[active]!;

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, r: rot };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (stage.current && !reduce) {
      const rect = stage.current.getBoundingClientRect();
      setGlow({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    setRot(drag.current.r + dx * 0.008);
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const step = (dir: -1 | 1) => {
    setRot((r) => r + dir * ((Math.PI * 2) / items.length));
  };

  return (
    <section className="orbit-stage" id="orbit-stage" ref={root}>
      <header className="orbit-stage-head">
        <div>
          <p className="orva-land-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="orbit-stage-nav">
          <button type="button" onClick={() => step(-1)} aria-label="Previous">
            ←
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next">
            →
          </button>
        </div>
      </header>

      {reduce ? (
        <div className="orbit-grid-fallback">
          {items.map((p) => (
            <button key={p.id} type="button" className="orbit-fallback-card" onClick={() => setLook(p)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div
          ref={stage}
          className="orbit-stage-arena"
          style={{ ["--gx" as string]: `${glow.x}%`, ["--gy" as string]: `${glow.y}%` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="orbit-magnetic" aria-hidden />
          <div className="orbit-floor" aria-hidden />
          {items.map((p, i) => {
            const { x, y, z } = orbitPoint(i, items.length, rot, 240, 78);
            const depth = (z + 1) / 2;
            const scale = 0.72 + depth * 0.42;
            const opacity = 0.35 + depth * 0.65;
            const isFront = i === active;
            return (
              <motion.button
                key={p.id}
                type="button"
                className={`orbit-item${isFront ? " on" : ""}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(42% + ${y - (isFront ? 12 : 0)}px)`,
                  zIndex: Math.round(10 + depth * 20),
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  opacity,
                }}
                onClick={() => {
                  setActive(i);
                  setLook(p);
                }}
              >
                <span className="orbit-item-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} draggable={false} loading="lazy" decoding="async" />
                </span>
                {isFront && <em>Look</em>}
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="orbit-focus">
        <div>
          <p className="orva-land-eyebrow">Center piece</p>
          <h3>{center.name}</h3>
          <p>
            {formatMoney(center.price, currency, locale)} · ★ {center.rating.toFixed(1)}
          </p>
        </div>
        <div className="orbit-focus-actions">
          <button type="button" className="primary" onClick={() => setLook(center)}>
            Quick look
          </button>
          <button
            type="button"
            onClick={() => {
              addToBag(center);
              onBuyNow?.(center);
            }}
          >
            Add to bag
          </button>
        </div>
      </div>

      {look && (
        <QuickLook3D
          product={look}
          currency={currency}
          locale={locale}
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
