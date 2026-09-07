"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { searchProducts } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";

export function SearchPage() {
  const { floors, config } = useCatalog();
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);

  const results = useMemo(() => searchProducts(q, 36, floors), [q, floors]);

  return (
    <OrvaShell>
      <PageHero
        kicker="Find anything"
        title="Search"
        lead={`Type a product, brand, or category across ${config.brandName}.`}
        image={landingHeroImage()}
        actions={
          <form
            className="search-form orva-hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              router.replace(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${config.brandName}…`}
              autoFocus
            />
            <button type="submit" className="primary">
              Search
            </button>
          </form>
        }
      />
      <AtmosphereBand items={["Search", "Shop", "Food", "Brands", config.brandName]} />

      <section className="orva-land-block">
        <SectionHead
          eyebrow="Results"
          title={
            q.trim()
              ? `${results.length} for “${q.trim()}”`
              : "Start typing above"
          }
        />
        <div className="pc3d-grid">
          {results.map((p) => (
            <ProductCard3D
              key={p.id}
              product={p}
              currency={config.currency}
              locale={config.locale}
              onBuyNow={() => router.push("/checkout")}
            />
          ))}
        </div>
        {!results.length && q.trim() && (
          <Link href="/shop" className="primary inline-cta">
            Browse full shop
          </Link>
        )}
      </section>
    </OrvaShell>
  );
}
