"use client";

import { CatalogProvider } from "@/components/CatalogProvider";
import { BrandKitApplier } from "@/components/shell/BrandKitApplier";
import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";

export function OrvaProviders({ children }: { children: ReactNode }) {
  return (
    <CatalogProvider>
      <BrandKitApplier />
      <LayoutGroup id="orva-mall">{children}</LayoutGroup>
    </CatalogProvider>
  );
}
