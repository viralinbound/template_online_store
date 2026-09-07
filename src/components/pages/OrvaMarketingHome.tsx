"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  HoverLift,
  Magnetic,
  MotionCTA,
  RevealCard,
  Stagger,
  StaggerItem,
} from "@/components/motion/MotionKit";
import { ScrollSection3D, ScrollStage3D } from "@/components/motion/ScrollStage3D";
import { BoutiqueDoorCorridor } from "@/components/shop/BoutiqueDoorCorridor";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { OrbitStage } from "@/components/shop/OrbitStage";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { ExpectBand } from "@/components/shell/ExpectBand";
import { SpotlightReel } from "@/components/shell/SpotlightReel";
import { StudioCinematicHero } from "@/components/shell/StudioCinematicHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { DepthRunway } from "@/components/shop/DepthRunway";
import { MallEcommercePlaza } from "@/components/mall/MallEcommercePlaza";
import { TrustBar } from "@/components/ui/TrustBar";
import { CUSTOMER_PROMISES, HOW_IT_WORKS, LANDING_CHIPS } from "@/lib/catalog";
import type { MallFloor, MallSiteConfig, Product, StoreNode } from "@/types/mall";

export type LandingFloor = {
  label: string;
  title: string;
  categoryName: string;
  hero: string;
  storeCount?: number;
};

type Props = {
  config: MallSiteConfig;
  floors: LandingFloor[];
  mallFloors?: MallFloor[];
  boutiques: StoreNode[];
  picks: Product[];
  foodPicks?: Product[];
  foodStores?: StoreNode[];
  loading?: boolean;
  nestInShell?: boolean;
  topBar?: ReactNode;
  onShop: (category?: string) => void;
  onDirectory: () => void;
  onFood?: () => void;
  onMall?: () => void;
  onOpenStore?: (store: StoreNode) => void;
  onBuyNow?: (p: Product) => void;
  footer?: ReactNode;
};

/** Shop-first ecommerce home — browse → look → bag → checkout */
export function OrvaMarketingHome({
  config,
  floors,
  mallFloors,
  boutiques,
  picks,
  foodPicks = [],
  foodStores = [],
  loading,
  nestInShell = false,
  topBar,
  onShop,
  onDirectory,
  onFood,
  onMall,
  onOpenStore,
  onBuyNow,
  footer,
}: Props) {
  const marquee = useMemo(
    () => [
      config.brandName,
      "Shop catalog",
      "Quick look",
      "Food",
      "Guest checkout",
      ...config.trustPoints.slice(0, 3),
    ],
    [config],
  );

  const spotlights = useMemo(
    () => [
      {
        id: "fashion",
        eyebrow: "Fashion lane",
        title: "Style that moves with you",
        body: "Runway edits, quick look color swaps, and buy without leaving the grid.",
        image: floors[0]?.hero || picks[0]?.image || "",
        cta: "Shop fashion",
        onCta: () => onShop("fashion"),
      },
      {
        id: "tech",
        eyebrow: "Tech pavilion",
        title: "Gear worth opening",
        body: "Electronics and gaming with the same bag, coupons, and guest checkout.",
        image: floors[1]?.hero || picks[1]?.image || "",
        cta: "Shop tech",
        onCta: () => onShop("electronics"),
      },
      {
        id: "mall",
        eyebrow: "Virtual mall",
        title: "Walk floors. Buy pieces.",
        body: "Atrium to boutique to product — cinema energy, real ecommerce flow.",
        image: floors[2]?.hero || mallFloors?.[0]?.heroImage || picks[2]?.image || "",
        cta: "Enter mall",
        onCta: () => (onMall ?? onDirectory)(),
      },
      {
        id: "food",
        eyebrow: "Café court",
        title: "Heat, sweets, same checkout",
        body: "Food sits in one bag with fashion — no second cart, no friction.",
        image: foodPicks[0]?.image || floors[0]?.hero || "",
        cta: "Shop food",
        onCta: () => (onFood ?? (() => onShop("food")))(),
      },
    ].filter((s) => s.image),
    [config.brandName, floors, foodPicks, mallFloors, onDirectory, onFood, onMall, onShop, picks],
  );

  return (
    <ScrollStage3D lite className={`orva-land dense lumen-home studio-pro${nestInShell ? " nested full-bleed" : ""}`}>
      {!nestInShell && topBar}

      <ScrollSection3D lite className="scroll-hero-slot">
        <StudioCinematicHero
          brand={config.brandName}
          tagline={config.tagline}
          lead="A high-tech storefront built to catch the eye — browse, look, bag, checkout in one cinematic flow."
          heroProductImage={picks[0]?.image}
          onScrollCue={() => onShop()}
          onMall={onMall ?? onDirectory}
          onShop={() => onShop()}
          onFood={onFood ?? (() => onShop("food"))}
          actions={
            <motion.div
              className="orva-land-cta studio-cine-cta"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.55 }}
            >
              <TrustBar points={config.trustPoints} />
              <Magnetic>
                <MotionCTA pulse>
                  <a href="/shop" className="primary">
                    Start shopping
                  </a>
                </MotionCTA>
              </Magnetic>
            </motion.div>
          }
          chips={
            <Stagger className="orva-land-chips studio-cine-chips" delay={0.5}>
              {LANDING_CHIPS.map((c) => (
                <StaggerItem key={c.label}>
                  <button type="button" onClick={() => onShop(c.category)}>
                    {c.label}
                  </button>
                </StaggerItem>
              ))}
              {loading && <p className="orva-land-sync">Syncing catalog…</p>}
            </Stagger>
          }
        />
      </ScrollSection3D>

      <ExpectBand brand={config.brandName} />

      {spotlights.length > 0 && (
        <ScrollSection3D lite>
          <div className="orva-land-block tight spot-wrap">
            <SpotlightReel slides={spotlights} />
          </div>
        </ScrollSection3D>
      )}

      <AtmosphereBand items={marquee} />

      <ScrollSection3D lite>
        <div className="orva-land-block tight">
          <DepthRunway onShop={onShop} onFood={onFood} />
        </div>
      </ScrollSection3D>

      {mallFloors && mallFloors.length > 0 && (
        <ScrollSection3D lite>
          <div className="orva-land-block">
            <MallEcommercePlaza floors={mallFloors} brand={config.brandName} compact />
          </div>
        </ScrollSection3D>
      )}

      <ScrollSection3D lite>
        <div className="orva-land-block">
          <OrbitStage
            products={picks}
            currency={config.currency}
            locale={config.locale}
            eyebrow="Featured"
            title="Start with the pieces"
            onBuyNow={onBuyNow}
          />
        </div>
      </ScrollSection3D>

      <ScrollSection3D lite>
        <section className="orva-land-block tight workflow-band">
          <SectionHead eyebrow="Workflow" title="Browse → look → bag → checkout" />
          <div className="workflow-steps">
            {[
              { n: "01", t: "Shop", d: "Filter the catalog by category and price" },
              { n: "02", t: "Look", d: "Quick look · color · compare" },
              { n: "03", t: "Bag", d: "Add pieces and keep shopping" },
              { n: "04", t: "Checkout", d: "Guest pay, coupons, order tracking" },
            ].map((s, i) => (
              <RevealCard key={s.n} delay={i * 0.07}>
                <HoverLift>
                  <article className="workflow-step">
                    <em>{s.n}</em>
                    <strong>{s.t}</strong>
                    <p>{s.d}</p>
                  </article>
                </HoverLift>
              </RevealCard>
            ))}
          </div>
        </section>
      </ScrollSection3D>

      <ScrollSection3D lite>
        <section className="orva-land-block tight">
          <div className="orva-how-inline">
            {HOW_IT_WORKS.map((item, i) => (
              <RevealCard key={item.step} delay={i * 0.08}>
                <HoverLift>
                  <article className="orva-how-pill">
                    <em>{item.step}</em>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </article>
                </HoverLift>
              </RevealCard>
            ))}
          </div>
        </section>
      </ScrollSection3D>

      <ScrollSection3D lite>
        <section className="orva-land-block tight">
          <SectionHead
            eyebrow="Today’s edit"
            title="Pieces worth opening"
            action={
              <MotionCTA>
                <button type="button" className="orva-land-link" onClick={() => onShop()}>
                  Full shop →
                </button>
              </MotionCTA>
            }
          />
          <div className="pc3d-grid dense-grid">
            {picks.slice(0, 6).map((p) => (
              <ProductCard3D
                key={p.id}
                product={p}
                currency={config.currency}
                locale={config.locale}
                staticCard
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        </section>
      </ScrollSection3D>

      <ScrollSection3D lite>
        <section className="orva-land-block tight">
          <SectionHead eyebrow="Why here" title={`Why ${config.brandName}`} />
          <div className="orva-land-promises dense-promises">
            {CUSTOMER_PROMISES.map((item, i) => (
              <RevealCard key={item.title} delay={i * 0.06}>
                <HoverLift>
                  <article className="orva-land-promise">
                    <em>{String(i + 1).padStart(2, "0")}</em>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </article>
                </HoverLift>
              </RevealCard>
            ))}
          </div>
        </section>
      </ScrollSection3D>

      <ScrollSection3D lite>
        <section className="orva-land-block tight">
          <BoutiqueDoorCorridor
            stores={boutiques.slice(0, 8)}
            variant="light"
            eyebrow="Brands"
            title="Featured brands"
            action={
              <MotionCTA>
                <button type="button" className="orva-land-link" onClick={onDirectory}>
                  All brands →
                </button>
              </MotionCTA>
            }
            onEnterStore={(s) => (onOpenStore ? onOpenStore(s) : onDirectory())}
          />
        </section>
      </ScrollSection3D>

      <ScrollSection3D lite>
        <section className="orva-land-finale compact-finale lumen-finale">
          <p className="orva-land-eyebrow">Demo checkout</p>
          <h2>
            Use <em>ORVA10</em> · 10% off
          </h2>
          <p>One bag across shop and food — guest checkout, no real charges.</p>
          <div className="orva-land-cta">
            <Magnetic>
              <MotionCTA pulse>
                <button type="button" className="primary" onClick={() => onShop()}>
                  Shop the edit
                </button>
              </MotionCTA>
            </Magnetic>
            <MotionCTA>
              <button type="button" className="ghost" onClick={onDirectory}>
                Browse brands
              </button>
            </MotionCTA>
          </div>
        </section>
      </ScrollSection3D>

      {footer}
    </ScrollStage3D>
  );
}
