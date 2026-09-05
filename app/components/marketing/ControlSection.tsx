import { Link } from "react-router";
import { RouteStop, SectionIntro } from "./Primitives";
import { Reveal } from "./Reveal";

const controls = [
  ["Designated channel", "Calls happen in the one text channel you choose."],
  ["Route protocol", "1:1 text only. No voice, ever."],
  ["Moderation shield", "NSFW filter and word guard on every connection."],
  ["Data retention", "Purge on disconnect."],
] as const;

export function ControlSection() {
  return (
    <section className="atlas-section atlas-section--control" id="control" aria-labelledby="control-title">
      <RouteStop step="03" title="Your controls" />
      <div className="atlas-contours" aria-hidden="true" />
      <div className="atlas-container control-layout">
        <Reveal className="control-layout__copy">
          <SectionIntro question="Do we lose control of our server?" title="Your community keeps the keys." titleId="control-title" inverse>
            Control plane policies govern every connection. Configure designated text channels, assign federated Hub rules, enforce automated safety shields, and audit security events in real time from your browser.
          </SectionIntro>
          <div className="control-actions">
            <Link className="atlas-button atlas-button--paper" to="/dashboard">
              Explore Control Plane <span aria-hidden="true">↗</span>
            </Link>
            <span className="control-subtext">Live Web Dashboard · Discord OAuth2</span>
          </div>
        </Reveal>

        <Reveal className="control-index" delay={100}>
          <dl>
            {controls.map(([term, description]) => (
              <div className="control-index__row" key={term}>
                <dt>{term}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
