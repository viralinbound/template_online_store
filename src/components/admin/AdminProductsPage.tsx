"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCatalog } from "@/components/CatalogProvider";
import { OrvaModal } from "@/components/ui/OrvaModal";
import { productHref, SHOP_CATEGORIES } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import type { MallCategory, Product } from "@/types/mall";

type StoreOpt = { id: string; name: string; category: string; floor: string };

type FormState = {
  id?: string;
  name: string;
  price: string;
  compareAtPrice: string;
  category: MallCategory | "fashion";
  storeId: string;
  brand: string;
  description: string;
  image: string;
  stock: string;
  colors: string;
  sizes: string;
};

const emptyForm = (): FormState => ({
  name: "",
  price: "",
  compareAtPrice: "",
  category: "fashion",
  storeId: "",
  brand: "",
  description: "",
  image: "",
  stock: "25",
  colors: "Default",
  sizes: "One size",
});

export function AdminProductsPage() {
  const { refresh, config } = useCatalog();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<StoreOpt[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [page, setPage] = useState(0);
  const PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const plist = await fetch("/api/admin/products", { cache: "no-store" }).then((r) => r.json());
      if (plist.error) throw new Error(plist.error);
      setProducts(plist.products ?? []);
      setStores(plist.stores ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.includes(query) ||
        (p.brand ?? "").toLowerCase().includes(query),
    );
  }, [products, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const paged = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);

  useEffect(() => {
    setPage(0);
  }, [q]);

  const openCreate = () => {
    setForm({ ...emptyForm(), storeId: stores[0]?.id ?? "" });
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      price: String(p.price),
      compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : "",
      category: p.category,
      storeId: p.storeId,
      brand: p.brand ?? "",
      description: p.description,
      image: p.image,
      stock: p.stock != null ? String(p.stock) : "",
      colors: (p.colors ?? []).join(", "),
      sizes: (p.sizes ?? []).join(", "),
    });
    setFormOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        id: form.id,
        name: form.name,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        category: form.category,
        storeId: form.storeId || undefined,
        brand: form.brand || undefined,
        description: form.description,
        image: form.image || undefined,
        stock: form.stock === "" ? null : Number(form.stock),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
      const method = form.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setFormOpen(false);
      setToast(form.id ? "Updated — storefront syncing" : "Added — storefront syncing");
      await load();
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setDeleteId(null);
      setToast("Deleted — storefront syncing");
      await load();
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="Products" lead="Full CRUD — changes go live on the mall storefront.">
      <div className="admin-top-actions" style={{ marginBottom: "1rem" }}>
        <button type="button" className="ghost" onClick={() => void load()}>
          Refresh
        </button>
        <button type="button" className="primary" onClick={openCreate}>
          + Add product
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {toast && <div className="admin-toast">{toast}</div>}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, SKU, brand…" />
          <span className="muted">{filtered.length} shown</span>
        </div>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-prod">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" />
                        <div>
                          <strong>{p.name}</strong>
                          <small>
                            {p.sku} · {p.brand || "—"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{formatMoney(p.price, p.currency || config.currency, config.locale)}</td>
                    <td>{p.stock ?? "∞"}</td>
                    <td>{p.category}</td>
                    <td className="admin-row-actions">
                      <Link href={productHref(p)} target="_blank">
                        View
                      </Link>
                      <button type="button" onClick={() => openEdit(p)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => setDeleteId(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > PAGE && (
          <div className="admin-pager">
            <button type="button" className="ghost" disabled={safePage <= 0} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <span className="muted">
              Page {safePage + 1} / {pageCount}
            </span>
            <button
              type="button"
              className="ghost"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </section>

      <OrvaModal
        open={formOpen}
        title={form.id ? "Edit product" : "Add product"}
        wide
        onClose={() => setFormOpen(false)}
        footer={
          <>
            <button type="button" className="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="primary"
              disabled={saving || !form.name || !form.price}
              onClick={() => void save()}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        <div className="admin-form">
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </label>
          <label>
            Price
            <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          </label>
          <label>
            Compare at
            <input
              type="number"
              value={form.compareAtPrice}
              onChange={(e) => setForm((f) => ({ ...f, compareAtPrice: e.target.value }))}
            />
          </label>
          <label>
            Stock
            <input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as MallCategory }))}
            >
              {SHOP_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Boutique
            <select value={form.storeId} onChange={(e) => setForm((f) => ({ ...f, storeId: e.target.value }))}>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.floor}
                </option>
              ))}
            </select>
          </label>
          <label>
            Brand
            <input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
          </label>
          <label>
            Image URL
            <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
          </label>
          <label className="full">
            Colors
            <input value={form.colors} onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))} />
          </label>
          <label className="full">
            Sizes
            <input value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} />
          </label>
          <label className="full">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </label>
        </div>
      </OrvaModal>

      <OrvaModal
        open={Boolean(deleteId)}
        title="Delete product?"
        onClose={() => setDeleteId(null)}
        footer={
          <>
            <button type="button" className="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </button>
            <button type="button" className="danger primary" disabled={saving} onClick={() => void confirmDelete()}>
              {saving ? "Deleting…" : "Delete"}
            </button>
          </>
        }
      >
        <p className="muted">Removed from live catalog — storefront refreshes automatically.</p>
      </OrvaModal>
    </AdminShell>
  );
}
