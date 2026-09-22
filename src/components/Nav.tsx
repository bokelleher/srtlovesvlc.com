export function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner container">
        <a className="nav__brand" href="#top" aria-label="SRT loves VLC home">
          <BrandMark />
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

function BrandMark() {
  return (
    <svg
      className="nav__mark"
      width="28"
      height="28"
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" fill="#141820" />
      <path
        d="M32 48c-1.2 0-2.3-.5-3.1-1.4C22 39.2 14 32.8 14 25.6 14 20.2 18.2 16 23.4 16c2.8 0 5.4 1.3 7.1 3.4C32.2 17.3 34.8 16 37.6 16 42.8 16 47 20.2 47 25.6c0 7.2-8 13.6-14.9 20.9-.8.9-1.9 1.5-3.1 1.5z"
        fill="#ff4d6d"
      />
      <circle cx="22" cy="22" r="2.2" fill="#7cf0d0" />
      <path
        d="M26 22h8.5a6 6 0 0 1 6 6"
        stroke="#7cf0d0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="42.5" cy="28" r="2.2" fill="#7cf0d0" />
    </svg>
  )
}
