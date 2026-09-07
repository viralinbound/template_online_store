"use client";

import type { Product } from "@/types/mall";

const SIZE_GUIDE: Record<string, string[]> = {
  default: ["XS · chest 34–36", "S · 36–38", "M · 38–40", "L · 40–42", "XL · 42–44"],
  footwear: ["UK 6 · EU 39", "UK 7 · EU 40", "UK 8 · EU 42", "UK 9 · EU 43", "UK 10 · EU 44"],
};

const FAQ = [
  {
    q: "Is this the final price?",
    a: "Yes — taxes for this demo are included in the listed price. Coupons apply at checkout.",
  },
  {
    q: "How fast is delivery?",
    a: "Most cities: 2–4 days. You’ll see an ETA on the order tracking page after purchase.",
  },
  {
    q: "Can I return it?",
    a: "Unused items can be returned within 7 days (demo policy). Start from Orders.",
  },
];

export function CommerceTrustRow() {
  return (
    <ul className="orva-trust-row" aria-label="Purchase guarantees">
      <li>Secure demo pay</li>
      <li>Easy returns</li>
      <li>Live order track</li>
      <li>Support help</li>
    </ul>
  );
}

export function SizeGuide({ product }: { product: Product }) {
  const footwear =
    /shoe|runner|sneaker|trainer|footwear/i.test(product.name) ||
    product.subcategory.toLowerCase().includes("footwear");
  const rows = footwear ? SIZE_GUIDE.footwear : SIZE_GUIDE.default;
  if (product.sizes.length === 1 && product.sizes[0] === "One Size") {
    return (
      <details className="pp-extra">
        <summary>Size guide</summary>
        <p>This item is One Size — designed as a free fit for most customers.</p>
      </details>
    );
  }
  return (
    <details className="pp-extra">
      <summary>Size guide</summary>
      <ul>
        {rows.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <p className="muted">Guide is approximate · boutique fit may vary.</p>
    </details>
  );
}

export function ProductQA() {
  return (
    <details className="pp-extra">
      <summary>Questions & answers</summary>
      <ul className="pp-qa">
        {FAQ.map((f) => (
          <li key={f.q}>
            <strong>{f.q}</strong>
            <p>{f.a}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function ImageZoom({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="pp-zoom-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <span className="pp-zoom-hint">Hover / pinch to inspect</span>
    </div>
  );
}
