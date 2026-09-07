"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCatalog } from "@/components/CatalogProvider";

const LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/activity", label: "Activity" },
  { href: "/admin/connect", label: "Connect" },
];

export function AdminShell({ children, title, lead }: { children: ReactNode; title: string; lead?: string }) {
  const pathname = usePathname();
  const { config } = useCatalog();

  return (
    <div className="admin-app">
      <aside className="admin-side">
        <Link href="/admin" className="admin-side-brand">
          <strong>{config.brandName}</strong>
          <span>Admin</span>
        </Link>
        <nav>
          {LINKS.map((l) => {
            const on = l.exact ? pathname === l.href : pathname?.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={on ? "on" : ""}>
                {l.label}
              </Link>
            );
          })}
        </nav>
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
  );
}
