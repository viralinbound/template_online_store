"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCatalog } from "@/components/CatalogProvider";
import { MallEcommercePlaza } from "@/components/mall/MallEcommercePlaza";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { BoutiqueDoorCorridor } from "@/components/shop/BoutiqueDoorCorridor";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { floorHref, suggestProducts } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";

/** Full mall atrium hub — floors that sell (light motion for speed) */
export function FloorsHubPage() {
  const { floors, config } = useCatalog();
  const router = useRouter();
  const featuredStores = useMemo(
    () => floors.flatMap((f) => f.stores.filter((s) => s.featured)).slice(0, 8),
    [floors],
  );
  const picks = useMemo(() => suggestProducts(6, [], floors), [floors]);
  const totalStores = floors.reduce((n, f) => n + f.stores.length, 0);
  const totalProducts = floors.reduce(
    (n, f) => n + f.stores.reduce((m, s) => m + s.products.length, 0),
    0,
  );

  return (
    <OrvaShell>
      <PageHero
        kicker="Virtual mall · live catalog"
        title={`Enter the ${config.brandName} atrium`}
        lead={`${floors.length} floors · ${totalStores} brands · ${totalProducts} products — category → shop → subcategory → buy.`}
        image={landingHeroImage()}
        actions={
          <>
            <Link href="/shop" className="primary">
              Shop all
            </Link>
            <Link href="/directory" className="ghost">
              Brand directory
            </Link>
          </>
        }
      />

      <AtmosphereBand
        items={[
          config.brandName,
          "Mall floors",
          "Category",
          "Shops",
          "Products",
          ...config.trustPoints.slice(0, 2),
        ]}
      />

      <section className="orva-land-block">
        <div className="mall-atrium-stats">
          {[
            { n: String(floors.length).padStart(2, "0"), t: "Floors" },
            { n: String(totalStores), t: "Brands" },
            { n: String(totalProducts), t: "Products" },
            { n: "ORVA10", t: "Demo coupon" },
          ].map((s) => (
            <article key={s.t} className="mall-atrium-stat">
              <strong>{s.n}</strong>
              <span>{s.t}</span>
            </article>
          ))}
        </div>
      </section>

      <div className="orva-land-block">
        <MallEcommercePlaza floors={floors} brand={config.brandName} />
      </div>

      <section className="orva-land-block tight">
        <SectionHead eyebrow="Doors" title="Featured brand doors" />
        <BoutiqueDoorCorridor
          stores={featuredStores}
          variant="light"
          eyebrow="Open a house"
          title="Step into a boutique"
          onEnterStore={(s) => router.push(`/stores/${s.slug || s.id}`)}
        />
      </section>

      <section className="orva-land-block tight">
        <SectionHead
          eyebrow="From the mall"
          title="Pieces on every floor"
          action={
            <Link href="/shop" className="orva-land-link">
              Full shop →
            </Link>
          }
        />
        <div className="pc3d-grid dense-grid">
          {picks.map((p) => (
            <ProductCard3D
              key={p.id}
              product={p}
              currency={config.currency}
              locale={config.locale}
              variant="light"
              staticCard
              onBuyNow={() => router.push("/cart")}
            />
          ))}
        </div>
      </section>

      <section className="orva-land-finale lumen-finale compact-finale">
        <p className="orva-land-eyebrow">Ready to buy</p>
        <h2>Pick a floor · category · shop · checkout</h2>
        <p>Same bag across mall floors, shop, and food — guest pay with ORVA10.</p>
        <div className="orva-land-cta">
          <Link href={floors[0] ? floorHref(floors[0]) : "/shop"} className="primary">
            Start at {floors[0]?.title ?? "shop"}
          </Link>
          <Link href="/checkout" className="ghost">
            Go to checkout
          </Link>
        </div>
      </section>
    </OrvaShell>
  );
}
