import { SITE_TITLE, SITE_URL, absolute, formerEmployers, person, profileLinks, ventures } from "@/data/site";

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Schema.org data that tells Google (and AI answer engines) who Ujjwal is: one Person, linked to
 * the ventures he founded or leads and the companies he worked at, plus the WebSite and the
 * ProfilePage that is about him. Facts mirror the page copy; change them in src/data/site.ts.
 */
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: person.name,
      givenName: person.firstName,
      familyName: person.lastName,
      url: SITE_URL,
      image: absolute(person.portrait),
      jobTitle: person.jobTitle,
      description: person.description,
      knowsAbout: person.knowsAbout,
      sameAs: profileLinks,
      founder: [
        { "@type": "Organization", name: ventures.scaleBuild.name },
        { "@type": "Organization", name: ventures.hyperscaler.name, url: ventures.hyperscaler.url },
      ],
      worksFor: [
        { "@type": "Organization", name: ventures.scaleBuild.name },
        { "@type": "Organization", name: ventures.worldAiAlliance.name },
      ],
      memberOf: {
        "@type": "OrganizationRole",
        roleName: "Founding President",
        memberOf: { "@type": "Organization", name: ventures.worldAiAlliance.name },
      },
      alumniOf: formerEmployers.map((name) => ({ "@type": "Organization", name })),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: person.name,
      description: person.description,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: SITE_TITLE,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": PERSON_ID },
      about: { "@id": PERSON_ID },
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // escape "<" so nothing in the data can close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
