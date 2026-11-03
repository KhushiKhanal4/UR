/**
 * All page copy lives here so sections stay purely presentational.
 * Image paths point at /public/images (downloaded from the Figma file).
 */

export const BOOKING_HREF = "https://calendly.com/ujjwalroy1/hyperscaler-scale-your-build";

/** The booking pop-up's details panel (mirrors the Calendly event, whose own header is hidden). */
export const booking = {
  host: "Ujjwal Roy",
  avatar: "/images/about-featured.webp",
  title: "Hyperscaler – Scale your Build",
  duration: "30 min",
  location: "Web conferencing details provided upon confirmation",
  assurances: ["Times shown in your time zone", "Instant calendar invite", "Reschedule anytime"],
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Journey", href: "#journey" },
  { label: "Highlights", href: "#highlights" },
  { label: "Articles", href: "#articles" },
] as const;

export const hero = {
  headline: ["AI should grow every", "business & serve every nation."],
  intro:
    "Ujjwal Roy engineered chips at Intel and Micron, founded ScaleBuild AI, shaped Nepal’s first National AI Policy, and now leads the World AI Alliance.",
  firstName: "Ujjwal",
  lastName: "Roy",
  roles: ["AI Visionary", "AI Advisor", "Product Strategist", "Business growth expert", "Operator"],
};

export const about = {
  biography: [
    "Ujjwal Roy has worked at every level of technology. He engineered chips at Intel and Micron, founded ScaleBuild AI to turn AI into revenue, and helped shape Nepal’s first National AI Policy.",
    "Today he leads the World AI Alliance, building AI that is fair and accountable for all.",
  ],
};

export const INSTAGRAM_HREF = "https://www.instagram.com/ujjwalroyx?cplk=anV5ejNhMjR5bjcz";

/** Instagram-style gallery under the biography: a curated grid, every tile opens the profile. */
export const instagram = {
  handle: "@ujjwalroyx",
  href: INSTAGRAM_HREF,
  avatar: "/images/about-featured.webp",
  /** How many tiles the grid shows; they're drawn at random from `posts` on each visit. */
  gridSize: 8,
  /** `fit: "contain"` shows the whole photo over a blurred copy of itself instead of cropping it. */
  posts: <{ src: string; alt: string; fit?: "contain" }[]>[
    { src: "/images/about-section/image1.webp", alt: "Ujjwal Roy named Founding President of the World AI Alliance" },
    { src: "/images/about-section/image2.webp", alt: "Driving through San Francisco at night" },
    { src: "/images/about-section/image3.webp", alt: "Ujjwal Roy at the Pyramids of Giza" },
    { src: "/images/about-section/image4.webp", alt: "Podcast episode on AGI and the next breakthrough" },
    { src: "/images/about-section/image5.webp", alt: "Podcast episode on the future of work and jobs" },
    { src: "/images/about-section/image6.webp", alt: "Podcast episode on how much work AI will do" },
    { src: "/images/about-section/image7.webp", alt: "Ujjwal Roy discussing why Meta and Google keep getting hit" },
    { src: "/images/about-section/about-featured.webp", alt: "Ujjwal Roy in front of a rocket-launch backdrop" },
    // the two people stand at opposite edges: a portrait crop would cut one off, so show it whole
    {
      src: "/images/about-section/trade-fair.webp",
      alt: "Ujjwal Roy at the New York International Trade Fair awards",
      fit: "contain",
    },
  ],
};

export type Social = { label: string; href: string; icon: string; size: number };

const footerSocials: Social[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ujjwalroyx", icon: "/images/social-linkedin.svg", size: 40 },
  { label: "X", href: "#", icon: "/images/social-x.svg", size: 40 },
  { label: "YouTube", href: "#", icon: "/images/social-youtube.svg", size: 16 },
  { label: "Facebook", href: "https://www.facebook.com/ujjwal.roy.9985/", icon: "/images/social-facebook.svg", size: 40 },
];

/** Every profile, Instagram first (the About gallery's row). The footer keeps its original four. */
export const socials: Social[] = [
  { label: "Instagram", href: INSTAGRAM_HREF, icon: "/images/social-instagram.svg", size: 40 },
  ...footerSocials,
];

export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "16K+", label: "Follow his AI insights on LinkedIn" },
  { value: "50+", label: "Companies advised and built for" },
  { value: "30+", label: "Keynotes, panels and judging seats" },
];

export type Service = { title: string; icon: string; description: string; tags: string[] };

export const services: Service[] = [
  {
    title: "AI Growth Advisory",
    icon: "/images/service-ai-growth.webp",
    description:
      "Ujjwal finds where AI can add revenue or cut cost, then builds it with ScaleBuild AI’s engineers. You get a working system in production, not a strategy deck.",
    tags: ["AI Opportunity Audit", "Build & Deploy", "Fractional AI Strategist"],
  },
  {
    title: "Policy & Government Advisory",
    icon: "/images/service-policy.webp",
    description:
      "Ujjwal helped shape Nepal’s first National AI Policy and 30-year IT roadmap. He now helps governments and institutions write AI rules their citizens can trust.",
    tags: ["National AI Policy", "Data Sovereignty", "AI Talent Programs"],
  },
  {
    title: "Keynotes & Speaking",
    icon: "/images/service-keynotes.webp",
    description:
      "From the World AI Alliance launch to judging AI hackathons, Ujjwal speaks on AI strategy, ethics and the Global South. He speaks as someone who has built chips, companies and policy.",
    tags: ["Keynotes", "Panels & Firesides", "Hackathon Judging"],
  },
  {
    title: "Backing Founders",
    icon: "/images/service-founders.webp",
    description:
      "From the World AI Alliance launch to judging AI hackathons, Ujjwal speaks on AI strategy, ethics and the Global South. He speaks as someone who has built chips, companies and policy.",
    tags: ["AI-First Startups", "Pre-seed / Seed", "Strategy & Intros"],
  },
];

export type JourneyChapter = {
  id: string;
  backgroundWord: string;
  /** Offset of the giant background word inside the 1462px-wide section (from Figma). */
  wordPosition: { top: number; left: number };
  category: string;
  chapter: string;
  headline: [string, string];
  description: string;
  details: { label: string; value: string }[];
};

export const journey: JourneyChapter[] = [
  {
    id: "silicon",
    backgroundWord: "SILICON",
    wordPosition: { top: -78, left: 410 },
    category: "Silicon",
    chapter: "The roots",
    headline: ["BUILT FROM THE", "TRANSISTOR UP"],
    description:
      "Before advising anyone on AI, Ujjwal built the hardware it runs on, leading engineering on the chip floors of Intel and Micron.",
    details: [
      { label: "Where", value: "Chip floors at Intel and Micron" },
      { label: "The lesson", value: "Technology only matters when it ships" },
      { label: "What you get", value: "Advice that survives contact with production" },
    ],
  },
  {
    id: "strategy",
    backgroundWord: "STRATEGY",
    wordPosition: { top: -17, left: 170 },
    category: "Strategy",
    chapter: "The business",
    headline: ["THEN HE", "MADE AI PAY"],
    description:
      "In 2021 he founded ScaleBuild AI to build AI that drives revenue, not demos. He now shapes growth as Head of Strategy at Two Hands.",
    details: [
      { label: "Where", value: "ScaleBuild AI and Two Hands Corporation" },
      { label: "The lesson", value: "Strategy and engineering belong in the same room" },
      { label: "What you get", value: "AI that moves your numbers, built end to end" },
    ],
  },
  {
    id: "state",
    backgroundWord: "STATE",
    wordPosition: { top: -79, left: 692 },
    category: "State",
    chapter: "The mission",
    headline: ["NOW HE SHAPES", "THE RULES"],
    description:
      "He helped shape Nepal’s first National AI Policy and now leads the World AI Alliance, working for AI that is fair and accountable everywhere.",
    details: [
      { label: "Where", value: "Government of Nepal and the World AI Alliance" },
      { label: "The lesson", value: "The rules written now decide who AI serves" },
      { label: "What you get", value: "Policy grounded in how AI is actually built" },
    ],
  },
];

export type Product = {
  id: string;
  year: string;
  summary: string;
  categories: string[];
  image: string;
  /** the product's own site; the whole card links there */
  href: string;
};

export const products: Product[] = [
  {
    id: "marketing-autopilot",
    year: "2026",
    summary: "Run your marketing on autopilot",
    categories: ["Meta", "google"],
    image: "/images/product-marketing-bg.webp",
    href: "https://hyperscalerai.co/",
  },
  {
    id: "quantum-computing",
    year: "2026",
    summary: "Quantum Computing Infrastructure",
    categories: ["Quantum physics", "Infrastructure", "simulation"],
    image: "/images/product-quantum-bg.webp",
    href: "https://thequantumx.com/",
  },
];

/**
 * Highlights reel, row by row as the 3×3 grid (Figma: Video component, 652:1014). Stills of
 * the talks for now; each will become a video. The middle one is the featured reel: it opens
 * full screen and shrinks into the centre of the grid.
 */
export const highlightTiles = [
  { src: "/images/highlights/h1.webp", alt: "Ujjwal Roy speaking in a studio interview" },
  { src: "/images/highlights/h2.webp", alt: "Ujjwal Roy on a television news panel" },
  { src: "/images/highlights/h3.webp", alt: "Ujjwal Roy recording a podcast" },
  { src: "/images/highlights/h4.webp", alt: "Ujjwal Roy seated for a long-form interview" },
  { src: "/images/highlights/h5-featured.webp", alt: "Ujjwal Roy giving a keynote at Mindful March" },
  { src: "/images/highlights/h6.webp", alt: "Ujjwal Roy answering questions on a podcast" },
  { src: "/images/highlights/h7.webp", alt: "Ujjwal Roy in a television studio interview" },
  { src: "/images/highlights/h8.webp", alt: "Ujjwal Roy interviewed on a talk show" },
  { src: "/images/highlights/h9.webp", alt: "Ujjwal Roy in a roundtable discussion" },
] as const;

export const marqueeItems = [
  { title: "Launched Products", font: "font-sans" },
  { title: "Launched Products", font: "font-sans" },
] as const;

export type Award = { title: string; description: string; year: string };

export const awards: Award[] = [
  { title: "Youngest Scientist Award, Nepal", description: "An early invention in electronics", year: "2024" },
  { title: "AI Innovator of the Year", description: "Building AI systems that grew revenue", year: "2024" },
  {
    title: "Global Leadership in Ethical AI",
    description: "Founding the World AI Alliance to promote AI",
    year: "2026",
  },
];

export type Article = {
  title: string;
  date: string;
  readingTime: string;
  summary?: string;
  href: string;
  image: string;
  /**
   * Media frame (Figma: 426–428 wide, so kept as a ratio) and, where Figma crops the image off
   * centre, the image's box inside it in the same pixels. Without a crop the image covers the
   * frame, centred, which is Figma's "Fill".
   */
  media: { width: number; height: number; crop?: { top: number; left: number; width: number; height: number } };
  folded?: boolean;
};

export const articles: Article[] = [
  {
    title: "Identifying AI vs. Non-AI Products: How to Spot AI-Washing",
    date: "Jul 7, 2025",
    readingTime: "4 min. read",
    href: "#",
    image: "/images/article-ai-washing.webp",
    media: { width: 428, height: 350 },
    folded: true,
  },
  {
    title: "Importance of AI in Business: Competitive Advantage",
    date: "Jul 7, 2025",
    readingTime: "4 min. read",
    summary:
      "Companies that put AI to work now will set the pace for their industry. The ones that wait will spend years catching up.",
    href: "#",
    image: "/images/article-business.webp",
    media: { width: 426, height: 263, crop: { top: -43, left: -7, width: 433, height: 350 } },
  },
  {
    title: "Nepal’s Data Is Not Safe: The Case for Cyber Laws and AI Investment",
    date: "Jul 7, 2025",
    readingTime: "4 min. read",
    href: "#",
    image: "/images/article-nepal.webp",
    media: { width: 428, height: 350 },
  },
];

export const footer = {
  tagline: [
    "AI strategist, founder and policy advisor.",
    "From silicon to strategy to the state.",
    "Let's find your next move.",
  ],
  columns: [
    {
      heading: "Work with Ujjwal",
      links: [
        { label: "AI Growth Advisory", href: "#services" },
        { label: "Policy & Government Advisory", href: "#services" },
        { label: "Keynotes & Speaking", href: "#services" },
        { label: "Backing Founders", href: "#services" },
      ],
    },
    {
      heading: "Explore",
      links: [
        { label: "About Ujjwal", href: "#about" },
        { label: "Journey", href: "#journey" },
        { label: "Launched Products", href: "#products" },
        { label: "Highlights", href: "#highlights" },
      ],
    },
    {
      heading: "Insights",
      links: [
        { label: "Articles", href: "#articles" },
        { label: "Podcasts & Interviews", href: "#highlights" },
        { label: "Launches", href: "#products" },
        { label: "World AI Alliance", href: "#" },
      ],
    },
  ],
  socials: footerSocials,
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/privacy#cookies" },
  ],
};
