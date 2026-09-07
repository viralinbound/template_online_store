"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductSpin3D } from "@/components/commerce/ProductSpin3D";
import {
  CommerceTrustRow,
  ImageZoom,
  ProductQA,
  SizeGuide,
} from "@/components/commerce/ProductExtras";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StockPill } from "@/components/ui/StockPill";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/types/mall";

type Props = {
  product: Product;
  storeName: string;
  floorLabel: string;
  accent: string;
  ink: string;
  bg: string;
  currency: string;
  locale: string;
  showReviews: boolean;
  wishlisted: boolean;
  compared: boolean;
  related: Product[];
  onBack: () => void;
  onToggleWish: () => void;
  onToggleCompare: () => void;
  onOpenRelated: (p: Product) => void;
  onVisitStore?: () => void;
  onBuy: (opts: { size: string; color: string; qty: number }) => void;
  onBuyNow: (opts: { size: string; color: string; qty: number }) => void;
  onHelp: () => void;
};

const COLOR_FILTER: Record<string, string> = {
  Black: "grayscale(0.15) brightness(0.92)",
  Ivory: "sepia(0.12) brightness(1.08)",
  Navy: "hue-rotate(195deg) saturate(1.15)",
  Default: "none",
};

function colorFilter(color: string) {
  return COLOR_FILTER[color] ?? `hue-rotate(${(color.length * 37) % 360}deg) saturate(1.08)`;
}

export function ProductPage({
  product,
  storeName,
  floorLabel,
  accent,
  ink,
  bg,
  currency,
  locale,
  showReviews,
  wishlisted,
  compared,
  related,
  onBack,
  onToggleWish,
  onToggleCompare,
  onOpenRelated,
  onVisitStore,
  onBuy,
  onBuyNow,
  onHelp,
}: Props) {
  const gallery = useMemo(
    () => (product.gallery?.length ? product.gallery : [product.image]),
    [product.gallery, product.image],
  );
  const [shot, setShot] = useState(0);
  const [size, setSize] = useState(product.sizes[0] ?? "One size");
  const [color, setColor] = useState(product.colors[0] ?? "Default");
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<"photos" | "3d">("photos");
  const [viewers, setViewers] = useState(8 + (product.id.length % 17));
  const [pulse, setPulse] = useState<string | null>(null);

  const soldOut = product.stock != null && product.stock <= 0;
  const maxQty = product.stock != null && product.stock > 0 ? product.stock : 99;
  const reviews = product.reviews ?? [];
  const activeSrc = gallery[Math.min(shot, gallery.length - 1)] ?? product.image;

  // Real-time feel: color picks matching gallery frame instantly
  useEffect(() => {
    const idx = Math.max(0, product.colors.indexOf(color));
    if (gallery.length) setShot(idx % gallery.length);
    setPulse(`${color} selected · live update`);
    const t = window.setTimeout(() => setPulse(null), 1600);
    return () => window.clearTimeout(t);
  }, [color, gallery.length, product.colors]);

  useEffect(() => {
    setSize(product.sizes[0] ?? "One size");
    setColor(product.colors[0] ?? "Default");
    setShot(0);
    setMode("photos");
    setQty(1);
  }, [product.id, product.sizes, product.colors]);

  // Soft live social proof
  useEffect(() => {
    const id = window.setInterval(() => {
      setViewers((v) => Math.max(3, Math.min(48, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  const buyOpts = { size, color, qty };

  return (
    <motion.section
      className="pp pp-tech"
      style={{ background: bg, color: ink, ["--a" as string]: accent }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
    >
      <button type="button" className="pp-back" onClick={onBack}>
        ← Back
      </button>

      <div className="pp-stage">
        <div className="pp-mode-bar" role="tablist" aria-label="Product view">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "photos"}
            className={mode === "photos" ? "on" : ""}
            onClick={() => setMode("photos")}
          >
            Photos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "3d"}
            className={mode === "3d" ? "on" : ""}
            onClick={() => setMode("3d")}
          >
            3D spin
          </button>
          <span className="pp-viewers">
            <i /> {viewers} viewing now
          </span>
        </div>

        <AnimatePresence mode="wait">
          {mode === "3d" ? (
            <motion.div
              key="3d"
              className="pp-hero pp-hero-3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductSpin3D src={activeSrc} accent={accent} onExit={() => setMode("photos")} />
            </motion.div>
          ) : (
            <motion.div
              key={`photo-${activeSrc}-${color}`}
              className="pp-hero"
              initial={{ opacity: 0.6, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ filter: colorFilter(color) }}
            >
              <ImageZoom src={activeSrc} alt={`${product.name} · ${color}`} />
              <ProductBadges badges={product.badges} />
              {gallery.length > 1 && (
                <div className="pp-thumbs">
                  {gallery.map((src, i) => (
                    <button
                      type="button"
                      key={`${product.id}-g-${i}`}
                      className={shot === i ? "on" : ""}
                      onClick={() => setShot(i)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" style={{ filter: colorFilter(color) }} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {pulse && (
            <motion.p
              className="pp-live-pulse"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {pulse}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="pp-sheet">
        <p className="pp-kicker">
          Floor {floorLabel} · {storeName}
          {product.brand ? ` · ${product.brand}` : ""}
        </p>
        <h1>{product.name}</h1>
        <div className="pp-meta-row">
          <p className="pp-rating">
            ★ {product.rating.toFixed(1)}
            {product.reviewCount > 0 ? ` · ${product.reviewCount} reviews` : " · Curated pick"}
          </p>
          <StockPill stock={product.stock} />
        </div>
        {product.sku && <p className="pp-sku">SKU {product.sku}</p>}
        <CommerceTrustRow />
        <p className="pp-copy">{product.description}</p>
        <p className="pp-ship">
          {product.shippingNote ?? "Delivery in 2–4 days"} ·{" "}
          {product.returnNote ?? "Easy returns within 7 days"} ·{" "}
          <button type="button" className="linkish" onClick={onHelp}>
            Shipping help
          </button>
        </p>

        {product.colors.length > 0 && (
          <div className="pp-pick">
            <p>
              Color <em className="pp-live-tag">live</em>
            </p>
            <div className="pp-pills">
              {product.colors.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={color === c ? "on" : ""}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        {product.sizes.length > 0 && (
          <div className="pp-pick">
            <p>Size</p>
            <div className="pp-pills">
              {product.sizes.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={size === s ? "on" : ""}
                  onClick={() => {
                    setSize(s);
                    setPulse(`Size ${s} · ready to add`);
                    window.setTimeout(() => setPulse(null), 1400);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {!soldOut && (
          <div className="pp-pick">
            <p>Quantity</p>
            <div className="qty-row">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <em>{qty}</em>
              <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>
                +
              </button>
            </div>
          </div>
        )}

        <div className="pp-accordion">
          <details open>
            <summary>Details</summary>
            <p>
              {product.description}
              {product.colors.length ? ` Available in ${product.colors.join(", ")}.` : ""}
              {product.sizes.length ? ` Sizes ${product.sizes.join(", ")}.` : ""}
            </p>
          </details>
          <SizeGuide product={product} />
          <ProductQA />
          <details>
            <summary>Returns & authenticity</summary>
            <p>{product.returnNote ?? "Demo policy: unused items within 7 days."}</p>
          </details>
          {showReviews && reviews.length > 0 && (
            <details>
              <summary>Reviews ({reviews.length})</summary>
              <ul className="pp-reviews">
                {reviews.map((r) => (
                  <li key={r.id}>
                    <strong>
                      ★ {r.rating} · {r.author}
                    </strong>
                    {r.title && <em>{r.title}</em>}
                    <p>{r.body}</p>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        <div className="pp-price pp-price-desk">
          <ProductPrice product={product} currency={currency} locale={locale} size="lg" />
        </div>
        <div className="pp-actions pp-actions-desk">
          <button
            type="button"
            className="primary"
            disabled={soldOut}
            onClick={() => onBuyNow(buyOpts)}
          >
            {soldOut ? "Sold out" : "Buy now"}
          </button>
          <button type="button" disabled={soldOut} onClick={() => onBuy(buyOpts)}>
            Add to cart
          </button>
          <button type="button" className={wishlisted ? "wish on" : "wish"} onClick={onToggleWish}>
            {wishlisted ? "Saved ♥" : "Save ♥"}
          </button>
          <button type="button" className={compared ? "on" : ""} onClick={onToggleCompare}>
            {compared ? "In compare" : "Compare"}
          </button>
        </div>
        {onVisitStore && (
          <button type="button" className="pp-visit" onClick={onVisitStore}>
            Visit boutique · {storeName}
          </button>
        )}

        {related.length > 0 && (
          <div className="pp-related">
            <h3>You may also like</h3>
            <div className="suggest-grid">
              {related.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className="suggest-card"
                  onClick={() => onOpenRelated(p)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" />
                  <strong>{p.name}</strong>
                  <ProductPrice product={p} currency={currency} locale={locale} size="sm" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky easy buy — always reachable while browsing photos or 3D */}
      <div className="pp-sticky-buy">
        <div>
          <strong>{formatMoney(product.price, currency, locale)}</strong>
          <small>
            {color} · {size}
          </small>
        </div>
        <button type="button" disabled={soldOut} onClick={() => onBuy(buyOpts)}>
          Add
        </button>
        <button
          type="button"
          className="primary"
          disabled={soldOut}
          onClick={() => onBuyNow(buyOpts)}
        >
          {soldOut ? "Sold out" : "Buy"}
        </button>
      </div>
    </motion.section>
  );
}
