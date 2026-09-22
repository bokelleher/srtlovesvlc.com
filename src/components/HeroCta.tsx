import { WINDOWS_BUY_URL } from '../links'
import type { Platform } from '../hooks/usePlatform'

export function HeroCta({ platform }: { platform: Platform }) {
  const buy = (label: string, cls: string) => (
    <a className={cls} href={WINDOWS_BUY_URL} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  )
  if (platform === 'mac') {
    return (
      <div className="hero__cta">
        <span className="pill pill--soon">Coming to the Mac App Store</span>
        {buy('Get it for Windows · $1.99', 'btn btn--ghost')}
      </div>
    )
  }
  return (
    <div className="hero__cta">
      {buy('Buy for Windows · $1.99', 'btn btn--primary')}
      <a className="btn btn--ghost" href="#platforms">
        macOS coming soon
      </a>
    </div>
  )
}
