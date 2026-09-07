"use client";

import { useEffect } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { defaultSiteConfig } from "@/lib/data/types";

/** Pushes brand kit (name, logo, colors, favicon) into the live document + CSS vars */
export function BrandKitApplier() {
  const { config } = useCatalog();
  const theme = config.theme ?? defaultSiteConfig.theme!;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand", theme.brand);
    root.style.setProperty("--brand-deep", theme.brandDeep || theme.brand);
    root.style.setProperty("--accent", theme.accent);
    if (theme.accent2) root.style.setProperty("--accent-2", theme.accent2);
    if (theme.bg) root.style.setProperty("--bg", theme.bg);
    if (theme.ink) root.style.setProperty("--ink", theme.ink);
    root.style.setProperty("--theme-color", theme.brand);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", theme.brand);

    document.title = `${config.brandName} — Modern Ecommerce Platform`;

    let fav = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-brand-kit="1"]');
    if (config.faviconUrl || config.logoUrl) {
      if (!fav) {
        fav = document.createElement("link");
        fav.rel = "icon";
        fav.setAttribute("data-brand-kit", "1");
        document.head.appendChild(fav);
      }
      fav.href = config.faviconUrl || config.logoUrl || fav.href;
    }
  }, [config.brandName, config.faviconUrl, config.logoUrl, theme]);

  return null;
}
