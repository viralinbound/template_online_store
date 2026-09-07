"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StockPill } from "@/components/ui/StockPill";
import { mediaForColor, productHref } from "@/lib/catalog";
import { productLayoutId, springSoft } from "@/lib/motion";
import { useMallStore } from "@/store/useMallStore";
import type { Product } from "@/types/mall";

type Props = {
  product: Product;
  currency?: string;
  locale?: string;
  accent?: string;
  onClose: () => void;
  onBuyNow?: () => void;
};

/** Center quick-look — portaled to body so Look / Full page work on every device */
export function QuickLook3D({
  product,
  currency = "INR",
  locale = "en-IN",
  accent = "#14999c",
  onClose,
  onBuyNow,
}: Props) {
  const addToBag = useMallStore((s) => s.addToBag);
  const toggleCompare = useMallStore((s) => s.toggleCompare);
  const compare = useMallStore((s) => s.compare);
  const [color, setColor] = useState(product.colors[0] ?? "Default");
  const [mounted, setMounted] = useState(false);

  const src = useMemo(() => mediaForColor(product, color), [product, color]);
  const soldOut = product.stock != null && product.stock <= 0;
  const inCompare = compare.some((x) => x.id === product.id);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <motion.div
        className="ql3d-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="ql3d-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Quick look · ${product.name}`}
        style={{ ["--a" as string]: accent }}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ql3d-x" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="ql3d-media">
          <motion.img
            layoutId={productLayoutId(product.id)}
            key={src}
            src={src}
            alt={product.name}
            className="ql3d-photo"
            transition={springSoft}
          />
        </div>

        <div className="ql3d-info">
          <p className="home-kicker">{product.category}</p>
          <h2>{product.name}</h2>
          <div className="pp-meta-row">
            <p className="pp-rating">★ {product.rating.toFixed(1)}</p>
            <StockPill stock={product.stock} />
          </div>
          <ProductPrice product={product} currency={currency} locale={locale} size="lg" />

          {product.colors.length > 0 && (
            <div className="pp-pick">
              <p>Color · live preview</p>
              <div className="pp-pills">
                {product.colors.map((c) => (
                  <button type="button" key={c} className={color === c ? "on" : ""} onClick={() => setColor(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ql3d-actions">
            <button
              type="button"
              className="primary"
              disabled={soldOut}
              onClick={() => {
                addToBag(product, { color, size: product.sizes[0], qty: 1 });
                onBuyNow?.();
                onClose();
              }}
            >
              {soldOut ? "Sold out" : "Buy now"}
            </button>
            <button
              type="button"
              disabled={soldOut}
              onClick={() => addToBag(product, { color, size: product.sizes[0], qty: 1 })}
            >
              Add to cart
            </button>
            <button type="button" className={inCompare ? "on" : ""} onClick={() => toggleCompare(product)}>
              {inCompare ? "In compare" : "Compare"}
            </button>
            <Link href={productHref(product)} className="ql3d-fullpage" onClick={onClose}>
              Full page →
            </Link>
          </div>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}
