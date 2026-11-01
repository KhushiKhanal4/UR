"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const q = (kind: string) => gsap.utils.toArray<HTMLElement>(`#top [data-hero="${kind}"]`);

/**
 * The hero's opening, played on every load (scroll restoration is off, so a reload starts at
 * the top). Everything marked `data-hero` is kept hidden by CSS until this runs (`html.hero-intro`,
 * set by an inline script in the layout only when motion is allowed), so the first paint never
 * flashes the finished hero.
 *
 * - `video`  the backdrop settles from 1.18× while it fades up
 * - `grid`   the vertical rules draw down from the top
 * - `header` the nav drops in
 * - `line`   each headline line rises out of its own mask, un-blurring as it lands
 * - `fade`   copy rises a little, un-blurring
 * - `draw`   rules draw in from the left
 * - `role`   the roles list, one after another
 */
export function HeroIntro() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => document.documentElement.classList.remove("hero-intro"),
        })
        .from(q("video"), { autoAlpha: 0, scale: 1.18, duration: 2.6, ease: "power2.out" }, 0)
        .from(q("grid"), { autoAlpha: 0, scaleY: 0, transformOrigin: "top center", duration: 1.8, stagger: 0.06, ease: "power3.inOut" }, 0.1)
        .from(q("header"), { autoAlpha: 0, y: -24, duration: 1.2 }, 0.35)
        .from(q("line"), { autoAlpha: 0, yPercent: 110, rotate: 2.5, filter: "blur(10px)", duration: 1.5, stagger: 0.14, clearProps: "filter" }, 0.45)
        .from(q("fade"), { autoAlpha: 0, y: 28, filter: "blur(8px)", duration: 1.3, stagger: 0.1, clearProps: "filter" }, 0.85)
        .from(q("draw"), { autoAlpha: 0, scaleX: 0, transformOrigin: "left center", duration: 1.4, stagger: 0.08, ease: "power3.inOut" }, 1)
        .from(q("role"), { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.06 }, 1.1);
    });
  });

  return null;
}
