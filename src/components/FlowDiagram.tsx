/** Three-step flow, srt:// link to helper to VLC. Original illustration, not a screenshot. */
export function FlowDiagram() {
  return (
    <figure className="flow reveal" aria-labelledby="flow-caption">
      <ol className="flow__steps">
        <li className="flow__card">
          <span className="flow__mono">srt://</span>
          <span className="flow__title">A link arrives</span>
          <span className="flow__sub">Clicked in mail, chat or a runbook. Or pasted.</span>
        </li>
        <li className="flow__link" aria-hidden="true">
          <span className="flow__dot" />
        </li>
        <li className="flow__card">
          <img className="flow__icon" src="/app-icon.png" width={40} height={40} alt="" />
          <span className="flow__title">Menu bar helper</span>
          <span className="flow__sub">Owns the srt:// scheme. Hands the URL to your VLC.</span>
          <span className="flow__mono flow__mono--faint">no embedded libvlc</span>
        </li>
        <li className="flow__link" aria-hidden="true">
          <span className="flow__dot" />
        </li>
        <li className="flow__card">
          <span className="flow__player" aria-hidden="true">
            <svg viewBox="0 0 48 32">
              <rect x="1" y="1" width="46" height="30" rx="5" />
              <polygon points="20,9 20,23 32,16" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="flow__title">Your VLC</span>
          <span className="flow__sub">Playback stays in the player you already trust.</span>
        </li>
      </ol>
      <figcaption id="flow-caption">
        A link arrives. The helper owns <code>srt://</code>. VLC does the playback.
      </figcaption>
    </figure>
  )
}
