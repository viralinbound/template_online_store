"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { floorHref } from "@/lib/catalog";
import type { MallFloor } from "@/types/mall";

type Props = {
  floors: MallFloor[];
  brand?: string;
  compact?: boolean;
};

/** Designer 2.5D mall atrium — floors as shoppable worlds */
export function MallEcommercePlaza({ floors, brand = "Orva", compact = false }: Props) {
  const reduce = useReducedMotion();
  if (!floors.length) return null;

  return (
    <section className={`mall-ecom-plaza${compact ? " compact" : ""}`} aria-label="Virtual mall floors">
      <div className="mall-ecom-plaza-head">
        <p className="orva-land-eyebrow">Mall · ecommerce</p>
        <h2>Walk the floors. Buy the pieces.</h2>
        <p className="mall-ecom-lead">
          {brand} is a living mall — each level is a curated shop world with real brands, products, and checkout.
        </p>
        <Link href="/floors" className="orva-land-link">
          Open full atrium →
        </Link>
      </div>

      <div className="mall-ecom-stack" style={{ perspective: reduce ? undefined : 1400 }}>
        {floors.map((floor, i) => {
          const hero = floor.heroImage ?? floor.stores[0]?.doorImage ?? "";
          const productCount = floor.stores.reduce((n, s) => n + s.products.length, 0);
          const peek = floor.stores.flatMap((s) => s.products).slice(0, 3);
          const depth = floors.length - i;

          return (
            <motion.article
              key={floor.id}
              className="mall-ecom-floor"
              style={{
                ["--stack-i" as string]: i,
                zIndex: depth,
              }}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={
                reduce
                  ? undefined
                  : { y: -6, scale: 1.01, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }
            >
              <Link href={floorHref(floor)} className="mall-ecom-floor-link">
                <div className="mall-ecom-floor-media">
                  {hero ? <img src={hero} alt="" /> : <div className="mall-ecom-floor-fallback" />}
                  <span className="mall-ecom-floor-label">{floor.label}</span>
                </div>
                <div className="mall-ecom-floor-copy">
                  <strong>{floor.title}</strong>
                  <em>{floor.categoryName}</em>
                  <p>
                    {floor.stores.length} brands · {productCount} products
                  </p>
                  <div className="mall-ecom-peek" aria-hidden>
                    {peek.map((p) => (
                      <img key={p.id} src={p.image} alt="" />
                    ))}
                  </div>
                  <span className="mall-ecom-enter">Enter floor</span>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
