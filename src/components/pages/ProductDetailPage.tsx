"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import {
  CommerceTrustRow,
  ProductQA,
  SizeGuide,
} from "@/components/commerce/ProductExtras";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { SectionHead } from "@/components/shell/SectionHead";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StockPill } from "@/components/ui/StockPill";
import { findProductBySlug, mediaForColor, relatedProducts, storeById, storeHref } from "@/lib/catalog";
import { useMallStore } from "@/store/useMallStore";

export function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug ?? "");
  const { floors, config } = useCatalog();
  const product = findProductBySlug(slug, floors);
  const storeMeta = product ? storeById(product.storeId, floors) : null;
  const addToBag = useMallStore((s) => s.addToBag);
  const toggleWishlist = useMallStore((s) => s.toggleWishlist);
  const isWishlisted = useMallStore((s) => s.isWishlisted);
  const pushRecent = useMallStore((s) => s.pushRecent);
  const toggleCompare = useMallStore((s) => s.toggleCompare);
  const compare = useMallStore((s) => s.compare);

  const gallery = useMemo(
    () => (product?.gallery?.length ? product.gallery : product ? [product.image] : []),
    [product],
  );
  const [shot, setShot] = useState(0);
  const [size, setSize] = useState("One size");
  const [color, setColor] = useState("Default");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
    pushRecent(product);
    setSize(product.sizes[0] ?? "One size");
    setColor(product.colors[0] ?? "Default");
    setShot(0);
  }, [product, pushRecent]);

  useEffect(() => {
    if (!product) return;
    const idx = Math.max(0, product.colors.indexOf(color));
    if (gallery.length) setShot(idx % gallery.length);
  }, [color, gallery.length, product]);

  if (!product) {
    return (
      <OrvaShell>
        <section className="page-hero">
          <h1>Product not found</h1>
          <Link href="/shop">Back to shop</Link>
        </section>
      </OrvaShell>
    );
  }

  const soldOut = product.stock != null && product.stock <= 0;
  const related = relatedProducts(product, 4, floors);
  const activeSrc = mediaForColor(product, color);
  const opts = { size, color, qty };

  return (
    <OrvaShell>
      <AtmosphereBand
        items={[
          product.name,
          product.category,
          storeMeta?.store.name ?? config.brandName,
          "Quick look",
          "Buy now",
        ]}
      />
      <section className="pdp-page orva-pdp-themed">
        <div className="pdp-media">
          <div className="pdp-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeSrc} alt={product.name} />
            <ProductBadges badges={product.badges} />
            {gallery.length > 1 && (
              <div className="pp-thumbs">
                {gallery.map((src, i) => (
                  <button
                    type="button"
                    key={src + i}
                    className={shot === i ? "on" : ""}
                    onClick={() => setShot(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pdp-info">
          <p className="home-kicker">
            {storeMeta ? (
              <Link href={storeHref(storeMeta.store)}>
                Floor {storeMeta.floorLabel} · {storeMeta.store.name}
              </Link>
            ) : (
              config.brandName
            )}
          </p>
          <h1>{product.name}</h1>
          <div className="pp-meta-row">
            <p className="pp-rating">
              ★ {product.rating.toFixed(1)}
              {product.reviewCount ? ` · ${product.reviewCount} reviews` : ""}
            </p>
            <StockPill stock={product.stock} />
          </div>
          <CommerceTrustRow />
          <p className="pp-copy">{product.description}</p>
          <ProductPrice
            product={product}
            currency={config.currency}
            locale={config.locale}
            size="lg"
          />

          <div className="pp-pick">
            <p>Color</p>
            <div className="pp-pills">
              {product.colors.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={color === c ? "on" : ""}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="pp-pick">
            <p>Size</p>
            <div className="pp-pills">
              {product.sizes.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={size === s ? "on" : ""}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {!soldOut && (
            <div className="pp-pick">
              <p>Qty</p>
              <div className="qty-row">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <em>{qty}</em>
                <button type="button" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
            </div>
          )}

          <div className="pp-actions">
            <button
              type="button"
              className="primary"
              disabled={soldOut}
              onClick={() => {
                addToBag(product, opts);
                router.push("/checkout");
              }}
            >
              {soldOut ? "Sold out" : "Buy now"}
            </button>
            <button type="button" disabled={soldOut} onClick={() => addToBag(product, opts)}>
              Add to cart
            </button>
            <button
              type="button"
              className={isWishlisted(product.id) ? "wish on" : "wish"}
              onClick={() => toggleWishlist(product)}
            >
              {isWishlisted(product.id) ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              className={compare.some((x) => x.id === product.id) ? "on" : ""}
              onClick={() => toggleCompare(product)}
            >
              Compare
            </button>
          </div>

          <div className="pp-realtime">
            <span className="pp-live-dot" />
            Live catalog · color updates 3D / photos instantly
          </div>

          <div className="pp-accordion">
            <SizeGuide product={product} />
            <ProductQA />
          </div>
        </div>
      </section>

      <div className="pdp-sticky-buy">
        <div>
          <strong>{product.name}</strong>
          <ProductPrice
            product={product}
            currency={config.currency}
            locale={config.locale}
            size="sm"
          />
        </div>
        <button
          type="button"
          className="primary"
          disabled={soldOut}
          onClick={() => {
            addToBag(product, opts);
            router.push("/checkout");
          }}
        >
          {soldOut ? "Sold out" : "Buy now"}
        </button>
        <button type="button" disabled={soldOut} onClick={() => addToBag(product, opts)}>
          Add
        </button>
      </div>

      {related.length > 0 && (
        <section className="orva-land-block">
          <SectionHead eyebrow="More" title="You may also like" />
          <div className="pc3d-grid">
            {related.map((p) => (
              <ProductCard3D
                key={p.id}
                product={p}
                currency={config.currency}
                locale={config.locale}
                onBuyNow={() => router.push("/checkout")}
              />
            ))}
          </div>
        </section>
      )}
    </OrvaShell>
  );
}
