"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmixStoreGallery } from "@/components/AmixStoreGallery";
import { mallFloors, storeCollage } from "@/data/mallData";
import { floorHeroImage, landingHeroImage } from "@/lib/images";
import { useMallStore } from "@/store/useMallStore";
import type { Product, StoreNode } from "@/types/mall";

type FloorPage = {
  level: number;
  label: string;
  title: string;
  categoryName: string;
  subcategories: string[];
  vibe: string;
  bg: string;
  accent: string;
  ink: string;
  hero: string;
  stores: StoreNode[];
  collage: string[];
};

const FLOOR_META: Omit<
  FloorPage,
  "stores" | "level" | "label" | "title" | "categoryName" | "subcategories" | "collage" | "hero"
>[] = [
  {
    vibe: "Arrival atrium",
    bg: "linear-gradient(155deg, #eef7f6 0%, #f7fbfb 48%, #dcefee 100%)",
    accent: "#14999c",
    ink: "#0f3d40",
  },
  {
    vibe: "Style runway",
    bg: "linear-gradient(160deg, #eef4f8 0%, #f7fafc 50%, #dce8f0 100%)",
    accent: "#2f7ebd",
    ink: "#163553",
  },
  {
    vibe: "Tech pavilion",
    bg: "linear-gradient(150deg, #e8f5f2 0%, #f4faf8 48%, #d3ebe4 100%)",
    accent: "#1a8f72",
    ink: "#124836",
  },
  {
    vibe: "Living loft",
    bg: "linear-gradient(155deg, #f7f3ea 0%, #fbf9f4 50%, #ebe2d2 100%)",
    accent: "#c08a3a",
    ink: "#4a3a1c",
  },
  {
    vibe: "Luxury salon",
    bg: "linear-gradient(155deg, #f7eef1 0%, #fbf6f8 48%, #eddde3 100%)",
    accent: "#c45d74",
    ink: "#4c2432",
  },
  {
    vibe: "Play court",
    bg: "linear-gradient(155deg, #eef6ea 0%, #f6faf3 50%, #dcebd2 100%)",
    accent: "#5a9a36",
    ink: "#2a4218",
  },
];

type Phase = "floors" | "lobby" | "store" | "product";

export function VirtualMallExperience() {
  const bag = useMallStore((s) => s.bag);
  const addToBag = useMallStore((s) => s.addToBag);
  const inspect = useMallStore((s) => s.inspect);
  const setInspect = useMallStore((s) => s.setInspect);
  const showBag = useMallStore((s) => s.showBag);
  const setShowBag = useMallStore((s) => s.setShowBag);
  const checkout = useMallStore((s) => s.checkout);
  const setCheckout = useMallStore((s) => s.setCheckout);
  const orderOk = useMallStore((s) => s.orderOk);
  const setOrderOk = useMallStore((s) => s.setOrderOk);
  const cartPulse = useMallStore((s) => s.cartPulse);
  const session = useMallStore((s) => s.session);
  const orders = useMallStore((s) => s.orders);
  const showAuth = useMallStore((s) => s.showAuth);
  const authMode = useMallStore((s) => s.authMode);
  const showOrders = useMallStore((s) => s.showOrders);
  const authError = useMallStore((s) => s.authError);
  const setShowAuth = useMallStore((s) => s.setShowAuth);
  const setShowOrders = useMallStore((s) => s.setShowOrders);
  const signup = useMallStore((s) => s.signup);
  const login = useMallStore((s) => s.login);
  const logout = useMallStore((s) => s.logout);
  const placeOrder = useMallStore((s) => s.placeOrder);

  const [started, setStarted] = useState(false);
  const [floor, setFloor] = useState(0);
  const [phase, setPhase] = useState<Phase>("floors");
  const [store, setStore] = useState<StoreNode | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [zooming, setZooming] = useState(false);
  const [zoomPic, setZoomPic] = useState<string | null>(null);
  const [zoomLabel, setZoomLabel] = useState("Zooming…");
  const [zoomFloorLabel, setZoomFloorLabel] = useState<string | null>(null);
  const [zoomDir, setZoomDir] = useState<"in" | "out">("in");
  const [lobbyKey, setLobbyKey] = useState(0);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const pages: FloorPage[] = useMemo(
    () =>
      mallFloors.map((f, i) => {
        const meta = FLOOR_META[i % FLOOR_META.length];
        const hero = floorHeroImage(f.label, meta.vibe, `mm-floor-${f.label}`);
        return {
          level: f.level,
          label: f.label,
          title: f.title,
          categoryName: f.categoryName,
          subcategories: f.subcategories,
          stores: f.stores,
          ...meta,
          hero,
          collage: [hero, ...f.stores.slice(0, 5).map((s, j) => storeCollage(s, j))],
        };
      }),
    [],
  );

  const current = pages[floor];
  const total = bag.reduce((s, p) => s + p.price, 0);
  const liveSession = hydrated ? session : null;
  const myOrders = useMemo(
    () => (liveSession ? orders.filter((o) => o.userId === liveSession.id) : []),
    [orders, liveSession],
  );

  useEffect(() => {
    if (liveSession) setCheckoutName(liveSession.name);
  }, [liveSession]);

  const runZoom = async (
    pic: string,
    label: string,
    after: () => void,
    opts?: { ms?: number; floorLabel?: string | null; dir?: "in" | "out" },
  ) => {
    if (zooming) return;
    setZoomPic(pic);
    setZoomLabel(label);
    setZoomFloorLabel(opts?.floorLabel ?? null);
    setZoomDir(opts?.dir ?? "in");
    setZooming(true);
    await new Promise((r) => setTimeout(r, opts?.ms ?? 720));
    after();
    setZooming(false);
    setZoomPic(null);
    setZoomFloorLabel(null);
  };

  const enterLobby = (pic?: string, floorIndex?: number) => {
    const idx = floorIndex ?? floor;
    const page = pages[idx];
    if (idx !== floor) setFloor(idx);
    void runZoom(
      pic ?? page.hero,
      `Opening ${page.title}`,
      () => {
        setPhase("lobby");
        setLobbyKey((k) => k + 1);
      },
      { ms: 820, floorLabel: page.label, dir: "in" },
    );
  };

  const zoomOutToFloors = () => {
    void runZoom(
      current.hero,
      `Returning to ${current.title}`,
      () => {
        setPhase("floors");
        setStore(null);
        setProduct(null);
      },
      { floorLabel: current.label, dir: "out" },
    );
  };

  const openStore = (s: StoreNode) => {
    void runZoom(
      s.doorImage,
      `${s.name} · ${s.subcategory}`,
      () => {
        setStore(s);
        setProduct(null);
        setPhase("store");
      },
      { floorLabel: current.label, dir: "in" },
    );
  };

  const zoomOutToLobby = () => {
    void runZoom(
      store?.doorImage ?? current.hero,
      `${current.title} lobby`,
      () => {
        setStore(null);
        setProduct(null);
        setPhase("lobby");
        setLobbyKey((k) => k + 1);
      },
      { floorLabel: current.label, dir: "out" },
    );
  };

  const openProduct = (p: Product) => {
    void runZoom(
      p.image,
      p.name,
      () => {
        setProduct(p);
        setPhase("product");
      },
      { floorLabel: current.label, dir: "in" },
    );
  };

  const zoomOutToStore = () => {
    void runZoom(
      product?.image ?? current.hero,
      store?.name ?? "Collection",
      () => {
        setProduct(null);
        setPhase("store");
      },
      { floorLabel: current.label, dir: "out" },
    );
  };

  const phaseHint =
    phase === "floors"
      ? " · Floor landing"
      : phase === "lobby"
        ? " · Lobby"
        : phase === "store"
          ? ` · ${store?.name ?? "Store"}`
          : ` · ${product?.name ?? "Product"}`;

  return (
    <div className="mp">
      {!started ? (
        <Intro
          onEnter={() => setStarted(true)}
          bagCount={bag.length}
          onBag={() => setShowBag(true)}
          sessionName={liveSession?.name ?? null}
          onAuth={(mode) => setShowAuth(true, mode)}
          onOrders={() => setShowOrders(true)}
          orderCount={myOrders.length}
          onLogout={logout}
        />
      ) : (
        <>
          <header className={`mp-nav ${phase === "floors" ? "mp-nav-dark" : ""}`}>
            <div className="mp-nav-brand">
              <strong>MegaMall</strong>
              <span className="mp-nav-sub">
                Floor {current.label} · {current.categoryName}
                {phaseHint}
              </span>
            </div>
            <div className="mp-nav-actions">
              {phase === "product" && (
                <button type="button" onClick={zoomOutToStore}>
                  ← Store
                </button>
              )}
              {phase === "store" && (
                <button type="button" onClick={zoomOutToLobby}>
                  ← Lobby
                </button>
              )}
              {phase === "lobby" && (
                <button type="button" onClick={zoomOutToFloors}>
                  ← Floors
                </button>
              )}
              {liveSession ? (
                <>
                  <button type="button" className="mp-nav-orders" onClick={() => setShowOrders(true)}>
                    Orders ({myOrders.length})
                  </button>
                  <button type="button" onClick={logout} title={liveSession.email}>
                    {liveSession.name.split(" ")[0]}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setShowAuth(true, "login")}>
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="mp-nav-signup"
                    onClick={() => setShowAuth(true, "signup")}
                  >
                    Create account
                  </button>
                </>
              )}
              <motion.button
                type="button"
                className="bag"
                key={cartPulse}
                animate={{ scale: [1, 1.1, 1] }}
                onClick={() => setShowBag(true)}
              >
                Cart {bag.length}
              </motion.button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {phase === "product" && product && store ? (
              <ProductPage
                key={product.id}
                product={product}
                storeName={store.name}
                accent={current.accent}
                ink={current.ink}
                bg={current.bg}
                onBack={zoomOutToStore}
                onBuy={() => addToBag(product)}
                onBuyNow={() => {
                  addToBag(product);
                  setCheckout(true);
                }}
              />
            ) : phase === "store" && store ? (
              <AmixStoreGallery
                key={store.id}
                store={store}
                floorLabel={current.label}
                accent={current.accent}
                onBack={zoomOutToLobby}
                onOpenProduct={openProduct}
                onBuy={(p) => addToBag(p)}
                onBuyNow={(p) => {
                  addToBag(p);
                  setCheckout(true);
                }}
              />
            ) : phase === "lobby" ? (
              <FloorLobby
                key={`lob-${floor}-${lobbyKey}`}
                page={current}
                onOpenStore={openStore}
              />
            ) : (
              <FloorScroll
                key="floors-scroll"
                pages={pages}
                floor={floor}
                onFloorChange={setFloor}
                onEnterLobby={(floorIndex, pic) => enterLobby(pic, floorIndex)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {zooming && (
              <motion.div
                className={`mp-zoom mp-zoom-${zoomDir}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {zoomPic && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <motion.img
                    src={zoomPic}
                    alt=""
                    className="mp-zoom-pic"
                    initial={{
                      scale: zoomDir === "in" ? 0.62 : 1.35,
                      opacity: 0.5,
                      borderRadius: zoomDir === "in" ? "1.4rem" : "0rem",
                    }}
                    animate={{
                      scale: zoomDir === "in" ? 1.45 : 0.78,
                      opacity: 1,
                      borderRadius: zoomDir === "in" ? "0rem" : "1.1rem",
                    }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <motion.div
                  className="mp-zoom-ring"
                  initial={{ scale: zoomDir === "in" ? 0.3 : 1.8, opacity: 0.4 }}
                  animate={{ scale: zoomDir === "in" ? 2.8 : 0.4, opacity: 0 }}
                  transition={{ duration: 0.72 }}
                />
                <motion.div
                  className="mp-zoom-caption"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  {zoomFloorLabel && (
                    <strong className="mp-zoom-floor">Floor {zoomFloorLabel}</strong>
                  )}
                  <p>{zoomLabel}</p>
                  <span>{zoomDir === "in" ? "Opening…" : "Returning…"}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <AnimatePresence>
        {inspect && (
          <Overlay onClose={() => setInspect(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={inspect.image} alt={inspect.name} />
            <h3>{inspect.name}</h3>
            <p className="price">₹{inspect.price.toLocaleString("en-IN")}</p>
            <div className="row">
              <button
                type="button"
                className="primary"
                onClick={() => {
                  addToBag(inspect);
                  setInspect(null);
                }}
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => {
                  addToBag(inspect);
                  setInspect(null);
                  setCheckout(true);
                }}
              >
                Buy now
              </button>
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBag && (
          <Overlay onClose={() => setShowBag(false)}>
            <h3>Shopping cart</h3>
            {bag.length === 0 ? (
              <p className="muted">Your cart is empty.</p>
            ) : (
              bag.map((item) => (
                <div key={item.id} className="bag-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                  <span>₹{item.price.toLocaleString("en-IN")}</span>
                </div>
              ))
            )}
            <p className="price">Total ₹{total.toLocaleString("en-IN")}</p>
            <button
              type="button"
              className="primary"
              disabled={!bag.length}
              onClick={() => {
                setShowBag(false);
                if (!liveSession) {
                  setShowAuth(true, "login");
                  return;
                }
                setCheckout(true);
              }}
            >
              {liveSession ? "Proceed to checkout" : "Sign in to checkout"}
            </button>
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkout && !orderOk && (
          <Overlay onClose={() => setCheckout(false)}>
            <h3>Checkout</h3>
            {!liveSession ? (
              <p className="muted">Please sign in or create an account to complete your order.</p>
            ) : (
              <>
                <label>
                  Name
                  <input
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Address
                  <input
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    placeholder="Delivery address"
                  />
                </label>
                {authError && <p className="auth-err">{authError}</p>}
                <p className="price">₹{total.toLocaleString("en-IN")}</p>
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    const ok = placeOrder(checkoutName, checkoutAddress);
                    if (ok) {
                      window.setTimeout(() => setOrderOk(false), 1800);
                    }
                  }}
                >
                  Place order
                </button>
              </>
            )}
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && (
          <AuthOverlay
            mode={authMode}
            error={authError}
            onClose={() => setShowAuth(false)}
            onSwitch={(m) => setShowAuth(true, m)}
            onLogin={login}
            onSignup={signup}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOrders && (
          <Overlay onClose={() => setShowOrders(false)}>
            <h3>Order history</h3>
            {!liveSession ? (
              <p className="muted">Sign in to view your order history.</p>
            ) : myOrders.length === 0 ? (
              <p className="muted">No orders yet.</p>
            ) : (
              <div className="order-list">
                {myOrders.map((o) => (
                  <article key={o.id} className="order-card">
                    <header>
                      <strong>{new Date(o.createdAt).toLocaleString()}</strong>
                      <span>₹{o.total.toLocaleString("en-IN")}</span>
                    </header>
                    <p className="muted">
                      {o.customerName} · {o.address}
                    </p>
                    <ul>
                      {o.items.map((it) => (
                        <li key={`${o.id}-${it.id}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={it.image} alt="" />
                          <span>{it.name}</span>
                          <em>₹{it.price.toLocaleString("en-IN")}</em>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {orderOk && (
          <motion.div className="mp-ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <span>✓</span>
              <h2>Order confirmed</h2>
              <p className="muted">Saved to your order history</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Intro({
  onEnter,
  bagCount,
  onBag,
  sessionName,
  onAuth,
  onOrders,
  orderCount,
  onLogout,
}: {
  onEnter: () => void;
  bagCount: number;
  onBag: () => void;
  sessionName: string | null;
  onAuth: (mode: "login" | "signup") => void;
  onOrders: () => void;
  orderCount: number;
  onLogout: () => void;
}) {
  return (
    <section className="lp">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        className="lp-hero-img"
        src={landingHeroImage()}
        alt="MegaMall premium retail destination"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="lp-veil" />

      <header className="lp-top">
        <strong>MegaMall</strong>
        <div className="lp-top-actions">
          {sessionName ? (
            <>
              <button type="button" onClick={onOrders}>
                Orders ({orderCount})
              </button>
              <button type="button" onClick={onLogout}>
                {sessionName.split(" ")[0]} · Out
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => onAuth("login")}>
                Sign in
              </button>
              <button type="button" className="mp-nav-signup" onClick={() => onAuth("signup")}>
                Create account
              </button>
            </>
          )}
          <button type="button" onClick={onBag}>
            Cart ({bagCount})
          </button>
        </div>
      </header>

      <div className="lp-copy">
        <motion.p
          className="lp-kicker"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Premium retail destination
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          MegaMall
        </motion.h1>
        <motion.p
          className="lp-lead"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          A curated retail destination — browse floors, open stores, and shop featured collections.
        </motion.p>
        <motion.div
          className="lp-cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
        >
          <button type="button" className="primary" onClick={onEnter}>
            Begin shopping
          </button>
        </motion.div>
      </div>

      <motion.div
        className="lp-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        aria-hidden
      >
        <span>Continue to floors</span>
        <i />
      </motion.div>
    </section>
  );
}

function ProductPage({
  product,
  storeName,
  accent,
  ink,
  bg,
  onBack,
  onBuy,
  onBuyNow,
}: {
  product: Product;
  storeName: string;
  accent: string;
  ink: string;
  bg: string;
  onBack: () => void;
  onBuy: () => void;
  onBuyNow: () => void;
}) {
  return (
    <motion.section
      className="pp"
      style={{ background: bg, color: ink, ["--a" as string]: accent }}
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45 }}
    >
      <button type="button" className="pp-back" onClick={onBack}>
        ← Back to collection
      </button>
      <div className="pp-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={product.image}
          alt={product.name}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
        />
      </div>
      <div className="pp-sheet">
        <p className="pp-kicker">{storeName}</p>
        <h1>{product.name}</h1>
        <p className="pp-copy">{product.description}</p>
        <ul>
          <li>
            <em>Rating</em>
            <span>{product.rating.toFixed(1)} / 5</span>
          </li>
          <li>
            <em>Colors</em>
            <span>{product.colors.join(" · ")}</span>
          </li>
          <li>
            <em>Sizes</em>
            <span>{product.sizes.join(" / ")}</span>
          </li>
        </ul>
        <p className="pp-price">₹{product.price.toLocaleString("en-IN")}</p>
        <div className="pp-actions">
          <button type="button" className="primary" onClick={onBuyNow}>
            Buy now
          </button>
          <button type="button" onClick={onBuy}>
            Add to cart
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function FloorScroll({
  pages,
  floor,
  onFloorChange,
  onEnterLobby,
}: {
  pages: FloorPage[];
  floor: number;
  onFloorChange: (n: number) => void;
  onEnterLobby: (floorIndex: number, pic?: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const locking = useRef(false);
  const lastFloor = useRef(floor);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  // Jump when floor dots change
  useEffect(() => {
    const el = scrollerRef.current;
    const slide = slideRefs.current[floor];
    if (!el || !slide || locking.current) return;
    if (lastFloor.current === floor) return;
    lastFloor.current = floor;
    locking.current = true;
    slide.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      locking.current = false;
    }, 600);
  }, [floor]);

  // Track which floor is in view while scrolling (stops at ends — no loop)
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (locking.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number((visible.target as HTMLElement).dataset.floorIndex);
        if (Number.isNaN(idx) || idx === lastFloor.current) return;
        lastFloor.current = idx;
        onFloorChange(idx);
      },
      { root, threshold: [0.55, 0.7, 0.85] },
    );

    slideRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [pages.length, onFloorChange]);

  // Start on current floor once
  useEffect(() => {
    const slide = slideRefs.current[floor];
    if (!slide) return;
    locking.current = true;
    slide.scrollIntoView({ behavior: "auto", block: "start" });
    lastFloor.current = floor;
    requestAnimationFrame(() => {
      locking.current = false;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.section
      className="fl-endless"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
      transition={{ duration: 0.45 }}
    >
      <div ref={scrollerRef} className="fl-endless-scroller">
        {pages.map((page, i) => (
          <div
            key={page.level}
            className="fl-land-wrap"
            data-floor-index={i}
            ref={(node) => {
              slideRefs.current[i] = node;
            }}
          >
            <FloorSlide page={page} onEnterLobby={(pic) => onEnterLobby(i, pic)} />
          </div>
        ))}
      </div>

      <div className="fl-endless-hint">
        <span>Browse floors</span>
      </div>

      <div className="mp-floor-dots fl-land-dots">
        {pages.map((p, i) => (
          <button
            type="button"
            key={p.level}
            className={i === floor ? "on" : ""}
            style={{ ["--a" as string]: p.accent }}
            onClick={() => onFloorChange(i)}
            aria-label={`Go to floor ${p.label}`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </motion.section>
  );
}

function FloorSlide({
  page,
  onEnterLobby,
}: {
  page: FloorPage;
  onEnterLobby: (pic?: string) => void;
}) {
  return (
    <article className="fl-land" style={{ color: page.ink, ["--a" as string]: page.accent }}>
      <button
        type="button"
        className="fl-land-hit"
        aria-label={`Open ${page.title}`}
        onClick={() => onEnterLobby(page.hero)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          className="fl-land-hero"
          src={page.hero}
          alt={page.title}
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ amount: 0.4, once: false }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </button>
      <div className="fl-land-veil" />

      <div className="fl-land-copy">
        <motion.p
          className="fl-land-brand"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5, once: false }}
        >
          MegaMall · Floor {page.label}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.45, once: false }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
        >
          {page.title}
        </motion.h1>
        <motion.p
          className="fl-land-lead"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5, once: false }}
          transition={{ delay: 0.05 }}
        >
          {page.categoryName} — curated boutiques and featured collections on this level.
        </motion.p>
        <motion.ul
          className="fl-land-subs"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4, once: false }}
          transition={{ delay: 0.1 }}
        >
          {page.subcategories.slice(0, 4).map((sub) => (
            <li key={sub}>{sub}</li>
          ))}
        </motion.ul>
        <motion.div
          className="fl-land-cta"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5, once: false }}
          transition={{ delay: 0.12 }}
        >
          <button type="button" className="primary" onClick={() => onEnterLobby(page.hero)}>
            Explore {page.title}
          </button>
        </motion.div>
      </div>

      <motion.div
        className="fl-land-cue"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.85 }}
        viewport={{ amount: 0.4, once: false }}
        aria-hidden
      >
        <span>Next floor</span>
        <i />
      </motion.div>
    </article>
  );
}

function FloorLobby({
  page,
  onOpenStore,
}: {
  page: FloorPage;
  onOpenStore: (s: StoreNode) => void;
}) {
  const [activeSub, setActiveSub] = useState<string>("All");
  const filtered =
    activeSub === "All" ? page.stores : page.stores.filter((s) => s.subcategory === activeSub);

  return (
    <motion.section
      className="fl-lobby"
      style={{ background: page.bg, color: page.ink, ["--a" as string]: page.accent }}
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="fl-lobby-marquee"
        aria-hidden
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i}>
            Floor {page.label} · {page.categoryName} · {page.title} ·
          </span>
        ))}
      </motion.div>

      <div className="fl-lobby-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={page.hero}
          alt=""
          initial={{ scale: 1.18 }}
          whileInView={{ scale: 1 }}
          viewport={{ amount: 0.4, once: false }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5, once: false }}
        >
          <p style={{ color: page.accent }}>
            Floor {page.label} · {page.categoryName}
          </p>
          <h2>{page.title}</h2>
          <span>Select a department, then open a store</span>
        </motion.div>
      </div>

      <div className="fl-sub-rail" role="tablist" aria-label="Departments">
        <button
          type="button"
          className={activeSub === "All" ? "on" : ""}
          onClick={() => setActiveSub("All")}
        >
          All departments
        </button>
        {page.subcategories.map((sub) => (
          <button
            type="button"
            key={sub}
            className={activeSub === sub ? "on" : ""}
            onClick={() => setActiveSub(sub)}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="fl-lobby-stack">
        <AnimatePresence mode="popLayout">
          {filtered.map((s, i) => {
            const fromLeft = i % 2 === 0;
            return (
              <motion.button
                type="button"
                key={s.id}
                layout
                className={`fl-door fl-door-stack ${fromLeft ? "left" : "right"}`}
                initial={{
                  opacity: 0,
                  x: fromLeft ? -140 : 140,
                  y: 48,
                  rotate: fromLeft ? -5 : 5,
                  scale: 0.92,
                }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 110, damping: 16 }}
                whileHover={{ y: -10, scale: 1.03 }}
                onClick={() => onOpenStore(s)}
              >
                <div className="fl-door-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.doorImage} alt="" />
                  <em style={{ background: s.theme.accent }}>{String(i + 1).padStart(2, "0")}</em>
                </div>
                <div className="fl-door-meta">
                  <span className="fl-door-sub">{s.subcategory}</span>
                  <strong>{s.name}</strong>
                  <span>
                    {page.categoryName} · {s.category}
                  </span>
                  <small>View collection</small>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function AuthOverlay({
  mode,
  error,
  onClose,
  onSwitch,
  onLogin,
  onSignup,
}: {
  mode: "login" | "signup";
  error: string | null;
  onClose: () => void;
  onSwitch: (m: "login" | "signup") => void;
  onLogin: (email: string, password: string) => boolean;
  onSignup: (name: string, email: string, password: string) => boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Overlay onClose={onClose}>
      <h3>{mode === "login" ? "Sign in" : "Create account"}</h3>
      <p className="muted">
        {mode === "login"
          ? "Sign in to checkout and view your order history."
          : "Create an account to save purchases and track orders."}
      </p>
      {mode === "signup" && (
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
      )}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 4 characters"
        />
      </label>
      {error && <p className="auth-err">{error}</p>}
      <button
        type="button"
        className="primary"
        onClick={() => {
          if (mode === "login") onLogin(email, password);
          else onSignup(name, email, password);
        }}
      >
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
      <button
        type="button"
        className="auth-switch"
        onClick={() => onSwitch(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "New here? Create an account" : "Already registered? Sign in"}
      </button>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      className="mp-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="mp-sheet"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="close" onClick={onClose}>
          Close
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
