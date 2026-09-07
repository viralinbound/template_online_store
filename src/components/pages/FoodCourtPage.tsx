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
import { BoutiqueDoorCorridor } from "@/components/shop/BoutiqueDoorCorridor";
import { EXPERIENCE_ROADMAP, productsByCategory } from "@/lib/catalog";
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
        kicker="Food · shop category"
        title="Café heat & kitchen sweets"
        lead="Coffee, confectionery, and dessert — same cards, quick look, and Buy path as the rest of Orva."
        image={hero}
        size="tall"
        actions={
          <>
            <Link href="/shop?category=food" className="primary">
              Shop food catalog
            </Link>
            <Link href="/shop" className="ghost">
              Full shop
            </Link>
            <Link href="/directory" className="ghost">
              Brands
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
        <BoutiqueDoorCorridor
          stores={stores}
          variant="light"
          eyebrow="Cafés & counters"
          title="Food brands"
          action={
            <Link href="/directory" className="orva-land-link">
              All brands →
            </Link>
          }
        />
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
