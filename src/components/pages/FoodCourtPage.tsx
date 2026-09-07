"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { EXPERIENCE_ROADMAP, productsByCategory, storeHref } from "@/lib/catalog";
import { categoryCollageImage } from "@/lib/images";

export function FoodCourtPage() {
  const { floors, config } = useCatalog();
  const router = useRouter();
  const products = useMemo(() => productsByCategory("food", 24, floors), [floors]);
  const stores = useMemo(
    () => floors.flatMap((f) => f.stores.filter((s) => s.category === "food")),
    [floors],
  );
  const hero =
    stores[0]?.doorImage ?? categoryCollageImage("food", "food-court", 0);

  return (
    <OrvaShell>
      <PageHero
        kicker="Food Court · first-class destination"
        title="Café heat & atrium sweets"
        lead="Coffee bars, confectionery, and dessert desks — same tilt cards, quick 3D look, and Buy path as the rest of Orva."
        image={hero}
        size="tall"
        actions={
          <>
            <Link href="/shop?category=food" className="primary">
              Shop food catalog
            </Link>
            <Link href="/floors" className="ghost">
              Mall floors
            </Link>
            <Link href="/directory" className="ghost">
              Directory
            </Link>
          </>
        }
      />

      <AtmosphereBand
        items={[
          "Food Court",
          "Espresso",
          "Pastry",
          "Dessert desk",
          "Guest checkout",
          config.brandName,
        ]}
      />

      <section className="orva-land-block">
        <SectionHead
          eyebrow="Courts & counters"
          title="Boutiques on the food promenade"
          action={
            <Link href="/directory" className="orva-land-link">
              Full directory →
            </Link>
          }
        />
        <div className="orva-land-boutiques">
          {stores.map((s) => (
            <Link
              key={s.id}
              href={storeHref(s)}
              className="orva-land-boutique"
              style={{ ["--a" as string]: s.theme.accent }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.doorImage} alt="" />
              <span>
                <em>{s.subcategory}</em>
                <strong>{s.name}</strong>
                <small>{s.products.length} items</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="orva-land-block">
        <SectionHead
          eyebrow="Menu board"
          title="Taste the edit"
          action={
            <Link href="/shop?category=food" className="orva-land-link">
              View all food →
            </Link>
          }
        />
        <div className="pc3d-grid">
          {products.map((p) => (
            <ProductCard3D
              key={p.id}
              product={p}
              currency={config.currency}
              locale={config.locale}
              accent="#e88755"
              onBuyNow={() => router.push("/checkout")}
            />
          ))}
        </div>
      </section>

      <section className="orva-land-block">
        <SectionHead eyebrow="Food plans" title="Ideas cooking next" />
        <div className="orva-idea-grid">
          {EXPERIENCE_ROADMAP.map((idea) => (
            <article key={idea.title} className="orva-idea-card">
              <strong>{idea.title}</strong>
              <p>{idea.body}</p>
            </article>
          ))}
        </div>
        <p className="muted" style={{ marginTop: "1rem" }}>
          See also{" "}
          <Link href="/help?section=whats-next" className="orva-land-link">
            Help · What’s next
          </Link>
        </p>
      </section>

      <section className="orva-land-finale food-finale">
        <p className="orva-land-eyebrow">Hungry?</p>
        <h2>Order from the court</h2>
        <p>Demo checkout only — grab a combo, apply ORVA10, track like any Orva order.</p>
        <div className="orva-land-cta">
          <Link href="/shop?category=food" className="primary">
            Shop food
          </Link>
          <Link href="/cart" className="ghost">
            View cart
          </Link>
        </div>
      </section>
    </OrvaShell>
  );
}
