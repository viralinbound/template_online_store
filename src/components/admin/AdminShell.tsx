"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { AdminAuthGate } from "@/components/auth/AdminAuthGate";
import { useMallStore } from "@/store/useMallStore";

const LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/activity", label: "Activity" },
  { href: "/admin/connect", label: "Connect" },
];

export function AdminShell({ children, title, lead }: { children: ReactNode; title: string; lead?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useCatalog();
  const session = useMallStore((s) => s.session);
  const logout = useMallStore((s) => s.logout);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navOpen]);

  const go = (href: string) => {
    setNavOpen(false);
    if (pathname === href) return;
    router.push(href);
  };

  const signOut = () => {
    setNavOpen(false);
    logout();
    router.push("/admin");
  };

  const nav = (
    <nav className="admin-side-nav" aria-label="Admin sections">
      {LINKS.map((l) => {
        const on = l.exact ? pathname === l.href : pathname?.startsWith(l.href);
        return (
          <button
            key={l.href}
            type="button"
            className={on ? "on" : ""}
            aria-current={on ? "page" : undefined}
            onClick={() => go(l.href)}
          >
            {l.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <AdminAuthGate>
      <div className={`admin-app${navOpen ? " admin-nav-open" : ""}`}>
        <header className="admin-mobile-bar">
          <Link href="/" className="admin-mobile-brand" aria-label={`${config.brandName} storefront`}>
            <strong>{config.brandName}</strong>
            <span>Admin</span>
          </Link>
          <div className="admin-mobile-actions">
            <button type="button" className="admin-mobile-signout" onClick={signOut}>
              Sign out
            </button>
            <button
              type="button"
              className="admin-mobile-toggle"
              aria-expanded={navOpen}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              onClick={() => setNavOpen((v) => !v)}
            >
              <i />
              <i />
              <i />
            </button>
          </div>
        </header>

        {navOpen && (
          <button type="button" className="admin-mobile-scrim" aria-label="Close menu" onClick={() => setNavOpen(false)} />
        )}

        <aside className="admin-side">
          <Link href="/" className="admin-side-brand" aria-label={`${config.brandName} storefront`} onClick={() => setNavOpen(false)}>
            <strong>{config.brandName}</strong>
            <span>Admin panel · home</span>
          </Link>
          {nav}
          <div className="admin-side-user">
            <strong>{session?.name ?? "Admin"}</strong>
            <span>{session?.email}</span>
            <button type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
          <Link href="/" className="admin-side-out" onClick={() => setNavOpen(false)}>
            ← Storefront
          </Link>
        </aside>

        <div className="admin-main">
          <header className="admin-main-head">
            <div>
              <p className="orva-land-eyebrow">Control center</p>
              <h1>{title}</h1>
              {lead && <p className="muted">{lead}</p>}
            </div>
            <Link href="/" className="admin-main-storefront">
              Storefront →
            </Link>
          </header>
          <div className="admin-mobile-tabs" aria-label="Admin sections">
            {LINKS.map((l) => {
              const on = l.exact ? pathname === l.href : pathname?.startsWith(l.href);
              return (
                <button
                  key={l.href}
                  type="button"
                  className={on ? "on" : ""}
                  aria-current={on ? "page" : undefined}
                  onClick={() => go(l.href)}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
          {children}
        </div>
      </div>
    </AdminAuthGate>
  );
}
