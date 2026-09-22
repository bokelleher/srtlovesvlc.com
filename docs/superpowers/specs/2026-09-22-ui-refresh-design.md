# srtlovesvlc.com UI refresh: design

Date: 2026-09-22. Status: approved by Bo in conversation, pending spec review.

## Goal

A bolder visual pass on the marketing site that keeps the existing palette and
type, fixes the known defects, and gives the page a real above-the-fold call to
action that is honest about platform availability (Windows on sale now, macOS
coming to the Mac App Store).

## Defects this pass must fix

1. No call to action above the fold. The only purchase button is in Platforms.
2. Hero copy says "No fake download button here" while Windows is on sale.
3. The meta description in `index.html` still says Windows is "on the way".
4. Nav "Pricing" links to `#pricing`, which no element carries.
5. The How-it-works SVG scales its text to about 6px at 390px wide.
6. `eula.html` and `privacy.html` use a different font, nav and layout.
7. "Get the app" repeats the Platforms cards with no button.
8. `.reveal` starts at opacity 0 even when JavaScript never runs.

## Non-goals

- No light theme.
- No change to the Windows purchase flow, the Stripe link, or `downloads/`.
- No new pages. The legal pages stay at their current URLs.
- No looping or scroll-linked animation beyond what is listed below.
- No edge accent strips on any card (house rule).

## 1. Hero

Layout: two-column grid as today (copy left, stage right), single column on
viewports at or under 900px with the stage below the copy.

Copy:

- Eyebrow: "macOS and Windows helper".
- H1 unchanged: "SRT links deserve a straight path into VLC".
- Lede: "SRT ❤ VLC sits in your menu bar or tray, claims the srt:// scheme, and
  launches the VLC you already use. No embedded player." The sentence about a
  fake download button is removed.
- Chips unchanged.
- The "Coming soon · Mac App Store" line is replaced by the CTA row.

CTA row. A small `usePlatform()` hook decides once at render, with no effect
after mount, from `navigator.userAgentData?.platform`, then
`navigator.platform`, then the user-agent string. It returns `'mac' | 'windows'
| 'other'`. Rendering per result:

| Platform | Primary | Secondary |
|---|---|---|
| windows | Button, mint: "Buy for Windows · $1.99" to the Stripe link, new tab | Ghost link: "macOS coming soon" to `#platforms` |
| mac | Non-interactive pill (not a button, not a link): "Coming to the Mac App Store" | Ghost link: "Get it for Windows · $1.99" to Stripe, new tab |
| other | Button, mint: "Buy for Windows · $1.99" to Stripe, new tab | Ghost link: "macOS coming soon" to `#platforms` |

Both buttons reuse the existing `.btn`, `.btn--primary` and `.btn--ghost`
classes. The pill is a new `.pill--soon` with the badge palette.

Stage (`<MenuBarStage>` replaces `<MenuPreview>`):

- A menu-bar strip: full width of the column, height 30px, radius 10px,
  translucent dark surface, 1px border. Right cluster holds three generic
  status glyphs drawn as inline SVG (a wifi fan, a battery outline, and a
  search circle) and a clock reading "9:41". No Apple logo, no Apple glyphs.
- The real `app-icon.png` at 18px sits in the cluster, wrapped in a mint ring.
- The popover hangs from the icon: same content as today's `MenuPreview`, width
  `min(100%, 340px)`, anchored so its right edge lines up under the icon.
- Reveal animation, driven by the existing `.is-visible` class:
  1. 0 to 700ms: an `srt://` chip (mono, mint) enters at the strip's left edge
     and translates to the icon, fading in the last 150ms.
  2. 600 to 1000ms: the icon ring scales 1 to 1.35 and back once.
  3. 900 to 1400ms: the popover fades and rises 10px into place.
  Everything is CSS keyframes with `animation-fill-mode: both`. The chip is
  `aria-hidden`.
- The two body background glows move to `body::before` and `body::after`
  pseudo-elements and drift on a 30s alternate loop (translate only, at most
  40px). This is the only continuous motion on the page.
- Under `prefers-reduced-motion: reduce` every keyframe above is disabled and
  the stage renders its final state.

## 2. How it works

`FlowDiagram` is rewritten as HTML, not SVG. Structure:

```
<figure class="flow reveal">
  <ol class="flow__steps">
    <li class="flow__card">  srt:// link   (mono chip + "click or paste")
    <li class="flow__link" aria-hidden>  connector
    <li class="flow__card">  Menu bar helper (real app icon, two lines, "no embedded libvlc")
    <li class="flow__link" aria-hidden>  connector
    <li class="flow__card">  Your VLC (generic player glyph, no VLC branding)
  </ol>
  <figcaption> unchanged
</figure>
```

Layout: `grid-template-columns: 1fr auto 1fr auto 1fr` at or above 760px;
single column below, where each connector becomes a 40px vertical line.
Cards reuse the feature-card surface, border and radius.

Connector animation: each connector is a 2px line with a 8px mint dot that
travels from start to end once. Connector one plays 0 to 900ms, connector two
900 to 1800ms, both triggered by `.is-visible` on the figure. The dot is
`aria-hidden`. Disabled under reduced motion.

## 3. Features and Platforms

Features:

- Each card gains a 20px inline-SVG line icon in mint above the title. Six
  icons, drawn as simple strokes, one per feature: link, play, clock, layers,
  gauge, power.
- Hover and focus-within: `translateY(-2px)`, border colour
  `rgba(124,240,208,0.35)`, 160ms transition. Full border only.
- Card background becomes the surface-2 gradient already used by the popover.

Platforms:

- The "Get the app" section is deleted along with its `.cta-lite` styles.
- The section keeps `id="platforms"`. The `.platform-cards` wrapper gets
  `id="pricing"` so the nav link resolves. Both anchors scroll correctly
  because `scroll-padding-top` already accounts for the sticky nav.
- Each card gains a `.platform-card__price` line under the OS name:
  macOS "Price TBA · Mac App Store", Windows "$1.99 · one-time purchase".
- The Windows card body gains: "After checkout you land on a private download
  page for the installer."
- Card buttons unchanged.

## 4. Legal pages

`public/eula.html` and `public/privacy.html` remain static HTML at the same
URLs and must read fully without JavaScript.

- New `public/legal.css`, linked by both pages. It declares the same `:root`
  tokens as `src/index.css`, the nav, footer, and a `.legal` reading column of
  `max-width: 68ch`.
- New `public/fonts/` holding three files copied from
  `node_modules/@fontsource/dm-sans/files/`: latin 400, 500 and 700 woff2.
  `legal.css` declares the matching `@font-face` rules with `font-display:
  swap`. The app build keeps using fontsource; this copy exists only because
  Vite hashes the app's font filenames.
- Nav: identical markup and classes to the app's `Nav`, with links Home, How
  it works, Features, Platforms, Pricing (all absolute to the home page), then
  EULA and Privacy. The current page's link carries `aria-current="page"`.
- Footer: identical to the app footer.
- Body: H1 as today; each numbered section becomes an H2 preceded by a mint
  eyebrow with the number ("01", "02"...). Inline styles are removed from both
  files.

## 5. Fixes and verification

- `index.html` gets `<script>document.documentElement.classList.add('js')</script>`
  as the first child of `<head>`. `.reveal` rules are scoped to `html.js
  .reveal`, so without JavaScript everything is visible.
- `index.html` meta description becomes: "SRT ❤️ VLC claims srt:// links and
  launches the VLC you already use. Windows tray helper available now for
  $1.99. macOS menu-bar helper coming to the Mac App Store."
- Nav links unchanged.

Verification, all on vm100 before any deploy:

1. `npm ci && npm run build` succeeds, `tsc --noEmit` is clean.
2. Serve `dist/` on a loopback port and screenshot with
   `/opt/headless/shot.py` at 1280x3300 and 390x4700.
3. Check every nav anchor resolves to an element (`#top`, `#how`,
   `#features`, `#platforms`, `#pricing`).
4. Screenshot `/eula.html` and `/privacy.html` at 1280 and 390.
5. A scratch Playwright script (same venv as `shot.py`, kept in the session
   scratchpad, not committed) covers what `shot.py` cannot: it renders the hero
   with a Windows, a Mac and a Linux user agent and asserts the CTA text; it
   renders once with `reduced_motion='reduce'`; and it renders once with
   JavaScript disabled and asserts the Features heading is visible.

Deploying `dist/` to `/var/www/srtlovesvlc.com` is a separate step that Bo
triggers. It must keep `downloads/` intact (see `ops/deploy.sh`).

## Files touched

- `index.html`
- `src/App.tsx`, `src/index.css`, `src/chrome.css`
- `src/components/Nav.tsx` (no change expected), `FlowDiagram.tsx` (rewrite),
  `MenuPreview.tsx` (replaced by `MenuBarStage.tsx`)
- new `src/hooks/usePlatform.ts`, `src/components/FeatureIcon.tsx`
- `public/eula.html`, `public/privacy.html`, new `public/legal.css`,
  new `public/fonts/*.woff2`
