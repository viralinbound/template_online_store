"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  src: string;
  accent?: string;
  onExit?: () => void;
  /** Smaller stage for compare / quick-look */
  compact?: boolean;
  /** Hide toolbar chrome (mini embeds) */
  bare?: boolean;
};

function SpinCard({
  src,
  reduced,
  dragX,
  dragging,
}: {
  src: string;
  reduced: boolean;
  dragX: MutableRefObject<number>;
  dragging: MutableRefObject<boolean>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useTexture(src);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (!mesh.current) return;
    const target = dragX.current;
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, target, 0.14);
    if (!reduced && !dragging.current && Math.abs(target - mesh.current.rotation.y) < 0.03) {
      dragX.current += dt * 0.4;
    }
    mesh.current.rotation.x = Math.sin(performance.now() * 0.0004) * 0.035;
  });

  return (
    <mesh ref={mesh} position={[0, 0.05, 0]}>
      <planeGeometry args={[2.35, 2.95]} />
      <meshStandardMaterial map={texture} roughness={0.35} metalness={0.12} />
    </mesh>
  );
}

/** Easy 3D product stage — drag to spin, gentle auto-rotate, one-tap back to photos. */
export function ProductSpin3D({
  src,
  accent = "#14999c",
  onExit,
  compact = false,
  bare = false,
}: Props) {
  const dragX = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const [hint, setHint] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    dragX.current = 0;
    setHint(true);
    const t = window.setTimeout(() => setHint(false), 2800);
    return () => window.clearTimeout(t);
  }, [src]);

  const handlers = useMemo(
    () => ({
      onPointerDown: (e: React.PointerEvent) => {
        dragging.current = true;
        lastX.current = e.clientX;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setHint(false);
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        dragX.current += dx * 0.01;
      },
      onPointerUp: () => {
        dragging.current = false;
      },
    }),
    [],
  );

  return (
    <div
      className={`pp3d-stage${compact ? " compact" : ""}${bare ? " bare" : ""}`}
      style={{ ["--a" as string]: accent }}
    >
      {!bare && (
        <>
          <div className="pp3d-grid" aria-hidden />
          <div className="pp3d-glow" aria-hidden />
          <div className="pp3d-toolbar">
            <span className="pp3d-live">
              <i /> Live 3D
            </span>
            {onExit && (
              <button type="button" className="pp3d-exit" onClick={onExit}>
                Back to photos
              </button>
            )}
          </div>
        </>
      )}

      <div className="pp3d-canvas" {...handlers}>
        <Suspense
          fallback={
            <div className="pp3d-loading">
              <span />
              Loading 3D…
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0.1, compact ? 4.8 : 4.2], fov: compact ? 40 : 36 }}
            dpr={[1, compact ? 1.35 : 1.6]}
            gl={{ antialias: true, alpha: true }}
          >
            <color attach="background" args={["#071618"]} />
            <ambientLight intensity={0.85} />
            <directionalLight position={[3, 4, 2]} intensity={1.15} color="#e8fffb" />
            <directionalLight position={[-3, 1, -2]} intensity={0.35} color={accent} />
            <SpinCard src={src} reduced={reduced} dragX={dragX} dragging={dragging} />
            {!compact && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
                <circleGeometry args={[1.4, 48]} />
                <meshStandardMaterial color="#0b2426" metalness={0.4} roughness={0.5} />
              </mesh>
            )}
          </Canvas>
        </Suspense>
      </div>

      {!bare && hint && <p className="pp3d-hint">Drag to spin · easy & smooth</p>}
      {!bare && !compact && (
        <p className="pp3d-caption">High-tech preview · same product, live view</p>
      )}
    </div>
  );
}
