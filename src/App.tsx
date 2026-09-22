import { FlowDiagram } from './components/FlowDiagram'
import { MenuPreview } from './components/MenuPreview'
import { Nav } from './components/Nav'
import { useReveal } from './hooks/useReveal'

const features = [
  {
    title: 'Claims srt://',
    body: 'Register as the handler for SRT links on macOS. Click a link in mail, chat, or a runbook — the helper takes it from there.',
  },
  {
    title: 'Launches your VLC',
    body: 'Hands the URL to the VLC you already trust. Does not embed libvlc. Playback stays in VLC’s hands.',
  },
  {
    title: 'Recent streams',
    body: 'Re-open the last few destinations from the menu bar without digging through history elsewhere.',
  },
  {
    title: 'Reuse one VLC',
    body: 'Optional --one-instance behavior so a new srt:// opens in the running player instead of spawning another copy.',
  },
  {
    title: 'Latency control',
    body: 'Set a default SRT latency in milliseconds for lab and contribution paths that need a known buffer.',
  },
  {
    title: 'Launch at login',
    body: 'Keep the helper ready on macOS via a Login Item — so the scheme is claimed when you need it.',
  },
]

export default function App() {
  useReveal()

  return (
    <>
      <div id="top" />
      <Nav />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">macOS menu-bar helper</p>
            <h1 id="hero-title">
              SRT links deserve a{' '}
              <span className="accent">straight path</span> into VLC
            </h1>
            <p className="hero__lede">
              SRT ❤ VLC sits in the menu bar, claims the{' '}
              <code className="inline-code">srt://</code> scheme, and launches
              the VLC you already use. No embedded player. No fake download
              button here — it&apos;s coming to the Mac App Store.
            </p>
            <ul className="hero__chips" aria-label="Highlights">
              <li>srt:// handler</li>
              <li>Your VLC</li>
              <li>Recent streams</li>
              <li>--one-instance</li>
              <li>Latency</li>
              <li>Login Item</li>
            </ul>
            <p className="hero__store">
              <span className="badge">Coming soon</span>
              Mac App Store · proprietary
            </p>
          </div>
          <MenuPreview />
        </div>
      </section>

      <section id="how" className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="section__head reveal">
            <p className="eyebrow">How it works</p>
            <h2 id="how-title" className="h2">
              Scheme in. Player out.
            </h2>
            <p className="lede">
              The helper is a thin bridge — not a media stack. It owns the URL
              scheme, remembers recent destinations, and asks VLC to play.
            </p>
          </div>
          <FlowDiagram />
        </div>
      </section>

      <section id="features" className="section band" aria-labelledby="features-title">
        <div className="container">
          <div className="section__head reveal">
            <p className="eyebrow">Features</p>
            <h2 id="features-title" className="h2">
              Small surface. Operator-friendly.
            </h2>
            <p className="lede">
              Built for people who already live in SRT and VLC — contribution
              labs, remote production, and anyone tired of copy-paste into Open
              Network Stream.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <article key={f.title} className="feature-card reveal">
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platforms" className="section" aria-labelledby="platforms-title">
        <div className="container platforms reveal">
          <div>
            <p className="eyebrow">Platforms</p>
            <h2 id="platforms-title" className="h2">
              Mac first. Windows next.
            </h2>
            <p className="lede">
              Today: a macOS menu-bar app, headed to the Mac App Store. A
              Windows tray companion that claims{' '}
              <code className="inline-code">srt://</code> the same way is on
              the roadmap — same idea, same handoff to VLC.
            </p>
          </div>
          <div className="platform-cards">
            <div className="platform-card platform-card--live">
              <div className="platform-card__os">macOS</div>
              <div className="platform-card__status">Menu bar · Coming to Mac App Store</div>
              <p>Scheme handler, Login Item, recent streams, latency, reuse VLC.</p>
            </div>
            <div className="platform-card">
              <div className="platform-card__os">Windows</div>
              <div className="platform-card__status">Tray · Coming</div>
              <p>Same bridge pattern: claim srt://, launch the user’s VLC.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section band cta-lite" aria-labelledby="store-title">
        <div className="container reveal">
          <h2 id="store-title" className="h2">
            Mac App Store — soon
          </h2>
          <p className="lede">
            Distribution is proprietary via the Mac App Store. This site is
            informational only: no placeholder downloads, no fake “Get the app”
            links. When the listing is live, it will land here.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            SRT <span className="heart">❤</span> VLC
          </div>
          <p className="footer__note">
            Not affiliated with VideoLAN or the VLC project. VLC is a trademark
            of the VideoLAN non-profit. Requires a separate VLC install.
          </p>
          <p className="footer__copy">© {new Date().getFullYear()} SRT ❤ VLC</p>
        </div>
      </footer>
    </>
  )
}
