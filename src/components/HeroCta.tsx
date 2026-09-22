import { MAC_BUY_URL, PRICE, WINDOWS_BUY_URL } from '../links'
import type { Platform } from '../hooks/usePlatform'

function Buy({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <a
      className={primary ? 'btn btn--primary' : 'btn btn--ghost'}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  )
}

export function HeroCta({ platform }: { platform: Platform }) {
  const macOnSale = MAC_BUY_URL !== ''

  if (platform === 'mac') {
    return (
      <div className="hero__cta">
        {macOnSale ? (
          <Buy href={MAC_BUY_URL} label={`Buy for Mac · ${PRICE}`} primary />
        ) : (
          <span className="pill pill--soon">Coming to the Mac App Store</span>
        )}
        <Buy href={WINDOWS_BUY_URL} label={`Get it for Windows · ${PRICE}`} />
      </div>
    )
  }

  return (
    <div className="hero__cta">
      <Buy href={WINDOWS_BUY_URL} label={`Buy for Windows · ${PRICE}`} primary />
      {macOnSale ? (
        <Buy href={MAC_BUY_URL} label={`Get it for Mac · ${PRICE}`} />
      ) : (
        <a className="btn btn--ghost" href="#platforms">
          macOS coming soon
        </a>
      )}
    </div>
  )
}
