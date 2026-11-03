import type { MetadataRoute } from "next";
import { SITE_TITLE, person } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: person.name,
    description: person.description,
    start_url: "/",
    display: "browser",
    background_color: "#131319",
    theme_color: "#131319",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon1.png", type: "image/png", sizes: "96x96" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
