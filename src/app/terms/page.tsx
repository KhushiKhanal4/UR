import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { SITE_URL, legal } from "@/data/site";

const description = `The terms for using ujjwalroy.com and booking a call with ${legal.owner}.`;

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Use", description, url: "/terms" },
};

const mail = <a href={`mailto:${legal.email}`}>{legal.email}</a>;

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="The ground rules for using this site and booking a call. In short: the content is for information, a call is a conversation rather than a contract, and the site is provided as it is."
    >
      <h2>Agreement</h2>
      <p>
        These terms apply to your use of <a href={SITE_URL}>ujjwalroy.com</a> (the “Site”), operated by {legal.owner} (“we”,
        “us”). By using the Site you agree to them. If you do not agree, please do not use the Site. Our{" "}
        <a href="/privacy">Privacy Policy</a> explains how we handle personal information.
      </p>

      <h2>Information, not advice</h2>
      <p>
        Articles, talks, opinions and other content on the Site are for general information. They reflect {legal.owner}’s
        views and are not legal, financial, investment, tax or other professional advice for your situation. Do not act on
        them without advice from a qualified professional.
      </p>

      <h2>Booking a call</h2>
      <ul>
        <li>Calls are scheduled through Calendly, and Calendly’s own terms also apply to the booking.</li>
        <li>You can reschedule or cancel using the links in your confirmation email.</li>
        <li>We may decline, reschedule or cancel a booking, for example if a request falls outside what we offer.</li>
        <li>
          Booking or holding a call does not create an advisory, consulting, employment or other professional relationship.
          Any paid engagement is governed only by a separate written agreement.
        </li>
        <li>Please do not share confidential information on a first call unless we have agreed to confidentiality in writing.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The Site and its content, including text, photographs, video, graphics and design, belong to {legal.owner} or are
        used with permission. You may view and share links to the Site and quote short excerpts with credit. Do not copy,
        republish, sell or create works from the content without written permission.
      </p>
      <p>
        Company names and logos shown on the Site, such as Meta, Micron, IBM and Intel, are the trademarks of their owners.
        They show where {legal.owner} has worked or what he is building, and do not imply that those companies endorse the
        Site.
      </p>

      <h2>Acceptable use</h2>
      <p>When using the Site, do not:</p>
      <ul>
        <li>Break any law or anyone’s rights</li>
        <li>Try to gain unauthorised access to the Site or interfere with its operation or security</li>
        <li>Use bots or scrapers in a way that overloads the Site, or to collect other people’s personal information</li>
        <li>Make fake or abusive bookings, or impersonate anyone</li>
      </ul>

      <h2>Other websites and services</h2>
      <p>
        The Site links to and embeds services run by others, such as Calendly and social networks. We are not responsible
        for their content, terms or practices; using them is at your own risk and under their terms.
      </p>

      <h2>Disclaimer</h2>
      <p className="legal-caps">
        The Site and its content are provided “as is” and “as available”, without warranties of any kind, express or
        implied, including warranties of accuracy, merchantability, fitness for a particular purpose and non-infringement.
        We do not promise that the Site will always be available, error-free or secure.
      </p>

      <h2>Limitation of liability</h2>
      <p className="legal-caps">
        To the fullest extent the law allows, {legal.owner} will not be liable for any indirect, incidental, special,
        consequential or punitive damages, or any loss of profits, data or goodwill, arising from your use of the Site or its
        content. Our total liability for any claim relating to the Site is limited to one hundred US dollars (US$100).
      </p>
      <p>Some jurisdictions do not allow these limits, so some of them may not apply to you.</p>

      <h2>Indemnity</h2>
      <p>
        If you misuse the Site or break these terms, you agree to cover the reasonable costs, including legal fees, that we
        incur as a result.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of {legal.governingLaw}, without regard to conflict-of-law rules. Any dispute
        will be handled by the courts there, unless the law where you live gives you the right to bring it elsewhere.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The current version is always on this page, with its “Last updated” date. Continuing to
        use the Site after a change means you accept the new terms.
      </p>

      <h2>General</h2>
      <p>
        If any part of these terms is found unenforceable, the rest still applies. If we do not enforce a term straight away,
        we have not waived it. These terms are the whole agreement between you and us about the Site.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: {mail}.</p>
    </LegalPage>
  );
}
