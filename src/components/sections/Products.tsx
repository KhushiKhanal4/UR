import Image from "next/image";
import { CaseStudyMotion } from "@/components/motion/CaseStudyMotion";
import { FadeRule } from "@/components/ui/GradientRule";
import { SectionIntro } from "@/components/ui/SectionHeading";
import { marqueeItems, products, type Product } from "@/data/content";

/** Vertical rules on the card's column edges (Figma: 120 / 516.78 / 918.78 in the 1440 frame,
    i.e. the left edge and the thirds of the 1200 content box), placed in that same box so the
    index, year, summary and categories and the preview's left edge sit exactly on them. */
const PRODUCT_RULES = ["0%", "33.3333%", "66.6667%"];

export function Products() {
  return (
    <div id="products" className="scroll-mt-10">
      <div className="container-page grid gap-8 py-16 md:py-20 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-10 lg:py-[120px] xl:grid-cols-[400px_800px] xl:gap-0">
        <SectionIntro
          tone="dark"
          label="Built & Shipped"
          descriptionFont="font-dm"
          description="AI products and platforms Ujjwal has taken from idea to market, built to solve real business problems."
        />
        <TitleMarquee />
      </div>

      <CaseStudyMotion>
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i + 1} />
        ))}
      </CaseStudyMotion>
    </div>
  );
}

function TitleMarquee() {
  // The list is rendered twice so a -50% translate loops seamlessly.
  const loop = [...marqueeItems, ...marqueeItems];
  return (
    // clipped sideways only: the 0.8 leading lets the glyphs overhang the box vertically
    <div data-anim="up" className="h-[clamp(84px,9vw,114px)] w-full overflow-x-clip xl:w-[800px]" aria-label="Launched Products">
      <div aria-hidden className="flex w-max animate-marquee gap-2.5 will-change-transform">
        {loop.map((item, i) => (
          <div key={i} className="flex shrink-0 flex-col gap-[clamp(12px,1.4vw,20px)] pr-10">
            <p
              className={`${item.font} whitespace-nowrap text-[clamp(56px,6.95vw,100px)] font-semibold leading-[0.8] tracking-[-0.08em] text-white`}
            >
              {item.title}
            </p>
            <p className="text-[14px] font-semibold uppercase leading-[14px] tracking-[-0.56px]">
              <span className="text-white/30">©</span>
              <span className="text-white"> 2023-25</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    // A screen-tall stage per case study, the card centred in it.
    <article className="relative flex lg:min-h-svh">
      {/* Blurred, darkened, grained artwork pinned to the viewport (Figma: layer blur 18 = CSS
          blur(9px), a 20% black fill, monotone noise), at 1.2× so the blur never shows an edge.
          The list clips these to itself, and each one fades in over the last as its card comes
          up (CaseStudyMotion); later cards' start hidden so the first paint is right.
          Half-res source: the blur hides anything finer. */}
      <div
        aria-hidden
        data-cs-backdrop
        className="pointer-events-none fixed inset-0 z-0"
        style={index > 1 ? { opacity: 0, visibility: "hidden" } : undefined}
      >
        <Image src={product.image} alt="" fill sizes="60vw" className="scale-[1.2] transform-gpu object-cover blur-[9px] will-change-transform" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute -inset-[120px] overflow-hidden">
          <div className="noise absolute inset-0 animate-grain" />
        </div>
      </div>

      <div className="relative z-[1] mx-auto flex w-full max-w-[1440px] px-5 md:px-10 lg:px-[120px]">
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col justify-center">
          {PRODUCT_RULES.map((left) => (
            <div key={left} className="absolute bottom-0 top-0 hidden lg:block" style={{ left }}>
              <FadeRule orientation="vertical" className="h-full" />
            </div>
          ))}

          <a
            href={product.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex flex-col py-12 md:py-16 lg:py-0"
          >
            <div className="grid h-8 grid-cols-[1fr_2fr] text-[12px] sm:grid-cols-3 font-medium uppercase leading-3 tracking-[-0.24px]">
              <span className="font-dm text-muted-dark">{String(index).padStart(2, "0")}.</span>
              <span className="flex gap-[5px]">
                <span className="text-muted-dark">year</span>
                <span className="text-white">{product.year}</span>
              </span>
            </div>

            {/* stage (measured, never moves) > frame (rises into place, clips) > entry zoom
                (1.7× down to 1×) > drift (taller than the frame, parallax). See CaseStudyMotion. */}
            <div data-cs-stage className="relative aspect-square w-full md:aspect-[1200/498]">
              <div data-cs-frame className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0">
                  <div data-cs-enter className="absolute inset-0">
                    <div data-cs-drift className="absolute inset-x-0 -top-[30%] h-[160%]">
                      <Image
                        src={product.image}
                        alt={product.summary}
                        fill
                        sizes="(min-width: 1440px) 1320px, 92vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pb-2 pt-5 sm:grid-cols-3 sm:gap-0 lg:h-[86px] lg:pb-0">
              <span aria-hidden className="hidden sm:block" />
              <h3 className="font-dm text-[14px] font-semibold uppercase leading-[14px] tracking-[-0.56px] text-white">
                {product.summary}
              </h3>
              <ul className="flex flex-col gap-[5px] text-[12px] font-semibold uppercase leading-3 tracking-[-0.24px] text-muted-dark">
                {product.categories.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </a>
        </div>
      </div>
    </article>
  );
}
