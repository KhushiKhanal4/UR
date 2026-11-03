"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { highlightTiles } from "@/data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The middle of the 3×3 grid: the featured reel. */
const FEATURED = 4;

/**
 * The reel opens full screen. Pinned, the scroll shrinks it into the centre of a 3×3 grid of
 * talks: the whole grid starts at 3× around its centre, so the reel fills the screen and its
 * neighbours wait just past the edges, then they slide in as it scales down to fit.
 * Tiles touch (Figma: Video component, 652:1014).
 */
export function Highlights() {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // tablets and up only: on phones the reel is shown on its own (below)
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: stage.current, start: "top top", end: "+=180%", pin: true, scrub: 0.6 },
          })
          .fromTo("[data-hl-grid]", { scale: 3 }, { scale: 1, duration: 0.75, ease: "power1.inOut" }, 0.1)
          .set({}, {}, 1);
      });
    },
    { scope: stage },
  );

  return (
    <section id="highlights" className="scroll-mt-10">
      <SectionHeading
        tone="dark"
        label="On Air & On Stage"
        description="Podcasts, interviews and keynotes where Ujjwal unpacks AI strategy, policy and what comes next."
        title="Highlights"
      />

      {/* Phones: no pinned grid, just the featured reel, full width at its own proportions */}
      <div data-anim="up" className="relative aspect-[1538/756] w-full overflow-hidden md:hidden">
        <ReelVideo />
      </div>

      <div ref={stage} className="relative hidden h-svh overflow-hidden bg-dark md:block">
        <div data-hl-grid className="absolute inset-0 grid origin-center grid-cols-3 grid-rows-3">
          {highlightTiles.map((tile, i) => (
            <div key={tile.src} className="relative overflow-hidden">
              {i === FEATURED ? (
                <ReelVideo />
              ) : (
                <Image src={tile.src} alt={tile.alt} fill sizes="34vw" className="object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The featured reel: UR.mp4 plays muted on a loop while on screen, with the keynote still as its
 * poster. The file is large, so nothing downloads until the section is near the viewport (a
 * hidden copy — phone vs grid layout — never intersects, so it never loads). Under reduced
 * motion it stays on the poster.
 */
function ReelVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload === "none") {
            video.preload = "auto";
            video.load();
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      preload="none"
      poster={highlightTiles[FEATURED].src}
      aria-label={highlightTiles[FEATURED].alt}
      tabIndex={-1}
      className="pointer-events-none absolute inset-0 size-full object-cover"
    >
      <source src="/videos/UR.mp4" type="video/mp4" />
    </video>
  );
}
