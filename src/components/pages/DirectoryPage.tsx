"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { floorSlug, storeHref } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";

export function DirectoryPage() {
  const { floors, config } = useCatalog();
  const [q, setQ] = useState("");
  const [floorFilter, setFloorFilter] = useState<string | "all">("all");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return floors
      .filter((f) => floorFilter === "all" || f.id === floorFilter)
      .map((f) => {
        const stores = f.stores.filter((s) => {
          if (!query) return true;
          return (
            s.name.toLowerCase().includes(query) ||
            s.subcategory.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query) ||
            f.title.toLowerCase().includes(query)
          );
        });
        return { floor: f, stores };
      })
      .filter((r) => r.stores.length > 0 || !query);
  }, [floors, q, floorFilter]);

  return (
    <OrvaShell>
      <PageHero
        kicker="Mall map · pages"
        title="Directory"
        lead="Find every boutique as a normal page — then open it from the floor journey."
        image={landingHeroImage()}
        actions={
          <>
            <Link href="/food" className="ghost">
              Food Court
            </Link>
            <Link href="/floors" className="ghost">
              Mall floors
            </Link>
            <Link href="/shop" className="ghost">
              Shop all
            </Link>
          </>
        }
      />
      <AtmosphereBand items={[config.brandName, "Directory", "Floors", "Food Court", "Shop"]} />

      <section className="orva-land-block">
        <SectionHead eyebrow="Find" title="Every boutique" />
        <div className="dir-tools">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${config.brandName} boutiques…`}
          />
          <div className="dest-cats">
            <button
              type="button"
              className={floorFilter === "all" ? "on" : ""}
              onClick={() => setFloorFilter("all")}
            >
              All floors
            </button>
            {floors.map((f) => (
              <button
                type="button"
                key={f.id}
                className={floorFilter === f.id ? "on" : ""}
                onClick={() => setFloorFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {rows.map(({ floor, stores }) => (
          <div key={floor.id} className="dir-floor-block">
            <header>
              <h2>
                Floor {floor.label} · {floor.title}
              </h2>
              <Link href={`/floors/${floorSlug(floor)}`}>Open floor →</Link>
            </header>
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
                    <strong>{s.name}</strong>
                    <small>{s.subcategory}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </OrvaShell>
  );
}
