import type { Metadata, Viewport } from "next";
import { DM_Sans, Figtree, Geist, Onest, Spectral } from "next/font/google";
import { BookingModal } from "@/components/booking/BookingModal";
import { OG_IMAGE, SITE_TITLE, SITE_URL, person } from "@/data/site";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "900"],
  variable: "--font-figtree",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: false,
});

/* the "ScaleBuild AI" wordmark in the hero's Building with row */
const onest = Onest({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-onest",
  display: "swap",
  preload: false,
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
  variable: "--font-spectral",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${person.name}` },
  description: person.description,
  applicationName: person.name,
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "profile",
    firstName: person.firstName,
    lastName: person.lastName,
    url: "/",
    siteName: person.name,
    locale: "en_US",
    title: SITE_TITLE,
    description: person.description,
    images: [{ ...OG_IMAGE, type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: person.description,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

export const viewport: Viewport = {
  themeColor: "#131319",
};

/* Runs before the first paint: every load starts at the top, so the hero's opening plays each
   time, and (with motion allowed) the hero's pieces stay hidden until HeroIntro reveals them.
   If the script bundle never runs, the class comes off after 3s so nothing stays hidden. */
const HERO_INTRO_SCRIPT = `(function(){try{if("scrollRestoration"in history)history.scrollRestoration="manual";if(location.hash)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var d=document.documentElement;d.classList.add("hero-intro");setTimeout(function(){d.classList.remove("hero-intro")},3000)}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // the inline script adds a class to <html> before hydration: the DOM's version wins
    <html lang="en" className={`${figtree.variable} ${dmSans.variable} ${geist.variable} ${onest.variable} ${spectral.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HERO_INTRO_SCRIPT }} />
        {/* the booking pop-up embeds Calendly: open those connections early */}
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="preconnect" href="https://assets.calendly.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://calendly.com" />
      </head>
      <body>
        {children}
        <BookingModal />
      </body>
    </html>
  );
}
