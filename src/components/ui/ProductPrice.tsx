"use client";

import { discountPercent, formatMoney } from "@/lib/money";
import type { Product } from "@/types/mall";

type Props = {
  product: Product;
  currency?: string;
  locale?: string;
  size?: "sm" | "md" | "lg";
};

/** Adaptive price — strike + % off only when compareAtPrice exists */
export function ProductPrice({ product, currency, locale, size = "md" }: Props) {
  const cur = currency ?? product.currency ?? "INR";
  const pct = discountPercent(product.price, product.compareAtPrice);
  return (
    <span className={`mm-price mm-price-${size}`}>
      <strong>{formatMoney(product.price, cur, locale)}</strong>
      {pct != null && product.compareAtPrice != null && (
        <>
          <s>{formatMoney(product.compareAtPrice, cur, locale)}</s>
          <em>−{pct}%</em>
        </>
      )}
    </span>
  );
}
