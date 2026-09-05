"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mallFloors } from "@/data/mallData";
import { useMallStore } from "@/store/useMallStore";
import type { Product, StoreNode } from "@/types/mall";

const allStores = mallFloors.flatMap((f) =>
  f.stores.map((s) => ({ ...s, floorLabel: f.label })),
);

export function StoreFlow() {
  const activeStoreId = useMallStore((s) => s.activeStoreId);
  const setActiveStoreId = useMallStore((s) => s.setActiveStoreId);
  const setInspect = useMallStore((s) => s.setInspect);
  const addToBag = useMallStore((s) => s.addToBag);
  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [entering, setEntering] = useState(false);

  const stores =
    floorFilter === "all" ? allStores : allStores.filter((s) => s.floor === floorFilter);
  const active = allStores.find((s) => s.id === activeStoreId) ?? null;

  const enterStore = (id: string) => {
    setEntering(true);
    window.setTimeout(() => {
      setActiveStoreId(id);
      setEntering(false);
    }, 700);
  };

  const exitStore = () => {
    setEntering(true);
    window.setTimeout(() => {
      setActiveStoreId(null);
      setEntering(false);
    }, 500);
  };

  return (
    <section id="stores" className="sf">
      <div className="sf-head">
        <p className="mm-kicker">Inside the mall</p>
        <h2>{active ? "Store room" : "Store list"}</h2>
        <p>
          {active
            ? "Products animate onto the displays. Tap to inspect."
            : "Same walk energy — scroll the corridor, then enter a room."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            transition={{ duration: 0.45 }}
          >
            <div className="sf-floors">
              <button
                className={floorFilter === "all" ? "on" : ""}
                onClick={() => setFloorFilter("all")}
              >
                All
              </button>
              {mallFloors.map((f) => (
                <button
                  key={f.id}
                  className={floorFilter === f.level ? "on" : ""}
                  onClick={() => setFloorFilter(f.level)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="sf-corridor">
              <div className="sf-corridor-depth" />
              <div className="sf-rail">
                {stores.map((store, i) => (
                  <motion.article
                    key={store.id}
                    className="sf-store"
                    style={theme(store)}
                    initial={{ opacity: 0, y: 40, rotateY: i % 2 ? -12 : 12 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: i % 2 ? -6 : 6 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ delay: (i % 6) * 0.06, duration: 0.55 }}
                    whileHover={{ y: -8, rotateY: 0, scale: 1.02 }}
                  >
                    <div className="sf-store-window">
                      <img src={`https://picsum.photos/seed/${store.id}-flow/700/900`} alt="" />
                      <div className="sf-logo">{store.name}</div>
                      <div className="sf-meta">
                        Floor {store.floorLabel} · {store.wing} · {store.category}
                      </div>
                    </div>
                    <motion.button
                      className="sf-enter"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => enterStore(store.id)}
                    >
                      Enter room →
                    </motion.button>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <StoreRoom
            key={active.id}
            store={active}
            onExit={exitStore}
            onInspect={setInspect}
            onAdd={addToBag}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {entering && (
          <motion.div
            className="sf-door-wipe"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{active ? "Leaving store…" : "Entering store…"}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StoreRoom({
  store,
  onExit,
  onInspect,
  onAdd,
}: {
  store: StoreNode & { floorLabel: string };
  onExit: () => void;
  onInspect: (p: Product) => void;
  onAdd: (p: Product) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ left: 0 });
  }, [store.id]);

  return (
    <motion.div
      className="sf-room"
      style={theme(store)}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 40, filter: "blur(8px)" }}
      transition={{ duration: 0.55 }}
    >
      <div className="sf-room-top">
        <button onClick={onExit}>← Back to store list</button>
        <div>
          <strong>{store.name}</strong>
          <span>
            Floor {store.floorLabel} · {store.category}
          </span>
        </div>
      </div>

      <div className="sf-room-stage" ref={scroller}>
        <div className="sf-room-track">
          <div className="sf-room-seg intro">
            <img src={`https://picsum.photos/seed/${store.id}-room/1200/700`} alt="" />
            <motion.div
              className="sf-room-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p>Welcome to</p>
              <h3>{store.name}</h3>
              <span>Swipe to walk the room · products appear on displays</span>
            </motion.div>
          </div>

          {chunk(store.products, 6).map((group, gi) => (
            <div key={gi} className="sf-room-seg aisle">
              <div className="sf-aisle-floor" />
              <div className="sf-shelves left">
                {group.slice(0, 3).map((p, i) => (
                  <ProductPop
                    key={p.id}
                    product={p}
                    delay={0.15 + i * 0.08}
                    onInspect={onInspect}
                    onAdd={onAdd}
                  />
                ))}
              </div>
              <div className="sf-shelves right">
                {group.slice(3).map((p, i) => (
                  <ProductPop
                    key={p.id}
                    product={p}
                    delay={0.25 + i * 0.08}
                    onInspect={onInspect}
                    onAdd={onAdd}
                  />
                ))}
              </div>
              <div className="sf-center">
                {group[0] && (
                  <ProductPop
                    product={group[0]}
                    featured
                    delay={0.35}
                    onInspect={onInspect}
                    onAdd={onAdd}
                  />
                )}
              </div>
            </div>
          ))}

          <div className="sf-room-seg end">
            <p>End of room</p>
            <button onClick={onExit}>Leave store</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductPop({
  product,
  onInspect,
  onAdd,
  delay = 0,
  featured = false,
}: {
  product: Product;
  onInspect: (p: Product) => void;
  onAdd: (p: Product) => void;
  delay?: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      className={`sf-product ${featured ? "featured" : ""}`}
      initial={{ opacity: 0, y: 50, scale: 0.85, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
    >
      <button className="sf-product-hit" onClick={() => onInspect(product)}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <strong>{product.name}</strong>
        <em>₹{product.price.toLocaleString("en-IN")}</em>
      </button>
      <button className="sf-add" onClick={() => onAdd(product)}>
        Add
      </button>
    </motion.div>
  );
}

function theme(store: StoreNode) {
  return {
    ["--primary" as string]: store.theme.primary,
    ["--accent" as string]: store.theme.accent,
    ["--wall" as string]: store.theme.wall,
    ["--floor" as string]: store.theme.floor,
  } as React.CSSProperties;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
