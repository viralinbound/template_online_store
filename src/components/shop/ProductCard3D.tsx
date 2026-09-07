"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { QuickLook3D } from "@/components/commerce/QuickLook3D";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StockPill } from "@/components/ui/StockPill";
import { mediaForColor, productHref } from "@/lib/catalog";
import { useMallStore } from "@/store/useMallStore";
import type { Product } from "@/types/mall";

type Props = {
  product: Product;
  currency?: string;
  locale?: string;
  accent?: string;
  onBuyNow?: (p: Product) => void;
};

/** Shop card with 3D tilt, live color media, and quick-look spin */
export function ProductCard3D({
  product,
  currency = "INR",
  locale = "en-IN",
  accent = "#14999c",
  onBuyNow,
}: Props) {
  const addToBag = useMallStore((s) => s.addToBag);
  const toggleCompare = useMallStore((s) => s.toggleCompare);
  const compare = useMallStore((s) => s.compare);
  const ref = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState(product.colors[0] ?? "Default");
  const [quick, setQuick] = useState(false);

  const src = mediaForColor(product, color);
  const inCompare = compare.some((x) => x.id === product.id);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ x: (py - 0.5) * -10, y: (px - 0.5) * 12 });
  };

  return (
    <>
      <article
        ref={ref}
        className="pc3d"
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <button type="button" className="pc3d-media" onClick={() => setQuick(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={product.name} loading="lazy" key={src} />
          <ProductBadges badges={product.badges} />
          <span className="pc3d-3dtag">Quick 3D</span>
        </button>
        <div className="pc3d-body">
          <p className="pc3d-cat">
            {product.category} · ★ {product.rating.toFixed(1)}
          </p>
          <Link href={productHref(product)}>
            <strong>{product.name}</strong>
          </Link>
          <ProductPrice product={product} currency={currency} locale={locale} size="sm" />
          <StockPill stock={product.stock} />

          {product.colors.length > 1 && (
            <div className="pc3d-colors" role="group" aria-label="Colors">
              {product.colors.slice(0, 5).map((c) => (
                <button
                  type="button"
                  key={c}
                  className={color === c ? "on" : ""}
                  title={c}
                  aria-label={c}
                  onClick={() => setColor(c)}
                >
                  <i style={{ background: swatchTone(c) }} />
                </button>
              ))}
            </div>
          )}

          <div className="pc3d-actions">
            <button type="button" className="pc3d-view" onClick={() => setQuick(true)}>
              3D
            </button>
            <button
              type="button"
              className={inCompare ? "on" : ""}
              onClick={() => toggleCompare(product)}
              title="Compare"
            >
              ⇄
            </button>
            <button
              type="button"
              onClick={() => addToBag(product, { color, size: product.sizes[0] })}
            >
              Add
            </button>
            <button
              type="button"
              className="buy"
              onClick={() => {
                addToBag(product, { color, size: product.sizes[0] });
                onBuyNow?.(product);
              }}
            >
              Buy
            </button>
          </div>
        </div>
      </article>

      {quick && (
        <QuickLook3D
          product={product}
          currency={currency}
          locale={locale}
          accent={accent}
          onClose={() => setQuick(false)}
          onBuyNow={() => onBuyNow?.(product)}
        />
      )}
    </>
  );
}

function swatchTone(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("black") || n.includes("noir") || n.includes("onyx")) return "#1a1a1a";
  if (n.includes("white") || n.includes("ivory") || n.includes("cream")) return "#f4f1ea";
  if (n.includes("red") || n.includes("ruby") || n.includes("crimson")) return "#c0392b";
  if (n.includes("blue") || n.includes("navy") || n.includes("azure")) return "#1f4e79";
  if (n.includes("green") || n.includes("olive") || n.includes("sage")) return "#3d6b4f";
  if (n.includes("gold") || n.includes("amber") || n.includes("brass")) return "#c9a227";
  if (n.includes("silver") || n.includes("steel") || n.includes("grey") || n.includes("gray"))
    return "#9aa3a8";
  if (n.includes("pink") || n.includes("rose") || n.includes("blush")) return "#e8a0bf";
  if (n.includes("brown") || n.includes("tan") || n.includes("cognac")) return "#8b5a2b";
  if (n.includes("purple") || n.includes("violet") || n.includes("lilac")) return "#6b4c9a";
  if (n.includes("orange") || n.includes("coral") || n.includes("rust")) return "#d35400";
  if (n.includes("teal") || n.includes("mint") || n.includes("aqua")) return "#14999c";
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `hsl(${h} 42% 48%)`;
}
