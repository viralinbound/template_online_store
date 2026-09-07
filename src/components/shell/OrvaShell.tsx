"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { CartToast } from "@/components/commerce/CartToast";
import { CartNudge, CompareTray } from "@/components/commerce/ShoppingChrome";
import { MallFooter } from "@/components/MallFooter";
import { LiveSourceBadge } from "@/components/ui/LiveSourceBadge";
import { productHref } from "@/lib/catalog";
import { useMallStore } from "@/store/useMallStore";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/food", label: "Food" },
  { href: "/floors", label: "Mall" },
  { href: "/directory", label: "Directory" },
  { href: "/admin", label: "Admin" },
];

export function OrvaShell({ children, bare = false }: { children: ReactNode; bare?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useCatalog();
  const bagCount = useMallStore((s) => s.bagCount);
  const wishlist = useMallStore((s) => s.wishlist);
  const compare = useMallStore((s) => s.compare);
  const setShowCompare = useMallStore((s) => s.setShowCompare);
  const session = useMallStore((s) => s.session);
  const setShowBag = useMallStore((s) => s.setShowBag);
  const setCheckout = useMallStore((s) => s.setCheckout);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  const count = hydrated ? bagCount() : 0;
  const compareCount = hydrated ? compare.length : 0;

  if (bare) {
    return (
      <>
        {children}
        <CartToast
          onOpenBag={() => router.push("/cart")}
          onCheckout={() => router.push("/checkout")}
        />
        <CartNudge />
      </>
    );
  }

  return (
    <div className="orva-site orva-site-themed">
      <header className="orva-top orva-top-rich">
        <Link href="/" className="orva-brand">
          <strong>{config.brandName}</strong>
          <span>{config.tagline}</span>
        </Link>
        <nav className="orva-nav" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname?.startsWith(item.href) ? "on" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="orva-top-actions">
          <LiveSourceBadge />
          <Link href="/search">Search</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/help">Help</Link>
          {session ? (
            <span className="orva-user">{session.name.split(" ")[0]}</span>
          ) : (
            <Link href="/checkout">Join / Guest</Link>
          )}
          <Link href="/cart" className="orva-cart-link">
            Cart {count}
            {wishlist.length ? ` · ♥${wishlist.length}` : ""}
          </Link>
          {compareCount > 0 && (
            <button
              type="button"
              className="orva-compare-btn"
              onClick={() => setShowCompare(true)}
            >
              Compare {compareCount}
            </button>
          )}
        </div>
      </header>

      <main className="orva-main orva-main-themed">{children}</main>

      <MallFooter
        onShop={() => router.push("/shop")}
        onExplore={() => router.push("/floors")}
        onDirectory={() => router.push("/directory")}
        onHelp={(section) =>
          router.push(section ? `/help?section=${section}` : "/help")
        }
      />

      <CompareTray
        onOpen={(p) => router.push(productHref(p))}
        onBuyNow={() => router.push("/checkout")}
      />

      <CartToast
        onOpenBag={() => {
          setShowBag(false);
          router.push("/cart");
        }}
        onCheckout={() => {
          setCheckout(false);
          router.push("/checkout");
        }}
      />
      <CartNudge />
    </div>
  );
}
