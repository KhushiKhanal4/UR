"use client";

import { useEffect, useState } from "react";
import { Particles } from "./Particles";
import { SERVICE_FIELD, SERVICE_SHAPES } from "./service-shapes";

type Props = {
  /** Card titles, in order; each one is also the key of its shape in SERVICE_SHAPES. */
  labels: string[];
  /** Id of the element containing the `[data-service-card]` items that drive the shape. */
  scopeId: string;
  className?: string;
};

/**
 * Services graphic: one Particles swarm that re-forms into the graphic for whichever
 * card is crossing the middle of the viewport. Hover pushes the dots aside; a press
 * throws a shockwave and they re-gather into the same shape (the scroll owns the shape).
 */
export function ParticleMorph({ labels, scopeId, className = "" }: Props) {
  const [active, setActive] = useState(0);
  // Below the desktop layout the graphic is hidden (Services); keep the swarm small there in
  // case the window is later widened. Decided once — the dot count is fixed for the life of
  // the swarm (and it is not part of the markup, so hydration is unaffected).
  const [compact] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(`#${scopeId} [data-service-card]`));
    const select = (i: number) => {
      if (i < 0) return;
      cards.forEach((c, j) => c.toggleAttribute("data-active", j === i));
      setActive(i);
    };
    select(0);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) select(cards.indexOf(entry.target as HTMLElement));
        }
      },
      // a thin band across the middle of the viewport decides the active card
      { rootMargin: "-45% 0px -45% 0px" },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [scopeId]);

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div className="relative min-h-0 flex-1">
        <Particles
          shapes={SERVICE_SHAPES}
          field={SERVICE_FIELD}
          shape={labels[active]}
          count={compact ? 480 : 900}
          grain={compact ? "Coarse" : "Fine"}
          reach={90}
          force={60}
          fluid
          allowScroll
          pressAdvances={false}
          align="start"
          label={`${labels[active]}, drawn in dots. Move over it to push the dots aside.`}
          className="absolute inset-0"
        />
      </div>
      <div
        aria-hidden
        className="flex items-center gap-3 pt-2 font-dm text-[12px] font-medium uppercase tracking-[-0.24px] text-muted"
      >
        <span className="tabular-nums text-ink">{String(active + 1).padStart(2, "0")}</span>
        <span className="flex gap-1">
          {labels.map((label, i) => (
            <span
              key={label}
              className={`h-0.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-primary" : "w-2 bg-muted-dark"}`}
            />
          ))}
        </span>
        <span key={active} className="animate-[fade-in_400ms_ease-out] truncate">
          {labels[active]}
        </span>
      </div>
    </div>
  );
}
