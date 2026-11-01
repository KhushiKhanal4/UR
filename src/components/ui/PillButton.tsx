import type { ComponentProps, CSSProperties, ReactNode } from "react";

type Variant = "light" | "primary";

/* base colours and the fill that swells up on hover */
const variants: Record<Variant, { base: string; fill: string }> = {
  light: {
    base: "bg-card text-ink hover:text-white",
    fill: "bg-primary",
  },
  primary: {
    base: "bg-primary text-white",
    fill: "bg-ink",
  },
};

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

type PillButtonProps = ComponentProps<"a"> & { variant?: Variant };

/**
 * The site's call-to-action pill. On hover (pointer devices only) a circle of the accent swells
 * up from the bottom edge and floods the pill, the label rolls up letter by letter and a copy
 * rolls in from below, and the pill lifts; a press sinks it slightly.
 */
export function PillButton({ variant = "light", className = "", children, ...props }: PillButtonProps) {
  const v = variants[variant];
  return (
    <a
      className={`group relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-semibold tracking-[-0.5px] transition-[color,translate,scale] duration-500 ${EASE} hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current motion-reduce:transition-colors motion-reduce:hover:translate-y-0 ${v.base} ${className}`}
      {...props}
    >
      {/* centred on the bottom edge, wide enough to cover the pill once grown */}
      <span
        aria-hidden
        className={`absolute left-1/2 top-full -z-10 aspect-square w-[max(160%,12rem)] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-[scale] duration-700 ${EASE} group-hover:scale-100 motion-reduce:transition-none ${v.fill}`}
      />
      <RollingLabel>{children}</RollingLabel>
    </a>
  );
}

/** Two stacked copies of the label in a one-line window; hover swaps them, a letter at a time. */
function RollingLabel({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <span className="relative">{children}</span>;

  const chars = Array.from(children);
  const row = (hidden: boolean) =>
    chars.map((char, i) => (
      <span
        key={i}
        className={`inline-block transition-[translate] duration-500 ${EASE} motion-reduce:transition-none ${
          hidden ? "translate-y-full group-hover:translate-y-0" : "group-hover:-translate-y-full"
        }`}
        style={{ transitionDelay: `${i * 14}ms` } as CSSProperties}
      >
        {char === " " ? " " : char}
      </span>
    ));

  return (
    <span className="relative block overflow-hidden">
      <span className="sr-only">{children}</span>
      <span aria-hidden className="block">
        {row(false)}
      </span>
      <span aria-hidden className="absolute inset-0 block">
        {row(true)}
      </span>
    </span>
  );
}
