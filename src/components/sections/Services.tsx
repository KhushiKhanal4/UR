import Image from "next/image";
import { ParticleMorph } from "@/components/motion/ParticleMorph";
import { PillButton } from "@/components/ui/PillButton";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { BOOKING_HREF, services, type Service } from "@/data/content";

export function Services() {
  return (
    <section id="services" className="container-page scroll-mt-10 py-20 md:py-24 lg:pb-[150px] lg:pt-[151px]">
      <div id="services-layout" className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-[30px]">
        {/* Phones/tablets: this wrapper dissolves (display: contents) and the particle stage is
            hidden, so the intro sits straight above the cards. Desktop: it's the sticky left column. */}
        <div className="contents lg:block lg:min-w-0 lg:flex-1 xl:max-w-[604px]">
          <div className="contents lg:sticky lg:top-6 lg:flex lg:flex-col lg:gap-[18px]">
            <div data-anim="stagger" data-anim-stay className="flex flex-col gap-[18px] pb-4 lg:pb-0">
              <SectionLabel tone="light">What I do</SectionLabel>
              <h2 className="max-w-[465px] text-balance font-geist text-[clamp(32px,3.6vw,52px)] font-medium leading-[1.2] tracking-[-0.03em] text-ink">
                Three ways to put AI to work.
              </h2>
              <PillButton href={BOOKING_HREF} variant="primary" className="self-start px-6 pb-3.5 pt-3 text-[16px]">
                Book a strategy call
              </PillButton>
            </div>
            <ParticleMorph
              scopeId="services-layout"
              labels={services.map((s) => s.title)}
              className="max-lg:hidden lg:aspect-square lg:max-h-[calc(100svh-330px)] lg:w-full lg:max-w-[512px] lg:pt-6"
            />
          </div>
        </div>

        <ul data-anim="stagger" className="flex w-full flex-col gap-3 rounded-2xl border border-line bg-subtle p-2.5 sm:gap-5 sm:p-5 lg:w-[56%] lg:max-w-[646px] lg:shrink-0">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <li
      data-service-card
      className="flex flex-col gap-6 rounded-lg bg-card p-5 shadow-[0_0_0_1px_transparent] transition-shadow duration-500 data-active:shadow-[0_0_0_1px_rgba(85,31,162,0.1),0_8px_20px_-14px_rgba(85,31,162,0.18)] sm:gap-7 sm:p-6"
    >
      <div className="flex flex-col gap-5">
        <div className="flex min-h-16 items-center justify-between gap-4 pb-2 sm:pb-5">
          <h3 className="text-[20px] font-medium sm:text-[22px] leading-[26.4px] tracking-[-1px] text-ink">{service.title}</h3>
          <span className="relative flex size-11 shrink-0 items-center justify-center rounded-lg border-[0.667px] border-line bg-subtle">
            <Image src={service.icon} alt="" width={34} height={34} sizes="34px" className="size-[34px] object-cover" />
          </span>
        </div>
        <p className="max-w-[556px] text-[15px] sm:text-[16px] font-medium leading-[1.28] tracking-[0.04px] text-muted">
          {service.description}
        </p>
      </div>
      <ul className="flex flex-wrap gap-2.5">
        {service.tags.map((tag) => (
          <li
            key={tag}
            className="flex h-[30px] items-center rounded-full border border-line bg-subtle px-4 pb-2 pt-2.5 text-[12px] font-semibold uppercase leading-3 text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
    </li>
  );
}
