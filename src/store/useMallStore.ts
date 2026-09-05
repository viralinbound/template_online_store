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

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type MallOrder = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  address: string;
  customerName: string;
  createdAt: string;
};

type MallState = {
  bag: Product[];
  inspect: Product | null;
  showBag: boolean;
  checkout: boolean;
  orderOk: boolean;
  cartPulse: number;
  activeStoreId: string | null;
  users: MallUser[];
  session: Omit<MallUser, "password"> | null;
  orders: MallOrder[];
  showAuth: boolean;
  authMode: "login" | "signup";
  showOrders: boolean;
  authError: string | null;
  addToBag: (p: Product) => void;
  setInspect: (p: Product | null) => void;
  setShowBag: (v: boolean) => void;
  setCheckout: (v: boolean) => void;
  setOrderOk: (v: boolean) => void;
  setActiveStoreId: (id: string | null) => void;
  clearBag: () => void;
  setShowAuth: (v: boolean, mode?: "login" | "signup") => void;
  setShowOrders: (v: boolean) => void;
  clearAuthError: () => void;
  signup: (name: string, email: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  placeOrder: (customerName: string, address: string) => boolean;
};

function publicUser(u: MallUser): Omit<MallUser, "password"> {
  return { id: u.id, name: u.name, email: u.email };
}

export const useMallStore = create<MallState>()(
  persist(
    (set, get) => ({
      bag: [],
      inspect: null,
      showBag: false,
      checkout: false,
      orderOk: false,
      cartPulse: 0,
      activeStoreId: null,
      users: [],
      session: null,
      orders: [],
      showAuth: false,
      authMode: "login",
      showOrders: false,
      authError: null,
      addToBag: (p) =>
        set((s) => ({
          bag: s.bag.some((x) => x.id === p.id) ? s.bag : [...s.bag, p],
          cartPulse: s.cartPulse + 1,
        })),
      setInspect: (p) => set({ inspect: p }),
      setShowBag: (v) => set({ showBag: v }),
      setCheckout: (v) => set({ checkout: v }),
      setOrderOk: (v) => set({ orderOk: v }),
      setActiveStoreId: (id) => set({ activeStoreId: id }),
      clearBag: () => set({ bag: [] }),
      setShowAuth: (v, mode) =>
        set({
          showAuth: v,
          authMode: mode ?? get().authMode,
          authError: null,
        }),
      setShowOrders: (v) => set({ showOrders: v }),
      clearAuthError: () => set({ authError: null }),
      signup: (name, email, password) => {
        const n = name.trim();
        const e = email.trim().toLowerCase();
        const p = password.trim();
        if (!n || !e || p.length < 4) {
          set({ authError: "Please enter your name, email, and a password (minimum 4 characters)." });
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
      placeOrder: (customerName, address) => {
        const { session, bag } = get();
        if (!session) {
          set({ showAuth: true, authMode: "login", authError: "Please sign in to place an order." });
          return false;
        }
        if (!bag.length) return false;
        const name = customerName.trim() || session.name;
        const addr = address.trim();
        if (!addr) {
          set({ authError: "Please enter a delivery address." });
          return false;
        }
        const order: MallOrder = {
          id: `ord-${Date.now()}`,
          userId: session.id,
          items: bag.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
          })),
          total: bag.reduce((s, p) => s + p.price, 0),
          address: addr,
          customerName: name,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          orders: [order, ...s.orders],
          bag: [],
          orderOk: true,
          checkout: false,
          authError: null,
        }));
        return true;
      },
    }),
    {
      name: "megamall-v1",
      partialize: (s) => ({
        users: s.users,
        session: s.session,
        orders: s.orders,
        bag: s.bag,
      }),
    },
  ),
);
