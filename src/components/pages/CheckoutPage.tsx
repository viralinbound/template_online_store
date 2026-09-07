"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCatalog } from "@/components/CatalogProvider";
import { CheckoutPanel } from "@/components/commerce/CheckoutPanel";
import { AtmosphereBand } from "@/components/shell/AtmosphereBand";
import { OrvaShell } from "@/components/shell/OrvaShell";
import { PageHero } from "@/components/shell/PageHero";
import { SectionHead } from "@/components/shell/SectionHead";
import { formatMoney } from "@/lib/money";
import { landingHeroImage } from "@/lib/images";
import { useMallStore, type PaymentMethod } from "@/store/useMallStore";

export function CheckoutPage() {
  const { config } = useCatalog();
  const router = useRouter();
  const bag = useMallStore((s) => s.bag);
  const bagTotal = useMallStore((s) => s.bagTotal);
  const session = useMallStore((s) => s.session);
  const addresses = useMallStore((s) => s.addresses);
  const authError = useMallStore((s) => s.authError);
  const placeOrder = useMallStore((s) => s.placeOrder);
  const setShowAuth = useMallStore((s) => s.setShowAuth);
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [saveAddress, setSaveAddress] = useState(true);
  const [placed, setPlaced] = useState(false);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (session) setName(session.name);
  }, [session]);

  const total = hydrated ? bagTotal() : 0;
  const heroImg = bag[0]?.product.image ?? landingHeroImage();

  if (hydrated && bag.length === 0 && !placed) {
    return (
      <OrvaShell>
        <PageHero
          kicker="Checkout"
          title="Your cart is empty"
          image={landingHeroImage()}
          actions={
            <>
              <Link href="/shop" className="primary">
                Shop now
              </Link>
              <Link href="/food" className="ghost">
                Food Court
              </Link>
            </>
          }
        />
      </OrvaShell>
    );
  }

  if (placed) {
    return (
      <OrvaShell>
        <PageHero
          kicker="Order placed"
          title="Thanks — we got it"
          lead="Demo order saved locally. Track status anytime from Orders."
          image={landingHeroImage()}
          actions={
            <>
              <Link href="/orders" className="primary">
                View orders
              </Link>
              <Link href="/shop" className="ghost">
                Keep shopping
              </Link>
            </>
          }
        />
      </OrvaShell>
    );
  }

  return (
    <OrvaShell>
      <PageHero
        kicker="Secure demo checkout"
        title="Checkout"
        lead={`Total ${formatMoney(total, config.currency, config.locale)} · ${bag.length} item${bag.length === 1 ? "" : "s"}`}
        image={heroImg}
        actions={
          <Link href="/cart" className="ghost">
            ← Edit cart
          </Link>
        }
      />
      <AtmosphereBand items={["Checkout", "UPI · Card · COD", "ORVA10", config.brandName]} />
      <section className="orva-land-block checkout-page">
        <SectionHead eyebrow="Details" title="Delivery & payment" />
        <CheckoutPanel
          guestAllowed={config.featureFlags.guestCheckout}
          isGuest={!session}
          name={name}
          phone={phone}
          address={address}
          email={email}
          payment={payment}
          saveAddress={saveAddress}
          addresses={addresses}
          total={total}
          currency={config.currency}
          locale={config.locale}
          error={authError}
          onName={setName}
          onPhone={setPhone}
          onAddress={setAddress}
          onEmail={setEmail}
          onPayment={setPayment}
          onSaveAddress={setSaveAddress}
          onPickAddress={(a) => {
            setName(a.name);
            setPhone(a.phone);
            setAddress(a.line);
          }}
          onSignIn={() => setShowAuth(true, "login")}
          onSubmit={() => {
            const ok = placeOrder({
              customerName: name,
              address,
              phone,
              paymentMethod: payment,
              guestEmail: email,
              saveAddress,
            });
            if (ok) {
              setPlaced(true);
              router.push("/orders");
            }
          }}
        />
      </section>
    </OrvaShell>
  );
}
