"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Wheel and touch input across Launched Products is scaled down, so the case studies pass
   more slowly than the rest of the page. */
const PRODUCTS_PACE = 0.8;

/**
 * Page-wide smooth scrolling (Lenis). It keeps the native scroll position, so pins, sticky
 * columns and fixed backdrops all behave as before; it just eases each wheel step out.
 * Driven from GSAP's ticker so ScrollTrigger reads the same frame Lenis writes.
 * Off when the visitor prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pace = 1;
    const lenis = new Lenis({
      lerp: 0.12,
      anchors: true,
      virtualScroll: (data) => {
        data.deltaY *= pace;
        data.deltaX *= pace;
        return true;
      },
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const products = document.getElementById("products");
    const slow = products
      ? ScrollTrigger.create({
          trigger: products,
          start: "top 60%",
          end: "bottom 40%",
          refreshPriority: -1,
          onToggle: (self) => {
            pace = self.isActive ? PRODUCTS_PACE : 1;
          },
        })
      : null;

    /* the booking pop-up freezes the page behind it */
    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("booking:open", stop);
    window.addEventListener("booking:close", start);

    return () => {
      window.removeEventListener("booking:open", stop);
      window.removeEventListener("booking:close", start);
      slow?.kill();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
