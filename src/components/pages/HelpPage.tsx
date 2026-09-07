"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { EXPERIENCE_ROADMAP, HELP_SECTIONS } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";

export function HelpPage() {
  const { config } = useCatalog();
  const params = useSearchParams();
  const section = params.get("section");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!section) return;
    refs.current[section]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [section]);

  return (
    <OrvaShell>
      <PageHero
        kicker="Support"
        title="Help center"
        lead={`Shipping, returns, FAQs, and what’s next for the ${config.brandName} demo.`}
        image={landingHeroImage()}
        actions={
          <>
            <Link href="/orders" className="ghost">
              Track orders
            </Link>
            <Link href="/food" className="ghost">
              Food Court
            </Link>
            <Link href="/shop" className="ghost">
              Back to shop
            </Link>
          </>
        }
      />
      <AtmosphereBand items={["Help", "Shipping", "Returns", "What’s next", config.brandName]} />

      <section className="orva-land-block help-page">
        <SectionHead eyebrow="Guides" title="Everything you need" />
        <nav className="help-toc">
          {HELP_SECTIONS.map((s) => (
            <Link key={s.id} href={`/help?section=${s.id}`}>
              {s.title}
            </Link>
          ))}
        </nav>
        {HELP_SECTIONS.map((s) => (
          <article
            key={s.id}
            id={s.id}
            ref={(el) => {
              refs.current[s.id] = el;
            }}
            className="help-section"
          >
            <h2>{s.title}</h2>
            <ul>
              {s.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="orva-land-block">
        <SectionHead eyebrow="Roadmap" title="Experience ideas" />
        <div className="orva-idea-grid">
          {EXPERIENCE_ROADMAP.map((idea) => (
            <article key={idea.title} className="orva-idea-card">
              <strong>{idea.title}</strong>
              <p>{idea.body}</p>
            </article>
          ))}
        </div>
      </section>
    </OrvaShell>
  );
}
