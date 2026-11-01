import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { articles, type Article } from "@/data/content";

export function Articles() {
  return (
    <section id="articles" className="relative scroll-mt-10 pb-16 lg:pb-[127px]">
      <Image
        src="/images/articles-decorative.png"
        alt=""
        width={413}
        height={308}
        sizes="413px"
        className="pointer-events-none absolute right-0 top-0 hidden opacity-48 lg:block"
      />
      <SectionHeading
        tone="light"
        label="Insights"
        descriptionFont="font-dm"
        description="Notes on building AI that works, from chip floors to boardrooms to policy rooms."
        title="Articles"
        titleTracking="tracking-[-5px]"
        className="relative lg:pr-[85px]"
      />

      <div className="container-page lg:pt-[52px]">
        <ul data-anim="stagger" className="grid gap-10 md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:flex lg:gap-0">
          {articles.map((article, i) => (
            <li key={article.title} className="flex min-w-0 lg:contents">
              {i > 0 && <CardDivider />}
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CardDivider() {
  return (
    <span
      aria-hidden
      className="hidden w-px shrink-0 self-stretch lg:block"
      style={{ backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.28), rgba(0,0,0,0))" }}
    />
  );
}

function ArticleCard({ article }: { article: Article }) {
  const { media } = article;
  const { crop } = media;
  const sizes = "(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw";
  return (
    <article data-anim-item className="group flex min-w-0 flex-1 flex-col">
      {/* frame (Figma's proportions, so the crop holds at any width) > hover zoom > scroll zoom
          (starts at 1.3×, settles as the card scrolls in) > the image, cropped as in Figma and
          never stretched: it always covers its own box */}
      <div
        className="relative w-full overflow-hidden bg-subtle"
        style={{ aspectRatio: `${media.width} / ${media.height}` }}
      >
        <div className="absolute inset-0 transition-[scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
          <div data-anim="zoom" className="absolute inset-0">
            {crop ? (
              <div
                className="absolute"
                style={{
                  top: `${(crop.top / media.height) * 100}%`,
                  left: `${(crop.left / media.width) * 100}%`,
                  width: `${(crop.width / media.width) * 100}%`,
                  height: `${(crop.height / media.height) * 100}%`,
                }}
              >
                <Image src={article.image} alt="" fill sizes={sizes} className="object-cover" />
              </div>
            ) : (
              <Image src={article.image} alt="" fill sizes={sizes} className="object-cover" />
            )}
          </div>
        </div>
        {article.folded && <FoldedCorner />}
      </div>

      <div className="flex flex-col gap-5 px-1 pb-4 pt-6 sm:px-10 sm:pb-[60px] sm:pt-10 md:px-6 lg:px-10">
        <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase leading-3 tracking-[-0.24px] text-muted">
          <time>{article.date}</time>
          <span aria-hidden className="size-1 rounded-full bg-ink" />
          <span>{article.readingTime}</span>
        </p>
        <h3 className="max-w-[268px] text-[16px] font-semibold leading-[20.8px] tracking-[-0.8px] text-ink">
          {article.title}
        </h3>
        {article.summary && (
          <p className="max-w-[320px] pb-2.5 text-[16px] leading-[22.4px] tracking-[-0.8px] text-muted">
            {article.summary}
          </p>
        )}
        <a
          href={article.href}
          className="group/cta relative flex items-center gap-1.5 self-start text-[16px] font-medium leading-[1.4] tracking-[-0.64px] text-primary"
        >
          Read Article
          {/* hover: an underline draws in from the left (and out to the right on leave) while
              the arrow slips forward and back in again */}
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:origin-left group-hover/cta:scale-x-100 motion-reduce:transition-none"
          />
          <span aria-hidden className="relative flex size-[10.799px] items-center justify-center overflow-hidden">
            <span className="flex size-full items-center justify-center transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-[180%] motion-reduce:transition-none">
              <span className="relative size-[7.636px] rotate-45">
                <span className="absolute inset-[-9.82%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/arrow-up-right.svg" alt="" width={9.13632} height={9.13635} className="block size-full" />
                </span>
              </span>
            </span>
            {/* the arrow's twin, waiting just off to the left */}
            <span className="absolute inset-0 flex -translate-x-[180%] items-center justify-center transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-0 motion-reduce:transition-none">
              <span className="relative size-[7.636px] rotate-45">
                <span className="absolute inset-[-9.82%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/arrow-up-right.svg" alt="" width={9.13632} height={9.13635} className="block size-full" />
                </span>
              </span>
            </span>
          </span>
          <span className="sr-only">: {article.title}</span>
        </a>
      </div>
    </article>
  );
}

/** Paper-fold accent on the first thumbnail's top-left corner (two rotated SVG shapes from Figma). */
function FoldedCorner() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-0 top-0 size-[120px]">
      <div className="absolute left-[-17px] top-[-16px] flex h-[117.936px] w-[117.735px] items-center justify-center">
        <div className="relative h-[61.337px] w-[105.308px] rotate-[134.81deg]">
          <div className="absolute inset-[0_2.9%_11.96%_2.9%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/article-accent-left.svg" alt="" width={99.1998} height={54.003} className="block size-full" />
          </div>
        </div>
      </div>
      <div className="absolute left-[-38px] top-[-38px] flex h-[117.498px] w-[117.3px] items-center justify-center">
        <div className="relative h-[61.337px] w-[104.69px] rotate-[-45.19deg]">
          <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/article-accent-right.svg" alt="" width={90.6645} height={46.003} className="block size-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
