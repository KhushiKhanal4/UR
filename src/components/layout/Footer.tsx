import { BackgroundVideo } from "@/components/motion/BackgroundVideo";
import { PillButton } from "@/components/ui/PillButton";
import { BOOKING_HREF, footer } from "@/data/content";

export function Footer() {
  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-[#111] text-white">
      {/* Atmospheric backdrop + shading, behind the whole footer: the navigation panel is
          see-through (Figma: 1% black, 2px backdrop blur), so the waves run on behind the links */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* Figma: the wave video rotated ~90° at 40% opacity. Phones: the footer is taller than
            the rotated video is, so it stands upright and covers the whole footer instead */}
        <div className="absolute inset-0 flex items-center justify-center md:inset-auto md:left-1/2 md:top-[-340px] md:h-[977px] md:w-[max(1457px,100%)] md:-translate-x-1/2">
          <BackgroundVideo className="h-full w-full opacity-40 md:h-[max(1449px,100vw)] md:w-[965px] md:max-w-none md:shrink-0 md:rotate-[90.47deg]" />
        </div>
        <div
          className="absolute inset-0 md:inset-x-0 md:bottom-auto md:top-[-248px] md:h-[873px]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(9,10,14,0.349) 0%, rgba(9,10,14,0.059) 42%, rgba(9,10,14,0.58) 68%, rgba(9,10,14,0.902) 100%)",
          }}
        />
      </div>

      <div className="h-[clamp(120px,15.4vw,222px)]" />

      <div className="border-t border-white/10 bg-black/[0.01] shadow-[0_-24px_80px_0_rgba(9,10,14,0.34)] backdrop-blur-[2px]">
        <div className="container-page flex flex-col pb-8 pt-[46px]">
          <div data-anim="stagger" className="flex flex-col gap-12 xl:flex-row xl:gap-20">
            <div className="flex flex-1 flex-col gap-4">
              <p className="flex h-10 items-start text-[20px] font-medium leading-none text-[#fafafa]">UJJWAL ROY</p>
              <p className="text-[14px] leading-[1.625] tracking-[-0.8px] text-[rgba(212,212,216,0.78)]">
                {footer.tagline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <PillButton href={BOOKING_HREF} className="self-start px-5 py-2.5 text-[15px]">
                Book a strategy call
              </PillButton>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-12 xl:w-[720px] xl:shrink-0">
              {footer.columns.map((column) => (
                <div key={column.heading} className="flex flex-col gap-4">
                  <h2 className="text-[14px] uppercase leading-[1.15] text-[#fafafa] sm:text-[16px] sm:leading-none">{column.heading}</h2>
                  <ul className="flex flex-col gap-2 text-[14px] font-light leading-[1.25] text-[rgba(212,212,216,0.9)]">
                    {column.links.map((link) => (
                      <li key={link.label} className="min-h-[18px]">
                        <a href={link.href} className="transition-colors hover:text-white">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="pt-9">
            <div data-anim="rule" className="h-px bg-white/[0.11]" />
            {/* phones: socials and legal links first, the copyright line closing the page */}
            <div className="flex flex-col gap-5 pt-4 md:flex-row md:items-start md:justify-between md:gap-6">
              <p className="order-last text-[13px] leading-[1.5] text-[#a1a1aa] md:order-none md:text-[14px]">© 2026 Ujjwal Roy. All rights reserved.</p>
              <div className="flex flex-col gap-2 md:items-end md:gap-0">
                <ul className="flex gap-1">
                  {footer.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        aria-label={social.label}
                        className="flex size-10 items-center opacity-90 transition-opacity hover:opacity-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={social.icon} alt="" width={social.size} height={social.size} className="block" />
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-wrap gap-x-5 gap-y-1">
                  {footer.legal.map((link) => (
                    <li key={link.label} className="flex h-5 items-center">
                      <a href={link.href} className="text-[14px] leading-none text-[#d4d4d8] transition-colors hover:text-white">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
