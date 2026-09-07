"use client";

import { HELP_SECTIONS } from "@/lib/catalog";
import { useCatalogOptional } from "@/components/CatalogProvider";

type Props = {
  onShop: () => void;
  onExplore: () => void;
  onDirectory: () => void;
  onHelp: (section?: string) => void;
  onOrders?: () => void;
  onAdmin?: () => void;
};

export function MallFooter({
  onShop,
  onExplore,
  onDirectory,
  onHelp,
  onOrders,
  onAdmin,
}: Props) {
  const catalog = useCatalogOptional();
  const brand = catalog?.config.brandName ?? "Orva";
  const tagline = catalog?.config.tagline ?? "Shop curated products, brands, and Food — bag and checkout with clarity.";
  const trust = catalog?.config.trustPoints?.length
    ? catalog.config.trustPoints
    : ["Curated collections", "Secure demo checkout", "Returns in 7 days (demo)"];
  const coupon = catalog?.config.couponCode ?? "ORVA10";
  const logoUrl = catalog?.config.logoUrl;
  const email = catalog?.config.supportEmail;

  return (
    <footer className="mall-footer">
      <div className="mall-footer-grid">
        <div>
          <strong className="mall-footer-brand">
            {logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="" className="mall-footer-logo" />
                {brand}
              </>
            ) : (
              brand
            )}
          </strong>
          <p>{tagline}</p>
          {email && (
            <p>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
        </div>
        <div>
          <h4>Shop</h4>
          <button type="button" onClick={onShop}>
            Catalog
          </button>
          <button type="button" onClick={onDirectory}>
            Brands
          </button>
          <button type="button" onClick={onExplore}>
            Full shop
          </button>
        </div>
        <div>
          <h4>Help</h4>
          {HELP_SECTIONS.map((s) => (
            <button type="button" key={s.id} onClick={() => onHelp(s.id)}>
              {s.title}
            </button>
          ))}
          {onOrders && (
            <button type="button" onClick={onOrders}>
              Orders
            </button>
          )}
        </div>
        <div>
          <h4>Trust</h4>
          {trust.slice(0, 3).map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p>Offer code {coupon}</p>
          {onAdmin && (
            <button type="button" className="mall-footer-admin" onClick={onAdmin}>
              Admin
            </button>
          )}
        </div>
      </div>
      <div className="mall-footer-bottom">
        <span>
          © {new Date().getFullYear()} {brand} · Ecommerce platform template
        </span>
        <span>Privacy · Terms · Refund (demo)</span>
      </div>
    </footer>
  );
}
