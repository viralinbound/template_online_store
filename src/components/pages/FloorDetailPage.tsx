"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { SectionHead } from "@/components/shell/SectionHead";
import { Showroom3D } from "@/components/shop/Showroom3D";
import { findFloorBySlug, storeHref } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";

export function FloorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug ?? "");
  const { floors, config } = useCatalog();
  const floor = findFloorBySlug(slug, floors);

  const products = useMemo(
    () => (floor ? floor.stores.flatMap((s) => s.products) : []),
    [floor],
  );

  if (!floor) {
    return (
      <OrvaShell>
        <section className="floor-immersive">
          <div className="floor-immersive-copy">
            <h1>Floor not found</h1>
            <Link href="/floors" className="primary">
              Back to mall
            </Link>
          </div>
        </section>
      </OrvaShell>
    );
  }

  const hero = floor.heroImage ?? floor.stores[0]?.doorImage ?? landingHeroImage();
  const accent = floor.stores[0]?.theme.accent ?? "#14999c";

  return (
    <OrvaShell>
      <section className="floor-immersive" style={{ ["--a" as string]: accent }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero} alt="" className="floor-immersive-bg" />
        <div className="floor-immersive-veil" />
        <div className="floor-immersive-copy">
          <p className="mall-journey-meta">
            {config.brandName} · Floor {floor.label}
          </p>
          <h1>{floor.title}</h1>
          <p>
            {floor.categoryName} · {floor.stores.length} boutiques · {products.length} pieces
          </p>
          <div className="orva-land-cta">
            <a href="#floor-showroom" className="primary">
              Open showroom
            </a>
            <Link href="/floors" className="ghost">
              All floors
            </Link>
          </div>
        </div>
      </section>

      <AtmosphereBand items={[floor.title, ...floor.subcategories.slice(0, 5)]} />

      <div id="floor-showroom">
        <Showroom3D
          products={products.slice(0, 16)}
          currency={config.currency}
          locale={config.locale}
          accent={accent}
          eyebrow={`Floor ${floor.label} · live stage`}
          title="Scroll the showroom"
          onBuyNow={() => router.push("/checkout")}
        />
      </div>

      <section className="orva-land-block">
        <SectionHead eyebrow="Boutiques" title="Enter a door" />
        <div className="orva-land-boutiques">
          {floor.stores.map((s) => (
            <Link
              key={s.id}
              href={storeHref(s)}
              className="orva-land-boutique"
              style={{ ["--a" as string]: s.theme.accent }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.doorImage} alt="" />
              <span>
                <strong>{s.name}</strong>
                <small>{s.subcategory}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </OrvaShell>
  );
}
