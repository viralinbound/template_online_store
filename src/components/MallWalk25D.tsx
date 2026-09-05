"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  { k: "01 GATE", t: "Approach the plaza", d: "Glass facade ahead. MegaMall fills the frame." },
  { k: "02 DOORS", t: "Doors slide open", d: "Automatic glass parts. You step across the threshold." },
  { k: "03 LOBBY", t: "Enter the lobby", d: "Cool air. Soft lights. Floor tiles race under you." },
  { k: "04 ATRIUM", t: "Atrium opens wide", d: "Look up — balconies stack. The mall feels enormous." },
  { k: "05 CORRIDOR", t: "Walk the corridor", d: "Store logos slide past on both sides as you move." },
  { k: "06 STORE", t: "A store pulls you in", d: "Displays glow. Products wait on real shelves." },
  { k: "07 SHOP", t: "You are inside", d: "Scroll done. Explore floors and buy below." },
];

export function MallWalk25D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=650%",
          scrub: 1.15,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = Math.min(BEATS.length - 1, Math.floor(self.progress * BEATS.length));
            setBeat(i);
          },
        },
      });

      // Camera dolly: world moves toward viewer (fake walk-in)
      tl.fromTo(
        ".mw-world",
        { z: -900, rotateX: 8, y: 40 },
        { z: 180, rotateX: 0, y: 0, ease: "none", duration: 1 },
        0,
      );

      tl.fromTo(".mw-plaza", { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.25, duration: 0.18 }, 0);
      tl.fromTo(".mw-door-l", { xPercent: 0 }, { xPercent: -105, duration: 0.14 }, 0.1);
      tl.fromTo(".mw-door-r", { xPercent: 0 }, { xPercent: 105, duration: 0.14 }, 0.1);
      tl.fromTo(".mw-lobby", { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.16);
      tl.fromTo(".mw-atrium", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.16 }, 0.28);
      tl.fromTo(".mw-stores", { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.42);
      tl.fromTo(
        ".mw-store-row",
        { x: 0 },
        { x: -280, ease: "none", duration: 0.28 },
        0.45,
      );
      tl.fromTo(".mw-shop-glow", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.16 }, 0.72);
      tl.fromTo(".mw-vignette", { opacity: 0.35 }, { opacity: 0.55, duration: 1 }, 0);

      // Floor rush
      tl.fromTo(
        ".mw-floor-tex",
        { backgroundPosition: "50% 0%" },
        { backgroundPosition: "50% 180%", ease: "none", duration: 1 },
        0,
      );

      gsap.utils.toArray<HTMLElement>(".mw-copy").forEach((el, i) => {
        const start = i / BEATS.length;
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 });
        if (i === 0) return;
        tl.to(".mw-copy", { opacity: 0, y: -18, duration: 0.08 }, start - 0.02);
        tl.to(el, { opacity: 1, y: 0, duration: 0.12 }, start);
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="cinema" className="mw-wrap" ref={wrapRef}>
      <div className="mw-stage">
        <div className="mw-sky" />
        <div className="mw-vignette" />

        <div className="mw-camera">
          <div className="mw-world">
            {/* Plaza / exterior */}
            <div className="mw-layer mw-plaza">
              <div className="mw-building">
                <img src="https://picsum.photos/seed/mw-facade/1400/900" alt="" />
                <div className="mw-sign">MEGAMALL</div>
              </div>
            </div>

            {/* Doors */}
            <div className="mw-doors">
              <div className="mw-door mw-door-l" />
              <div className="mw-door mw-door-r" />
            </div>

            {/* Lobby tunnel */}
            <div className="mw-layer mw-lobby">
              <div className="mw-tunnel">
                <div className="mw-wall left" />
                <div className="mw-wall right" />
                <div className="mw-ceiling" />
                <div className="mw-floor">
                  <div className="mw-floor-tex" />
                </div>
                <div className="mw-vanish" />
              </div>
            </div>

            {/* Atrium depth */}
            <div className="mw-layer mw-atrium">
              <div className="mw-balc b1" />
              <div className="mw-balc b2" />
              <div className="mw-balc b3" />
              <div className="mw-chandelier" />
              <img className="mw-atrium-img" src="https://picsum.photos/seed/mw-atrium/1200/800" alt="" />
            </div>

            {/* Store corridor */}
            <div className="mw-layer mw-stores">
              <div className="mw-store-row">
                {["AURA", "LUMIÉ", "NEXTRON", "VELOCITY", "HAVEN", "ORÉLLE", "NEON ARENA"].map((name, i) => (
                  <div key={name} className={`mw-storefront ${i % 2 ? "right" : "left"}`}>
                    <img src={`https://picsum.photos/seed/mw-store-${i}/600/700`} alt="" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inside store glow */}
            <div className="mw-layer mw-shop-glow">
              <img src="https://picsum.photos/seed/mw-inside/1100/800" alt="" />
              <div className="mw-shelf">
                {[0, 1, 2].map((i) => (
                  <img key={i} src={`https://picsum.photos/seed/mw-prod-${i}/200/200`} alt="" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mw-copy-layer">
          {BEATS.map((b) => (
            <div key={b.k} className="mw-copy">
              <p>{b.k}</p>
              <h2>{b.t}</h2>
              <span>{b.d}</span>
            </div>
          ))}
        </div>

        <div className="mw-hud">
          <div className="mw-hud-top">
            <span>2D → 3D FEEL · MALL WALK</span>
            <span>
              {String(beat + 1).padStart(2, "0")}/{String(BEATS.length).padStart(2, "0")}
            </span>
          </div>
          <div className="mw-progress">
            <i style={{ width: `${((beat + 1) / BEATS.length) * 100}%` }} />
          </div>
          <p className="mw-hint">Scroll to walk into MegaMall</p>
        </div>
      </div>
    </section>
  );
}

export function SoftCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 250, damping: 28 });
  const sy = useSpring(y, { stiffness: 250, damping: 28 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return <motion.div className="mw-cursor" style={{ left: sx, top: sy }} aria-hidden />;
}
