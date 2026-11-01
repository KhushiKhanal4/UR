"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ScrollRevealText } from "@/components/motion/ScrollRevealText";
import { LabelRule } from "@/components/ui/GradientRule";
import { about, instagram, socials } from "@/data/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The footer's glyphs are drawn 16px wide inside their box, vertically centred: show just that. */
function SocialGlyph({ icon, size }: { icon: string; size: number }) {
  return (
    <span
      aria-hidden
      className="block size-4 bg-current"
      style={{
        mask: `url(${icon}) 0 ${-(size - 16) / 2}px / ${size}px ${size}px no-repeat`,
        WebkitMask: `url(${icon}) 0 ${-(size - 16) / 2}px / ${size}px ${size}px no-repeat`,
      }}
    />
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);
  const ink = useRef<HTMLDivElement>(null);

  // a normal section, no pinning: the biography inks in as it scrolls up through the screen
  useGSAP(
    () => {
      gsap.fromTo(
        ink.current,
        { "--p": 0 },
        {
          "--p": 1,
          ease: "none",
          scrollTrigger: { trigger: ink.current, start: "top 85%", end: "bottom 45%", scrub: true },
        },
      );
    },
    { scope: root },
  );

  const textClass = "text-[clamp(22px,3.06vw,44px)] font-medium leading-[1.6] tracking-[-0.045em]";

  return (
    <section
      ref={root}
      id="about"
      className="container-page scroll-mt-10 pt-16 md:pt-20 lg:pt-[120px]"
    >
      <div className="mx-auto flex max-w-[1191px] flex-col items-center gap-12 lg:gap-[72px]">
        <div className="flex w-full flex-col items-center gap-8 lg:gap-[43px]">
          <div data-anim="up" className="flex items-center gap-2.5">
            <LabelRule tone="light" towards="left" />
            <h2 className="text-[18px] font-semibold leading-[46px] text-muted">About</h2>
            <LabelRule tone="light" towards="right" />
          </div>
          <div ref={ink} className="w-full">
            <ScrollRevealText paragraphs={about.biography} className={textClass} />
          </div>
        </div>

        {/* Instagram-style gallery: profile header, social links, then a square grid. */}
        <div className="flex w-full flex-col gap-5 md:gap-6">
          <div data-anim="up" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3"
            >
              <span className="relative size-12 overflow-hidden rounded-full ring-2 ring-primary ring-offset-2 ring-offset-page">
                <Image src={instagram.avatar} alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span className="flex flex-col">
                <span className="text-[16px] font-semibold leading-tight">{instagram.handle}</span>
                <span className="text-[14px] leading-tight text-muted transition-colors group-hover:text-primary">
                  Follow on Instagram
                </span>
              </span>
            </a>
            <ul className="flex gap-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    <SocialGlyph icon={social.icon} size={social.size} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ul data-anim="stagger" className="grid grid-cols-2 gap-1 sm:grid-cols-4 md:gap-2">
            {instagram.posts.map((post) => (
              <li key={post.src}>
                <a
                  href={instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden bg-subtle"
                >
                  <Image
                    src={post.src}
                    alt={post.alt}
                    fill
                    sizes="(min-width: 1350px) 300px, (min-width: 640px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-dark/0 text-white opacity-0 transition duration-300 group-hover:bg-dark/40 group-hover:opacity-100">
                    <SocialGlyph icon="/images/social-instagram.svg" size={40} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
