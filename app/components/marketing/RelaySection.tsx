import { RouteStop, SectionIntro } from "./Primitives";
import { Reveal } from "./Reveal";

const stops = [
  { server: "Pixel Pier", initials: "PP", tone: "sky" as const },
  { server: "Garden Guild", initials: "GG", tone: "violet" as const },
  { server: "Night Café", initials: "NC", tone: "coral" as const },
];

export function RelaySection() {
  return (
    <section className="atlas-section atlas-section--paper relay-section" aria-labelledby="relay-title">
      <RouteStop step="01" title="Message relay" />
      <div className="atlas-container">
        <Reveal>
          <SectionIntro question="What does InterChat actually do?" title="One channel. A whole neighbourhood." titleId="relay-title">
            A message sent in one connected channel appears across every server in the Hub, while each
            community keeps its own home.
          </SectionIntro>
        </Reveal>

        <Reveal className="relay-dispatch" delay={100}>
          <figure className="relay-dispatch__message">
            <blockquote>“anyone up for a game night?”</blockquote>
            <figcaption>Mia · from Garden Guild</figcaption>
          </figure>
          <ol className="relay-dispatch__stops" aria-label="Where the message is delivered">
            {stops.map((stop) => (
              <li className="relay-dispatch__stop" key={stop.server}>
                <span className={`server-mark server-mark--${stop.tone}`} aria-hidden="true">{stop.initials}</span>
                <strong>{stop.server}</strong>
                <span className="relay-dispatch__meta"># global-lounge · delivered</span>
              </li>
            ))}
          </ol>
        </Reveal>
        <p className="atlas-margin-note">Same conversation. Three communities. Everyone stays home.</p>
      </div>
    </section>
  );
}
