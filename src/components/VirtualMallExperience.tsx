"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmixStoreGallery } from "@/components/AmixStoreGallery";
import { useCatalog } from "@/components/CatalogProvider";
import { MallDirectory } from "@/components/MallDirectory";
import { MallFooter } from "@/components/MallFooter";
import { OrvaMarketingHome } from "@/components/pages/OrvaMarketingHome";
import { ShopDestination } from "@/components/ShopDestination";
import { CartToast } from "@/components/commerce/CartToast";
import { CheckoutPanel, OrderCard } from "@/components/commerce/CheckoutPanel";
import { ProductPage } from "@/components/commerce/ProductPage";
import {
  CartNudge,
  CompareTray,
  MobileStickyBag,
  ReferralBanner,
  SkipToShop,
} from "@/components/commerce/ShoppingChrome";
import { ProductBadges } from "@/components/ui/ProductBadges";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StockPill } from "@/components/ui/StockPill";
import { LiveSourceBadge } from "@/components/ui/LiveSourceBadge";
import { storeCollage } from "@/data/mallData";
import {
  HELP_SECTIONS,
  relatedProducts,
  searchProducts,
  suggestProducts,
  allProducts,
} from "@/lib/catalog";
import { floorHeroImage } from "@/lib/images";
import { formatMoney } from "@/lib/money";
import {
  LOCAL_COUPONS,
  useMallStore,
  type PaymentMethod,
} from "@/store/useMallStore";
import type { MallSiteConfig, Product, StoreNode } from "@/types/mall";

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

type Phase = "floors" | "lobby" | "store" | "product" | "shop" | "directory";

export function VirtualMallExperience() {
  const { floors: mallFloors, config, loading: catalogLoading } = useCatalog();
  const bag = useMallStore((s) => s.bag);
  const wishlist = useMallStore((s) => s.wishlist);
  const recent = useMallStore((s) => s.recent);
  const couponCode = useMallStore((s) => s.couponCode);
  const couponError = useMallStore((s) => s.couponError);
  const addToBag = useMallStore((s) => s.addToBag);
  const setQty = useMallStore((s) => s.setQty);
  const removeFromBag = useMallStore((s) => s.removeFromBag);
  const toggleWishlist = useMallStore((s) => s.toggleWishlist);
  const isWishlisted = useMallStore((s) => s.isWishlisted);
  const pushRecent = useMallStore((s) => s.pushRecent);
  const applyCoupon = useMallStore((s) => s.applyCoupon);
  const clearCoupon = useMallStore((s) => s.clearCoupon);
  const bagCount = useMallStore((s) => s.bagCount);
  const bagSubtotal = useMallStore((s) => s.bagSubtotal);
  const bagDiscount = useMallStore((s) => s.bagDiscount);
  const bagTotal = useMallStore((s) => s.bagTotal);
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
  const showSearch = useMallStore((s) => s.showSearch);
  const showWishlist = useMallStore((s) => s.showWishlist);
  const authError = useMallStore((s) => s.authError);
  const setShowAuth = useMallStore((s) => s.setShowAuth);
  const setShowOrders = useMallStore((s) => s.setShowOrders);
  const setShowSearch = useMallStore((s) => s.setShowSearch);
  const setShowWishlist = useMallStore((s) => s.setShowWishlist);
  const signup = useMallStore((s) => s.signup);
  const login = useMallStore((s) => s.login);
  const logout = useMallStore((s) => s.logout);
  const placeOrder = useMallStore((s) => s.placeOrder);
  const addresses = useMallStore((s) => s.addresses);
  const lastOrderId = useMallStore((s) => s.lastOrderId);
  const advanceOrderStatus = useMallStore((s) => s.advanceOrderStatus);
  const toggleCompare = useMallStore((s) => s.toggleCompare);
  const compare = useMallStore((s) => s.compare);
  const setTrackingOrderId = useMallStore((s) => s.setTrackingOrderId);
  const trackingOrderId = useMallStore((s) => s.trackingOrderId);

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
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [saveAddress, setSaveAddress] = useState(true);
  const [couponDraft, setCouponDraft] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [returnPhase, setReturnPhase] = useState<Phase>("floors");
  const [helpSection, setHelpSection] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const pages: FloorPage[] = useMemo(
    () =>
      mallFloors.map((f, i) => {
        const meta = FLOOR_META[i % FLOOR_META.length];
        const hero = f.heroImage ?? floorHeroImage(f.label, meta.vibe, `mm-floor-${f.label}`);
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
    [mallFloors],
  );

  const current = pages[floor];
  const itemCount = hydrated ? bagCount() : 0;
  const subtotal = hydrated ? bagSubtotal() : 0;
  const discount = hydrated ? bagDiscount() : 0;
  const total = hydrated ? bagTotal() : 0;
  const liveSession = hydrated ? session : null;
  const myOrders = useMemo(() => {
    if (liveSession) return orders.filter((o) => o.userId === liveSession.id);
    // Guest: show recent guest orders from this device
    return orders.filter((o) => o.userId.startsWith("guest-")).slice(0, 8);
  }, [orders, liveSession]);
  const searchHits = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (q.startsWith("under ")) {
      const max = Number(q.replace(/[^0-9]/g, "")) || 3000;
      return allProducts(mallFloors)
        .filter((p) => p.price <= max)
        .sort((a, b) => a.price - b.price)
        .slice(0, 24);
    }
    if (q.includes("best") || q.includes("top rated")) {
      return allProducts(mallFloors)
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 24);
    }
    return searchProducts(searchQ, 24, mallFloors);
  }, [searchQ, mallFloors]);
  const cartSuggestions = useMemo(
    () => suggestProducts(4, bag.map((l) => l.product.id), mallFloors),
    [bag, mallFloors],
  );
  const money = (n: number) => formatMoney(n, config.currency, config.locale);
  const catalogPool = useMemo(() => allProducts(mallFloors), [mallFloors]);

  const runReorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.items.forEach((it) => {
      const found = catalogPool.find((p) => p.id === it.id);
      if (found) {
        addToBag(found, { qty: it.qty, size: it.size, color: it.color });
      }
    });
    setShowOrders(false);
    setShowBag(true);
  };

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
    setReturnPhase("lobby");
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

  const openProduct = (p: Product, from?: Phase) => {
    pushRecent(p);
    if (from) setReturnPhase(from);
    else if (phase !== "product") setReturnPhase(phase);
    void runZoom(
      p.image,
      p.name,
      () => {
        setProduct(p);
        setPhase("product");
        setStarted(true);
        setShowSearch(false);
        setShowWishlist(false);
        setShowBag(false);
        const floorIdx = pages.findIndex((pg) => pg.stores.some((s) => s.id === p.storeId));
        if (floorIdx >= 0) {
          setFloor(floorIdx);
          const st = pages[floorIdx]?.stores.find((s) => s.id === p.storeId) ?? null;
          setStore(st);
        }
      },
      { floorLabel: current.label, dir: "in" },
    );
  };

  const zoomOutToStore = () => {
    void runZoom(
      product?.image ?? current.hero,
      returnPhase === "shop" || returnPhase === "directory"
        ? `Shop ${config.brandName}`
        : (store?.name ?? "Collection"),
      () => {
        setProduct(null);
        if (returnPhase === "shop") {
          setPhase("shop");
          setStore(null);
        } else if (returnPhase === "directory") {
          setPhase("directory");
          setStore(null);
        } else {
          setPhase("store");
        }
      },
      { floorLabel: current.label, dir: "out" },
    );
  };

  const goShop = () => {
    setStarted(true);
    setPhase("shop");
    setStore(null);
    setProduct(null);
    setReturnPhase("shop");
  };

  const goExplore = () => {
    setStarted(true);
    setPhase("floors");
    setStore(null);
    setProduct(null);
    setReturnPhase("floors");
  };

  const goDirectory = () => {
    setStarted(true);
    setPhase("directory");
    setStore(null);
    setProduct(null);
  };

  const openHelp = (section?: string) => {
    setHelpSection(section ?? "faq");
  };

  const openStoreFromShop = (s: StoreNode, floorIndex: number) => {
    setFloor(floorIndex);
    setReturnPhase(phase === "directory" ? "directory" : "shop");
    void runZoom(
      s.doorImage,
      `${s.name} · ${s.subcategory}`,
      () => {
        setStore(s);
        setProduct(null);
        setPhase("store");
        setStarted(true);
      },
      { floorLabel: pages[floorIndex]?.label ?? current.label, dir: "in" },
    );
  };

  const openFloorFromDirectory = (floorIndex: number) => {
    setFloor(floorIndex);
    setReturnPhase("directory");
    enterLobby(pages[floorIndex]?.hero, floorIndex);
  };

  const phaseHint =
    phase === "floors"
      ? " · Explore floors"
      : phase === "lobby"
        ? " · Lobby"
        : phase === "store"
          ? ` · ${store?.name ?? "Store"}`
          : phase === "shop"
            ? " · Quick shop"
            : phase === "directory"
              ? " · Directory"
              : ` · ${product?.name ?? "Product"}`;

  return (
    <div className="mp">
      {catalogLoading && (
        <div className="mm-catalog-loading" aria-live="polite">
          Loading catalog…
        </div>
      )}
      {!started ? (
        <Intro
          config={config}
          onExplore={goExplore}
          onShop={goShop}
          onDirectory={goDirectory}
          onHelp={openHelp}
          onOpenFloor={(i) => {
            setFloor(i);
            goExplore();
          }}
          floors={pages.map((p) => ({
            label: p.label,
            title: p.title,
            categoryName: p.categoryName,
            hero: p.hero,
            storeCount: p.stores.length,
          }))}
          boutiques={mallFloors.flatMap((f) => f.stores.filter((s) => s.featured)).slice(0, 8)}
          bagCount={itemCount}
          onBag={() => setShowBag(true)}
          sessionName={liveSession?.name ?? null}
          onAuth={(mode) => setShowAuth(true, mode)}
          onOrders={() => setShowOrders(true)}
          orderCount={myOrders.length}
          onLogout={logout}
          onSearch={() => setShowSearch(true)}
          onWishlist={() => setShowWishlist(true)}
          wishCount={wishlist.length}
        />
      ) : (
        <>
          <header className={`mp-nav ${phase === "floors" ? "mp-nav-dark" : ""}`}>
            <div className="mp-nav-brand">
              <strong>{config.brandName}</strong>
              <span className="mp-nav-sub">
                {phase === "shop"
                  ? `${config.tagline} · Quick shop`
                  : phase === "directory"
                    ? "Mall directory · All floors & boutiques"
                    : `Floor ${current.label} · ${current.categoryName}${phaseHint}`}
              </span>
              <LiveSourceBadge />
            </div>
            <div className="mp-nav-actions">
              <div className="mp-mode-toggle" role="group" aria-label="Browse mode">
                {config.featureFlags.explore && (
                  <button
                    type="button"
                    className={
                      phase === "shop" ||
                      phase === "directory" ||
                      (phase === "product" && (returnPhase === "shop" || returnPhase === "directory"))
                        ? ""
                        : "on"
                    }
                    onClick={goExplore}
                  >
                    Explore
                  </button>
                )}
                {config.featureFlags.shop && (
                  <button
                    type="button"
                    className={
                      phase === "shop" ||
                      (phase === "product" && returnPhase === "shop")
                        ? "on"
                        : ""
                    }
                    onClick={goShop}
                  >
                    Shop
                  </button>
                )}
              </div>
              {config.featureFlags.directory && (
                <button type="button" onClick={goDirectory}>
                  Directory
                </button>
              )}
              {phase === "product" && (
                <button type="button" onClick={zoomOutToStore}>
                  {returnPhase === "shop" || returnPhase === "directory" ? "← Shop" : "← Store"}
                </button>
              )}
              {phase === "store" && (
                <button
                  type="button"
                  onClick={() => {
                    if (returnPhase === "shop") goShop();
                    else if (returnPhase === "directory") goDirectory();
                    else zoomOutToLobby();
                  }}
                >
                  {returnPhase === "shop" || returnPhase === "directory" ? "← Back" : "← Lobby"}
                </button>
              )}
              {phase === "lobby" && (
                <button type="button" onClick={zoomOutToFloors}>
                  ← Floors
                </button>
              )}
              <button type="button" onClick={() => setShowSearch(true)}>
                Search
              </button>
              <button type="button" onClick={() => setShowWishlist(true)}>
                Saved{wishlist.length ? ` (${wishlist.length})` : ""}
              </button>
              <button type="button" className="mp-nav-help" onClick={() => openHelp("faq")}>
                Help
              </button>
              {liveSession ? (
                <>
                  <button type="button" className="mp-nav-orders" onClick={() => setShowOrders(true)}>
                    Orders{myOrders.length > 0 ? ` (${myOrders.length})` : ""}
                  </button>
                  <button type="button" onClick={logout} title={liveSession.email}>
                    {liveSession.name.split(" ")[0]}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="mp-nav-orders" onClick={() => setShowOrders(true)}>
                    Orders{myOrders.length > 0 ? ` (${myOrders.length})` : ""}
                  </button>
                  <button type="button" onClick={() => setShowAuth(true, "login")}>
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="mp-nav-signup"
                    onClick={() => setShowAuth(true, "signup")}
                  >
                    Join
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
                Cart {itemCount}
              </motion.button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {phase === "product" && product && (store || returnPhase === "shop" || returnPhase === "directory") ? (
              <ProductPage
                key={product.id}
                product={product}
                storeName={store?.name ?? config.brandName}
                floorLabel={current.label}
                accent={current.accent}
                ink={current.ink}
                bg={current.bg}
                currency={config.currency}
                locale={config.locale}
                showReviews={config.featureFlags.reviews}
                wishlisted={isWishlisted(product.id)}
                compared={compare.some((x) => x.id === product.id)}
                related={relatedProducts(product, 4, mallFloors)}
                onBack={zoomOutToStore}
                onToggleWish={() => toggleWishlist(product)}
                onToggleCompare={() => toggleCompare(product)}
                onOpenRelated={(p) => openProduct(p, returnPhase)}
                onVisitStore={
                  store
                    ? () => {
                        setProduct(null);
                        setPhase("store");
                      }
                    : undefined
                }
                onBuy={(opts) => addToBag(product, opts)}
                onBuyNow={(opts) => {
                  addToBag(product, opts);
                  setCheckout(true);
                }}
                onHelp={() => openHelp("shipping")}
              />
            ) : phase === "store" && store ? (
              <AmixStoreGallery
                key={store.id}
                store={store}
                floorLabel={current.label}
                accent={current.accent}
                currency={config.currency}
                locale={config.locale}
                onBack={() => {
                  if (returnPhase === "shop") goShop();
                  else if (returnPhase === "directory") goDirectory();
                  else zoomOutToLobby();
                }}
                onOpenProduct={(p) => openProduct(p, "store")}
                onBuy={(p) => addToBag(p)}
                onBuyNow={(p) => {
                  addToBag(p);
                  setCheckout(true);
                }}
                onShop={goShop}
              />
            ) : phase === "directory" ? (
              <MallDirectory
                key="directory"
                accent={current.accent}
                onOpenFloor={openFloorFromDirectory}
                onOpenStore={openStoreFromShop}
                onShop={goShop}
              />
            ) : phase === "shop" ? (
              <ShopDestination
                key="shop-dest"
                accent={current.accent}
                onOpenProduct={(p) => openProduct(p, "shop")}
                onBuy={(p) => addToBag(p)}
                onExploreMall={goExplore}
                onOpenStore={openStoreFromShop}
                onDirectory={goDirectory}
                onHelp={openHelp}
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
                brandName={config.brandName}
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
            <p className="price">{money(inspect.price)}</p>
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
              <>
                <p className="muted">Your cart is empty — pick something you like.</p>
                <div className="suggest-grid">
                  {cartSuggestions.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className="suggest-card"
                      onClick={() => {
                        setShowBag(false);
                        openProduct(p);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" />
                      <strong>{p.name}</strong>
                      <span>{money(p.price)}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {bag.map((line) => (
                  <div key={line.key} className="bag-line bag-line-rich">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={line.product.image} alt={line.product.name} />
                    <div className="bag-line-info">
                      <span>{line.product.name}</span>
                      <small>
                        {line.color} · {line.size}
                      </small>
                      <div className="qty-row">
                        <button type="button" onClick={() => setQty(line.key, line.qty - 1)}>
                          −
                        </button>
                        <em>{line.qty}</em>
                        <button type="button" onClick={() => setQty(line.key, line.qty + 1)}>
                          +
                        </button>
                        <button type="button" className="linkish" onClick={() => removeFromBag(line.key)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <span>{money(line.product.price * line.qty)}</span>
                  </div>
                ))}
                <div className="coupon-row">
                  <input
                    value={couponDraft}
                    onChange={(e) => setCouponDraft(e.target.value)}
                    placeholder="Coupon · ORVA10"
                  />
                  <button type="button" onClick={() => applyCoupon(couponDraft)}>
                    Apply
                  </button>
                  {couponCode && (
                    <button type="button" className="linkish" onClick={clearCoupon}>
                      Clear {couponCode}
                    </button>
                  )}
                </div>
                {couponError && <p className="auth-err">{couponError}</p>}
                {couponCode && LOCAL_COUPONS[couponCode] && (
                  <p className="muted">
                    Applied {couponCode} — {LOCAL_COUPONS[couponCode].label}
                  </p>
                )}
                <p className="muted">Subtotal {money(subtotal)}</p>
                {discount > 0 && <p className="muted">Discount −{money(discount)}</p>}
                <p className="price">Total {money(total)}</p>
                <ReferralBanner onApply={() => applyCoupon("ORVAFRIEND")} />
              </>
            )}
            <button
              type="button"
              className="primary"
              disabled={!bag.length}
              onClick={() => {
                setShowBag(false);
                if (!liveSession && !config.featureFlags.guestCheckout) {
                  setShowAuth(true, "login");
                  return;
                }
                setCheckout(true);
              }}
            >
              {liveSession || config.featureFlags.guestCheckout
                ? "Proceed to checkout"
                : "Sign in to checkout"}
            </button>
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkout && !orderOk && (
          <Overlay onClose={() => setCheckout(false)}>
            <CheckoutPanel
              guestAllowed={config.featureFlags.guestCheckout}
              isGuest={!liveSession}
              name={checkoutName}
              phone={checkoutPhone}
              address={checkoutAddress}
              email={checkoutEmail}
              payment={paymentMethod}
              saveAddress={saveAddress}
              addresses={addresses}
              total={total}
              currency={config.currency}
              locale={config.locale}
              error={authError}
              onName={setCheckoutName}
              onPhone={setCheckoutPhone}
              onAddress={setCheckoutAddress}
              onEmail={setCheckoutEmail}
              onPayment={setPaymentMethod}
              onSaveAddress={setSaveAddress}
              onPickAddress={(a) => {
                setCheckoutName(a.name);
                setCheckoutPhone(a.phone);
                setCheckoutAddress(a.line);
              }}
              onSignIn={() => {
                setCheckout(false);
                setShowAuth(true, "login");
              }}
              onSubmit={() => {
                const ok = placeOrder({
                  customerName: checkoutName,
                  address: checkoutAddress,
                  phone: checkoutPhone,
                  paymentMethod,
                  guestEmail: checkoutEmail,
                  saveAddress,
                });
                if (ok) {
                  window.setTimeout(() => setOrderOk(false), 4000);
                }
              }}
            />
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSearch && (
          <Overlay onClose={() => setShowSearch(false)}>
            <h3>Search {config.brandName}</h3>
            <label>
              Find products
              <input
                autoFocus
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Try yoga mat, under 3000, best rated…"
              />
            </label>
            <div className="orva-smart-chips">
              {["under 3000", "best rated", "fashion", "electronics", "luxury"].map((chip) => (
                <button type="button" key={chip} onClick={() => setSearchQ(chip)}>
                  {chip}
                </button>
              ))}
            </div>
            {!searchQ.trim() && recent.length > 0 && (
              <>
                <p className="muted">Recently viewed</p>
                <div className="suggest-grid">
                  {recent.slice(0, 4).map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className="suggest-card"
                      onClick={() => openProduct(p)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" />
                      <strong>{p.name}</strong>
                      <span>{money(p.price)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {searchQ.trim() && searchHits.length === 0 && (
              <p className="muted">No matches. Try another word.</p>
            )}
            {searchHits.length > 0 && (
              <div className="search-hits">
                {searchHits.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className="search-hit"
                    onClick={() => openProduct(p)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" />
                    <span>
                      <strong>{p.name}</strong>
                      <small>
                        {p.category} · {p.subcategory}
                      </small>
                    </span>
                    <em>{money(p.price)}</em>
                  </button>
                ))}
              </div>
            )}
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWishlist && (
          <Overlay onClose={() => setShowWishlist(false)}>
            <h3>Saved items</h3>
            {wishlist.length === 0 ? (
              <p className="muted">Nothing saved yet. Tap ♥ on a product to keep it here.</p>
            ) : (
              <div className="search-hits">
                {wishlist.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className="search-hit"
                    onClick={() => openProduct(p)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" />
                    <span>
                      <strong>{p.name}</strong>
                      <small>Tap to view</small>
                    </span>
                    <em>{money(p.price)}</em>
                  </button>
                ))}
              </div>
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
          <Overlay onClose={() => { setShowOrders(false); setTrackingOrderId(null); }}>
            <h3>Orders & tracking</h3>
            {!liveSession && myOrders.length === 0 ? (
              <p className="muted">
                No guest orders yet. Place an order with guest checkout, or{" "}
                <button type="button" className="linkish" onClick={() => setShowAuth(true, "login")}>
                  sign in
                </button>
                .
              </p>
            ) : myOrders.length === 0 ? (
              <p className="muted">No orders yet.</p>
            ) : (
              <div className="order-list">
                {myOrders.map((o) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    money={money}
                    onAdvance={() => advanceOrderStatus(o.id)}
                    onReorder={() => runReorder(o.id)}
                  />
                ))}
              </div>
            )}
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {helpSection && (
          <Overlay onClose={() => setHelpSection(null)}>
            <h3>Help center</h3>
            <div className="help-tabs">
              {HELP_SECTIONS.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={helpSection === s.id ? "on" : ""}
                  onClick={() => setHelpSection(s.id)}
                >
                  {s.title}
                </button>
              ))}
            </div>
            {HELP_SECTIONS.filter((s) => s.id === helpSection).map((s) => (
              <div key={s.id} className="help-body">
                <h4>{s.title}</h4>
                {s.body.map((line) => (
                  <p key={line} className="muted">
                    {line}
                  </p>
                ))}
              </div>
            ))}
            <div className="row">
              <button type="button" className="primary" onClick={() => { setHelpSection(null); goShop(); }}>
                Shop now
              </button>
              <button type="button" onClick={() => { setHelpSection(null); goDirectory(); }}>
                Directory
              </button>
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {orderOk && (
          <motion.div className="mp-ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <span>✓</span>
              <h2>Order confirmed</h2>
              <p className="muted">
                {lastOrderId ? `Order ${lastOrderId}` : "Saved"} · tracking is ready
              </p>
              <div className="row" style={{ justifyContent: "center", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    setOrderOk(false);
                    goShop();
                  }}
                >
                  Continue shopping
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderOk(false);
                    if (lastOrderId) setTrackingOrderId(lastOrderId);
                    setShowOrders(true);
                  }}
                >
                  Track order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartNudge />
      <CartToast
        onOpenBag={() => setShowBag(true)}
        onCheckout={() => {
          setShowBag(false);
          setCheckout(true);
        }}
      />
      <CompareTray
        onOpen={(p) => {
          openProduct(p, phase === "shop" || !started ? "shop" : returnPhase);
        }}
      />
      {started && phase !== "product" && phase !== "store" && <MobileStickyBag onShop={goShop} />}
      {started && (phase === "floors" || phase === "lobby") && (
        <SkipToShop onShop={goShop} />
      )}
    </div>
  );
}

function Intro({
  config,
  onExplore,
  onShop,
  onDirectory,
  onHelp,
  onOpenFloor,
  floors,
  boutiques,
  bagCount,
  onBag,
  sessionName,
  onAuth,
  onOrders,
  orderCount,
  onLogout,
  onSearch,
  onWishlist,
  wishCount,
}: {
  config: MallSiteConfig;
  onExplore: () => void;
  onShop: () => void;
  onDirectory: () => void;
  onHelp: (section?: string) => void;
  onOpenFloor: (index: number) => void;
  floors: { label: string; title: string; categoryName: string; hero: string; storeCount?: number }[];
  boutiques: StoreNode[];
  bagCount: number;
  onBag: () => void;
  sessionName: string | null;
  onAuth: (mode: "login" | "signup") => void;
  onOrders: () => void;
  orderCount: number;
  onLogout: () => void;
  onSearch: () => void;
  onWishlist: () => void;
  wishCount: number;
}) {
  const { floors: catalogFloors } = useCatalog();
  const todayEdit = useMemo(() => suggestProducts(8, [], catalogFloors), [catalogFloors]);
  const foodPicks = useMemo(
    () => catalogFloors.flatMap((f) => f.stores.filter((s) => s.category === "food").flatMap((s) => s.products)).slice(0, 4),
    [catalogFloors],
  );
  const foodStores = useMemo(
    () => catalogFloors.flatMap((f) => f.stores.filter((s) => s.category === "food")).slice(0, 6),
    [catalogFloors],
  );
  const addToBag = useMallStore((s) => s.addToBag);

  return (
    <OrvaMarketingHome
      config={config}
      floors={floors}
      boutiques={boutiques}
      picks={todayEdit}
      foodPicks={foodPicks}
      foodStores={foodStores}
      onShop={() => onShop()}
      onDirectory={onDirectory}
      onFloors={onExplore}
      onFood={onShop}
      onOpenFloor={onOpenFloor}
      onOpenStore={() => onDirectory()}
      onBuyNow={(p) => {
        addToBag(p);
        onBag();
      }}
      topBar={
        <header className="orva-land-top">
          <strong>{config.brandName}</strong>
          <div className="orva-land-top-actions">
            <LiveSourceBadge />
            <button type="button" onClick={onSearch}>
              Search
            </button>
            <button type="button" onClick={onDirectory}>
              Directory
            </button>
            <button type="button" onClick={onWishlist}>
              Saved{wishCount ? ` (${wishCount})` : ""}
            </button>
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
                  Join
                </button>
              </>
            )}
            <button type="button" className="orva-land-top-cart" onClick={onBag}>
              Cart ({bagCount})
            </button>
          </div>
        </header>
      }
      footer={<MallFooter onShop={onShop} onExplore={onExplore} onDirectory={onDirectory} onHelp={onHelp} />}
    />
  );
}

function FloorScroll({
  pages,
  floor,
  brandName = "Orva",
  onFloorChange,
  onEnterLobby,
}: {
  pages: FloorPage[];
  floor: number;
  brandName?: string;
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
            <FloorSlide
              page={page}
              brandName={brandName}
              onEnterLobby={(pic) => onEnterLobby(i, pic)}
            />
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
  brandName = "Orva",
  onEnterLobby,
}: {
  page: FloorPage;
  brandName?: string;
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
          {brandName} · Floor {page.label}
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
            <li key={sub}>
              <button type="button" onClick={() => onEnterLobby(page.hero)}>
                {sub}
              </button>
            </li>
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
          <span>Tap a store to browse products</span>
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
        {filtered.length === 0 ? (
          <div className="fl-empty">
            <p>No stores in {activeSub}.</p>
            <button type="button" className="primary" onClick={() => setActiveSub("All")}>
              See all departments
            </button>
            <div className="fl-empty-suggest">
              {page.stores.slice(0, 2).map((s) => (
                <button type="button" key={s.id} className="suggest-card" onClick={() => onOpenStore(s)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.doorImage} alt="" />
                  <strong>{s.name}</strong>
                  <span>{s.subcategory}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
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
                    y: 28,
                    scale: 0.96,
                  }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 140, damping: 18 }}
                  whileTap={{ scale: 0.98 }}
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
        )}
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
