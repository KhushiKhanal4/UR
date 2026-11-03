import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { legal } from "@/data/site";

/**
 * Shell for the legal pages: the site header on a dark band with the title, then the text as a
 * readable column on the light page, then the usual footer. Sections are passed as children;
 * `.legal-prose` (globals.css) styles their headings, paragraphs, lists and links.
 */
export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <div id="top" className="relative bg-dark text-white">
        <Header base="/" />
        <div className="container-page pb-14 pt-36 sm:pb-20 sm:pt-44">
          <p className="text-[14px] text-muted-dark">Last updated {legal.lastUpdated}</p>
          <h1 className="mt-3 text-[clamp(36px,5vw,60px)] font-medium leading-[1.1] tracking-[-0.04em]">{title}</h1>
          <p className="mt-5 max-w-[640px] text-[16px] leading-[1.6] text-muted-dark sm:text-[18px]">{intro}</p>
        </div>
      </div>

      <main className="container-page py-14 sm:py-20">
        <article className="legal-prose mx-auto max-w-[720px]">{children}</article>
      </main>

      <Footer base="/" />
    </>
  );
}
