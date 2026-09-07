"use client";

import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHead({ eyebrow, title, action, className = "" }: Props) {
  return (
    <header className={`orva-land-head ${className}`.trim()}>
      <div>
        <p className="orva-land-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </header>
  );
}
