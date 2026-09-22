/** Original SVG illustration — srt:// → helper → VLC. Not a product screenshot. */
export function FlowDiagram() {
  return (
    <figure className="flow reveal" aria-labelledby="flow-caption">
      <svg
        viewBox="0 0 720 220"
        role="img"
        aria-label="Flow from an srt link through the menu-bar helper into VLC"
      >
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7cf0d0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect width="720" height="220" rx="20" fill="#0f131a" />
        <rect
          x="1"
          y="1"
          width="718"
          height="218"
          rx="19"
          fill="none"
          stroke="#243044"
        />

        {/* Link chip */}
        <rect x="36" y="70" width="180" height="80" rx="14" fill="#141820" stroke="#2a3a52" />
        <text x="126" y="104" textAnchor="middle" fill="#7cf0d0" fontFamily="JetBrains Mono, monospace" fontSize="15" fontWeight="500">
          srt://
        </text>
        <text x="126" y="128" textAnchor="middle" fill="#9aa8bd" fontFamily="DM Sans, sans-serif" fontSize="13">
          click or paste
        </text>

        <path d="M232 110h48" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" />
        <polygon points="280,110 268,104 268,116" fill="#ff4d6d" />

        {/* Helper */}
        <rect x="292" y="54" width="200" height="112" rx="14" fill="#141820" stroke="#2a3a52" />
        <circle cx="318" cy="78" r="8" fill="#ff4d6d" />
        <text x="336" y="83" fill="#e8edf5" fontFamily="DM Sans, sans-serif" fontSize="14" fontWeight="600">
          Menu bar helper
        </text>
        <text x="318" y="112" fill="#9aa8bd" fontFamily="DM Sans, sans-serif" fontSize="12">
          Claims the srt:// scheme
        </text>
        <text x="318" y="134" fill="#9aa8bd" fontFamily="DM Sans, sans-serif" fontSize="12">
          Hands off to your VLC
        </text>
        <text x="318" y="152" fill="#6b7a90" fontFamily="JetBrains Mono, monospace" fontSize="11">
          no embedded libvlc
        </text>

        <path d="M508 110h48" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" />
        <polygon points="556,110 544,104 544,116" fill="#7cf0d0" />

        {/* VLC stand-in — generic player window, not VLC branding */}
        <rect x="568" y="62" width="116" height="96" rx="12" fill="#141820" stroke="#2a3a52" />
        <rect x="584" y="80" width="84" height="48" rx="6" fill="#0b0d12" />
        <polygon points="618,94 618,114 636,104" fill="#7cf0d0" />
        <text x="626" y="148" textAnchor="middle" fill="#e8edf5" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600">
          Your VLC
        </text>
      </svg>
      <figcaption id="flow-caption">
        A link arrives. The helper owns <code>srt://</code>. VLC does the playback.
      </figcaption>
    </figure>
  )
}
