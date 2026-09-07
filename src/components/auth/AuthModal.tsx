"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMallStore } from "@/store/useMallStore";

/** Storefront + admin authentication modal */
export function AuthModal() {
  const show = useMallStore((s) => s.showAuth);
  const mode = useMallStore((s) => s.authMode);
  const error = useMallStore((s) => s.authError);
  const setShowAuth = useMallStore((s) => s.setShowAuth);
  const login = useMallStore((s) => s.login);
  const signup = useMallStore((s) => s.signup);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = mode === "login" ? login(email, password) : signup(name, email, password);
    if (ok) {
      setName("");
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.button
            type="button"
            className="auth-backdrop"
            aria-label="Close auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuth(false)}
          />
          <div className="auth-modal-anchor">
            <motion.div
              className="auth-modal"
              role="dialog"
              aria-modal="true"
              aria-label={mode === "login" ? "Sign in" : "Create account"}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
            <button type="button" className="auth-x" onClick={() => setShowAuth(false)} aria-label="Close">
              ×
            </button>
            <p className="orva-land-eyebrow">Account</p>
            <h2>{mode === "login" ? "Welcome back" : "Create your Orva account"}</h2>
            <p className="auth-lead">
              {mode === "login"
                ? "Sign in for orders, wishlist sync, and admin access."
                : "Demo signup — local only, no real email sent."}
            </p>

            <form className="auth-form" onSubmit={onSubmit}>
              {mode === "signup" && (
                <label>
                  Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 4 characters"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={4}
                />
              </label>
              {error && <p className="auth-err">{error}</p>}
              <button type="submit" className="primary">
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <button
              type="button"
              className="auth-switch"
              onClick={() => setShowAuth(true, mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>

            <div className="auth-demo">
              <p>Admin demo</p>
              <code>admin@orva.demo</code> / <code>admin123</code>
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEmail("admin@orva.demo");
                  setPassword("admin123");
                  setShowAuth(true, "login");
                }}
              >
                Fill admin
              </button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
