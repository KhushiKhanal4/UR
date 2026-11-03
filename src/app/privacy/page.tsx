import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BOOKING_HREF } from "@/data/content";
import { SITE_URL, legal } from "@/data/site";

const description = `How ${legal.owner} collects, uses and protects personal information on ujjwalroy.com and when you book a call.`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy", description, url: "/privacy" },
};

const mail = <a href={`mailto:${legal.email}`}>{legal.email}</a>;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This site collects very little: no analytics, no advertising trackers and no cookies of its own. This policy explains what is collected, mainly when you book a call, and what you can ask us to do with it."
    >
      <h2>Who we are</h2>
      <p>
        This website, <a href={SITE_URL}>ujjwalroy.com</a> (the “Site”), is operated by {legal.owner} (“we”, “us”). For any
        question about this policy or your personal information, email {mail}.
      </p>

      <h2>Information we collect</h2>
      <h3>When you book a call</h3>
      <p>
        Calls are booked through Calendly, either in the booking window on this Site or on Calendly’s own page. When you
        book, you give us your <strong>name, email address</strong>, the time you pick, and anything you choose to add in
        the booking form (for example, what you would like to discuss).
      </p>
      <h3>When you contact us</h3>
      <p>If you email us, we receive your email address and whatever you include in your message.</p>
      <h3>Automatically, when you visit</h3>
      <p>
        Like any website, the servers that host the Site keep standard technical logs: your IP address, browser and device
        type, the pages requested and the time of each request. These are used only to run, secure and fix the Site. We do
        not use analytics tools, advertising pixels or tracking scripts, and the Site’s fonts and videos are served from
        the Site itself, not from third-party networks.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To schedule, prepare for, hold and follow up on the calls you book</li>
        <li>To reply to your messages</li>
        <li>To keep the Site secure and working</li>
        <li>To meet legal obligations</li>
      </ul>
      <p>
        We do <strong>not</strong> sell your personal information, share it for advertising, or use it for automated
        decision-making.
      </p>

      <h2>Who we share it with</h2>
      <p>Only with the services needed to do the things above, and only as much as they need:</p>
      <ul>
        <li>
          <strong>Calendly</strong>, which processes bookings under its own{" "}
          <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer">
            privacy notice
          </a>
        </li>
        <li>The video-conferencing provider named in your booking confirmation, for the call itself</li>
        <li>Our email and website-hosting providers</li>
        <li>Authorities or other parties, when the law requires it or to protect our rights or someone’s safety</li>
      </ul>

      <h2 id="cookies">Cookies</h2>
      <p>
        The Site itself sets <strong>no cookies</strong>. When you open the booking window, the embedded Calendly page may
        set its own cookies, which are needed for booking to work and to remember your preferences such as your time zone.
        These are governed by Calendly’s{" "}
        <a href="https://calendly.com/legal/cookie-notice" target="_blank" rel="noopener noreferrer">
          cookie notice
        </a>
        . You can block or delete cookies in your browser settings; if you block Calendly’s, booking may not work, and you
        can email us instead.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep booking and contact details for as long as we need them to work with you and for our records, then delete
        them. Hosting logs are kept for a short period set by the hosting provider. You can ask us to delete your
        information sooner (see below).
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask us to tell you what personal information we hold about you, correct it, delete it, or stop using it.
        Depending on where you live, you may have further rights:
      </p>
      <ul>
        <li>
          <strong>California and other US states with privacy laws:</strong> the right to know, access, correct and delete
          your personal information, and the right not to be discriminated against for using these rights. We do not sell
          or “share” personal information as those laws define it.
        </li>
        <li>
          <strong>European Economic Area, UK and Switzerland:</strong> the rights of access, rectification, erasure,
          restriction, objection and portability, and the right to complain to your local data protection authority. We
          rely on your request (to book a call) and our legitimate interest in running the Site as the legal bases for
          using your information.
        </li>
      </ul>
      <p>To make a request, email {mail}. We will respond within the time the applicable law allows.</p>

      <h2>Where it is processed</h2>
      <p>
        We and our service providers are based in, or process data in, the United States. If you visit from elsewhere, your
        information will be transferred there, with the protections the providers apply under their own terms.
      </p>

      <h2>Security</h2>
      <p>
        The Site is served only over HTTPS, and we use reputable providers to handle bookings and email. No method of
        transmission or storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>Children</h2>
      <p>
        The Site is meant for professionals and is not directed to children under 13 (or 16 in the EEA and UK). We do not
        knowingly collect their information; if you believe a child has given us personal information, email us and we
        will delete it.
      </p>

      <h2>Links to other sites</h2>
      <p>
        The Site links to other websites, such as LinkedIn, Instagram, Facebook and the ventures mentioned on it. Their
        privacy practices are their own.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we will update it on this page and change the “Last updated” date above. Significant
        changes will be made clear on the Site.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests: {mail}. To book a call instead, use the{" "}
        <a href={BOOKING_HREF}>booking calendar</a>.
      </p>
    </LegalPage>
  );
}
