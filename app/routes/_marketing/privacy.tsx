import type { Route } from "./+types/privacy";
import { MarketingHeader } from "../../components/MarketingHeader";
import { MarketingFooter } from "../../components/marketing";
import { SUPPORT_SERVER_URL } from "../../components/marketing/constants";
import "../../styles/marketing.css";

const EFFECTIVE_DATE = "24 August 2026";

const contents = [
  ["overview", "Overview"],
  ["data", "Data we collect"],
  ["uses", "How we use it"],
  ["retention", "Retention"],
  ["sharing", "Who receives it"],
  ["rights", "Your rights"],
  ["security", "Security & contact"],
] as const;

export function meta({}: Route.MetaArgs) {
  const title = "Privacy Policy — InterChat";
  const description = "How InterChat collects, uses, shares, and retains personal data.";
  return [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: "#19172B" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
  ];
}

function PolicySection({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="privacy-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="privacy-section__number" aria-hidden="true">{number}</div>
      <div className="privacy-section__body">
        <h2 id={`${id}-title`}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="marketing-page privacy-page">
      <MarketingHeader />
      <main>
        <header className="privacy-hero" id="top">
          <div className="atlas-container privacy-hero__grid">
            <div>
              <p className="atlas-eyebrow">Privacy, mapped clearly</p>
              <h1>Your data should not be a mystery.</h1>
              <p className="privacy-hero__lede">
                This policy explains what InterChat stores when Discord communities connect through Hubs, Calls, and the dashboard—and what choices you have.
              </p>
            </div>
            <div className="privacy-map" aria-hidden="true">
              <span className="privacy-map__node privacy-map__node--you">You</span>
              <span className="privacy-map__line privacy-map__line--one" />
              <span className="privacy-map__node privacy-map__node--interchat">InterChat</span>
              <span className="privacy-map__line privacy-map__line--two" />
              <span className="privacy-map__node privacy-map__node--cloud">OVHcloud</span>
              <span className="privacy-map__note">Only the route needed to run the service.</span>
            </div>
          </div>
        </header>

        <div className="privacy-meta">
          <div className="atlas-container privacy-meta__inner">
            <span>Effective {EFFECTIVE_DATE}</span>
            <span>Controller: InterChat</span>
            <a href={SUPPORT_SERVER_URL}>Privacy contact ↗</a>
          </div>
        </div>

        <div className="atlas-container privacy-layout">
          <aside className="privacy-toc">
            <p>On this page</p>
            <nav aria-label="Privacy policy contents">
              {contents.map(([id, label], index) => (
                <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>
              ))}
            </nav>
          </aside>

          <article className="privacy-document">
            <div className="privacy-summary">
              <strong>The short version</strong>
              <p>We use data to relay messages, match Calls, operate community controls, prevent abuse, and maintain the service. We do not sell personal data or use it for third-party advertising.</p>
            </div>

            <PolicySection id="overview" number="01" title="Who this policy covers">
              <p>
                InterChat is the controller for personal data processed by the InterChat Discord bot, website, and dashboard. This policy covers people who use InterChat, people whose messages pass through an InterChat Hub or Call, and server administrators who configure it.
              </p>
              <p>
                Discord separately controls the data it processes on its platform. A server or Hub owner may also make independent choices about content in their Discord community.
              </p>
            </PolicySection>

            <PolicySection id="data" number="02" title="Data we collect">
              <div className="privacy-data-grid">
                <div><span>Identity</span><h3>Discord account data</h3><p>Discord user ID, display name, avatar URL, locale, badges, preferences, and—if Discord provides it—email and verification status.</p></div>
                <div><span>Communities</span><h3>Server and Hub data</h3><p>Server, channel, role, webhook, invite, and Hub identifiers; names, icons, rules, settings, membership, permissions, blocklists, and configuration history.</p></div>
                <div><span>Content</span><h3>Messages and feedback</h3><p>Hub and live Call message content, attachment URLs, replies, reactions, reports, report context, reviews, feedback answers, and moderation reasons.</p></div>
                <div><span>Activity</span><h3>Usage and reputation</h3><p>Message and Call counts, votes, streaks, achievements, activity timestamps, Hub activity, reputation, safety signals, and feature events tied to user, server, or Hub IDs.</p></div>
                <div><span>Billing</span><h3>Premium records</h3><p>Payment-provider customer, event, and subscription identifiers; plan, status, dates, premium keys, and gift records. InterChat does not store full payment-card numbers.</p></div>
                <div><span>Access</span><h3>Login and security</h3><p>Encrypted Discord OAuth access and refresh tokens, granted scopes, session cookies, login state, and, where server-side sessions are used, IP address and browser user-agent.</p></div>
                <div><span>Operations</span><h3>Technical records</h3><p>Delivery identifiers, error and diagnostic logs, service events, cache entries, and timestamps needed to relay, troubleshoot, secure, and audit InterChat.</p></div>
              </div>
              <p className="privacy-note">Message content may reveal sensitive facts if you choose to include them. Please avoid sharing sensitive personal data through public Hubs or Calls.</p>
            </PolicySection>

            <PolicySection id="uses" number="03" title="Why we process data">
              <div className="privacy-table-wrap">
                <table>
                  <thead><tr><th>Purpose</th><th>Typical data</th><th>GDPR legal basis</th></tr></thead>
                  <tbody>
                    <tr><td>Provide Hubs, Calls, accounts, and the dashboard</td><td>Identity, content, community configuration, delivery records</td><td>Performance of our service contract</td></tr>
                    <tr><td>Moderate content, prevent abuse, and protect communities</td><td>Messages, reports, safety signals, blocklists, audit history</td><td>Legitimate interests in safety, security, and enforcing rules</td></tr>
                    <tr><td>Maintain, debug, and improve InterChat</td><td>Diagnostics, feature events, counts, and service performance</td><td>Legitimate interests in operating a reliable service</td></tr>
                    <tr><td>Remember optional preferences and send optional reminders</td><td>Preferences, locale, vote and streak activity</td><td>Contract or consent, depending on the feature</td></tr>
                    <tr><td>Meet legal duties and respond to valid requests</td><td>Relevant account, audit, or safety records</td><td>Legal obligation or legitimate interests in legal claims</td></tr>
                  </tbody>
                </table>
              </div>
              <h3>Automated safety tools</h3>
              <p>
                InterChat uses automated rules, a deterministic safety score, content matching, and image classification to detect spam, abuse, and potentially unsafe images. These signals may delay or block delivery or flag content for moderators. You may ask for human review through our support server. We do not use this data for advertising or credit, employment, or similar eligibility decisions.
              </p>
            </PolicySection>

            <PolicySection id="retention" number="04" title="How long we keep data">
              <p>We use fixed limits where the system supports them and purpose-based limits elsewhere. Deletion from live systems may take additional time to propagate through encrypted backups.</p>
              <div className="privacy-retention-list">
                <div><strong>10 minutes</strong><span>Temporary Discord login state used to prevent forged sign-ins.</span></div>
                <div><strong>24 hours</strong><span>Live Call message content, delivery mappings, and closed-Call cache state.</span></div>
                <div><strong>48 hours</strong><span>Hub message delivery caches used for edits, replies, reactions, and moderation.</span></div>
                <div><strong>8 days</strong><span>Hourly Hub discovery activity buckets; rolling unique-user buckets are cleaned with them.</span></div>
                <div><strong>Browser session</strong><span>The dashboard session cookie lasts until the browser session ends or you sign out. Discord OAuth tokens remain encrypted until you disconnect, delete your account, or the credentials are revoked.</span></div>
                <div><strong>Service or resource lifetime</strong><span>Profiles, preferences, Hub and server settings, Call history metadata, durable Hub message records, billing references, reports, feedback, moderation and audit history, achievements, and aggregate statistics are kept while needed to run the service, protect communities, resolve disputes, or meet legal and accounting duties. We delete or de-identify them when the related account/resource is deleted or a valid erasure request applies. Some safety, billing, and audit records may remain where necessary to prevent repeat abuse, keep legally required records, or establish legal claims.</span></div>
              </div>
              <p className="privacy-note">Discord copies relayed into participating channels remain subject to Discord and each server’s own retention and moderation choices. Removing our copy does not automatically remove every Discord copy.</p>
            </PolicySection>

            <PolicySection id="sharing" number="05" title="Who receives data">
              <ul>
                <li><strong>Discord</strong> receives relayed content and identifiers needed to operate the bot and sign you in.</li>
                <li><strong>OVHcloud</strong> hosts InterChat infrastructure and acts as our processor under a Data Processing Agreement.</li>
                <li><strong>InterChat service components</strong> process only what their job requires: Prism delivers messages, Iris checks permissions, and Polarizer scores images for safety.</li>
                <li><strong>Top.gg</strong> receives or sends Discord identifiers and vote events when you use voting features.</li>
                <li><strong>Stripe</strong> processes payments and provides us with customer, event, and subscription references; InterChat does not receive full card details.</li>
                <li><strong>Google Fonts</strong> may receive technical request data, such as your IP address, when your browser loads site fonts.</li>
                <li><strong>Authorities or advisers</strong> receive data only when required by law or reasonably necessary to protect rights, safety, and the service.</li>
              </ul>
              <p>
                We do not sell personal data. Discord, Stripe, Top.gg, and Google may process data outside the EEA under their own terms and transfer safeguards. OVHcloud processes hosted data under our instructions and DPA. See the <a href="https://www.ovhcloud.com/en-ie/personal-data-protection/faq/">OVHcloud GDPR information</a>, <a href="https://discord.com/privacy">Discord Privacy Policy</a>, <a href="https://stripe.com/privacy">Stripe Privacy Policy</a>, <a href="https://top.gg/privacy">Top.gg Privacy Policy</a>, and <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.
              </p>
            </PolicySection>

            <PolicySection id="rights" number="06" title="Your choices and rights">
              <p>Depending on where you live and the circumstances, you may ask us to:</p>
              <ul className="privacy-rights">
                <li>give you access to and a copy of your personal data;</li>
                <li>correct inaccurate or incomplete data;</li>
                <li>delete data or restrict how we use it;</li>
                <li>provide portable data you gave us;</li>
                <li>object to processing based on legitimate interests;</li>
                <li>withdraw consent without affecting earlier lawful processing; or</li>
                <li>arrange human review of a significant automated decision.</li>
              </ul>
              <p>
                Send a request through the <a href={SUPPORT_SERVER_URL}>InterChat support server</a>. We may ask you to verify control of your Discord account. We normally respond within one month. You may also complain to the data protection authority where you live or work, or where you believe an infringement occurred.
              </p>
            </PolicySection>

            <PolicySection id="security" number="07" title="Security, changes, and contact">
              <p>
                We use access controls, least-privilege service boundaries, encrypted connections, encrypted OAuth tokens, short-lived operational caches, logging, and backups to protect data. No online service can guarantee absolute security.
              </p>
              <p>
                InterChat is the data controller. Contact us about privacy, security, or this policy through the <a href={SUPPORT_SERVER_URL}>InterChat support server</a>. We will post material policy changes here and update the effective date. If a change materially affects how we use your data, we will provide additional notice where practical.
              </p>
            </PolicySection>
          </article>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
