"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  brand: string;
  logoUrl?: string;
  bagCount: number;
  bagPulse?: boolean;
  compareCount?: number;
  sessionName?: string | null;
  isAdmin?: boolean;
  onCompare?: () => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
};

/** Edge-to-edge studio header — brand + actions (no Mall/Shop/Food/Brands strip) */
export function OrvaStudioHeader({
  brand,
  logoUrl,
  bagCount,
  bagPulse,
  compareCount = 0,
  sessionName,
  isAdmin,
  onCompare,
  onSignIn,
  onSignOut,
}: Props) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);
  const { scrollY } = useScroll();
  const progress = useSpring(0, { stiffness: 160, damping: 28 });

  useEffect(() => setReady(true), []);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    progress.set(Math.min(v / max, 1));
  });

  useEffect(() => setMenuOpen(false), [pathname]);

  const barScale = useTransform(progress, [0, 1], [0, 1]);
  const path = pathname ?? "/";
  const isHome = path === "/";
  const cinematic = isHome && !scrolled && !menuOpen;
  const lifted = scrolled || menuOpen || !isHome;
  const motionSafe = ready && !reduce;

  return (
    <motion.header
      className={`orva-studio-header no-top-nav${cinematic ? " cinematic" : " solid"}${lifted ? " lifted" : ""}${menuOpen ? " open" : ""}`}
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="orva-studio-progress" style={{ scaleX: barScale }} aria-hidden />

      <div className="orva-studio-bar">
        <Link href="/" className="orva-studio-brand" aria-label={`${brand} home`}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="orva-studio-logo" />
          ) : (
            <motion.span
              className="orva-studio-mark"
              aria-hidden
              animate={motionSafe ? { rotate: [0, 8, -4, 0] } : undefined}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <strong>{brand}</strong>
        </Link>

        {/* Order: Search → Orders → Account → Compare → Bag → Menu */}
        <div className="orva-studio-actions">
          <Link href="/search" className="orva-studio-quiet">
            Search
          </Link>

          <Link href="/orders" className="orva-studio-quiet">
            Orders
          </Link>

          {isAdmin && (
            <Link href="/admin" className="orva-studio-quiet orva-studio-admin">
              Admin
            </Link>
          )}

          {sessionName ? (
            <>
              <span className="orva-studio-quiet orva-studio-user" title={sessionName}>
                {sessionName}
              </span>
              {onSignOut && (
                <button type="button" className="orva-studio-quiet orva-studio-auth" onClick={onSignOut}>
                  Sign out
                </button>
              )}
            </>
          ) : (
            <button type="button" className="orva-studio-quiet orva-studio-auth" onClick={onSignIn}>
              Sign in
            </button>
          )}

          {compareCount > 0 && (
            <button type="button" className="orva-studio-quiet" onClick={onCompare}>
              Compare {compareCount}
            </button>
          )}

          <Link
            href="/cart"
            className={`orva-studio-bag${bagPulse ? " pulse" : ""}`}
            aria-label={`Bag ${bagCount}`}
          >
            <motion.span
              key={bagCount}
              initial={reduce ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="orva-studio-bag-count"
            >
              {bagCount}
            </motion.span>
            <span>Bag</span>
          </Link>

          <button
            type="button"
            className="orva-studio-menu"
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <i />
            <i />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="orva-studio-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="orva-studio-panel-grid">
              {[
                { href: "/floors", label: "Mall atrium", hint: "Floors · doors · buy" },
                { href: "/shop", label: "Full catalog", hint: "Filter · sort · buy" },
                { href: "/food", label: "Food court", hint: "Café · sweets · bites" },
                { href: "/directory", label: "Brand index", hint: "Every house" },
                { href: "/search", label: "Search", hint: "Find a piece" },
                { href: "/orders", label: "Orders", hint: "Track demo buys" },
                { href: "/admin", label: "Admin panel", hint: "Products · orders · insights" },
                { href: "/help", label: "Help", hint: "Shipping · returns" },
                { href: "/checkout", label: "Checkout", hint: "ORVA10 · 10% off" },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link href={item.href} onClick={() => setMenuOpen(false)}>
                    <strong>{item.label}</strong>
                    <span>{item.hint}</span>
                  </Link>
                </motion.div>
              ))}
              {!sessionName && onSignIn && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                >
                  <button
                    type="button"
                    className="orva-studio-panel-auth"
                    onClick={() => {
                      setMenuOpen(false);
                      onSignIn();
                    }}
                  >
                    <strong>Sign in</strong>
                    <span>Account · admin demo</span>
                  </button>
                </motion.div>
              )}
              {sessionName && onSignOut && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                >
                  <button
                    type="button"
                    className="orva-studio-panel-auth"
                    onClick={() => {
                      setMenuOpen(false);
                      onSignOut();
                    }}
                  >
                    <strong>Sign out</strong>
                    <span>{sessionName} · log out</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
