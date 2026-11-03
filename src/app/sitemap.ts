import type { MetadataRoute } from "next";
import { OG_IMAGE, SITE_URL, absolute, person } from "@/data/site";

/** Add an entry here for every new route. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [absolute(person.portrait), absolute(OG_IMAGE.url)],
    },
    { url: absolute("/privacy"), lastModified: new Date("2026-11-03"), changeFrequency: "yearly", priority: 0.3 },
    { url: absolute("/terms"), lastModified: new Date("2026-11-03"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
