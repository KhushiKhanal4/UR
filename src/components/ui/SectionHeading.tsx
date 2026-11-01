import type { ReactNode } from "react";
import { LabelRule } from "./GradientRule";

type Tone = "light" | "dark";

export function SectionLabel({ children, tone }: { children: ReactNode; tone: Tone }) {
  return (
    <div className="flex h-[33px] items-center gap-2.5">
      <span
        className={`whitespace-nowrap text-[18px] font-semibold leading-[46px] ${tone === "dark" ? "text-muted-dark" : "text-muted"}`}
      >
        {children}
      </span>
      <LabelRule tone={tone} />
    </div>
  );
}

/**
 * Two-column section intro: small label + description on the left, oversized title on the right.
 * Used by Highlights, Articles and (with a custom right slot) Products.
 */
export function SectionHeading({
  id,
  tone,
  label,
  description,
  descriptionFont = "font-sans",
  title,
  titleTracking = "tracking-[-6px]",
  className = "",
}: {
  id?: string;
  tone: Tone;
  label: string;
  description: string;
  descriptionFont?: string;
  title: ReactNode;
  titleTracking?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={`container-page flex scroll-mt-10 flex-col gap-8 pb-12 pt-20 md:pb-16 md:pt-24 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pb-[100px] lg:pt-[150px] ${className}`}
    >
      <SectionIntro tone={tone} label={label} description={description} descriptionFont={descriptionFont} />
      <div className="flex w-full items-start lg:h-[114px] lg:min-w-0 lg:max-w-[800px] lg:flex-1">
        <h2
          data-anim="chars"
          className={`whitespace-nowrap text-[clamp(56px,6.95vw,100px)] font-semibold leading-[0.8] ${titleTracking} ${tone === "dark" ? "text-white" : "text-ink"}`}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

export function SectionIntro({
  tone,
  label,
  description,
  descriptionFont = "font-sans",
}: {
  tone: Tone;
  label: string;
  description: string;
  descriptionFont?: string;
}) {
  return (
    <div data-anim="stagger" className="flex w-full max-w-[302px] shrink-0 flex-col gap-4">
      <SectionLabel tone={tone}>{label}</SectionLabel>
      <p
        className={`${descriptionFont} text-[16px] leading-[22.4px] tracking-[-0.8px] ${tone === "dark" ? "text-muted-dark" : "text-muted"}`}
      >
        {description}
      </p>
    </div>
  );
}
