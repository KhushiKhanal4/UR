"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* A little before the element is fully in: it has started to show by the time it moves. Plays
   whenever it comes into view, from below or from above, and rewinds as it leaves either edge
   so it plays again on the way back. Measured last, after the pinned sections (About, Journey,
   Highlights) have added their scroll. */
const ENTER = {
  start: "top 88%",
  end: "bottom 12%",
  toggleActions: "play reverse play reverse",
  refreshPriority: -1,
} as const;

/**
 * Page-wide scroll reveals, declared in markup with `data-anim` so the sections stay server
 * components. Mounted once on the page; does nothing when the visitor prefers reduced motion,
 * so everything is simply there.
 *
 * - `up`       the element rises 40px and fades in
 * - `stagger`  its `[data-anim-item]` descendants (or, if none, its children) do, one after another
 * - `words`    its words rise into place from behind their own line masks
 * - `chars`    the same, letter by letter (oversized single-word titles)
 * - `count`    a number like "16K+" counts up from 0, keeping its suffix
 * - `rule`     a line draws in from the left
 * - `zoom`     an image starts at 1.3× and settles to 1× as its frame scrolls in (scrubbed);
 *              put it on a layer inside an overflow-hidden frame
 * - `exit`     as its section scrolls off the top, the element lifts away and fades (scrubbed)
 * - `sink`     as its section scrolls off the top, the element lags behind and enlarges: a
 *              background parallax (scrubbed)
 *
 * Add `data-anim-stay` to a sticky element: it never really leaves the top of the screen, so
 * it only rewinds when scrolled back above where it came in.
 */
export function ScrollAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const all = (kind: string) => gsap.utils.toArray<HTMLElement>(`[data-anim="${kind}"]`);
      const enter = (el: HTMLElement) =>
        el.hasAttribute("data-anim-stay")
          ? { trigger: el, ...ENTER, end: undefined, toggleActions: "play none none reverse" }
          : { trigger: el, ...ENTER };

      all("up").forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: enter(el) });
      });

      all("stagger").forEach((el) => {
        const items = el.querySelectorAll<HTMLElement>("[data-anim-item]");
        const targets = items.length ? Array.from(items) : Array.from(el.children);
        gsap.from(targets, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: enter(el),
        });
      });

      (["words", "chars"] as const).forEach((type) => {
        all(type).forEach((el) => {
          // autoSplit re-splits when fonts load or lines rewrap, handing back a fresh tween
          SplitText.create(el, {
            type,
            mask: type,
            autoSplit: true,
            onSplit: (self) => {
              // the masks are only a line-height tall and as wide as the letter's advance, and
              // the oversized titles set a tight leading (0.8) and negative tracking, so
              // ascenders, descenders and the right edge of each glyph were cut. Pad each mask
              // vertically (pulled back with a negative margin so the layout doesn't move) and
              // clip only top and bottom: the rise still hides behind the line, glyphs can
              // overhang sideways.
              self.masks.forEach((mask) => {
                const m = mask as HTMLElement;
                m.style.paddingBlock = "0.25em";
                m.style.marginBlock = "-0.25em";
                m.style.overflow = "visible";
                m.style.clipPath = "inset(0 -0.5em)";
              });
              return gsap.from(self[type], {
                yPercent: 140,
                duration: type === "chars" ? 0.9 : 1,
                ease: "power4.out",
                stagger: type === "chars" ? 0.03 : 0.05,
                scrollTrigger: enter(el),
              });
            },
          });
        });
      });

      const restore: (() => void)[] = [];
      all("count").forEach((el) => {
        const match = el.textContent?.trim().match(/^(\d+)(.*)$/);
        if (!match) return;
        const [, digits, suffix] = match;
        const value = { n: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(value, {
          n: Number(digits),
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(value.n)}${suffix}`;
          },
          scrollTrigger: enter(el),
        });
        restore.push(() => {
          el.textContent = `${digits}${suffix}`;
        });
      });

      all("rule").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: enter(el),
        });
      });

      all("zoom").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.3 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "top 35%", scrub: 0.6, refreshPriority: -1 },
          },
        );
      });

      // scrubbed over the section's own exit: from its top at the top of the screen until it's gone
      const leaving = (el: HTMLElement) => ({
        trigger: el.closest("section") ?? el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        refreshPriority: -1,
      });
      all("exit").forEach((el) => {
        gsap.to(el, { yPercent: -18, opacity: 0.15, ease: "none", scrollTrigger: leaving(el) });
      });
      all("sink").forEach((el) => {
        gsap.to(el, { yPercent: 35, scale: 1.12, ease: "none", scrollTrigger: leaving(el) });
      });

      // put the real figures back if the preference changes mid-visit
      return () => restore.forEach((fn) => fn());
    });
  });

  return null;
}
