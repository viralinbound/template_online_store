"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMallStore } from "@/store/useMallStore";
import { formatMoney } from "@/lib/money";
import { useCatalogOptional } from "@/components/CatalogProvider";

/** Toast after add-to-cart — one tap to checkout */
export function CartToast({
  onCheckout,
  onOpenBag,
}: {
  onCheckout: () => void;
  onOpenBag: () => void;
}) {
  const toast = useMallStore((s) => s.cartToast);
  const dismissCartToast = useMallStore((s) => s.dismissCartToast);
  const catalog = useCatalogOptional();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="orva-cart-toast"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          role="status"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {toast.image && <img src={toast.image} alt="" />}
          <div>
            <strong>Added to bag</strong>
            <p>
              {toast.name}
              {toast.price != null
                ? ` · ${formatMoney(toast.price, catalog?.config.currency ?? "INR", catalog?.config.locale)}`
                : ""}
            </p>
          </div>
          <button
            type="button"
            className="ghost-light"
            onClick={() => {
              dismissCartToast();
              onOpenBag();
            }}
          >
            Bag
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => {
              dismissCartToast();
              onCheckout();
            }}
          >
            Checkout
          </button>
          <button type="button" className="orva-toast-x" onClick={dismissCartToast} aria-label="Dismiss">
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
