"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Fast start, long settle: between a quadratic and a cubic ease-out, which is what the
   reference's entry curve measures as (76% done at 44% of the way, 95% at 74%). */
const settle = (p: number) => 1 - Math.pow(1 - p, 2.5);

/**
 * Scroll motion for the Launched Products case studies, wrapping the cards:
 * - `[data-cs-stage]` (static, the measuring box) holds `[data-cs-frame]`, which rises 150px
 *   into place while its `[data-cs-enter]` zooms out from 1.7×, as the card's top travels from
 *   the bottom of the screen to a third of the way down;
 * - `[data-cs-drift]` (the image, taller than its frame) drifts from top to bottom of its slack
 *   over the card's whole pass across the screen, so the photo moves slower than the page.
 * - `[data-cs-backdrop]`s are fixed to the viewport and clipped to this wrapper; each one after
 *   the first fades in over the one before while its card rises from the bottom of the screen
 *   to near the top, so the artwork dissolves from one case into the next.
 */
export function CaseStudyMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // the dissolve is a fade, not movement, so it runs under reduced motion too
      gsap.utils.toArray<HTMLElement>("[data-cs-backdrop]", root.current).forEach((backdrop, i) => {
        if (i === 0) return;
        gsap.fromTo(
          backdrop,
          // autoAlpha: while fully faded, a backdrop is visibility:hidden, so its blur and
          // animated grain aren't composited on every scroll frame
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: backdrop.parentElement, start: "top 90%", end: "top 10%", scrub: true },
          },
        );
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-cs-stage]", root.current).forEach((stage) => {
          const frame = stage.querySelector("[data-cs-frame]");
          const enter = stage.querySelector("[data-cs-enter]");
          const drift = stage.querySelector("[data-cs-drift]");

          gsap
            .timeline({ scrollTrigger: { trigger: stage, start: "top bottom", end: "top 34%", scrub: true } })
            .fromTo(frame, { y: 150 }, { y: 0, ease: settle }, 0)
            .fromTo(enter, { scale: 1.7 }, { scale: 1, ease: settle }, 0);

          // the drift box is 160% of the frame, centred: ±18.75% of itself is ±30% of the frame
          gsap.fromTo(
            drift,
            { yPercent: -18.75 },
            {
              yPercent: 18.75,
              ease: "none",
              scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  // clip-path, not overflow: it is what clips the fixed backdrops to the list
  return (
    <div ref={root} className="relative [clip-path:inset(0)]">
      {children}
    </div>
  );
}
