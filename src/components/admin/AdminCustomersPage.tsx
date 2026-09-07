"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useMallStore } from "@/store/useMallStore";

export function AdminCustomersPage() {
  const users = useMallStore((s) => s.users);
  const orders = useMallStore((s) => s.orders);
  const session = useMallStore((s) => s.session);
  const setUserRole = useMallStore((s) => s.setUserRole);
  const removeUser = useMallStore((s) => s.removeUser);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <AdminShell title="Customers" lead="Accounts on this device — change roles or remove demo users.">
      {toast && <div className="admin-toast">{toast}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const count = orders.filter((o) => o.userId === u.id || o.guestEmail === u.email).length;
              const isSeedAdmin = u.email === "admin@orva.demo";
              return (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-role ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{count}</td>
                  <td>{session?.id === u.id ? "Signed in" : "—"}</td>
                  <td className="admin-row-actions">
                    <button
                      type="button"
                      disabled={isSeedAdmin && u.role === "admin"}
                      onClick={() => {
                        const next = u.role === "admin" ? "customer" : "admin";
                        setUserRole(u.id, next);
                        flash(`${u.name} → ${next}`);
                      }}
                    >
                      {u.role === "admin" ? "Make customer" : "Make admin"}
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={isSeedAdmin}
                      title={isSeedAdmin ? "Seed admin cannot be removed" : "Remove user"}
                      onClick={() => {
                        if (!removeUser(u.id)) {
                          flash("Cannot remove this account");
                          return;
                        }
                        flash(`Removed ${u.name}`);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
