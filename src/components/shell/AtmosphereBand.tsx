"use client";

/** Soft marquee strip — shared atmosphere across site */
export function AtmosphereBand({ items }: { items: string[] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];
  return (
    <div className="orva-land-marquee" aria-hidden>
      <div className="orva-land-marquee-track">
        {loop.map((t, i) => (
          <span key={`${t}-${i}`}>{t}</span>
        ))}
      </div>
    </div>
  );
}
