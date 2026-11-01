import type { Metadata, Viewport } from "next";
import { DM_Sans, Figtree, Geist } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Ujjwal Roy — AI Strategist, Founder & Policy Advisor",
  description:
    "Ujjwal Roy engineered chips at Intel and Micron, founded ScaleBuild AI, shaped Nepal’s first National AI Policy, and now leads the World AI Alliance.",
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
    <html lang="en" className={`${figtree.variable} ${dmSans.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HERO_INTRO_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
