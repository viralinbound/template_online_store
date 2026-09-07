"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
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

  const go = (href: string) => {
    if (pathname === href) return;
    router.push(href);
  };

  return (
    <AdminAuthGate>
      <div className="admin-app">
        <aside className="admin-side">
          <button type="button" className="admin-side-brand" onClick={() => go("/admin")}>
            <strong>{config.brandName}</strong>
            <span>Admin panel</span>
          </button>
          <nav aria-label="Admin sections">
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
          <div className="admin-side-user">
            <strong>{session?.name ?? "Admin"}</strong>
            <span>{session?.email}</span>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/admin");
              }}
            >
              Sign out
            </button>
          </div>
          <Link href="/" className="admin-side-out">
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
          </header>
          {children}
        </div>
      </div>
    </AdminAuthGate>
  );
}
