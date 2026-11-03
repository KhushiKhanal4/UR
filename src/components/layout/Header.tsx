import { BOOKING_HREF, navLinks } from "@/data/content";
import { PillButton } from "@/components/ui/PillButton";

/** `base` prefixes the in-page links: "/" on pages other than home, so "#about" becomes "/#about". */
export function Header({ base = "" }: { base?: string }) {
  return (
    <header className="container-page absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 pb-2.5 pt-6">
      <nav aria-label="Primary" className="flex flex-1 items-center gap-[42px] text-muted-dark">
        <a href={`${base}#top`} className="font-dm text-[32px] leading-none tracking-[-6.4px]" aria-label="Ujjwal Roy — home">
          UR
        </a>
        <ul className="hidden w-[456px] items-center justify-between font-dm text-[18px] font-medium leading-[1.4] tracking-[-1px] lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={base + link.href} className="transition-colors hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <PillButton href={BOOKING_HREF} className="hidden w-[140px] px-[18px] py-1.5 font-dm text-[16px] sm:inline-flex">
        Book a call
      </PillButton>

      {/* Mobile / tablet menu — native <details>, so it works without JavaScript */}
      <details className="group relative lg:hidden">
        <summary
          aria-label="Open menu"
          className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/20 text-white [&::-webkit-details-marker]:hidden"
        >
          <span aria-hidden className="relative block h-3 w-4">
            <span className="absolute inset-x-0 top-0 h-px bg-current transition-transform group-open:translate-y-[5.5px] group-open:rotate-45" />
            <span className="absolute inset-x-0 top-[5.5px] h-px bg-current transition-opacity group-open:opacity-0" />
            <span className="absolute inset-x-0 bottom-0 h-px bg-current transition-transform group-open:-translate-y-[5.5px] group-open:-rotate-45" />
          </span>
        </summary>
        <div className="absolute right-0 top-12 w-[min(78vw,280px)] rounded-2xl border border-white/10 bg-dark-raised/95 p-2 shadow-2xl backdrop-blur-md">
          <ul className="flex flex-col font-dm text-[18px] font-medium tracking-[-0.5px] text-muted-dark">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={base + link.href} className="block rounded-xl px-4 py-3 transition-colors hover:bg-white/5 hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <PillButton href={BOOKING_HREF} className="mt-2 w-full px-[18px] py-3 font-dm text-[16px] sm:hidden">
            Book a call
          </PillButton>
        </div>
      </details>
    </header>
  );
}
