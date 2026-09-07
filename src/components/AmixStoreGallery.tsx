"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { ProductPrice } from "@/components/ui/ProductPrice";
import { StockPill } from "@/components/ui/StockPill";
import { ProductBadges } from "@/components/ui/ProductBadges";
import type { Product, StoreNode } from "@/types/mall";

type Props = {
  store: StoreNode;
  floorLabel: string;
  accent: string;
  currency?: string;
  locale?: string;
  onBack: () => void;
  onOpenProduct: (p: Product) => void;
  onBuy: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  onShop?: () => void;
};

export function AmixStoreGallery({
  store,
  floorLabel,
  accent,
  currency = "INR",
  locale = "en-IN",
  onBack,
  onOpenProduct,
  onBuy,
  onBuyNow,
  onShop,
}: Props) {
  const [compact, setCompact] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (compact === null) {
    return (
      <section
        className="amix-m amix-m-boot"
        style={{
          ["--store-bg" as string]: store.theme.floor,
          ["--store-ink" as string]: store.theme.primary,
        }}
        aria-busy
      >
        <p>Loading collection…</p>
      </section>
    );
  }

  if (compact) {
    return (
      <MobileStoreBrowse
        store={store}
        floorLabel={floorLabel}
        accent={accent}
        currency={currency}
        locale={locale}
        onBack={onBack}
        onOpenProduct={onOpenProduct}
        onBuy={onBuy}
        onBuyNow={onBuyNow}
        onShop={onShop}
      />
    );
  }

  return (
    <DesktopStoreGallery
      store={store}
      floorLabel={floorLabel}
      accent={accent}
      currency={currency}
      locale={locale}
      onBack={onBack}
      onOpenProduct={onOpenProduct}
      onBuy={onBuy}
      onBuyNow={onBuyNow}
      onShop={onShop}
    />
  );
}

/** Touch-first catalog for phones and tablets */
function MobileStoreBrowse({
  store,
  floorLabel,
  accent,
  currency = "INR",
  locale = "en-IN",
  onBack,
  onOpenProduct,
  onBuy,
  onBuyNow,
  onShop,
}: Props) {
  const theme = store.theme;
  const products = store.products;
  const [focus, setFocus] = useState(0);
  const current = products[focus] ?? products[0];

  return (
    <section
      className="amix-m"
      style={{
        ["--a" as string]: accent,
        ["--store-bg" as string]: theme.floor,
        ["--store-wall" as string]: theme.wall,
        ["--store-ink" as string]: theme.primary,
        ["--store-accent" as string]: theme.accent,
      }}
    >
      <header className="amix-m-top">
        <button type="button" className="amix-m-back" onClick={onBack}>
          ← Lobby
        </button>
        <div className="amix-m-brand">
          <p>
            Floor {floorLabel} · {store.subcategory}
          </p>
          <h2>{store.name}</h2>
        </div>
        {onShop && (
          <button type="button" className="amix-m-shop" onClick={onShop}>
            Shop
          </button>
        )}
      </header>

      <p className="amix-m-count">{products.length} products · tap Buy to order fast</p>

      <div className="amix-m-list">
        {products.map((p, i) => (
          <motion.article
            key={p.id}
            className={`amix-m-card ${focus === i ? "on" : ""}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.28), duration: 0.35 }}
            onClick={() => setFocus(i)}
          >
            <button type="button" className="amix-m-media" onClick={() => onOpenProduct(p)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} loading="lazy" />
              <ProductBadges badges={p.badges} />
            </button>
            <div className="amix-m-body">
              <button type="button" className="amix-m-title" onClick={() => onOpenProduct(p)}>
                <strong>{p.name}</strong>
                <span>{p.description}</span>
              </button>
              <div className="amix-m-meta">
                <em>★ {p.rating.toFixed(1)}</em>
                <StockPill stock={p.stock} />
              </div>
              <ProductPrice product={p} currency={currency} locale={locale} size="sm" />
              <p className="amix-trust-line">2–4 day delivery · 7-day returns</p>
              <div className="amix-m-actions">
                <button type="button" className="buy-now" onClick={() => onBuyNow(p)}>
                  Buy now
                </button>
                <button type="button" className="bag" onClick={() => onBuy(p)}>
                  Add
                </button>
                <button type="button" className="view" onClick={() => onOpenProduct(p)}>
                  Details
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {current && (
        <div className="amix-m-sticky">
          <div>
            <strong>{current.name.split(" · ")[0]}</strong>
            <ProductPrice product={current} currency={currency} locale={locale} size="sm" />
          </div>
          <button type="button" onClick={() => onBuy(current)}>
            Add
          </button>
          <button type="button" className="buy-now" onClick={() => onBuyNow(current)}>
            Buy
          </button>
        </div>
      )}
    </section>
  );
}

function DesktopStoreGallery({
  store,
  floorLabel,
  accent,
  currency = "INR",
  locale = "en-IN",
  onBack,
  onOpenProduct,
  onBuy,
  onBuyNow,
  onShop,
}: Props) {
  const products = store.products;
  const [active, setActive] = useState(-1);
  const progress = useRef(0);
  const [progressUi, setProgressUi] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  const sides = useMemo(() => products.map((_, i) => (i % 2 === 0 ? -1 : 1)), [products]);
  const theme = store.theme;
  const titleMode = progressUi < 0.12;
  const introDone = progressUi > 0.1;
  const productProgress = Math.max(0, (progressUi - 0.12) / 0.88);
  const current = active >= 0 ? products[active] : null;
  const sideLabel = active < 0 ? "" : active % 2 === 0 ? "Featured left" : "Featured right";

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      progress.current = p;
      setProgressUi(p);
      if (p <= 0.12) {
        setActive(-1);
        return;
      }
      const pp = (p - 0.12) / 0.88;
      const idx = Math.round(pp * Math.max(0, products.length - 1));
      setActive(THREE.MathUtils.clamp(idx, 0, products.length - 1));
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
    };
  }, [products.length]);

  const jumpTo = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const p = 0.12 + (products.length <= 1 ? 0 : (index / (products.length - 1)) * 0.88);
    el.scrollTo({ top: p * max, behavior: "smooth" });
  };

  return (
    <section
      className="amix3 amix3-light"
      style={{
        ["--a" as string]: accent,
        ["--store-bg" as string]: theme.floor,
        ["--store-wall" as string]: theme.wall,
        ["--store-ink" as string]: theme.primary,
        ["--store-accent" as string]: theme.accent,
      }}
    >
      <div className="amix3-scroller" ref={scroller}>
        <div className="amix3-spacer" style={{ height: `${(2 + products.length) * 95}vh` }} />
      </div>

      <div className="amix3-sticky">
        <button type="button" className="amix3-back" onClick={onBack}>
          <span className="amix3-back-full">← Back to lobby</span>
          <span className="amix3-back-short">← Lobby</span>
        </button>

        <motion.div
          className={`amix3-title ${titleMode ? "hero" : "dock"}`}
          animate={{
            top: titleMode ? "50%" : "4.55rem",
            left: titleMode ? "50%" : "1.1rem",
            x: titleMode ? "-50%" : "0%",
            y: titleMode ? "-50%" : "0%",
            scale: titleMode ? 1 : 0.38,
          }}
          transition={{ type: "spring", stiffness: 130, damping: 18 }}
        >
          <p className="amix3-kicker">
            Floor {floorLabel} · {store.subcategory}
          </p>
          <h2 className="amix3-store-name">{store.name}</h2>
          {titleMode && (
            <span className="amix3-start">Scroll to browse the full collection</span>
          )}
        </motion.div>

        <div className="amix3-canvas">
          <Canvas camera={{ position: [0, 0.55, 6.2], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
            <color attach="background" args={[theme.floor]} />
            <fog attach="fog" args={[theme.floor, 11, 28]} />
            <ambientLight intensity={1.25} />
            <hemisphereLight args={["#ffffff", theme.wall, 0.85]} />
            <pointLight position={[0, 4.2, 3.2]} intensity={2.2} color="#ffffff" />
            <pointLight position={[3.4, 2.6, 2.8]} intensity={1.1} color={theme.accent} />
            <pointLight position={[-3.4, 2.4, 2.6]} intensity={1.05} color={theme.primary} />
            <spotLight
              position={[0, 5.8, 3.8]}
              angle={0.48}
              penumbra={0.75}
              intensity={1.85}
              color="#ffffff"
            />
            <Suspense fallback={null}>
              <MovingBackdrop theme={theme} progressRef={progress} />
              <ProductField
                products={products}
                sides={sides}
                activeIndex={active}
                accent={theme.accent}
                primary={theme.primary}
                onSelect={(i) => {
                  jumpTo(i);
                }}
              />
            </Suspense>
          </Canvas>
        </div>

        <AnimatePresence mode="wait">
          {introDone && current && (
            <motion.aside
              key={current.id}
              className={`amix3-review ${active % 2 === 0 ? "dock-right" : "dock-left"}`}
              initial={{ opacity: 0, y: 18, x: active % 2 === 0 ? 24 : -24 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="amix3-side-pill" data-side={active % 2 === 0 ? "left" : "right"}>
                <i />
                <span>{sideLabel}</span>
                <em>
                  {String(active + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
                </em>
              </div>
              <ProductBadges badges={current.badges} />
              <h3>{current.name}</h3>
              <p className="amix3-copy">{current.description}</p>
              <ul>
                <li>
                  <em>Rating</em>
                  <span>★ {current.rating.toFixed(1)} / 5</span>
                </li>
                <li>
                  <em>Colors</em>
                  <span>{current.colors.join(" · ")}</span>
                </li>
                <li>
                  <em>Sizes</em>
                  <span>{current.sizes.join(" / ")}</span>
                </li>
              </ul>
              {current.reviews?.[0] && (
                <blockquote className="amix3-review-snip">
                  “{current.reviews[0].body.slice(0, 88)}
                  {current.reviews[0].body.length > 88 ? "…" : ""}”
                  <cite>— {current.reviews[0].author}</cite>
                </blockquote>
              )}
              <div className="amix3-price-row">
                <ProductPrice product={current} currency={currency} locale={locale} size="lg" />
                <StockPill stock={current.stock} />
              </div>
              <p className="amix-trust-line">
                {current.shippingNote ?? "Delivery in 2–4 days"} ·{" "}
                {current.returnNote ?? "7-day easy returns"}
              </p>
              <div className="amix3-actions">
                <button type="button" className="buy-now" onClick={() => onBuyNow(current)}>
                  Buy now
                </button>
                <button type="button" className="bag" onClick={() => onBuy(current)}>
                  Add to cart
                </button>
                <button type="button" className="view" onClick={() => onOpenProduct(current)}>
                  View details
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {onShop && (
          <button type="button" className="amix3-skip-shop" onClick={onShop}>
            Skip to Shop
          </button>
        )}

        <div className="amix3-progress">
          <i style={{ width: `${Math.round(productProgress * 100)}%` }} />
        </div>
        <p className="amix3-hint">
          {titleMode
            ? "Scroll to explore · Buy now from the card"
            : active % 2 === 0
              ? "Product left · order from the card"
              : "Product right · order from the card"}
        </p>
      </div>
    </section>
  );
}

function MovingBackdrop({
  theme,
  progressRef,
}: {
  theme: StoreNode["theme"];
  progressRef: React.MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const ribbon = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    const p = progressRef.current;
    if (group.current) {
      group.current.rotation.y += dt * 0.08;
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, -p * 4, 3, dt);
    }
    if (ribbon.current) {
      ribbon.current.rotation.z = Math.sin(p * Math.PI * 2) * 0.25;
      ribbon.current.position.x = Math.sin(p * 6) * 0.6;
    }
  });

  return (
    <group>
      <mesh ref={ribbon} position={[0, 0.8, -6]}>
        <planeGeometry args={[18, 10]} />
        <meshBasicMaterial color={theme.wall} transparent opacity={0.55} />
      </mesh>
      <group ref={group} position={[0, 0.6, -4]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 3.2, Math.sin(a * 1.4) * 1.1, Math.sin(a) * 1.4]}>
              <sphereGeometry args={[0.55 + (i % 3) * 0.12, 24, 24]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? theme.accent : theme.primary}
                transparent
                opacity={0.22}
                roughness={0.35}
                metalness={0.15}
              />
            </mesh>
          );
        })}
      </group>
      <FrontWash color={theme.accent} progressRef={progressRef} />
    </group>
  );
}

function FrontWash({
  color,
  progressRef,
}: {
  color: string;
  progressRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const p = progressRef.current;
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, 2.2 - p * 3.5, 4, dt);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(p * Math.PI) * 0.06;
  });
  return (
    <mesh ref={ref} position={[0, 0.5, 2]}>
      <circleGeometry args={[3.2, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
    </mesh>
  );
}

function ProductField({
  products,
  sides,
  activeIndex,
  accent,
  primary,
  onSelect,
}: {
  products: Product[];
  sides: number[];
  activeIndex: number;
  accent: string;
  primary: string;
  onSelect: (i: number) => void;
}) {
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  return (
    <group>
      {products.map((p, i) => (
        <ShowcaseCard
          key={p.id}
          product={p}
          index={i}
          side={sides[i]}
          activeRef={activeRef}
          accent={accent}
          primary={primary}
          onSelect={() => onSelect(i)}
        />
      ))}
    </group>
  );
}

function ShowcaseCard({
  product,
  index,
  side,
  activeRef,
  accent,
  primary,
  onSelect,
}: {
  product: Product;
  index: number;
  side: number;
  activeRef: React.MutableRefObject<number>;
  accent: string;
  primary: string;
  onSelect: () => void;
}) {
  const root = useRef<THREE.Group>(null);
  const enter = useRef(0);
  const lastOn = useRef(false);
  const offSide = useRef(side);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const glow = useRef<THREE.PointLight>(null);
  const tex = useMemo(() => {
    const t = new THREE.TextureLoader().load(product.image);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [product.image]);

  const isLeft = side < 0;

  useFrame((_, dt) => {
    if (!root.current) return;
    const isOn = unlockedActive(activeRef.current, index);

    if (isOn !== lastOn.current) {
      offSide.current = isOn ? side : -side;
      lastOn.current = isOn;
    }

    enter.current = THREE.MathUtils.damp(enter.current, isOn ? 1 : 0, isOn ? 6.5 : 11, dt);

    const restX = side * 1.72;
    const offX = offSide.current * 9.2;
    const x = THREE.MathUtils.lerp(offX, restX, enter.current);
    const y = THREE.MathUtils.lerp(0.05, 0.42, enter.current);
    const z = THREE.MathUtils.lerp(8, 0.15, enter.current);
    const base = isLeft ? 1.42 : 1.28;
    const s = base * enter.current;

    root.current.position.set(x, y, z);
    root.current.rotation.y = THREE.MathUtils.lerp(
      offSide.current * 0.75,
      side * 0.12,
      enter.current,
    );
    root.current.rotation.z = THREE.MathUtils.lerp(offSide.current * 0.05, 0, enter.current);
    root.current.scale.setScalar(Math.max(0.001, s));
    root.current.visible = enter.current > 0.04;

    if (matRef.current) {
      matRef.current.emissiveIntensity = isOn ? 0.12 : 0;
      matRef.current.roughness = 0.28;
    }
    if (glow.current) {
      glow.current.intensity = THREE.MathUtils.damp(
        glow.current.intensity,
        isOn ? (isLeft ? 2.6 : 2.4) : 0,
        8,
        dt,
      );
    }
  });

  const w = isLeft ? 1.78 : 1.58;
  const h = isLeft ? 2.28 : 2.05;

  return (
    <group ref={root} visible={false}>
      <pointLight ref={glow} position={[0, 0.35, 1.35]} intensity={0} color="#ffffff" distance={5} />
      <mesh position={[0, -h / 2 - 0.12, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[Math.max(w, h) * 0.42, 32]} />
        <meshBasicMaterial color="#0d2a2c" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          ref={matRef}
          map={tex}
          roughness={0.32}
          metalness={0.06}
          emissive={accent}
          emissiveIntensity={0.03}
        />
      </mesh>
      <mesh position={[0, 0, -0.028]}>
        <planeGeometry args={[w + 0.08, h + 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[w + 0.14, h + 0.14]} />
        <meshStandardMaterial color={primary} emissive={accent} emissiveIntensity={0.14} />
      </mesh>
      <Html
        position={[0, -(h / 2 + 0.2), 0.05]}
        center
        distanceFactor={7}
        style={{ pointerEvents: "none" }}
      >
        <div className={`amix3-plane-label ${isLeft ? "big" : ""}`}>{product.name}</div>
      </Html>
    </group>
  );
}

function unlockedActive(active: number, index: number) {
  return active >= 0 && active === index;
}
