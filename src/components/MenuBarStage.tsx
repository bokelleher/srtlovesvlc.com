/** Stylised menu bar + popover. Original illustration, not a screenshot. */
export function MenuBarStage() {
  return (
    <div
      className="stage reveal"
      role="img"
      aria-label="Stylised macOS menu bar with the SRT loves VLC popover open, showing recent streams and actions"
    >
      <div className="stage__bar">
        <span className="stage__chip" aria-hidden="true">
          srt://
        </span>
        <div className="stage__cluster" aria-hidden="true">
          <svg className="stage__glyph" viewBox="0 0 16 16">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" />
          </svg>
          <svg className="stage__glyph" viewBox="0 0 16 16">
            <path d="M2 6.5a9 9 0 0 1 12 0" />
            <path d="M4.5 9a5.5 5.5 0 0 1 7 0" />
            <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
          </svg>
          <svg className="stage__glyph" viewBox="0 0 16 16">
            <rect x="1.5" y="4.5" width="11" height="7" rx="1.5" />
            <path d="M13.5 7v2" />
            <rect x="3" y="6" width="6" height="4" fill="currentColor" stroke="none" />
          </svg>
          <span className="stage__app">
            <img src="/app-icon.png" width={18} height={18} alt="" />
          </span>
          <span className="stage__clock">9:41</span>
        </div>
      </div>
      <div className="stage__popover">
        <div className="menu-preview__title">SRT ❤ VLC</div>
        <div className="menu-preview__divider" />
        <div className="menu-preview__section">Recent Streams</div>
        <div className="menu-preview__row">
          <span className="menu-preview__ico">◈</span>
          <span className="mono">ingest.lab:9000</span>
        </div>
        <div className="menu-preview__row">
          <span className="menu-preview__ico">◈</span>
          <span className="mono">edge-a:5001</span>
        </div>
        <div className="menu-preview__divider" />
        <div className="menu-preview__row">
          <span className="menu-preview__ico">▶</span> Test Stream
          <kbd>⌘T</kbd>
        </div>
        <div className="menu-preview__row">
          <span className="menu-preview__ico">⚙</span> Settings
          <kbd>⌘,</kbd>
        </div>
        <div className="menu-preview__divider" />
        <div className="menu-preview__row muted">About</div>
        <div className="menu-preview__row muted">Quit</div>
      </div>
    </div>
  )
}
