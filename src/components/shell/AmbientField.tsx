"use client";

/** Soft ambient field — static washes only (no grain / continuous blur animation) */
export function AmbientField({ variant = "site" }: { variant?: "site" | "hero" | "dark" }) {
  return (
    <div className={`ambient-field ${variant} css-driven is-static`} aria-hidden>
      <span className="ambient-orb o1" />
      <span className="ambient-orb o2" />
    </div>
  );
}
