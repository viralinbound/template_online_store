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
import { findStoreBySlug } from "@/lib/catalog";
import { landingHeroImage } from "@/lib/images";
import { doorLayoutId, revealTransition, revealUp } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

export function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reduce = useReducedMotion();
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

  const { store } = hit;

  return (
    <OrvaShell>
      <PageHero
        kicker={store.subcategory}
        title={store.name}
        lead={store.description ?? `${store.products.length} products from this brand.`}
        image={store.doorImage}
        layoutId={doorLayoutId(store.id)}
        size="tall"
        actions={
          <>
            <a href="#shelf-walk" className="primary">
              Browse collection
            </a>
            <Link href="/shop" className="ghost">
              Full shop
            </Link>
            <Link href="/directory" className="ghost">
              All brands
            </Link>
          </>
        }
      />
      <AtmosphereBand items={[store.name, store.subcategory, store.category, config.brandName]} />

      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={revealUp}
        transition={{ ...revealTransition, delay: 0.05 }}
      >
        <Showroom3D
          products={store.products}
          currency={config.currency}
          locale={config.locale}
          accent={store.theme.accent}
          eyebrow={`${store.name} · showroom`}
          title="Scroll pieces in 3D"
          onBuyNow={() => router.push("/checkout")}
        />
      </motion.div>

      <motion.div
        id="shelf-walk"
        className="orva-land-block"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={revealUp}
        transition={{ ...revealTransition, delay: 0.08 }}
      >
        <BoutiqueShelfWalk
          store={store}
          currency={config.currency}
          locale={config.locale}
          onBuyNow={() => router.push("/checkout")}
        />
      </motion.div>

      <section className="orva-land-block">
        <SectionHead
          eyebrow="Collection"
          title={`${store.products.length} items · tilt · color · quick look`}
        />
        <div className="pc3d-grid">
          {store.products.map((p) => (
            <ProductCard3D
              key={p.id}
              product={p}
              currency={config.currency}
              locale={config.locale}
              accent={store.theme.accent}
              variant="light"
              staticCard
              onBuyNow={() => router.push("/checkout")}
            />
          ))}
        </div>
      </section>
    </OrvaShell>
  );
}
