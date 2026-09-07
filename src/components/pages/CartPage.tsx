"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { ReferralBanner } from "@/components/commerce/ShoppingChrome";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { ProductCard3D } from "@/components/shop/ProductCard3D";
import { productHref, suggestProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { landingHeroImage } from "@/lib/images";
import { LOCAL_COUPONS, useMallStore } from "@/store/useMallStore";

export function CartPage() {
  const { floors, config } = useCatalog();
  const router = useRouter();
  const bag = useMallStore((s) => s.bag);
  const setQty = useMallStore((s) => s.setQty);
  const removeFromBag = useMallStore((s) => s.removeFromBag);
  const bagSubtotal = useMallStore((s) => s.bagSubtotal);
  const bagDiscount = useMallStore((s) => s.bagDiscount);
  const bagTotal = useMallStore((s) => s.bagTotal);
  const couponCode = useMallStore((s) => s.couponCode);
  const couponError = useMallStore((s) => s.couponError);
  const applyCoupon = useMallStore((s) => s.applyCoupon);
  const clearCoupon = useMallStore((s) => s.clearCoupon);
  const session = useMallStore((s) => s.session);
  const [hydrated, setHydrated] = useState(false);
  const [couponDraft, setCouponDraft] = useState("");

  useEffect(() => setHydrated(true), []);

  const money = (n: number) => formatMoney(n, config.currency, config.locale);
  const suggestions = suggestProducts(
    4,
    bag.map((b) => b.product.id),
    floors,
  );
  const subtotal = hydrated ? bagSubtotal() : 0;
  const discount = hydrated ? bagDiscount() : 0;
  const total = hydrated ? bagTotal() : 0;

  return (
    <OrvaShell>
      <PageHero
        kicker="Bag"
        title="Your cart"
        lead={hydrated ? `${bag.length} line${bag.length === 1 ? "" : "s"} ready for checkout` : "Loading…"}
        image={bag[0]?.product.image ?? landingHeroImage()}
        actions={
          <>
            <Link href="/shop" className="ghost">
              Keep shopping
            </Link>
            <Link href="/food" className="ghost">
              Food Court
            </Link>
          </>
        }
      />
      <AtmosphereBand items={["Cart", "ORVA10", "Guest checkout", config.brandName]} />

      <section className="orva-land-block cart-page">
        <SectionHead eyebrow="Bag" title="Review & go" />
        {!hydrated ? (
          <p className="muted">Loading cart…</p>
        ) : bag.length === 0 ? (
          <>
            <p className="muted">Your cart is empty — pick something you like.</p>
            <div className="pc3d-grid">
              {suggestions.map((p) => (
                <ProductCard3D
                  key={p.id}
                  product={p}
                  currency={config.currency}
                  locale={config.locale}
                  onBuyNow={() => router.push("/checkout")}
                />
              ))}
            </div>
            <Link href="/shop" className="primary inline-cta">
              Browse shop
            </Link>
          </>
        ) : (
          <>
            <div className="cart-lines">
              {bag.map((line) => (
                <div key={line.key} className="bag-line bag-line-rich">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Link href={productHref(line.product)}>
                    <img src={line.product.image} alt={line.product.name} />
                  </Link>
                  <div className="bag-line-info">
                    <Link href={productHref(line.product)}>
                      <span>{line.product.name}</span>
                    </Link>
                    <small>
                      {line.color} · {line.size}
                    </small>
                    <div className="qty-row">
                      <button type="button" onClick={() => setQty(line.key, line.qty - 1)}>
                        −
                      </button>
                      <em>{line.qty}</em>
                      <button type="button" onClick={() => setQty(line.key, line.qty + 1)}>
                        +
                      </button>
                      <button
                        type="button"
                        className="linkish"
                        onClick={() => removeFromBag(line.key)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span>{money(line.product.price * line.qty)}</span>
                </div>
              ))}
            </div>

            <div className="coupon-row">
              <input
                value={couponDraft}
                onChange={(e) => setCouponDraft(e.target.value)}
                placeholder="Coupon · ORVA10"
              />
              <button type="button" onClick={() => applyCoupon(couponDraft)}>
                Apply
              </button>
              {couponCode && (
                <button type="button" className="linkish" onClick={clearCoupon}>
                  Clear {couponCode}
                </button>
              )}
            </div>
            {couponError && <p className="auth-err">{couponError}</p>}
            {couponCode && LOCAL_COUPONS[couponCode] && (
              <p className="muted">
                Applied {couponCode} — {LOCAL_COUPONS[couponCode].label}
              </p>
            )}
            <p className="muted">Subtotal {money(subtotal)}</p>
            {discount > 0 && <p className="muted">Discount −{money(discount)}</p>}
            <p className="price">Total {money(total)}</p>
            <ReferralBanner onApply={() => applyCoupon("ORVAFRIEND")} />

            <div className="home-cta">
              <button
                type="button"
                className="primary"
                onClick={() => {
                  if (!session && !config.featureFlags.guestCheckout) {
                    router.push("/checkout");
                    return;
                  }
                  router.push("/checkout");
                }}
              >
                {session || config.featureFlags.guestCheckout
                  ? "Proceed to checkout"
                  : "Sign in to checkout"}
              </button>
              <Link href="/shop" className="ghost">
                Keep shopping
              </Link>
            </div>
          </>
        )}
      </section>
    </OrvaShell>
  );
}
