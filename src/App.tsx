import { FeatureIcon, type IconName } from './components/FeatureIcon'
import { FlowDiagram } from './components/FlowDiagram'
import { HeroCta } from './components/HeroCta'
import { MenuBarStage } from './components/MenuBarStage'
import { Nav } from './components/Nav'
import { usePlatform } from './hooks/usePlatform'
import { useReveal } from './hooks/useReveal'
import { WINDOWS_BUY_URL } from './links'

const features: Array<{ title: string; body: string; icon: IconName }> = [
  {
    title: 'Claims srt://',
    icon: 'link',
    body: 'Register as the handler for SRT links on macOS. Click a link in mail, chat, or a runbook — the helper takes it from there.',
  },
  {
    title: 'Launches your VLC',
    icon: 'play',
    body: 'Hands the URL to the VLC you already trust. Does not embed libvlc. Playback stays in VLC’s hands.',
  },
  {
    title: 'Recent streams',
    icon: 'clock',
    body: 'Re-open the last few destinations from the menu bar without digging through history elsewhere.',
  },
  {
    title: 'Reuse one VLC',
    icon: 'layers',
    body: 'Optional --one-instance behavior so a new srt:// opens in the running player instead of spawning another copy.',
  },
  {
    title: 'Latency control',
    icon: 'gauge',
    body: 'Set a default SRT latency in milliseconds for lab and contribution paths that need a known buffer.',
  },
  {
    title: 'Launch at login',
    icon: 'power',
    body: 'Keep the helper ready on macOS via a Login Item — so the scheme is claimed when you need it.',
  },
]

export default function App() {
  useReveal()
  const platform = usePlatform()

  return (
    <>
      <div id="top" />
      <Nav />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div>
            <div className="hero__brand">
              <img
                className="hero__icon"
                src="/app-icon.png"
                width={72}
                height={72}
                alt="SRT loves VLC"
              />
            </div>
            <p className="eyebrow">macOS and Windows helper</p>
            <h1 id="hero-title">
              SRT links deserve a{' '}
              <span className="accent">straight path</span> into VLC
            </h1>
            <p className="hero__lede">
              SRT ❤️ VLC sits in your menu bar or tray, claims the{' '}
              <code className="inline-code">srt://</code> scheme, and launches
              the VLC you already use. No embedded player.
            </p>
            <ul className="hero__chips" aria-label="Highlights">
              <li>srt:// handler</li>
              <li>Your VLC</li>
              <li>Recent streams</li>
              <li>--one-instance</li>
              <li>Latency</li>
              <li>Login Item</li>
            </ul>
            <HeroCta platform={platform} />
          </div>
          <MenuBarStage />
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
                <span className="feature-card__icon">
                  <FeatureIcon name={f.icon} />
                </span>
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
              Mac and Windows.
            </h2>
            <p className="lede">
              macOS is headed to the Mac App Store. Windows is available now as
              a direct sale — same bridge idea: claim{' '}
              <code className="inline-code">srt://</code>, hand off to the VLC
              you already use.
            </p>
          </div>
          <div className="platform-cards" id="pricing">
            <div className="platform-card platform-card--live">
              <div className="platform-card__os">macOS</div>
              <div className="platform-card__price">Price TBA · Mac App Store</div>
              <div className="platform-card__status">Menu bar · Coming to Mac App Store</div>
              <p>Scheme handler, Login Item, recent streams, latency, reuse VLC.</p>
            </div>
            <div className="platform-card platform-card--live">
              <div className="platform-card__os">Windows</div>
              <div className="platform-card__price">$1.99 · one-time purchase</div>
              <div className="platform-card__status">Tray · Available now</div>
              <p>
                Claims <code className="inline-code">srt://</code> and launches
                your installed VLC. Requires .NET 8 Desktop Runtime and VLC.
                After checkout you land on a private download page for the
                installer.
              </p>
              <div className="platform-card__actions">
                <a
                  className="btn btn--primary"
                  href={WINDOWS_BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy for Windows · $1.99
                </a>
                <a className="btn btn--ghost" href="/eula.html">
                  EULA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            SRT <span className="heart">❤️</span> VLC
          </div>
          <p className="footer__note">
            Not affiliated with VideoLAN or the VLC project. VLC is a trademark
            of the VideoLAN non-profit. Requires a separate VLC install.
          </p>
          <p className="footer__links">
            <a href="/privacy.html">Privacy</a>
            <span aria-hidden="true">·</span>
            <a href="/eula.html">EULA</a>
          </p>
          <p className="footer__copy">© {new Date().getFullYear()} SRT ❤️ VLC</p>
        </div>
      </footer>
    </>
  )
}
