type Tone = "light" | "dark";

/** Hairline that fades out at both ends (Figma: transparent → 45% → transparent). */
export function FadeRule({
  orientation = "horizontal",
  tone = "dark",
  peak = 0.45,
  className = "",
  hero,
}: {
  orientation?: "horizontal" | "vertical";
  tone?: Tone;
  peak?: number;
  className?: string;
  /** marks it for the hero's opening (HeroIntro) */
  hero?: string;
}) {
  const rgb = tone === "dark" ? "255,255,255" : "0,0,0";
  const dir = orientation === "horizontal" ? "to right" : "to bottom";
  return (
    <div
      aria-hidden
      data-hero={hero}
      className={`pointer-events-none ${orientation === "horizontal" ? "h-px" : "w-px"} ${className}`}
      style={{ backgroundImage: `linear-gradient(${dir}, rgba(${rgb},0), rgba(${rgb},${peak}), rgba(${rgb},0))` }}
    />
  );
}

/** Short divider used next to section labels: strong at the label, fading away from it. */
export function LabelRule({ tone = "dark", towards = "right" }: { tone?: Tone; towards?: "left" | "right" }) {
  const rgb = tone === "dark" ? "255,255,255" : "0,0,0";
  const end = tone === "dark" ? 0 : 0.08;
  return (
    <span
      aria-hidden
      className="block h-px w-[110px] shrink-0"
      style={{
        backgroundImage: `linear-gradient(to ${towards}, rgba(${rgb},0.4), rgba(${rgb},0.2), rgba(${rgb},${end}))`,
      }}
    />
  );
}

/** Divider that starts bright on the left and fades out (journey details / footer). */
export function LeadRule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-px w-full ${className}`}
      style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.28) 53.85%, rgba(255,255,255,0) 100%)" }}
    />
  );
}
