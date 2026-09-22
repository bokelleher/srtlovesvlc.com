# UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved design in `docs/superpowers/specs/2026-09-22-ui-refresh-design.md`: OS-aware hero CTA, menu-bar stage, HTML flow diagram, feature icons, merged pricing, matching legal pages, no-JS fix.

**Architecture:** Vite + React 19 single page in `src/`, static legal pages in `public/`. All motion is CSS keyframes gated on the existing `.is-visible` class from `useReveal`, and on an `html.js` class so nothing hides without JavaScript. There is no test framework; every task's check is `npm run build` plus a headless screenshot or a Playwright assertion script.

**Tech Stack:** Node 22, Vite 8, React 19, TypeScript 5.9, fontsource DM Sans / JetBrains Mono, Playwright (Python venv at `/opt/headless/venv`) for verification.

## Global Constraints

- No em-dashes in any copy, comment or commit message.
- No edge accent strips (`border-left`/`border-top` colour bars) on any card.
- Every animation must be disabled or render its final state under `prefers-reduced-motion: reduce`.
- Nothing may hide without JavaScript: opacity-0 starting states are scoped to `html.js`.
- `/eula.html` and `/privacy.html` keep their URLs and must read with JavaScript off.
- Stripe link stays `https://buy.stripe.com/5kQ4gA8WP4Me7Cs00gafS00`.
- Do not touch `downloads/` on the server; do not deploy in this plan.
- Screenshots: `/opt/headless/venv/bin/python /opt/headless/shot.py <url> <out.png> [--width N --height N]`. Scratch dir: `/tmp/claude-1001/-opt/c108cf5e-3f66-4572-af70-10520cc93e84/scratchpad`.
- Serve the build for checks with `python3 -m http.server 5399 --bind 127.0.0.1 --directory dist` from the repo root.

---

### Task 1: Toolchain, no-JS reveal, meta description

**Files:**
- Modify: `index.html`
- Modify: `src/index.css:132-143`

- [ ] **Step 1: Install and prove the baseline builds**

```bash
cd /opt/srtlovesvlc.com && npm ci && npm run build
```
Expected: `dist/index.html` exists, no TypeScript errors.

- [ ] **Step 2: Add the js class and new description in `index.html`**

Insert as the first child of `<head>`:
```html
    <script>document.documentElement.classList.add('js')</script>
```
Replace the description meta content with:
```
SRT ❤️ VLC claims srt:// links and launches the VLC you already use. Windows tray helper available now for $1.99. macOS menu-bar helper coming to the Mac App Store.
```

- [ ] **Step 3: Scope `.reveal` to `html.js`**

In `src/index.css` replace the two `.reveal` rules with:
```css
html.js .reveal {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 0.7s var(--ease),
    transform 0.7s var(--ease);
}

html.js .reveal.is-visible {
  opacity: 1;
  transform: none;
}
```

- [ ] **Step 4: Build and check**

```bash
npm run build && grep -c "classList.add('js')" dist/index.html && grep -o 'html.js .reveal' dist/assets/*.css | head -1
```
Expected: `1` and one match.

- [ ] **Step 5: Commit** `Show content without JavaScript and refresh the meta description`

---

### Task 2: Platform detection and hero CTA

**Files:**
- Create: `src/links.ts`, `src/hooks/usePlatform.ts`, `src/components/HeroCta.tsx`
- Modify: `src/App.tsx` (hero copy, CTA row, import of `WINDOWS_BUY_URL`), `src/index.css` (append)

**Interfaces:**
- Produces: `WINDOWS_BUY_URL: string`; `type Platform = 'mac' | 'windows' | 'other'`; `detectPlatform(nav): Platform`; `usePlatform(): Platform`; `<HeroCta platform={Platform} />`.

- [ ] **Step 1: `src/links.ts`**
```ts
export const WINDOWS_BUY_URL = 'https://buy.stripe.com/5kQ4gA8WP4Me7Cs00gafS00'
```

- [ ] **Step 2: `src/hooks/usePlatform.ts`**
```ts
import { useMemo } from 'react'

export type Platform = 'mac' | 'windows' | 'other'

type NavHint = {
  userAgentData?: { platform?: string }
  platform?: string
  userAgent?: string
}

/** Mac is tested first: "darwin" would otherwise match the Windows test. */
export function detectPlatform(nav: NavHint): Platform {
  const hint = (nav.userAgentData?.platform || nav.platform || nav.userAgent || '').toLowerCase()
  if (/mac/.test(hint)) return 'mac'
  if (/win/.test(hint)) return 'windows'
  return 'other'
}

export function usePlatform(): Platform {
  return useMemo(
    () => (typeof navigator === 'undefined' ? 'other' : detectPlatform(navigator as NavHint)),
    [],
  )
}
```

- [ ] **Step 3: `src/components/HeroCta.tsx`**
```tsx
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
```

- [ ] **Step 4: Wire into `App.tsx`**

Replace the local `WINDOWS_BUY_URL` const with `import { WINDOWS_BUY_URL } from './links'`; add `import { HeroCta } from './components/HeroCta'` and `import { usePlatform } from './hooks/usePlatform'`; call `const platform = usePlatform()` beside `useReveal()`. Eyebrow text becomes `macOS and Windows helper`. Lede becomes:
```tsx
<p className="hero__lede">
  SRT ❤ VLC sits in your menu bar or tray, claims the{' '}
  <code className="inline-code">srt://</code> scheme, and launches the VLC
  you already use. No embedded player.
</p>
```
Replace the `<p className="hero__store">…</p>` block with `<HeroCta platform={platform} />`.

- [ ] **Step 5: Styles (append to `src/index.css`)**
```css
.hero__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.pill--soon {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(255, 77, 109, 0.3);
}
```
Delete the now-unused `.hero__store` rule.

- [ ] **Step 6: Build and check** `npm run build` clean; `grep -c "Buy for Windows" dist/assets/*.js` returns at least 1.

- [ ] **Step 7: Commit** `Add an OS-aware hero call to action`

---

### Task 3: Menu-bar stage and drifting glows

**Files:**
- Create: `src/components/MenuBarStage.tsx`
- Delete: `src/components/MenuPreview.tsx`
- Modify: `src/App.tsx` (swap component), `src/chrome.css:1-91` (replace `.menu-preview*` block), `src/index.css:48-60` (body background)

- [ ] **Step 1: `MenuBarStage.tsx`**
```tsx
/** Stylised menu bar + popover. Original illustration, not a screenshot. */
export function MenuBarStage() {
  return (
    <div
      className="stage reveal"
      role="img"
      aria-label="Stylised macOS menu bar with the SRT loves VLC popover open, showing recent streams and actions"
    >
      <div className="stage__bar">
        <span className="stage__chip" aria-hidden="true">srt://</span>
        <div className="stage__cluster" aria-hidden="true">
          <svg className="stage__glyph" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>
          <svg className="stage__glyph" viewBox="0 0 16 16"><path d="M2 6.5a9 9 0 0 1 12 0" /><path d="M4.5 9a5.5 5.5 0 0 1 7 0" /><circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" /></svg>
          <svg className="stage__glyph" viewBox="0 0 16 16"><rect x="1.5" y="4.5" width="11" height="7" rx="1.5" /><path d="M13.5 7v2" /><rect x="3" y="6" width="6" height="4" fill="currentColor" stroke="none" /></svg>
          <span className="stage__app"><img src="/app-icon.png" width={18} height={18} alt="" /></span>
          <span className="stage__clock">9:41</span>
        </div>
      </div>
      <div className="stage__popover">
        <div className="menu-preview__title">SRT ❤ VLC</div>
        <div className="menu-preview__divider" />
        <div className="menu-preview__section">Recent Streams</div>
        <div className="menu-preview__row"><span className="menu-preview__ico">◈</span><span className="mono">ingest.lab:9000</span></div>
        <div className="menu-preview__row"><span className="menu-preview__ico">◈</span><span className="mono">edge-a:5001</span></div>
        <div className="menu-preview__divider" />
        <div className="menu-preview__row"><span className="menu-preview__ico">▶</span> Test Stream<kbd>⌘T</kbd></div>
        <div className="menu-preview__row"><span className="menu-preview__ico">⚙</span> Settings<kbd>⌘,</kbd></div>
        <div className="menu-preview__divider" />
        <div className="menu-preview__row muted">About</div>
        <div className="menu-preview__row muted">Quit</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace `.menu-preview`, `.menu-preview__chrome`, `.menu-preview__pill`, `.menu-preview__dot`, `.menu-preview__panel` in `chrome.css` with**
```css
.stage {
  position: relative;
  width: 100%;
  filter: drop-shadow(var(--shadow));
}

.stage__bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
  padding: 0 10px;
  border-radius: 10px;
  background: rgba(28, 34, 48, 0.9);
  border: 1px solid var(--border);
  overflow: hidden;
}

.stage__chip {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  color: var(--mint);
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--mint-soft);
  opacity: 0;
}

.stage__cluster {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}

.stage__glyph {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
}

.stage__app {
  position: relative;
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
}

.stage__app img {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  display: block;
}

.stage__app::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 7px;
  border: 1.5px solid var(--mint);
  box-shadow: 0 0 10px rgba(124, 240, 208, 0.5);
}

.stage__clock {
  font-size: 0.74rem;
  font-weight: 500;
  color: var(--text);
  min-width: 30px;
  text-align: right;
}

.stage__popover {
  width: min(100%, 340px);
  margin: 10px 46px 0 auto;
  background: linear-gradient(180deg, #1c2230, #151a24);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 10px 0 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

@media (max-width: 480px) {
  .stage__popover {
    margin-right: 0;
  }
}

@keyframes stage-chip {
  0% { opacity: 0; left: 12px; }
  15% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; left: calc(100% - 96px); }
}

@keyframes stage-ring {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.35); }
}

@keyframes stage-pop {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}

html.js .stage__popover {
  opacity: 0;
}

html.js .stage.is-visible .stage__chip {
  animation: stage-chip 0.7s var(--ease) both;
}

html.js .stage.is-visible .stage__app::after {
  animation: stage-ring 0.4s ease-in-out 0.6s;
}

html.js .stage.is-visible .stage__popover {
  animation: stage-pop 0.5s var(--ease) 0.9s both;
}

@media (prefers-reduced-motion: reduce) {
  .stage__chip { display: none; }
  html.js .stage__popover { opacity: 1; animation: none; }
  html.js .stage.is-visible .stage__app::after { animation: none; }
}
```
Keep `.menu-preview__title` through `.menu-preview__divider` unchanged.

- [ ] **Step 3: Glow drift in `index.css`**

Replace the `body` background with `background: var(--bg);` and add:
```css
body::before,
body::after {
  content: '';
  position: fixed;
  inset: -20%;
  z-index: -1;
  pointer-events: none;
  animation: glow-drift 30s ease-in-out infinite alternate;
}

body::before {
  background: radial-gradient(1200px 600px at 20% 5%, rgba(255, 77, 109, 0.12), transparent 55%);
}

body::after {
  background: radial-gradient(900px 500px at 85% 10%, rgba(124, 240, 208, 0.08), transparent 50%);
  animation-direction: alternate-reverse;
}

@keyframes glow-drift {
  from { transform: translate(0, 0); }
  to { transform: translate(40px, 30px); }
}
```
The existing reduced-motion block already collapses this animation to 0.01ms.

- [ ] **Step 4: Swap in `App.tsx`**: import `MenuBarStage` instead of `MenuPreview`, render `<MenuBarStage />`; `git rm src/components/MenuPreview.tsx`.

- [ ] **Step 5: Build, serve, screenshot** at 1280x900 and 390x844; confirm the popover is visible, right-aligned under the icon, and the chip has faded out.

- [ ] **Step 6: Commit** `Replace the popover mock with a menu-bar stage`

---

### Task 4: HTML flow diagram

**Files:**
- Rewrite: `src/components/FlowDiagram.tsx`
- Modify: `src/chrome.css` (replace `.flow`, `.flow svg` rules)

- [ ] **Step 1: Component**
```tsx
/** Three-step flow, srt:// link to helper to VLC. Original illustration. */
export function FlowDiagram() {
  return (
    <figure className="flow reveal" aria-labelledby="flow-caption">
      <ol className="flow__steps">
        <li className="flow__card">
          <span className="flow__mono">srt://</span>
          <span className="flow__title">A link arrives</span>
          <span className="flow__sub">Clicked in mail, chat or a runbook. Or pasted.</span>
        </li>
        <li className="flow__link" aria-hidden="true"><span className="flow__dot" /></li>
        <li className="flow__card">
          <img className="flow__icon" src="/app-icon.png" width={40} height={40} alt="" />
          <span className="flow__title">Menu bar helper</span>
          <span className="flow__sub">Owns the srt:// scheme. Hands the URL to your VLC.</span>
          <span className="flow__mono flow__mono--faint">no embedded libvlc</span>
        </li>
        <li className="flow__link" aria-hidden="true"><span className="flow__dot" /></li>
        <li className="flow__card">
          <span className="flow__player" aria-hidden="true">
            <svg viewBox="0 0 48 32"><rect x="1" y="1" width="46" height="30" rx="5" /><polygon points="20,9 20,23 32,16" fill="currentColor" stroke="none" /></svg>
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
```

- [ ] **Step 2: Styles** (replace `.flow { margin: 0 }` and `.flow svg` rules; keep the figcaption rules)
```css
.flow { margin: 0; }

.flow__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 64px 1fr 64px 1fr;
  align-items: center;
}

.flow__card {
  display: grid;
  justify-items: center;
  gap: 6px;
  padding: 26px 20px;
  text-align: center;
  border-radius: var(--radius);
  background: linear-gradient(180deg, #1c2230, #151a24);
  border: 1px solid var(--border);
}

.flow__mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 1.05rem;
  color: var(--mint);
}

.flow__mono--faint {
  font-size: 0.78rem;
  color: var(--faint);
  margin-top: 4px;
}

.flow__title { font-weight: 600; letter-spacing: -0.01em; }
.flow__sub { color: var(--muted); font-size: 0.9rem; max-width: 26ch; }

.flow__icon { border-radius: 11px; box-shadow: 0 0 0 1px rgba(42, 58, 82, 0.85); }

.flow__player {
  width: 48px;
  height: 32px;
  color: var(--mint);
}
.flow__player svg { width: 100%; height: 100%; fill: none; stroke: var(--border); stroke-width: 1.5; }

.flow__link {
  position: relative;
  height: 2px;
  background: linear-gradient(90deg, var(--mint), var(--accent));
  opacity: 0.6;
}

.flow__dot {
  position: absolute;
  top: 50%;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--mint);
  box-shadow: 0 0 8px rgba(124, 240, 208, 0.8);
  transform: translate(-50%, -50%);
  opacity: 0;
}

@keyframes flow-dot-h {
  0% { left: 0; opacity: 0; }
  10% { opacity: 1; }
  100% { left: 100%; opacity: 1; }
}

html.js .flow.is-visible .flow__link:nth-of-type(2) .flow__dot { animation: flow-dot-h 0.9s var(--ease) 0.2s both; }
html.js .flow.is-visible .flow__link:nth-of-type(4) .flow__dot { animation: flow-dot-h 0.9s var(--ease) 1.1s both; }

@media (max-width: 760px) {
  .flow__steps { grid-template-columns: 1fr; }
  .flow__link {
    width: 2px;
    height: 40px;
    margin: 0 auto;
    background: linear-gradient(180deg, var(--mint), var(--accent));
  }
  .flow__dot { left: 50%; top: 0; }
  @keyframes flow-dot-v {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    100% { top: 100%; opacity: 1; }
  }
  html.js .flow.is-visible .flow__link:nth-of-type(2) .flow__dot { animation-name: flow-dot-v; }
  html.js .flow.is-visible .flow__link:nth-of-type(4) .flow__dot { animation-name: flow-dot-v; }
}

@media (prefers-reduced-motion: reduce) {
  .flow__dot { display: none; }
}
```
Note: `nth-of-type` counts `li` siblings, so the connectors are the 2nd and 4th `li`.

- [ ] **Step 3: Build, serve, screenshot** 1280 and 390; confirm three cards read at both widths.
- [ ] **Step 4: Commit** `Rebuild the flow diagram as responsive HTML`

---

### Task 5: Feature icons, pricing anchor, drop "Get the app"

**Files:**
- Create: `src/components/FeatureIcon.tsx`
- Modify: `src/App.tsx` (features array, feature card, platforms section, remove CTA section), `src/chrome.css` (feature card, platform price, remove `.cta-lite`)

- [ ] **Step 1: `FeatureIcon.tsx`**
```tsx
export type IconName = 'link' | 'play' | 'clock' | 'layers' | 'gauge' | 'power'

const paths: Record<IconName, JSX.Element> = {
  link: (<><path d="M8.5 11.5 11.5 8.5" /><path d="M7 13l-1.5 1.5a3 3 0 0 1-4.2-4.2L4 7.5a3 3 0 0 1 4.2 0" /><path d="M13 7l1.5-1.5a3 3 0 0 0-4.2-4.2L7.5 4" /></>),
  play: <polygon points="6,4 16,10 6,16" />,
  clock: (<><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" /></>),
  layers: (<><path d="M10 3l7 4-7 4-7-4z" /><path d="M3 11l7 4 7-4" /></>),
  gauge: (<><path d="M3 14a7 7 0 0 1 14 0" /><path d="M10 14l3.5-4.5" /></>),
  power: (<><path d="M10 3v7" /><path d="M6 6a6 6 0 1 0 8 0" /></>),
}

export function FeatureIcon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
```
(If `JSX` is not in scope under React 19 types, use `import type { ReactElement } from 'react'` and `Record<IconName, ReactElement>`.)

- [ ] **Step 2: `App.tsx`** Add `icon` to each feature in order: `link`, `play`, `clock`, `layers`, `gauge`, `power`. Type the array `Array<{ title: string; body: string; icon: IconName }>`. In the card, before `<h3>`: `<span className="feature-card__icon"><FeatureIcon name={f.icon} /></span>`. Add `id="pricing"` to `<div className="platform-cards">`. Under each `.platform-card__os` add `<div className="platform-card__price">Price TBA · Mac App Store</div>` and `<div className="platform-card__price">$1.99 · one-time purchase</div>`. Windows body gains the sentence `After checkout you land on a private download page for the installer.` (replacing `Purchase includes the installer download.`). Delete the whole `<section className="section band cta-lite">` block.

- [ ] **Step 3: Styles**
```css
.feature-card {
  padding: 22px 20px;
  border-radius: var(--radius);
  background: linear-gradient(180deg, #1c2230, #151a24);
  border: 1px solid var(--border);
  transition: transform 0.16s var(--ease), border-color 0.16s ease;
}
.feature-card:hover,
.feature-card:focus-within {
  transform: translateY(-2px);
  border-color: rgba(124, 240, 208, 0.35);
}
.feature-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: var(--mint-soft);
  color: var(--mint);
}
.platform-card__price {
  margin-top: 2px;
  font-size: 0.85rem;
  color: var(--text);
  font-weight: 500;
}
```
Delete `.cta-lite .lede`.

- [ ] **Step 4: Build; serve; check anchors** with the Playwright script from Task 7 step 2 (anchor part), or `grep -o 'id="pricing"' dist/assets/*.js`.
- [ ] **Step 5: Commit** `Add feature icons and fold pricing into Platforms`

---

### Task 6: Legal pages

**Files:**
- Create: `public/legal.css`, `public/fonts/dm-sans-latin-{400,500,700}-normal.woff2`
- Rewrite: `public/eula.html`, `public/privacy.html` (keep every clause of the legal text verbatim)

- [ ] **Step 1: Copy fonts**
```bash
mkdir -p public/fonts && for w in 400 500 700; do cp node_modules/@fontsource/dm-sans/files/dm-sans-latin-$w-normal.woff2 public/fonts/; done
```

- [ ] **Step 2: `public/legal.css`** with: three `@font-face` (family `DM Sans`, weights 400/500/700, `font-display: swap`, `src: url(/fonts/dm-sans-latin-<w>-normal.woff2) format('woff2')`), the `:root` tokens copied from `src/index.css`, `body` (margin 0, DM Sans, `var(--bg)`, `var(--text)`, line-height 1.6), `.nav` / `.nav__inner` / `.nav__brand` / `.nav__mark` / `.nav__links` copied from `src/index.css`, `.container` (`width: min(var(--max), calc(100% - 40px))`), `.legal { max-width: 68ch; padding: 56px 0 72px }`, `.legal h1 { font-size: clamp(1.9rem, 4vw, 2.6rem); letter-spacing: -0.03em; margin: 0 0 18px }`, `.legal .eyebrow` (copy), `.legal h2 { margin: 36px 0 8px; font-size: 1.2rem }`, `.legal p { color: var(--muted) }`, `.legal strong { color: var(--text) }`, `.legal a { color: var(--mint) }`, `.legal .contact { margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border) }`, plus `.footer*` rules copied from `chrome.css` and `index.css`. Links in `.nav__links[aria-current="page"]` get `color: var(--text)`.

- [ ] **Step 3: Rewrite both pages** to this skeleton, preserving all legal text:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>… existing title …</title>
  <link rel="icon" href="/favicon-32.png" sizes="32x32" />
  <link rel="stylesheet" href="/legal.css" />
</head>
<body>
  <header class="nav"><div class="nav__inner container">
    <a class="nav__brand" href="https://srtlovesvlc.com/"><img class="nav__mark" src="/app-icon.png" width="28" height="28" alt="" />SRT <span class="heart">❤</span> VLC</a>
    <nav class="nav__links" aria-label="Sections">
      <a href="https://srtlovesvlc.com/">Home</a><a href="https://srtlovesvlc.com/#how">How it works</a><a href="https://srtlovesvlc.com/#features">Features</a><a href="https://srtlovesvlc.com/#platforms">Platforms</a><a href="https://srtlovesvlc.com/#pricing">Pricing</a><a href="/eula.html">EULA</a><a href="/privacy.html">Privacy</a>
    </nav>
  </div></header>
  <main class="container legal">
    <h1>…</h1>
    <p>…intro…</p>
    <p class="eyebrow">01</p><h2>License grant</h2><p>…</p>
    …
    <p class="contact">…</p>
  </main>
  <footer class="footer"><div class="container footer__inner">…same as App footer…</div></footer>
</body>
</html>
```
The current page's nav link gets `aria-current="page"`.

- [ ] **Step 4: Build, serve, screenshot** `/eula.html` and `/privacy.html` at 1280 and 390; `curl -sI 127.0.0.1:5399/fonts/dm-sans-latin-400-normal.woff2` returns 200.
- [ ] **Step 5: Commit** `Restyle the legal pages to match the site`

---

### Task 7: Verification pass

- [ ] **Step 1: Full build** `npm run build` (runs `tsc -b`).
- [ ] **Step 2: Playwright checks** Save to scratchpad as `verify.py` and run with `/opt/headless/venv/bin/python`:
```python
import sys
from playwright.sync_api import sync_playwright
BASE = 'http://127.0.0.1:5399'
UAS = {
  'windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36',
  'mac': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 Version/17.6 Safari/605.1.15',
  'other': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128 Safari/537.36',
}
WANT = {'windows': 'Buy for Windows', 'mac': 'Coming to the Mac App Store', 'other': 'Buy for Windows'}
fails = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, ua in UAS.items():
        pg = b.new_page(user_agent=ua)
        pg.goto(BASE + '/'); pg.wait_for_timeout(800)
        txt = pg.locator('.hero__cta').inner_text()
        ok = WANT[name] in txt
        print(f'cta {name}: {"ok" if ok else "FAIL"} -> {txt!r}'); fails += not ok
        for a in ['#top', '#how', '#features', '#platforms', '#pricing']:
            if pg.locator(a).count() != 1:
                print(f'anchor {a}: FAIL'); fails += 1
        pg.close()
    pg = b.new_page(reduced_motion='reduce'); pg.goto(BASE + '/'); pg.wait_for_timeout(500)
    vis = pg.locator('.stage__popover').evaluate('e => getComputedStyle(e).opacity')
    print('reduced-motion popover opacity', vis); fails += vis != '1'
    ctx = b.new_context(java_script_enabled=False); pg = ctx.new_page(); pg.goto(BASE + '/')
    # With JS off the React app never mounts, so the body is empty by design; check the legal page instead.
    pg.goto(BASE + '/eula.html'); ok = pg.locator('h1').is_visible()
    print('no-js eula h1 visible', ok); fails += not ok
    b.close()
sys.exit(1 if fails else 0)
```
Expected: every line `ok`, exit 0. (The React root is empty without JavaScript regardless of `.reveal`; the `html.js` gate matters for browsers that run JS but where `useReveal` fails, and for the legal pages which share no such hazard. Record that in the final report.)
- [ ] **Step 3: Screenshots** home at 1280x3300 and 390x4700, eula and privacy at 1280 and 390; view each.
- [ ] **Step 4: Commit any fixes; push main.**
