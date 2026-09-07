"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { BoutiqueShelfWalk } from "@/components/shop/BoutiqueShelfWalk";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { Showroom3D } from "@/components/shop/Showroom3D";
import { findStoreBySlug, floorSlug } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";

export function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug ?? "");
  const { floors, config } = useCatalog();
  const hit = findStoreBySlug(slug, floors);

  if (!hit) {
    return (
      <OrvaShell>
        <PageHero
          kicker="Boutique"
          title="Not found"
          image={landingHeroImage()}
          actions={<Link href="/directory" className="primary">Directory</Link>}
        />
      </OrvaShell>
    );
  }

  const { store, floorLabel, floorTitle, floorIndex } = hit;
  const floor = floors[floorIndex];

  return (
    <OrvaShell>
      <PageHero
        kicker={`Floor ${floorLabel} · ${store.subcategory}`}
        title={store.name}
        lead={store.description ?? `${store.products.length} products in this boutique.`}
        image={store.doorImage}
        size="tall"
        actions={
          <>
            <a href="#shelf-walk" className="primary">
              Walk shelves
            </a>
            <Link href="/floors" className="ghost">
              All floors
            </Link>
            {floor && (
              <Link href={`/floors/${floorSlug(floor)}`} className="ghost">
                {floorTitle}
              </Link>
            )}
          </>
        }
      />
      <AtmosphereBand items={[store.name, store.subcategory, store.category, config.brandName]} />

      <Showroom3D
        products={store.products}
        currency={config.currency}
        locale={config.locale}
        accent={store.theme.accent}
        eyebrow={`${store.name} · showroom`}
        title="Scroll pieces in 3D"
        onBuyNow={() => router.push("/checkout")}
      />

      <div id="shelf-walk" className="orva-land-block">
        <BoutiqueShelfWalk
          store={store}
          currency={config.currency}
          locale={config.locale}
          onBuyNow={() => router.push("/checkout")}
        />
      </div>

      <section className="orva-land-block">
        <SectionHead
          eyebrow="Collection"
          title={`${store.products.length} items · tilt · color · quick 3D`}
        />
        <div className="pc3d-grid">
          {store.products.map((p) => (
            <ProductCard3D
              key={p.id}
              product={p}
              currency={config.currency}
              locale={config.locale}
              accent={store.theme.accent}
              onBuyNow={() => router.push("/checkout")}
            />
          ))}
        </div>
      </section>
    </OrvaShell>
  );
}
