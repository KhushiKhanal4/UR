import { Footer } from "@/components/layout/Footer";
import { ScrollAnimations } from "@/components/motion/ScrollAnimations";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { About } from "@/components/sections/About";
import { Articles } from "@/components/sections/Articles";
import { Awards } from "@/components/sections/Awards";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { ImpactStats } from "@/components/sections/ImpactStats";
import { Journey } from "@/components/sections/Journey";
import { Products } from "@/components/sections/Products";
import { Services } from "@/components/sections/Services";

export default function HomePage() {
  return (
    <>
      <main className="overflow-x-clip">
        <Hero />
        <About />
        <ImpactStats />
        <Services />
        <div className="bg-dark">
          <Journey />
          <Products />
          <Highlights />
          <Awards />
        </div>
        <Articles />
      </main>
      <Footer />
      {/* last, so its scroll reveals are set up after the pinned sections above them */}
      <ScrollAnimations />
      <SmoothScroll />
    </>
  );
}
