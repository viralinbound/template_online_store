"use client";

/** Stock pill — hidden when stock is null/undefined (unlimited) */
export function StockPill({ stock }: { stock?: number | null }) {
  if (stock == null) return null;
  if (stock <= 0) {
    return <span className="mm-stock sold">Sold out</span>;
  }
  if (stock <= 5) {
    return <span className="mm-stock low">Only {stock} left</span>;
  }
  return <span className="mm-stock ok">In stock</span>;
}
