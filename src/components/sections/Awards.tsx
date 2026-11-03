import Image from "next/image";
import { FadeRule } from "@/components/ui/GradientRule";
import { awards } from "@/data/content";

/** Vertical rules behind the award rows (x within the 1440 frame). */
const AWARD_RULES = [58, 503, 949, 1391].map((x) => `${(x / 1440) * 100}%`);

export function Awards() {
  return (
    <section aria-label="Awards and recognition" className="relative mx-auto max-w-[1440px]">
      {AWARD_RULES.map((left) => (
        <div key={left} className="absolute top-[-12px] hidden h-[302px] xl:block" style={{ left }}>
          <FadeRule orientation="vertical" peak={0.28} className="h-full" />
        </div>
      ))}

      <ul data-anim="stagger" className="container-page relative grid gap-4 py-14 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:py-20 xl:gap-10">
        {awards.map((award) => (
          <li
            key={award.title}
            className="relative flex min-h-[130px] items-center border-y border-white/30 px-5 pb-6 pt-10 sm:p-[30px]"
          >
            <div className="flex items-start gap-5">
              <Image
                src="/images/award.webp"
                alt=""
                width={32}
                height={32}
                sizes="32px"
                className="mt-[3px] size-8 -scale-x-100 object-contain"
              />
              <div className="flex flex-col">
                <h3 className="text-[14px] font-semibold leading-[19.6px] tracking-[-0.56px] text-white">
                  {award.title}
                </h3>
                <p className="text-[14px] leading-[21px] tracking-[-0.56px] text-muted-dark">{award.description}</p>
              </div>
            </div>
            <span className="absolute right-5 top-[19px] font-dm text-[14px] sm:right-[30px] leading-[21px] tracking-[-0.56px] text-muted-dark">
              {award.year}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
