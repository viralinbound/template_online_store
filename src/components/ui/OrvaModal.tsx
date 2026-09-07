"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  footer?: ReactNode;
};

/** Modern modal popup for ecommerce + admin flows */
export function OrvaModal({ open, title, children, onClose, wide, footer }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="orva-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`orva-modal${wide ? " wide" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <header className="orva-modal-head">
              <h3>{title}</h3>
              <button type="button" className="orva-modal-x" onClick={onClose} aria-label="Close">
                ×
              </button>
            </header>
            <div className="orva-modal-body">{children}</div>
            {footer && <footer className="orva-modal-foot">{footer}</footer>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
