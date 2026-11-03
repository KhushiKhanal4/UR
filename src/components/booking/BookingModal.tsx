"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { BOOKING_HREF, booking } from "@/data/content";

/* Any link to Calendly opens here instead of leaving the site. */
const isBookingLink = (el: EventTarget | null) =>
  el instanceof Element ? el.closest<HTMLAnchorElement>('a[href^="https://calendly.com/"]') : null;

/* What the visitor reads while Calendly loads, one line at a time. */
const STATUS_LINES = [
  "Opening Ujjwal’s calendar…",
  "Finding open slots in your time zone…",
  "Lining up the next available days…",
  "Almost there…",
];

/* After this long without Calendly reporting in, offer the direct link as a way out. */
const SLOW_AFTER_MS = 9000;

type Phase = "idle" | "loading" | "ready" | "booked";

/**
 * The booking pop-up. Mounted once in the layout, it listens for clicks on any Calendly link
 * (so every "Book a call" button keeps a plain href that still works without JavaScript) and
 * shows the booking page in a modal over the site.
 *
 * Layout: our own details panel on the left, Calendly on the right. Calendly's event header is
 * hidden (the panel replaces it) and its column is kept narrow, because at wider sizes Calendly
 * draws its own bordered card, which reads as a pop-up inside the pop-up.
 *
 * Speed: the layout preconnects to Calendly, and the iframe starts loading the moment a visitor
 * shows intent (hovering, focusing or touching a booking link), so by the time they click it is
 * usually ready. Once loaded it stays mounted, so reopening is instant.
 */
export function BookingModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [src, setSrc] = useState<string | null>(null); // set on warm-up or open
  const [phase, setPhase] = useState<Phase>("idle");
  const [frameKey, setFrameKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const phaseRef = useRef<Phase>("idle");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const warm = useCallback(() => {
    if (src) return;
    const params = new URLSearchParams({
      embed_domain: window.location.host,
      embed_type: "Inline",
      hide_gdpr_banner: "1",
      hide_event_type_details: "1",
      hide_landing_page_details: "1",
      background_color: "ffffff",
      text_color: "131319",
      primary_color: "131319",
    });
    setSrc(`${BOOKING_HREF}?${params}`);
    setPhase((p) => (p === "idle" ? "loading" : p));
  }, [src]);

  const open = useCallback(() => {
    warm();
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setIsOpen(true);
    document.documentElement.classList.add("booking-open");
    window.dispatchEvent(new Event("booking:open"));
  }, [warm]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  /* intercept booking links site-wide, and warm the iframe on intent */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = isBookingLink(e.target);
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      link.closest("details")?.removeAttribute("open"); // the mobile menu
      open();
    };
    const onIntent = (e: Event) => {
      if (isBookingLink(e.target)) warm();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
    document.addEventListener("touchstart", onIntent, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("focusin", onIntent);
      document.removeEventListener("touchstart", onIntent);
    };
  }, [open, warm]);

  /* Calendly reports its progress over postMessage */
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com" || typeof e.data?.event !== "string") return;
      const event: string = e.data.event;
      if (event === "calendly.event_scheduled") setPhase("booked");
      else if (event.startsWith("calendly.")) setPhase((p) => (p === "loading" ? "ready" : p));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /* closing: release the page, and start fresh next time if they already booked */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.classList.remove("booking-open");
      window.dispatchEvent(new Event("booking:close"));
      setIsOpen(false);
      if (phaseRef.current === "booked") {
        setFrameKey((k) => k + 1);
        setPhase("loading");
      }
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const booked = phase === "booked";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="booking-title"
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) close(); // a click on the backdrop
      }}
      className="booking-dialog m-auto h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-ink sm:h-[min(720px,calc(100dvh-32px))] sm:w-[min(880px,calc(100vw-32px))]"
    >
      <div className="relative flex h-full flex-col overflow-hidden bg-card sm:rounded-xl md:flex-row">
        <DetailsPanel booked={booked} />

        {/* Calendly column */}
        <div className="relative min-h-0 flex-1">
          <div className="relative mx-auto h-full w-full max-w-[520px]">
            {src && (
              <iframe
                key={frameKey}
                src={src}
                title="Book a strategy call with Ujjwal Roy"
                allow="payment"
                onLoad={() => {
                  // in case Calendly's message never arrives, reveal it shortly after the frame loads
                  window.setTimeout(() => setPhase((p) => (p === "loading" ? "ready" : p)), 1200);
                }}
                className={`absolute inset-0 size-full border-0 transition-opacity duration-500 ${
                  phase === "loading" ? "opacity-0" : "opacity-100"
                }`}
              />
            )}
            <BookingLoader visible={phase === "loading" || phase === "idle"} active={isOpen} />
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close booking"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}

/** Who, what and how long: a compact header on phones, a side panel from tablet up. */
function DetailsPanel({ booked }: { booked: boolean }) {
  return (
    <aside className="flex shrink-0 items-center gap-3 border-b border-line py-3 pl-4 pr-14 md:w-[300px] md:flex-col md:items-start md:gap-0 md:border-b-0 md:border-r md:bg-page md:p-8">
      <Image
        src={booking.avatar}
        alt=""
        width={56}
        height={56}
        sizes="56px"
        className="size-10 shrink-0 rounded-full object-cover md:size-14"
      />
      <div className="min-w-0 md:mt-5">
        <p className="hidden text-[14px] font-medium text-muted md:block">{booking.host}</p>
        <h2 id="booking-title" className="truncate font-dm text-[16px] font-semibold leading-tight tracking-[-0.4px] md:mt-1 md:whitespace-normal md:text-[22px]">
          {booked ? "You’re booked. See you soon!" : booking.title}
        </h2>
        <p className="mt-0.5 text-[13px] text-muted md:hidden">
          {booking.duration} · Video call
        </p>
      </div>

      <ul className="mt-6 hidden flex-col gap-3 text-[14px] text-muted md:flex">
        <li className="flex items-start gap-2.5">
          <ClockIcon />
          <span className="font-medium text-ink">{booking.duration}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <VideoIcon />
          <span>{booking.location}</span>
        </li>
      </ul>

      <ul className="mt-auto hidden flex-col gap-2 border-t border-line pt-5 text-[13px] text-muted md:flex md:w-full">
        {booking.assurances.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <CheckIcon />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * Shown until Calendly is ready: a skeleton shaped like Calendly's own (so nothing jumps when the
 * real one fades in), a wave that passes over the days as if open slots were being found, a
 * status line that moves on every couple of seconds, and a progress bar that keeps creeping.
 */
function BookingLoader({ visible, active }: { visible: boolean; active: boolean }) {
  const [line, setLine] = useState(0);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!visible || !active) return;
    setLine(0);
    setSlow(false);
    const tick = window.setInterval(() => setLine((l) => Math.min(l + 1, STATUS_LINES.length - 1)), 1800);
    const late = window.setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(late);
    };
  }, [visible, active]);

  return (
    <div
      aria-hidden={!visible}
      className={`absolute inset-0 flex flex-col bg-card transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="h-[2px] w-full overflow-hidden bg-subtle">
        <div className={`booking-progress h-full bg-ink/70 ${visible ? "" : "booking-progress-done"}`} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center gap-6 overflow-hidden px-6 pt-8 sm:px-10">
        <Bar className="h-5 w-32" />
        <div className="flex w-full max-w-[360px] items-center justify-between">
          <Bar className="size-7 rounded-md" />
          <Bar className="h-4 w-28" />
          <Bar className="size-7 rounded-md" />
        </div>
        <div className="grid w-full max-w-[360px] grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => (
            <span
              key={i}
              className="booking-day aspect-square rounded-full bg-subtle"
              style={{ animationDelay: `${(i % 7) * 90 + Math.floor(i / 7) * 160}ms` }}
            />
          ))}
        </div>
        <div className="flex w-full max-w-[360px] flex-col gap-2">
          <Bar className="h-3 w-20" />
          <Bar className="h-3 w-40" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 px-6 py-4 text-center" role="status" aria-live="polite">
        <p key={line} className="booking-status flex items-center gap-2 text-[14px] font-medium text-ink">
          <span className="booking-pulse size-1.5 rounded-full bg-ink" aria-hidden />
          {STATUS_LINES[line]}
        </p>
        {slow && (
          <p className="booking-status text-[13px] text-muted">
            Taking a little longer than usual.{" "}
            <a href={BOOKING_HREF} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-2">
              Open the calendar in a new tab
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function Bar({ className = "" }: { className?: string }) {
  return <span className={`booking-shimmer block rounded-full bg-subtle ${className}`} />;
}

const iconProps = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, "aria-hidden": true } as const;

function ClockIcon() {
  return (
    <svg {...iconProps} className="mt-0.5 shrink-0">
      <circle cx="8" cy="8" r="6.3" />
      <path d="M8 4.5V8l2.3 1.5" strokeLinecap="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg {...iconProps} className="mt-0.5 shrink-0">
      <rect x="1.5" y="4" width="9" height="8" rx="1.5" />
      <path d="M10.5 7l4-2.2v6.4l-4-2.2" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...iconProps} className="shrink-0">
      <path d="M3.5 8.3l2.8 2.7 6.2-6.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
