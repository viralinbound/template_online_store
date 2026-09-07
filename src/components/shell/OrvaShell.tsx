"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { CartToast } from "@/components/commerce/CartToast";
import { CartNudge, CompareTray } from "@/components/commerce/ShoppingChrome";
import { MallFooter } from "@/components/MallFooter";
import { BagFly } from "@/components/commerce/BagFly";
import { AuthModal } from "@/components/auth/AuthModal";
import { AmbientField } from "@/components/shell/AmbientField";
import { OrderEaseDock } from "@/components/shell/OrderEaseDock";
import { OrvaStudioHeader } from "@/components/shell/OrvaStudioHeader";
import { PageMotion } from "@/components/shell/PageMotion";
import { productHref } from "@/lib/catalog";
import { useMallStore } from "@/store/useMallStore";

export function OrvaShell({ children, bare = false }: { children: ReactNode; bare?: boolean }) {
  const router = useRouter();
  const { config } = useCatalog();
  const bagCount = useMallStore((s) => s.bagCount);
  const compare = useMallStore((s) => s.compare);
  const setShowCompare = useMallStore((s) => s.setShowCompare);
  const session = useMallStore((s) => s.session);
  const setShowAuth = useMallStore((s) => s.setShowAuth);
  const logout = useMallStore((s) => s.logout);
  const setShowBag = useMallStore((s) => s.setShowBag);
  const setCheckout = useMallStore((s) => s.setCheckout);
  const cartToast = useMallStore((s) => s.cartToast);
  const [hydrated, setHydrated] = useState(false);
  const [bagPulse, setBagPulse] = useState(false);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!cartToast) return;
    setBagPulse(true);
    const t = window.setTimeout(() => setBagPulse(false), 650);
    return () => window.clearTimeout(t);
  }, [cartToast]);

  const count = hydrated ? bagCount() : 0;
  const compareCount = hydrated ? compare.length : 0;

  if (bare) {
    return (
      <>
        {children}
        <AuthModal />
        <CartToast onOpenBag={() => router.push("/cart")} onCheckout={() => router.push("/checkout")} />
        <CartNudge />
      </>
    );
  }

  return (
    <div
      className="orva-site orva-site-themed orva-illoca orva-lumen orva-studio"
      style={
        {
          ["--brand" as string]: config.theme?.brand,
          ["--brand-deep" as string]: config.theme?.brandDeep || config.theme?.brand,
          ["--accent" as string]: config.theme?.accent,
          ["--accent-2" as string]: config.theme?.accent2,
          ["--bg" as string]: config.theme?.bg,
          ["--ink" as string]: config.theme?.ink,
        } as CSSProperties
      }
    >
      <AmbientField variant="site" />

      <OrvaStudioHeader
        brand={config.brandName}
        logoUrl={config.logoUrl}
        bagCount={count}
        bagPulse={bagPulse}
        compareCount={compareCount}
        sessionName={hydrated && session ? session.name.split(" ")[0] : null}
        isAdmin={hydrated && session?.role === "admin"}
        onCompare={() => setShowCompare(true)}
        onSignIn={() => setShowAuth(true, "login")}
        onSignOut={() => logout()}
      />

      <main className="orva-main orva-main-themed orva-studio-main">
        <PageMotion>{children}</PageMotion>
      </main>

      <MallFooter
        onShop={() => router.push("/shop")}
        onExplore={() => router.push("/shop")}
        onDirectory={() => router.push("/directory")}
        onHelp={(section) => router.push(section ? `/help?section=${section}` : "/help")}
        onOrders={() => router.push("/orders")}
        onAdmin={() => router.push("/admin")}
      />

      <CompareTray onOpen={(p) => router.push(productHref(p))} onBuyNow={() => router.push("/checkout")} />
      <BagFly />
      <AuthModal />
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
      <OrderEaseDock />
    </div>
  );
}
