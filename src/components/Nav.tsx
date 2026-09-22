import { useEffect, useState } from 'react'

const links: Array<[href: string, label: string]> = [
  ['#how', 'How it works'],
  ['#features', 'Features'],
  ['#platforms', 'Platforms'],
  ['#pricing', 'Pricing'],
]

export function Nav() {
  const [open, setOpen] = useState(false)

  // Close the phone menu on Escape, and if the viewport grows past the phone breakpoint.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 641px)')
    const onMq = () => {
      if (mq.matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  return (
    <header className={open ? 'nav nav--open' : 'nav'}>
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
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__bar" />
          <span className="nav__bar" />
          <span className="nav__bar" />
        </button>
        <nav
          id="nav-links"
          className="nav__links"
          aria-label="Sections"
          onClick={() => setOpen(false)}
        >
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
