import { InitialAvatar, MessageFragment, SectionIntro } from "./Primitives";
import { Reveal } from "./Reveal";

export function CallsSection() {
  return (
    <section className="atlas-section atlas-section--calls" id="calls" aria-labelledby="calls-title">
      <div className="atlas-container calls-layout">
        <Reveal className="calls-map">
          <div className="calls-map__server calls-map__server--local">
            <span className="server-mark server-mark--violet">GG</span>
            <div><strong>Garden Guild</strong><small># call-corner</small></div>
          </div>
          <div className="calls-map__track" aria-hidden="true">
            <span className="calls-map__signal">Text route · Connected</span>
            <span className="calls-map__route-note">1:1 Text Chat · No Voice Channels</span>
          </div>
          <div className="calls-map__server calls-map__server--remote">
            <span className="server-mark server-mark--sky">PP</span>
            <div><strong>Pixel Pier</strong><small># meet-someone</small></div>
          </div>

          <div className="call-card">
            <header>
              <div className="call-card__peers">
                <InitialAvatar initials="GG" tone="violet" />
                <InitialAvatar initials="PP" tone="sky" />
              </div>
              <div><strong>Text Call connected</strong><small>Garden Guild ↔ Pixel Pier · 1:1 Text</small></div>
              <span className="live-dot">Live</span>
            </header>
            <div className="call-card__messages">
              <MessageFragment initials="R" name="Rae" origin="Remote" tone="sky">hey! what are you all building?</MessageFragment>
              <MessageFragment initials="Y" name="You" tone="violet">a tiny co-op game. want a peek?</MessageFragment>
            </div>
            <div className="call-card__actions" aria-label="Available Call actions">
              <span>Skip</span><span>Send friend request</span><span className="danger">Hang up</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="calls-layout__copy" delay={100}>
          <SectionIntro question="How do Calls work?" title="A hello from somewhere unexpected." titleId="calls-title">
            Spontaneous 1:1 text chats across Discord communities. 100% text-based in your server’s designated channel — zero voice or camera overhead, with instant skip and moderation safety built into every connection.
          </SectionIntro>
          <div className="calls-feature-strip" aria-label="Text Call guarantees">
            <span className="calls-feature-pill">✦ 100% Text-Based</span>
            <span className="calls-feature-pill">✦ Isolated Channel</span>
            <span className="calls-feature-pill">✦ Instant Skip</span>
            <span className="calls-feature-pill">✦ Zero Audio Permissions</span>
          </div>
          <p className="calls-reassurance">
            Never joins a voice channel. Members chat only through the specific text channel you assign, protected by your server’s existing automod.
          </p>
          <p className="atlas-handnote">Temporary route. Real conversation.</p>
        </Reveal>
      </div>
    </section>
  );
}
