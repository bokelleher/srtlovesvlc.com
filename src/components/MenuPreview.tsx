/** Stylized menu-bar popover mock — original illustration, not a screenshot. */
export function MenuPreview() {
  return (
    <div className="menu-preview reveal" role="img" aria-label="Stylized menu-bar popover showing recent streams and actions">
      <div className="menu-preview__chrome">
        <span className="menu-preview__pill">SRT ❤ VLC</span>
        <span className="menu-preview__dot" />
      </div>
      <div className="menu-preview__panel">
        <div className="menu-preview__title">SRT ❤ VLC</div>
        <div className="menu-preview__divider" />
        <div className="menu-preview__section">Recent Streams</div>
        <div className="menu-preview__row">
          <span className="menu-preview__ico" aria-hidden="true">
            ◈
          </span>
          <span className="mono">ingest.lab:9000</span>
        </div>
        <div className="menu-preview__row">
          <span className="menu-preview__ico" aria-hidden="true">
            ◈
          </span>
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
