"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/mall";

export type MallUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type CartLine = {
  key: string;
  product: Product;
  qty: number;
  size: string;
  color: string;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
  color?: string;
};

export type OrderStatus = "Confirmed" | "Packing" | "Shipped" | "Out for delivery" | "Delivered";

export type PaymentMethod = "upi" | "card" | "cod";

export type TimelineStep = {
  status: OrderStatus;
  at: string;
  note?: string;
};

export type SavedAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line: string;
};

export type MallOrder = {
  id: string;
  userId: string;
  guestEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string;
  address: string;
  phone: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  timeline: TimelineStep[];
  createdAt: string;
  eta?: string;
};

export const LOCAL_COUPONS: Record<string, { percent: number; label: string }> = {
  ORVA10: { percent: 10, label: "10% off" },
  MEGA10: { percent: 10, label: "10% off" },
  WELCOME50: { percent: 5, label: "Welcome 5% off" },
  ORVAFRIEND: { percent: 10, label: "Referral 10% off" },
  FREESHIP: { percent: 0, label: "Free shipping (demo)" },
};

export const ORDER_FLOW: OrderStatus[] = [
  "Confirmed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

export const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: "upi", label: "UPI", hint: "Demo · GPay / PhonePe style" },
  { id: "card", label: "Card", hint: "Demo · Visa / Mastercard" },
  { id: "cod", label: "Cash on delivery", hint: "Pay when it arrives" },
];

type MallState = {
  bag: CartLine[];
  wishlist: Product[];
  recent: Product[];
  compare: Product[];
  addresses: SavedAddress[];
  couponCode: string;
  couponError: string | null;
  inspect: Product | null;
  showBag: boolean;
  checkout: boolean;
  orderOk: boolean;
  lastOrderId: string | null;
  cartPulse: number;
  cartNudgeAt: number | null;
  cartToast: { name: string; image?: string; price?: number } | null;
  activeStoreId: string | null;
  users: MallUser[];
  session: Omit<MallUser, "password"> | null;
  orders: MallOrder[];
  showAuth: boolean;
  authMode: "login" | "signup";
  showOrders: boolean;
  showSearch: boolean;
  showWishlist: boolean;
  showCompare: boolean;
  trackingOrderId: string | null;
  authError: string | null;
  addToBag: (p: Product, opts?: { size?: string; color?: string; qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  removeFromBag: (key: string) => void;
  toggleWishlist: (p: Product) => void;
  isWishlisted: (id: string) => boolean;
  pushRecent: (p: Product) => void;
  toggleCompare: (p: Product) => void;
  clearCompare: () => void;
  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;
  setInspect: (p: Product | null) => void;
  setShowBag: (v: boolean) => void;
  setCheckout: (v: boolean) => void;
  setOrderOk: (v: boolean) => void;
  setActiveStoreId: (id: string | null) => void;
  clearBag: () => void;
  setShowAuth: (v: boolean, mode?: "login" | "signup") => void;
  setShowOrders: (v: boolean) => void;
  setShowSearch: (v: boolean) => void;
  setShowWishlist: (v: boolean) => void;
  setShowCompare: (v: boolean) => void;
  setTrackingOrderId: (id: string | null) => void;
  clearAuthError: () => void;
  dismissCartNudge: () => void;
  dismissCartToast: () => void;
  flashCartToast: (p: Product) => void;
  saveAddress: (a: Omit<SavedAddress, "id">) => void;
  removeAddress: (id: string) => void;
  signup: (name: string, email: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  placeOrder: (input: {
    customerName: string;
    address: string;
    phone: string;
    paymentMethod: PaymentMethod;
    guestEmail?: string;
    saveAddress?: boolean;
    addressLabel?: string;
  }) => boolean;
  advanceOrderStatus: (orderId: string) => void;
  reorder: (orderId: string) => boolean;
  bagCount: () => number;
  bagSubtotal: () => number;
  bagDiscount: () => number;
  bagTotal: () => number;
};

function publicUser(u: MallUser): Omit<MallUser, "password"> {
  return { id: u.id, name: u.name, email: u.email };
}

function lineKey(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`;
}

function migrateBag(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (item && typeof item === "object" && "product" in item && "qty" in item) {
        return item as CartLine;
      }
      const p = item as Product;
      if (!p?.id) return null;
      const size = p.sizes?.[0] ?? "One size";
      const color = p.colors?.[0] ?? "Default";
      return {
        key: lineKey(p.id, size, color),
        product: p,
        qty: 1,
        size,
        color,
      } satisfies CartLine;
    })
    .filter(Boolean) as CartLine[];
}

function migrateOrders(raw: unknown): MallOrder[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((o) => {
    const order = o as MallOrder;
    const status = (order.status as OrderStatus) || "Confirmed";
    const timeline =
      Array.isArray(order.timeline) && order.timeline.length
        ? order.timeline
        : [{ status: "Confirmed" as OrderStatus, at: order.createdAt || new Date().toISOString() }];
    return {
      ...order,
      status,
      paymentMethod: order.paymentMethod || "cod",
      timeline,
      eta: order.eta,
    };
  });
}

function etaDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const useMallStore = create<MallState>()(
  persist(
    (set, get) => ({
      bag: [],
      wishlist: [],
      recent: [],
      compare: [],
      addresses: [],
      couponCode: "",
      couponError: null,
      inspect: null,
      showBag: false,
      checkout: false,
      orderOk: false,
      lastOrderId: null,
      cartPulse: 0,
      cartNudgeAt: null,
      cartToast: null,
      activeStoreId: null,
      users: [],
      session: null,
      orders: [],
      showAuth: false,
      authMode: "login",
      showOrders: false,
      showSearch: false,
      showWishlist: false,
      showCompare: false,
      trackingOrderId: null,
      authError: null,

      bagCount: () => get().bag.reduce((n, l) => n + l.qty, 0),
      bagSubtotal: () => get().bag.reduce((n, l) => n + l.product.price * l.qty, 0),
      bagDiscount: () => {
        const code = get().couponCode;
        const deal = LOCAL_COUPONS[code];
        if (!deal?.percent) return 0;
        return Math.round((get().bagSubtotal() * deal.percent) / 100);
      },
      bagTotal: () => Math.max(0, get().bagSubtotal() - get().bagDiscount()),

      addToBag: (p, opts) => {
        const size = opts?.size ?? p.sizes[0] ?? "One size";
        const color = opts?.color ?? p.colors[0] ?? "Default";
        const qty = Math.max(1, opts?.qty ?? 1);
        const key = lineKey(p.id, size, color);
        set((s) => {
          const existing = s.bag.find((l) => l.key === key);
          const bag = existing
            ? s.bag.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
            : [...s.bag, { key, product: p, qty, size, color }];
          return {
            bag,
            cartPulse: s.cartPulse + 1,
            cartNudgeAt: Date.now() + 45_000,
            cartToast: { name: p.name, image: p.image, price: p.price },
          };
        });
        window.setTimeout(() => {
          const cur = get().cartToast;
          if (cur?.name === p.name) set({ cartToast: null });
        }, 5200);
      },

      setQty: (key, qty) =>
        set((s) => ({
          bag:
            qty <= 0
              ? s.bag.filter((l) => l.key !== key)
              : s.bag.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),

      removeFromBag: (key) => set((s) => ({ bag: s.bag.filter((l) => l.key !== key) })),

      toggleWishlist: (p) =>
        set((s) => {
          const on = s.wishlist.some((x) => x.id === p.id);
          return {
            wishlist: on ? s.wishlist.filter((x) => x.id !== p.id) : [p, ...s.wishlist].slice(0, 40),
          };
        }),

      isWishlisted: (id) => get().wishlist.some((x) => x.id === id),

      pushRecent: (p) =>
        set((s) => ({
          recent: [p, ...s.recent.filter((x) => x.id !== p.id)].slice(0, 12),
        })),

      toggleCompare: (p) =>
        set((s) => {
          const on = s.compare.some((x) => x.id === p.id);
          if (on) {
            return { compare: s.compare.filter((x) => x.id !== p.id), showCompare: s.compare.length > 1 };
          }
          if (s.compare.length >= 3) return s;
          return { compare: [...s.compare, p], showCompare: true };
        }),

      clearCompare: () => set({ compare: [], showCompare: false }),

      applyCoupon: (code) => {
        const c = code.trim().toUpperCase();
        if (!LOCAL_COUPONS[c]) {
          set({
            couponError: "Invalid code. Try ORVA10, WELCOME50, or ORVAFRIEND.",
            couponCode: "",
          });
          return false;
        }
        set({ couponCode: c, couponError: null });
        return true;
      },

      clearCoupon: () => set({ couponCode: "", couponError: null }),

      setInspect: (p) => set({ inspect: p }),
      setShowBag: (v) => set({ showBag: v, cartNudgeAt: v ? null : get().cartNudgeAt }),
      setCheckout: (v) => set({ checkout: v }),
      setOrderOk: (v) => set({ orderOk: v }),
      setActiveStoreId: (id) => set({ activeStoreId: id }),
      clearBag: () => set({ bag: [], couponCode: "", couponError: null, cartNudgeAt: null }),
      setShowAuth: (v, mode) =>
        set({
          showAuth: v,
          authMode: mode ?? get().authMode,
          authError: null,
        }),
      setShowOrders: (v) => set({ showOrders: v }),
      setShowSearch: (v) => set({ showSearch: v }),
      setShowWishlist: (v) => set({ showWishlist: v }),
      setShowCompare: (v) => set({ showCompare: v }),
      setTrackingOrderId: (id) => set({ trackingOrderId: id, showOrders: id ? true : get().showOrders }),
      clearAuthError: () => set({ authError: null }),
      dismissCartNudge: () => set({ cartNudgeAt: null }),
      dismissCartToast: () => set({ cartToast: null }),
      flashCartToast: (p) => {
        set({ cartToast: { name: p.name, image: p.image, price: p.price } });
        window.setTimeout(() => {
          const cur = get().cartToast;
          if (cur?.name === p.name) set({ cartToast: null });
        }, 5200);
      },

      saveAddress: (a) =>
        set((s) => ({
          addresses: [
            {
              id: `addr-${Date.now()}`,
              ...a,
            },
            ...s.addresses,
          ].slice(0, 6),
        })),

      removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),

      signup: (name, email, password) => {
        const n = name.trim();
        const e = email.trim().toLowerCase();
        const p = password.trim();
        if (!n || !e || p.length < 4) {
          set({
            authError: "Please enter your name, email, and a password (minimum 4 characters).",
          });
          return false;
        }
        if (get().users.some((u) => u.email === e)) {
          set({ authError: "This email is already registered. Please sign in." });
          return false;
        }
        const user: MallUser = {
          id: `u-${Date.now()}`,
          name: n,
          email: e,
          password: p,
        };
        set((s) => ({
          users: [...s.users, user],
          session: publicUser(user),
          showAuth: false,
          authError: null,
        }));
        return true;
      },

      login: (email, password) => {
        const e = email.trim().toLowerCase();
        const user = get().users.find((u) => u.email === e && u.password === password.trim());
        if (!user) {
          set({ authError: "Incorrect email or password." });
          return false;
        }
        set({ session: publicUser(user), showAuth: false, authError: null });
        return true;
      },

      logout: () => set({ session: null, showOrders: false }),

      placeOrder: ({
        customerName,
        address,
        phone,
        paymentMethod,
        guestEmail,
        saveAddress: shouldSave,
        addressLabel,
      }) => {
        const { session, bag, couponCode } = get();
        if (!bag.length) return false;

        const name = customerName.trim() || session?.name || "";
        const addr = address.trim();
        const ph = phone.trim();
        const email = (guestEmail || session?.email || "").trim().toLowerCase();

        if (!name) {
          set({ authError: "Please enter your name." });
          return false;
        }
        if (!addr) {
          set({ authError: "Please enter a delivery address." });
          return false;
        }
        if (!ph || ph.replace(/\D/g, "").length < 8) {
          set({ authError: "Please enter a valid phone number." });
          return false;
        }
        if (!session && !email) {
          set({ authError: "Add an email for guest order updates (demo)." });
          return false;
        }

        const subtotal = get().bagSubtotal();
        const discount = get().bagDiscount();
        const total = Math.max(0, subtotal - discount);
        const now = new Date().toISOString();
        const order: MallOrder = {
          id: `ord-${Date.now()}`,
          userId: session?.id ?? `guest-${Date.now()}`,
          guestEmail: session ? undefined : email,
          items: bag.map((l) => ({
            id: l.product.id,
            name: l.product.name,
            price: l.product.price,
            image: l.product.image,
            qty: l.qty,
            size: l.size,
            color: l.color,
          })),
          subtotal,
          discount,
          total,
          coupon: couponCode || undefined,
          address: addr,
          phone: ph,
          customerName: name,
          paymentMethod,
          status: "Confirmed",
          timeline: [
            {
              status: "Confirmed",
              at: now,
              note:
                paymentMethod === "cod"
                  ? "Order placed · pay on delivery"
                  : `Payment recorded (${paymentMethod.toUpperCase()} · demo)`,
            },
          ],
          createdAt: now,
          eta: etaDaysFromNow(3),
        };

        set((s) => ({
          orders: [order, ...s.orders],
          bag: [],
          couponCode: "",
          couponError: null,
          orderOk: true,
          lastOrderId: order.id,
          checkout: false,
          authError: null,
          cartNudgeAt: null,
          addresses:
            shouldSave && addr
              ? [
                  {
                    id: `addr-${Date.now()}`,
                    label: addressLabel?.trim() || "Home",
                    name,
                    phone: ph,
                    line: addr,
                  },
                  ...s.addresses,
                ].slice(0, 6)
              : s.addresses,
        }));
        return true;
      },

      advanceOrderStatus: (orderId) => {
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== orderId) return o;
            const idx = ORDER_FLOW.indexOf(o.status);
            if (idx < 0 || idx >= ORDER_FLOW.length - 1) return o;
            const next = ORDER_FLOW[idx + 1];
            return {
              ...o,
              status: next,
              timeline: [
                ...o.timeline,
                {
                  status: next,
                  at: new Date().toISOString(),
                  note: next === "Delivered" ? "Delivered successfully" : `Moved to ${next}`,
                },
              ],
            };
          }),
        }));
      },

      reorder: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return false;
        // Re-add by matching recent/wishlist catalog products when possible
        const { recent, wishlist } = get();
        const pool = [...recent, ...wishlist];
        order.items.forEach((it) => {
          const found = pool.find((p) => p.id === it.id);
          if (found) {
            get().addToBag(found, {
              qty: it.qty,
              size: it.size,
              color: it.color,
            });
          }
        });
        set({ showBag: true, showOrders: false });
        return true;
      },
    }),
    {
      name: "orva-v2",
      partialize: (s) => ({
        users: s.users,
        session: s.session,
        orders: s.orders,
        bag: s.bag,
        wishlist: s.wishlist,
        recent: s.recent,
        compare: s.compare,
        addresses: s.addresses,
        couponCode: s.couponCode,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<MallState>;
        return {
          ...current,
          ...p,
          bag: migrateBag(p.bag),
          wishlist: Array.isArray(p.wishlist) ? p.wishlist : [],
          recent: Array.isArray(p.recent) ? p.recent : [],
          compare: Array.isArray(p.compare) ? p.compare : [],
          addresses: Array.isArray(p.addresses) ? p.addresses : [],
          orders: migrateOrders(p.orders),
        };
      },
    },
  ),
);
