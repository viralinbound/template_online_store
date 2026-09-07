"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useMallStore } from "@/store/useMallStore";

/** Protects /admin — requires signed-in admin role */
export function AdminAuthGate({ children }: { children: ReactNode }) {
  const session = useMallStore((s) => s.session);
  const login = useMallStore((s) => s.login);
  const logout = useMallStore((s) => s.logout);
  const authError = useMallStore((s) => s.authError);
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState("admin@orva.demo");
  const [password, setPassword] = useState("admin123");

  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="admin-gate">
        <p>Loading admin…</p>
      </div>
    );
  }

  if (session?.role === "admin") {
    return <>{children}</>;
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="admin-gate">
      <div className="admin-gate-card">
        <p className="orva-land-eyebrow">Secure area</p>
        <h1>Admin sign in</h1>
        <p>
          {session
            ? "This account is a customer. Sign in with an admin user to open the control center."
            : "Full catalog, orders, insights, and connectors — admin only."}
        </p>
        {session && (
          <p className="muted">
            Signed in as {session.email} ·{" "}
            <button type="button" className="auth-switch" onClick={() => logout()}>
              Sign out
            </button>
          </p>
        )}
        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {authError && <p className="auth-err">{authError}</p>}
          <button type="submit" className="primary">
            Enter admin
          </button>
        </form>
        <p className="admin-gate-hint">
          Demo · <code>admin@orva.demo</code> / <code>admin123</code>
        </p>
        <Link href="/" className="orva-land-link">
          ← Back to storefront
        </Link>
      </div>
    </div>
  );
}
