import { Link } from "react-router";
import { SectionIntro } from "./Primitives";
import { Reveal } from "./Reveal";

const serverRouteSpecs = [
  ["Designated Channel", "# call-corner"],
  ["Route Protocol", "1:1 Text Only (No Voice)"],
  ["Moderation Shield", "NSFW Filter + Word Guard"],
  ["Data Retention", "Purge on Disconnect"],
] as const;

const hubPolicySpecs = [
  ["Federated Peer", "Hobby Corner (8 Servers)"],
  ["Trust Tier", "Verified Community"],
  ["Cross-Server Pings", "Blocked (@everyone)"],
  ["Audit Stream", "14 Events Recorded Today"],
] as const;

export function ControlSection() {
  return (
    <section className="atlas-section atlas-section--control" id="control" aria-labelledby="control-title">
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

        <Reveal className="control-legend" delay={100}>
          <div className="control-console-tabs" aria-label="Control plane modules">
            <span className="control-tab control-tab--active">
              <span className="control-tab__dot" aria-hidden="true" />
              Overview & Policies
            </span>
            <span className="control-tab">Routes</span>
            <span className="control-tab">Audit Stream</span>
          </div>
          <div className="control-legend__heading">
            <div>
              <span className="control-legend__badge">CONTROL PLANE // WEB CONSOLE</span>
              <strong>Garden Guild (Server #1042)</strong>
            </div>
            <span className="console-status-pill">
              <i className="status-dot status-dot--on" aria-hidden="true" /> Live Policy Engine
            </span>
          </div>
          <section className="control-panel" aria-labelledby="server-controls-title">
            <header>
              <span className="legend-key legend-key--sky" aria-hidden="true" />
              <h3 id="server-controls-title">Server Route Spec</h3>
              <small>ServerCallRoute</small>
            </header>
            {serverRouteSpecs.map(([label, value]) => (
              <div className="setting-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </section>
          <section className="control-panel" aria-labelledby="hub-controls-title">
            <header>
              <span className="legend-key legend-key--violet" aria-hidden="true" />
              <h3 id="hub-controls-title">Hub Federation Policy</h3>
              <small>HubPolicyAssignment</small>
            </header>
            {hubPolicySpecs.map(([label, value]) => (
              <div className="setting-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </section>
          <div className="control-legend__foot">
            <span><i className="status-dot status-dot--on" aria-hidden="true" /> Resource-Oriented</span>
            <span><i className="status-dot" aria-hidden="true" /> Zero Voice Overhead</span>
            <span><i className="status-dot status-dot--log" aria-hidden="true" /> Immutable Audit Trail</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
