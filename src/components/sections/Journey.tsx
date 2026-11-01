"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Particles } from "@/components/motion/Particles";
import { JOURNEY_FIELD, JOURNEY_SHAPES } from "@/components/motion/journey-shapes";
import { LeadRule } from "@/components/ui/GradientRule";
import { journey, type JourneyChapter } from "@/data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Desktop with motion allowed: the chapters sit side by side and the page's vertical scroll
   drives them sideways while the section is pinned. Everywhere else they stack as before.
   The layout classes below use the same condition (lg:motion-safe:). */
const HORIZONTAL = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // the chapter whose graphic is gathered; -1 while the section is off screen
  const [active, setActive] = useState(-1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(HORIZONTAL, () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-chapter]", track.current);
        const steps = panels.length - 1;
        const width = () => root.current!.offsetWidth;
        // cached for the per-frame sync, re-measured on each refresh (resize)
        let panelWidth = width();

        /* One scrubbed timeline, in timeline seconds: a short settle, then for each chapter an
           eased slide followed by a hold, so a chapter rests on screen for a stretch of scroll
           instead of sliding straight past. The scroll length is proportional to the whole. */
        const LEAD = 0.3;
        const SLIDE = 1;
        const HOLD = 0.35;
        // scroll per timeline second, in panel widths
        const PACE = 0.8;
        const total = LEAD * 2 + steps * SLIDE + (steps - 1) * HOLD;
        // the section still "is" a chapter while it's mostly on screen; -1 when scrolled away
        const inside = { current: false };
        // runs every frame of the scrub: only touch React when the chapter actually changes
        let last = -2;
        const sync = () => {
          const next = inside.current ? Math.round(-Number(gsap.getProperty(track.current, "x")) / panelWidth) : -1;
          if (next !== last) setActive((last = next));
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: sync,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${total * PACE * width()}`,
            pin: true,
            // Lenis already eases the input, so the slide follows the scroll directly: a second
            // catch-up on top of it is what made the section feel heavy and late
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              panelWidth = width();
            },
          },
        });
        const pin = tl.scrollTrigger!;

        for (let i = 1; i <= steps; i++) {
          const at = LEAD + (i - 1) * (SLIDE + HOLD);
          tl.to(track.current, { x: () => -i * width(), duration: SLIDE, ease: "power2.inOut", force3D: true }, at);
          // the incoming chapter's copy trails in behind the panel edge
          tl.from(
            panels[i].querySelectorAll("[data-reveal]"),
            { x: 120, opacity: 0, stagger: 0.1, duration: 0.75, ease: "power3.out" },
            at + 0.3,
          );
        }
        // the giant background words drift slowly against the slide the whole way through
        tl.fromTo(panels.map((p) => p.querySelector("[data-word]")), { xPercent: 14 }, { xPercent: -14, duration: total }, 0);

        ScrollTrigger.create({
          start: () => pin.start - window.innerHeight * 0.45,
          end: () => pin.end + window.innerHeight * 0.45,
          onToggle: (self) => {
            inside.current = self.isActive;
            sync();
          },
        });
      });

      mm.add(`not all and ${HORIZONTAL}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-chapter]", track.current).forEach((panel, i) => {
          ScrollTrigger.create({
            trigger: panel,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => setActive((a) => (self.isActive ? i : a === i ? -1 : a)),
          });
        });
      });

      // Stacked chapters (phones/tablets): no sideways scroll, so each chapter's copy rises in
      // as it scrolls into view, and its giant word drifts across as the chapter passes.
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-chapter]", track.current).forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-reveal]"), {
            y: 48,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: panel, start: "top 75%", toggleActions: "play none none reverse" },
          });
          gsap.fromTo(
            panel.querySelector("[data-word]"),
            { xPercent: 8 },
            {
              xPercent: -18,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <div id="journey" ref={root} className="relative scroll-mt-10 lg:motion-safe:h-svh lg:motion-safe:overflow-hidden">
      <div ref={track} className="flex flex-col lg:motion-safe:h-full lg:motion-safe:flex-row lg:motion-safe:will-change-transform">
        {journey.map((chapter, i) => (
          <Chapter key={chapter.id} chapter={chapter} gathered={active === i} />
        ))}
      </div>
    </div>
  );
}

function Chapter({ chapter, gathered }: { chapter: JourneyChapter; gathered: boolean }) {
  return (
    <section
      data-chapter
      aria-labelledby={`journey-${chapter.id}`}
      className="relative w-full shrink-0 overflow-hidden bg-dark motion-reduce:defer-render lg:motion-safe:flex lg:motion-safe:h-full lg:motion-safe:items-center"
    >
      {/* pinned to the top of the chapter, not the centred content, so it reads as a
          header and its top edge is clipped slightly by the section */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto max-w-[1440px]">
        <p
          data-word
          className="absolute select-none whitespace-nowrap text-[clamp(96px,17.4vw,250px)] font-black leading-normal text-white opacity-[0.08]"
          style={{
            top: `clamp(${chapter.wordPosition.top}px, ${(chapter.wordPosition.top / 1440) * 100}vw, 0px)`,
            left: `${(chapter.wordPosition.left / 1440) * 100}%`,
          }}
        >
          {chapter.backgroundWord}
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[1440px]">

        <div className="container-page relative flex flex-col gap-12 py-20 md:py-28 lg:gap-[76px] lg:py-[140px] lg:motion-safe:gap-14 lg:motion-safe:py-20">
          <div className="flex items-start justify-between gap-10">
            <div className="flex max-w-[547px] flex-col gap-7">
              <div data-reveal className="flex flex-col gap-4">
                <div className="flex items-center gap-3 font-medium uppercase tracking-[-0.6px] text-muted-dark">
                  <span className="text-[12px]">{chapter.category}</span>
                  <span className="rounded-[20px] border border-[rgba(98,96,99,0.3)] bg-dark-raised px-2.5 py-1 text-[10px]">
                    {chapter.chapter}
                  </span>
                </div>
                <h2
                  id={`journey-${chapter.id}`}
                  className="flex flex-col text-[clamp(40px,5.15vw,74px)] font-semibold leading-[1.216] tracking-[-0.0676em] text-white"
                >
                  <span className="-mb-2">{chapter.headline[0]}</span>
                  <span>{chapter.headline[1]}</span>
                </h2>
              </div>
              <p data-reveal className="max-w-[520px] text-[14px] leading-[22px] text-muted-dark">
                {chapter.description}
              </p>
            </div>

            <Particles
              shapes={JOURNEY_SHAPES[chapter.id]}
              field={JOURNEY_FIELD}
              shape={gathered ? chapter.id : "dust"}
              count={700}
              reach={80}
              force={60}
              fluid
              allowScroll
              pressAdvances={false}
              label={`${chapter.category}, drawn in dots. Move over it to push the dots aside.`}
              className="ptc-on-dark hidden h-auto aspect-[512/400] w-[min(440px,32vw)] shrink-0 lg:grid lg:-mt-6 lg:mr-[2vw]"
            />
          </div>

          <div data-reveal className="flex flex-col gap-8 lg:gap-9">
            <LeadRule />
            {/* Column ratios mirror the Figma widths (370 / 420 / 433). */}
            <dl className="grid max-w-[1223px] gap-6 text-muted-dark md:grid-cols-[370fr_420fr_433fr] md:gap-x-6 xl:gap-x-0">
              {chapter.details.map((detail) => (
                <div key={detail.label} className="flex flex-col gap-2.5 xl:pr-10">
                  <dt className="text-[12px] font-semibold uppercase">{detail.label}</dt>
                  <dd className="text-[13px] leading-5">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
