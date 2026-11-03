/**
 * Site-wide facts for SEO and AEO: metadata, the share card, the sitemap, robots and the
 * structured data that tells search and answer engines who Ujjwal is. Change them here only.
 */
import { socials } from "@/data/content";

export const SITE_URL = "https://ujjwalroy.com";

export const person = {
  name: "Ujjwal Roy",
  firstName: "Ujjwal",
  lastName: "Roy",
  jobTitle: "AI Strategist, Founder & Policy Advisor",
  /** ~155 characters: what search results show under the title */
  description:
    "Ujjwal Roy is an AI strategist and founder. He engineered chips at Intel and Micron, founded ScaleBuild AI, shaped Nepal’s first National AI Policy and leads the World AI Alliance.",
  portrait: "/images/about-featured.webp",
  knowsAbout: [
    "Artificial intelligence strategy",
    "AI policy and governance",
    "Semiconductor engineering",
    "Product strategy",
    "Business growth",
    "AI for government",
  ],
};

export const SITE_TITLE = `${person.name} — ${person.jobTitle}`;

/** The share card (public/og-image.jpg, a compressed copy of og-image.png). */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Ujjwal Roy, AI Strategist: “I help founders, boards and governments turn AI into measurable growth.”",
};

/** Real profile URLs only: placeholder "#" links join automatically once they're filled in. */
export const profileLinks = socials
  .map((s) => s.href)
  .filter((href) => href.startsWith("http"))
  .map((href) => href.split("?")[0]); // drop tracking parameters: these identify the profiles

export const ventures = {
  scaleBuild: { name: "ScaleBuild AI" },
  worldAiAlliance: { name: "World AI Alliance" },
  hyperscaler: { name: "Hyperscaler", url: "https://hyperscalerai.co/" },
};

/** As shown in the hero's Formerly at row */
export const formerEmployers = ["Meta", "Micron", "IBM", "Intel"];

export const absolute = (path: string) => new URL(path, SITE_URL).toString();

/** The legal pages (/privacy, /terms). */
export const legal = {
  owner: person.name,
  email: "ujjwal@scalebuild.ai",
  governingLaw: "the State of North Carolina, United States",
  lastUpdated: "November 3, 2026",
};
