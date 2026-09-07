"use client";

/** Trust strip — adapts to config.trustPoints from DB/CMS */
export function TrustBar({ points }: { points: string[] }) {
  if (!points.length) return null;
  return (
    <ul className="mm-trust" aria-label="Shopping guarantees">
      {points.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}
