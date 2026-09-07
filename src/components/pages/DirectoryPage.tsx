"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { storeHref } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";

export function DirectoryPage() {
  const { floors, config } = useCatalog();
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState<string | "all">("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    floors.forEach((f) => f.stores.forEach((s) => set.add(s.category)));
    return [...set].sort();
  }, [floors]);

  const stores = useMemo(() => {
    const query = q.trim().toLowerCase();
    return floors
      .flatMap((f) => f.stores.map((s) => ({ store: s, group: f.title })))
      .filter(({ store }) => {
        if (catFilter !== "all" && store.category !== catFilter) return false;
        if (!query) return true;
        return (
          store.name.toLowerCase().includes(query) ||
          store.subcategory.toLowerCase().includes(query) ||
          store.category.toLowerCase().includes(query)
        );
      });
  }, [floors, q, catFilter]);

  return (
    <OrvaShell>
      <PageHero
        kicker="Brands"
        title="Brand directory"
        lead="Find every brand and boutique — open a store to shop its collection."
        image={landingHeroImage()}
        actions={
          <>
            <Link href="/shop" className="primary">
              Shop all
            </Link>
            <Link href="/food" className="ghost">
              Food
            </Link>
          </>
        }
      />
      <AtmosphereBand items={[config.brandName, "Brands", "Shop", "Food", "Checkout"]} />

      <section className="orva-land-block">
        <SectionHead eyebrow="Find" title={`${stores.length} brands`} />
        <div className="dir-tools">
          <input
            type="search"
            className="orva-search-field"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${config.brandName} brands…`}
            autoComplete="off"
            enterKeyHint="search"
            aria-label={`Search ${config.brandName} brands`}
          />
          <div className="dest-cats">
            <button
              type="button"
              className={catFilter === "all" ? "on" : ""}
              onClick={() => setCatFilter("all")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                className={catFilter === c ? "on" : ""}
                onClick={() => setCatFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="orva-land-boutiques">
          {stores.map(({ store }) => (
            <Link
              key={store.id}
              href={storeHref(store)}
              className="orva-land-boutique"
              style={{ ["--a" as string]: store.theme.accent }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={store.doorImage} alt="" />
              <span>
                <strong>{store.name}</strong>
                <small>
                  {store.subcategory} · {store.category}
                </small>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </OrvaShell>
  );
}
