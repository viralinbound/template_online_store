"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMallStore } from "@/store/useMallStore";
import { formatMoney } from "@/lib/money";
import { useCatalogOptional } from "@/components/CatalogProvider";
import { ProductSpin3D } from "@/components/commerce/ProductSpin3D";

/** Reminds shoppers about items left in cart — local demo, no SMS */
export function CartNudge() {
  const router = useRouter();
  const bag = useMallStore((s) => s.bag);
  const cartNudgeAt = useMallStore((s) => s.cartNudgeAt);
  const showBag = useMallStore((s) => s.showBag);
  const checkout = useMallStore((s) => s.checkout);
  const dismissCartNudge = useMallStore((s) => s.dismissCartNudge);
  const bagTotal = useMallStore((s) => s.bagTotal);
  const catalog = useCatalogOptional();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!cartNudgeAt || !bag.length || showBag || checkout) {
      setVisible(false);
      return;
    }
    const delay = Math.max(0, cartNudgeAt - Date.now());
    const t = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(t);
  }, [cartNudgeAt, bag.length, showBag, checkout]);

  if (!visible || !bag.length) return null;
  const currency = catalog?.config.currency ?? "INR";
  const locale = catalog?.config.locale ?? "en-IN";

  return (
    <div className="orva-nudge" role="status">
      <div>
        <strong>Still thinking it over?</strong>
        <p>
          {bag.length} item{bag.length > 1 ? "s" : ""} in your bag ·{" "}
          {formatMoney(bagTotal(), currency, locale)}
        </p>
      </div>
      <button
        type="button"
        className="primary"
        onClick={() => {
          dismissCartNudge();
          router.push("/cart");
        }}
      >
        Resume checkout
      </button>
      <button type="button" className="ghost-light" onClick={dismissCartNudge}>
        Dismiss
      </button>
    </div>
  );
}

export function MobileStickyBag({ onShop }: { onShop?: () => void }) {
  const count = useMallStore((s) => s.bagCount);
  const total = useMallStore((s) => s.bagTotal);
  const setShowBag = useMallStore((s) => s.setShowBag);
  const showBag = useMallStore((s) => s.showBag);
  const checkout = useMallStore((s) => s.checkout);
  const catalog = useCatalogOptional();
  const n = count();
  if (!n || showBag || checkout) return null;

  return (
    <div className="orva-sticky-bag">
      {onShop && (
        <button type="button" className="ghost-light" onClick={onShop}>
          Shop
        </button>
      )}
      <button type="button" className="primary" onClick={() => setShowBag(true)}>
        Bag ({n}) · {formatMoney(total(), catalog?.config.currency ?? "INR", catalog?.config.locale)}
      </button>
    </div>
  );
}

export function CompareTray({
  onOpen,
  onBuyNow,
}: {
  onOpen: (p: import("@/types/mall").Product) => void;
  onBuyNow?: (p: import("@/types/mall").Product) => void;
}) {
  const compare = useMallStore((s) => s.compare);
  const showCompare = useMallStore((s) => s.showCompare);
  const clearCompare = useMallStore((s) => s.clearCompare);
  const toggleCompare = useMallStore((s) => s.toggleCompare);
  const setShowCompare = useMallStore((s) => s.setShowCompare);
  const addToBag = useMallStore((s) => s.addToBag);
  const catalog = useCatalogOptional();
  const [spinId, setSpinId] = useState<string | null>(null);

  if (!showCompare || compare.length === 0) return null;

  return (
    <div className="orva-compare orva-compare-3d">
      <header>
        <strong>Compare 3D ({compare.length}/3)</strong>
        <button type="button" onClick={() => setShowCompare(false)}>
          Hide
        </button>
        <button type="button" onClick={clearCompare}>
          Clear
        </button>
      </header>
      <div className="orva-compare-row">
        {compare.map((p) => {
          const spinning = spinId === p.id;
          return (
            <article key={p.id}>
              <div className="orva-compare-media">
                {spinning ? (
                  <ProductSpin3D
                    src={p.gallery?.[0] ?? p.image}
                    accent="#14999c"
                    compact
                    bare
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" />
                )}
                <button
                  type="button"
                  className="orva-compare-spin"
                  onClick={() => setSpinId(spinning ? null : p.id)}
                >
                  {spinning ? "Photo" : "Mini spin"}
                </button>
              </div>
              <strong>{p.name}</strong>
              <span>
                {formatMoney(p.price, catalog?.config.currency ?? p.currency, catalog?.config.locale)}
              </span>
              <small>
                ★ {p.rating.toFixed(1)}
                {p.colors[0] ? ` · ${p.colors[0]}` : ""}
              </small>
              <div>
                <button type="button" onClick={() => onOpen(p)}>
                  View
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    addToBag(p);
                    onBuyNow?.(p);
                  }}
                >
                  Buy
                </button>
                <button type="button" onClick={() => toggleCompare(p)}>
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function SkipToShop({ onShop }: { onShop: () => void }) {
  return (
    <button type="button" className="orva-skip-shop" onClick={onShop}>
      Skip to Shop
    </button>
  );
}

export function ReferralBanner({ onApply }: { onApply: () => void }) {
  return (
    <div className="orva-referral">
      <p>
        Invite friends with code <strong>ORVAFRIEND</strong> — both get demo savings.
      </p>
      <button type="button" onClick={onApply}>
        Apply referral
      </button>
    </div>
  );
}
