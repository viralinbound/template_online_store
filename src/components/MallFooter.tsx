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

  return (
    <footer className="mall-footer">
      <div className="mall-footer-grid">
        <div>
          <strong className="mall-footer-brand">{brand}</strong>
          <p>Shop curated products, brands, and Food — bag and checkout with clarity.</p>
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
          <p>Curated collections</p>
          <p>Secure demo checkout</p>
          <p>Returns in 7 days (demo)</p>
          <p>Offer code ORVA10</p>
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
