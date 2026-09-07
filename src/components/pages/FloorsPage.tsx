"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { MallFloorJourney } from "@/components/shop/MallFloorJourney";
import { floorSlug } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";

export function FloorsPage() {
  const { floors, config } = useCatalog();
  const router = useRouter();
  const floorCards = useMemo(
    () =>
      floors.map((f) => ({
        label: f.label,
        title: f.title,
        categoryName: f.categoryName,
        hero: f.heroImage ?? f.stores[0]?.doorImage ?? "",
        storeCount: f.stores.length,
      })),
    [floors],
  );

  return (
    <OrvaShell>
      <PageHero
        kicker="Vertical mall"
        title="Scroll every floor"
        lead="Ride the levels like walking the atrium — enter a floor when it feels right."
        image={floorCards[0]?.hero || landingHeroImage()}
        size="compact"
        actions={
          <>
            <a href="#mall-journey" className="primary">
              Start the journey
            </a>
            <Link href="/shop" className="ghost">
              Shop catalog
            </Link>
            <Link href="/directory" className="ghost">
              Directory
            </Link>
          </>
        }
      />
      <AtmosphereBand items={floors.map((f) => `Floor ${f.label} · ${f.title}`)} />

      <MallFloorJourney
        floors={floorCards}
        brandName={config.brandName}
        onEnterFloor={(i) => {
          const f = floors[i];
          if (f) router.push(`/floors/${floorSlug(f)}`);
        }}
      />
    </OrvaShell>
  );
}
