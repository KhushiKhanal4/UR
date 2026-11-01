import { stats } from "@/data/content";

export function ImpactStats() {
  return (
    <section aria-label="Impact" className="container-page pt-12 md:pt-16 lg:pt-[107px]">
      {/* Column ratios mirror the Figma card widths (364 / 363 / 267). */}
      <dl data-anim="stagger" className="mx-auto grid max-w-[1191px] grid-cols-1 sm:grid-cols-[364fr_363fr_267fr]">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col-reverse gap-4 border-b border-dashed border-muted-dark pb-8 pt-6 sm:gap-6 sm:pb-[52px] sm:pr-4"
          >
            <dt className="text-[14px] leading-[16.8px] text-muted">{stat.label}</dt>
            <dd data-anim="count" className="text-[clamp(40px,5vw,54px)] font-semibold leading-[1.2] tracking-[-0.09em] text-ink">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
