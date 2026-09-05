"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const FRAMES = [
  {
    img: "https://picsum.photos/seed/mmx-01/1920/1080",
    kicker: "01 ARRIVAL",
    title: "MegaMall\nlive feed",
    line: "Signal locks. Plaza cameras open. You are at the gate.",
  },
  {
    img: "https://picsum.photos/seed/mmx-02/1920/1080",
    kicker: "02 ENTRY",
    title: "Glass doors\nsplit",
    line: "Biometric welcome. Cold air. Bass under the floor.",
  },
  {
    img: "https://picsum.photos/seed/mmx-03/1920/1080",
    kicker: "03 ATRIUM",
    title: "Look up.\nKeep walking.",
    line: "Five levels stack. Escalators carve light tunnels.",
  },
  {
    img: "https://picsum.photos/seed/mmx-04/1920/1080",
    kicker: "04 WINGS",
    title: "North to\nWest pulse",
    line: "Corridor depth expands. Store logos wake as you pass.",
  },
  {
    img: "https://picsum.photos/seed/mmx-05/1920/1080",
    kicker: "05 RETAIL",
    title: "Enter the\nstore grid",
    line: "Displays. Pedestals. Products waiting in physical space.",
  },
  {
    img: "https://picsum.photos/seed/mmx-06/1920/1080",
    kicker: "06 COMMERCE",
    title: "Inspect.\nAcquire.",
    line: "Bag syncs. Payment lane opens. Order confirmed.",
  },
  {
    img: "https://picsum.photos/seed/mmx-07/1920/1080",
    kicker: "07 SYSTEM",
    title: "Mall OS\nonline",
    line: "Scroll controls the camera. You are inside the machine.",
  },
  {
    img: "https://picsum.photos/seed/mmx-08/1920/1080",
    kicker: "08 OPEN",
    title: "Shop the\nfull grid",
    line: "Cinema ends. Catalog begins. Keep the same energy.",
  },
];

export function UltraCinema() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>(".ux-frame");
      const texts = gsap.utils.toArray<HTMLElement>(".ux-copy");
      const hud = stageRef.current?.querySelector(".ux-hud-bar") as HTMLElement | null;

      gsap.set(frames, { opacity: 0, scale: 1.12, filter: "blur(12px)" });
      gsap.set(frames[0], { opacity: 1, scale: 1, filter: "blur(0px)" });
      gsap.set(texts, { opacity: 0, y: 48, clipPath: "inset(100% 0 0 0)" });
      gsap.set(texts[0], { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=700%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = Math.min(FRAMES.length - 1, Math.floor(self.progress * FRAMES.length));
            setIndex(i);
          },
        },
      });

      frames.forEach((frame, i) => {
        if (i === 0) return;
        const prev = frames[i - 1];
        const text = texts[i];
        const prevText = texts[i - 1];
        const start = i / FRAMES.length;

        tl.to(
          prev,
          { opacity: 0, scale: 1.08, filter: "blur(10px)", duration: 0.8 },
          start,
        )
          .to(
            frame,
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8 },
            start,
          )
          .to(
            prevText,
            { opacity: 0, y: -24, clipPath: "inset(0 0 100% 0)", duration: 0.45 },
            start,
          )
          .to(
            text,
            { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.55 },
            start + 0.08,
          );
      });

      if (hud) {
        tl.fromTo(hud, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
      }

      gsap.to(".ux-beam", {
        xPercent: 40,
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=700%",
          scrub: true,
        },
      });

      gsap.to(".ux-grid", {
        backgroundPosition: "120px 80px",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=700%",
          scrub: true,
        },
      });

      setReady(true);
    }, pinRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="cinema" className="ux-pin-wrap" ref={pinRef}>
      <div className={`ux-stage ${ready ? "on" : ""}`} ref={stageRef}>
        <div className="ux-grid" />
        <div className="ux-beam" />
        <div className="ux-noise" />

        <div className="ux-frames">
          {FRAMES.map((f) => (
            <div key={f.img} className="ux-frame">
              <img src={f.img} alt="" />
              <div className="ux-shade" />
            </div>
          ))}
        </div>

        <div className="ux-depth">
          <div className="ux-pillar left" />
          <div className="ux-pillar right" />
          <div className="ux-floor-line" />
        </div>

        <div className="ux-copy-layer">
          {FRAMES.map((f) => (
            <div key={f.kicker} className="ux-copy">
              <p className="ux-kicker">{f.kicker}</p>
              <h2>
                {f.title.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="ux-line">{f.line}</p>
            </div>
          ))}
        </div>

        <div className="ux-hud">
          <div className="ux-hud-top">
            <span>CAM // MALL-CORE</span>
            <span>{String(index + 1).padStart(2, "0")} / {String(FRAMES.length).padStart(2, "0")}</span>
          </div>
          <div className="ux-hud-bar" />
          <div className="ux-hud-side">
            {FRAMES.map((f, i) => (
              <span key={f.kicker} className={i === index ? "on" : ""}>
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
          <div className="ux-hud-bottom">SCROLL TO DRIVE THE FEED</div>
        </div>

        <ParticleField />
      </div>
    </section>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.4 + Math.random() * 1.6,
      v: 0.0004 + Math.random() * 0.0012,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.v;
        if (p.y < 0) p.y = 1;
        ctx.fillStyle = "rgba(212,165,116,0.35)";
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ux-particles" aria-hidden />;
}

export function CrazyCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 280, damping: 28 });
  const sy = useSpring(y, { stiffness: 280, damping: 28 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a,button"));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  return (
    <motion.div
      className={`ux-cursor ${hover ? "hot" : ""}`}
      style={{ left: sx, top: sy }}
      aria-hidden
    />
  );
}
