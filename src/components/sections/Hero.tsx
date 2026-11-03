import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BackgroundVideo } from "@/components/motion/BackgroundVideo";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { CroppedImage, type Crop } from "@/components/ui/CroppedImage";
import { FadeRule } from "@/components/ui/GradientRule";
import { PillButton } from "@/components/ui/PillButton";
import { BOOKING_HREF, hero } from "@/data/content";

/** x-positions of the decorative vertical grid rules, as a share of the 1440 frame. */
const GRID_RULES = [42, 319, 501, 701, 902, 1055, 1207, 1360].map((x) => `${(x / 1440) * 100}%`);

export function Hero() {
  return (
    // At least one screen tall, growing on short screens so the headline and the profile row
    // below it always keep a clear gap between them.
    // On scroll the video sinks and slowly enlarges while the content lifts away and fades.
    <section id="top" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-dark text-white">
      <div data-anim="sink" className="absolute inset-0 -z-10">
        <div data-hero="video" className="size-full">
          <BackgroundVideo eager className="size-full opacity-[0.28]" />
        </div>
      </div>
      <HeroIntro />

      <div data-anim="exit" className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        {/* Decorative grid (Figma: 29px from the top, 731 of the 871 frame) */}
        <div aria-hidden className="absolute inset-0 hidden lg:block">
          {GRID_RULES.map((left) => (
            <div key={left} className="absolute bottom-[12.7%] top-[3.3%] opacity-50" style={{ left }}>
              <FadeRule hero="grid" orientation="vertical" className="h-full" />
            </div>
          ))}
        </div>

        <div data-hero="header" className="absolute inset-x-0 top-0 z-30">
          <Header />
        </div>

        <div className="container-page flex flex-1 flex-col gap-20 pb-14 pt-32 sm:gap-24 sm:pt-36 lg:gap-[clamp(88px,13svh,140px)] lg:pb-[clamp(28px,4.5svh,48px)] lg:pt-[clamp(112px,24.2svh,211px)]">
          {/* Headline + intro */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            {/* each line rises out of its own mask; the padding keeps descenders inside it */}
            <h1 className="flex flex-col gap-2 text-[clamp(34px,4.45vw,64px)] leading-[1.2] tracking-[-0.078em]">
              <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span data-hero="line" className="block origin-bottom-left">{hero.headline[0]}</span>
              </span>
              <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span
                data-hero="line"
                className="block origin-bottom-left bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5)), linear-gradient(-89.13deg, #e6d8ff 45.39%, #a890d6 93.4%)",
                }}
              >
                {hero.headline[1]}
              </span>
              </span>
            </h1>
            <div className="flex w-full max-w-[418px] shrink-0 flex-col items-start gap-6 lg:max-w-[340px] xl:mr-[13px] xl:max-w-[418px]">
              <p data-hero="fade" className="text-[16px] leading-6 tracking-[-0.5px] sm:text-justify sm:text-[18px]">{hero.intro}</p>
              <div data-hero="fade">
                <PillButton href={BOOKING_HREF} className="px-6 py-3 text-[16px]">
                  Book a strategy call
                </PillButton>
              </div>
            </div>
          </div>

          {/* Profile (left) + former employers (right), anchored to the bottom like the design */}
          <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between lg:mt-auto">
            <div className="md:mb-[13px] lg:pl-2.5">
              <p data-hero="fade" className="flex gap-1 text-[20px] leading-[29px]">
                <span>{hero.firstName}</span>
                <span className="text-muted-dark">{hero.lastName}</span>
              </p>
              <div className="relative mt-[28px] pl-[14px]">
                <FadeRule hero="draw" className="absolute -top-3.5 left-[-44px] w-[340px] md:left-[-64px] md:w-[400px] lg:left-[-74px] xl:left-[-114px] xl:w-[463px]" />
                <ul className="flex flex-col gap-2 whitespace-nowrap text-[15px] font-medium uppercase leading-5 tracking-[-0.14px] sm:text-[16px]">
                  {hero.roles.map((role) => (
                    <li key={role} data-hero="role">
                      {role}
                    </li>
                  ))}
                </ul>
                <FadeRule hero="draw" className="absolute -bottom-[13px] left-[-44px] w-[340px] md:left-[-64px] md:w-[400px] lg:left-[-74px] xl:left-[-114px] xl:w-[463px]" />
              </div>
            </div>

            {/* Formerly at, then Building with below it; anchored to the bottom, so adding the
                second block lifts the first */}
            <div className="flex w-full max-w-[433px] flex-col gap-[30px]">
              <div className="flex flex-col gap-3.5">
                <LogoHeading>Formerly at</LogoHeading>
                <LogoMarquee />
              </div>
              <div className="flex flex-col gap-3.5">
                <LogoHeading>Building with</LogoHeading>
                <BuildingWith />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A logo group's label with a rule fading out to its right. */
function LogoHeading({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span data-hero="fade" className="whitespace-nowrap text-[16px] leading-[29px] text-muted-dark">
        {children}
      </span>
      <span
        aria-hidden
        data-hero="draw"
        className="h-px flex-1"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.45), rgba(255,255,255,0.22), rgba(255,255,255,0.09))",
        }}
      />
    </div>
  );
}

/* The Building with logos are cropped out of padded Figma exports (image inside frame). */
const WAA_CROP: Crop = { top: "-51.75%", left: "-7.33%", width: "114.67%", height: "202.69%" };
const HYPERSCALER_CROP: Crop = { top: "-61.74%", left: "-7.81%", width: "114.06%", height: "221.21%" };

/**
 * The ventures Ujjwal is building now, on the same endless loop as Formerly at. Every size is in
 * em (Figma's px ÷ 17.713, the wordmark's size); the font size is set so the logos stand as tall
 * as Meta, Micron, IBM and Intel above, and it shrinks with the same 80vw rule as that strip.
 * The loop runs slower than the strip's 22s because one copy is longer, so both drift past at
 * the same speed.
 */
function BuildingWith() {
  return (
    <LogoLoop label="ScaleBuild AI, World AI Alliance and Hyperscaler" duration="33s">
      <ul className="flex items-center gap-[1.75em] pr-[1.75em] text-[clamp(16px,4.25vw,23px)] text-subtle">
        <li className="flex items-center gap-[0.38em] py-[0.38em]">
          <InfinityMark />
          <span className="whitespace-nowrap font-semibold leading-[1.4]">
            <span className="font-[family-name:var(--font-onest)]">ScaleBuild </span>
            <span className="font-[family-name:var(--font-spectral)] italic">AI</span>
          </span>
        </li>
        <li>
          <CroppedImage
            src="/images/building/world-ai-alliance.webp"
            alt="World AI Alliance"
            crop={WAA_CROP}
            sizes="180px"
            className="h-[2.171em] w-[9.046em]"
          />
        </li>
        <li className="flex items-center gap-[0.19em] py-[0.38em]">
          <InfinityMark />
          <CroppedImage
            src="/images/building/hyperscaler.webp"
            alt="Hyperscaler"
            crop={HYPERSCALER_CROP}
            sizes="100px"
            className="h-[1.019em] w-[4.66em]"
          />
        </li>
      </ul>
    </LogoLoop>
  );
}

/** An endless horizontal loop: the content is drawn twice so a -50% translate wraps seamlessly,
    and the ends fade into the hero. */
function LogoLoop({ label, duration, children }: { label: string; duration?: string; children: React.ReactNode }) {
  return (
    <div
      data-hero="fade"
      role="img"
      aria-label={label}
      className="w-full overflow-hidden opacity-80 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee-logos will-change-transform" style={duration ? { animationDuration: duration } : undefined}>
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="shrink-0">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The infinity mark shared by ScaleBuild AI and Hyperscaler. */
function InfinityMark() {
  return (
    <span className="relative block h-[1.254em] w-[2.239em] shrink-0">
      <Image src="/images/building/infinity.webp" alt="" fill sizes="48px" className="object-cover" />
    </span>
  );
}

/** The former employers on an endless loop, like the Launched Products titles: the logo strip
    is drawn twice so a -50% translate wraps seamlessly, and the ends fade into the hero. */
function LogoMarquee() {
  return (
    <LogoLoop label="Meta, Micron, IBM and Intel">
      <div className="pr-10">
        <div className="relative aspect-[441/58] w-[clamp(300px,80vw,433px)] overflow-hidden">
          <Image
            src="/images/hero-employer-logos.webp"
            alt=""
            width={2172}
            height={724}
            sizes="(min-width: 768px) 470px, 100vw"
            className="absolute left-[-5.97%] top-[-84.57%] h-[268.78%] w-[106.05%] max-w-none"
          />
        </div>
      </div>
    </LogoLoop>
  );
}
