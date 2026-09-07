"use client";

import { HELP_SECTIONS } from "@/lib/catalog";
import { useCatalogOptional } from "@/components/CatalogProvider";

type Props = {
  onShop: () => void;
  onExplore: () => void;
  onDirectory: () => void;
  onHelp: (section?: string) => void;
};

export function MallFooter({ onShop, onExplore, onDirectory, onHelp }: Props) {
  const catalog = useCatalogOptional();
  const brand = catalog?.config.brandName ?? "Orva";

  return (
    <footer className="mall-footer">
      <div className="mall-footer-grid">
        <div>
          <strong className="mall-footer-brand">{brand}</strong>
          <p>One mall experience — shop, scroll floors, Food Court, checkout with clarity.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <button type="button" onClick={onShop}>
            Catalog
          </button>
          <button type="button" onClick={onDirectory}>
            Directory
          </button>
          <button type="button" onClick={onExplore}>
            Mall floors
          </button>
        </div>
        <div>
          <h4>Help</h4>
          {HELP_SECTIONS.map((s) => (
            <button type="button" key={s.id} onClick={() => onHelp(s.id)}>
              {s.title}
            </button>
          ))}
        </div>
        <div>
          <h4>Trust</h4>
          <p>Curated collections</p>
          <p>Secure demo checkout</p>
          <p>Returns in 7 days (demo)</p>
          <p>Offer code ORVA10</p>
        </div>
      </div>
      <div className="mall-footer-bottom">
        <span>© {new Date().getFullYear()} {brand} · Ecommerce platform template</span>
        <span>Privacy · Terms · Refund (demo)</span>
      </div>
    </footer>
  );
}
