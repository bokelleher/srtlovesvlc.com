export function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner container">
        <a className="nav__brand" href="#top" aria-label="SRT loves VLC home">
          <img
            className="nav__mark"
            src="/app-icon.png"
            width={28}
            height={28}
            alt="SRT loves VLC"
          />
          <span className="nav__name">
            SRT <span className="heart" aria-hidden="true">
              ❤
            </span>{' '}
            VLC
          </span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#platforms">Platforms</a>
        </nav>
      </div>
    </header>
  )
}
