"use client";

import type { ProductBadge } from "@/types/mall";

const LABELS: Record<ProductBadge, string> = {
  new: "New",
  sale: "Sale",
  limited: "Limited",
  bestseller: "Bestseller",
  exclusive: "Exclusive",
};

/** Renders nothing when the product/DB row has no badges */
export function ProductBadges({ badges }: { badges?: ProductBadge[] | null }) {
  if (!badges?.length) return null;
  return (
    <ul className="mm-badges" aria-label="Product badges">
      {badges.map((b) => (
        <li key={b} className={`mm-badge mm-badge-${b}`}>
          {LABELS[b]}
        </li>
      ))}
    </ul>
  );
}
