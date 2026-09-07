"use client";

import { formatMoney } from "@/lib/money";
import {
  ORDER_FLOW,
  PAYMENT_OPTIONS,
  type MallOrder,
  type PaymentMethod,
  type SavedAddress,
} from "@/store/useMallStore";

type CheckoutProps = {
  guestAllowed: boolean;
  isGuest: boolean;
  name: string;
  phone: string;
  address: string;
  email: string;
  payment: PaymentMethod;
  saveAddress: boolean;
  addresses: SavedAddress[];
  total: number;
  currency: string;
  locale: string;
  error: string | null;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onAddress: (v: string) => void;
  onEmail: (v: string) => void;
  onPayment: (v: PaymentMethod) => void;
  onSaveAddress: (v: boolean) => void;
  onPickAddress: (a: SavedAddress) => void;
  onSubmit: () => void;
  onSignIn: () => void;
};

export function CheckoutPanel({
  guestAllowed,
  isGuest,
  name,
  phone,
  address,
  email,
  payment,
  saveAddress,
  addresses,
  total,
  currency,
  locale,
  error,
  onName,
  onPhone,
  onAddress,
  onEmail,
  onPayment,
  onSaveAddress,
  onPickAddress,
  onSubmit,
  onSignIn,
}: CheckoutProps) {
  return (
    <div className="orva-checkout">
      <h3>Checkout</h3>
      <p className="muted">
        {isGuest && guestAllowed
          ? "Guest checkout enabled — no account required for this demo."
          : "Complete delivery details to place your order."}
      </p>

      {isGuest && guestAllowed && (
        <p className="orva-guest-hint">
          Prefer an account?{" "}
          <button type="button" className="linkish" onClick={onSignIn}>
            Sign in
          </button>
        </p>
      )}

      {addresses.length > 0 && (
        <div className="checkout-block">
          <p className="checkout-label">Saved addresses</p>
          <div className="orva-addr-list">
            {addresses.map((a) => (
              <button type="button" key={a.id} className="orva-addr" onClick={() => onPickAddress(a)}>
                <strong>{a.label}</strong>
                <span>
                  {a.name} · {a.phone}
                </span>
                <small>{a.line}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="checkout-block">
        <p className="checkout-label">Contact</p>
        <label>
          Full name
          <input value={name} onChange={(e) => onName(e.target.value)} placeholder="Your name" />
        </label>
        <label>
          Phone
          <input
            value={phone}
            onChange={(e) => onPhone(e.target.value)}
            placeholder="10-digit mobile"
            inputMode="tel"
          />
        </label>
        {isGuest && (
          <label>
            Email (order updates)
            <input
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              placeholder="you@email.com"
              inputMode="email"
            />
          </label>
        )}
      </div>

      <div className="checkout-block">
        <p className="checkout-label">Delivery</p>
        <label>
          Address
          <textarea
            value={address}
            onChange={(e) => onAddress(e.target.value)}
            placeholder="Flat, street, city, PIN"
            rows={3}
          />
        </label>
        <label className="dest-check">
          <input
            type="checkbox"
            checked={saveAddress}
            onChange={(e) => onSaveAddress(e.target.checked)}
          />
          Save this address for next time
        </label>
      </div>

      <div className="checkout-block">
        <p className="checkout-label">Payment</p>
        <div className="orva-pay-grid">
          {PAYMENT_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.id}
              className={payment === opt.id ? "on" : ""}
              onClick={() => onPayment(opt.id)}
            >
              <strong>{opt.label}</strong>
              <small>{opt.hint}</small>
            </button>
          ))}
        </div>
        <p className="muted">Demo only — no real money is charged.</p>
      </div>

      <ul className="orva-trust-inline">
        <li>Secure checkout</li>
        <li>Easy returns</li>
        <li>Order tracking</li>
      </ul>

      {error && <p className="auth-err">{error}</p>}
      <p className="price">{formatMoney(total, currency, locale)}</p>
      <button type="button" className="primary" onClick={onSubmit}>
        Place order · {payment.toUpperCase()}
      </button>
    </div>
  );
}

type TimelineProps = {
  order: MallOrder;
  onAdvance?: () => void;
  onReorder?: () => void;
  onTrack?: () => void;
  money: (n: number) => string;
};

export function OrderCard({ order, onAdvance, onReorder, money }: TimelineProps) {
  const currentIdx = Math.max(0, ORDER_FLOW.indexOf(order.status));
  const eta = order.eta ? new Date(order.eta).toLocaleDateString() : null;

  return (
    <article className="order-card orva-order-card">
      <header>
        <strong>{new Date(order.createdAt).toLocaleString()}</strong>
        <span>{money(order.total)}</span>
      </header>
      <p className="order-status">{order.status}</p>
      {eta && <p className="muted">ETA · {eta}</p>}
      <p className="muted">
        {order.customerName} · {order.address}
        {order.phone ? ` · ${order.phone}` : ""}
      </p>
      <p className="muted">
        Paid via {order.paymentMethod.toUpperCase()}
        {order.coupon ? ` · ${order.coupon}` : ""}
        {order.guestEmail ? ` · Guest ${order.guestEmail}` : ""}
      </p>

      <ol className="orva-timeline">
        {ORDER_FLOW.map((step, i) => {
          const hit = order.timeline.find((t) => t.status === step);
          const done = i <= currentIdx;
          return (
            <li key={step} className={done ? "done" : ""}>
              <i />
              <div>
                <strong>{step}</strong>
                {hit ? (
                  <small>
                    {new Date(hit.at).toLocaleString()}
                    {hit.note ? ` · ${hit.note}` : ""}
                  </small>
                ) : (
                  <small>Pending</small>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <ul className="orva-order-items">
        {order.items.map((it, idx) => (
          <li key={`${order.id}-${it.id}-${idx}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image} alt="" />
            <span>
              {it.name}
              {it.qty > 1 ? ` ×${it.qty}` : ""}
            </span>
            <em>{money(it.price * (it.qty || 1))}</em>
          </li>
        ))}
      </ul>

      <div className="orva-order-actions">
        {onAdvance && order.status !== "Delivered" && (
          <button type="button" onClick={onAdvance}>
            Advance status (demo)
          </button>
        )}
        {onReorder && (
          <button type="button" className="primary" onClick={onReorder}>
            Reorder
          </button>
        )}
      </div>
    </article>
  );
}
