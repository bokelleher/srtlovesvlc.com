# srtlovesvlc.com

Marketing site for **SRT ❤ VLC**, a helper that claims `srt://` links and launches the VLC you already use (no embedded libvlc). Windows tray version is on sale now for $1.99 via Stripe. macOS menu-bar version is headed to the Mac App Store.

## Stack

Vite 8 + React 19 + TypeScript. Dark single page. Fonts ship through `@fontsource` (DM Sans, JetBrains Mono).

## Layout

| Path | What it is |
|---|---|
| `src/` | The React app. `App.tsx` holds the page; components live in `src/components/`. |
| `src/hooks/usePlatform.ts` | Picks the hero call to action from the visitor's platform (Windows, Mac, other). |
| `public/eula.html`, `public/privacy.html` | Static legal pages, styled by `public/legal.css`. They must keep working with JavaScript off, so they are plain HTML, not React routes. |
| `public/fonts/` | Three DM Sans woff2 files for the legal pages only. The app build hashes its own copies, so the static pages need these. |
| `ops/` | nginx config and deploy scripts. |
| `docs/superpowers/` | Design spec and implementation plan for the September 2026 UI refresh. |

On the server, `/var/www/srtlovesvlc.com/downloads/` holds the private Windows installer and its fulfillment page. It is **not in this repo** and every deploy script excludes it. Never commit it and never deploy over it.

## Develop

```bash
npm ci
npm run dev
```

`npm run build` runs `tsc -b`, the icon prebuild, and `vite build` into `dist/`. The prebuild decodes favicons from `scripts/*.b64` and keeps any PNG already in `public/` when no b64 copy exists.

## Verify a build before deploying

Serve `dist/` on loopback and look at it. On vm100 the headless screenshot tool is at `/opt/headless`:

```bash
npm run build
python3 -m http.server 5399 --bind 127.0.0.1 --directory dist &
/opt/headless/venv/bin/python /opt/headless/shot.py http://127.0.0.1:5399/ /tmp/home.png --width 1280 --height 2600 --wait 3000
```

Notes for anyone checking the page:

- Sections fade in on scroll. A full-page screenshot that never scrolls will show them blank. Use a tall viewport instead of `--full`.
- The fade-in only applies when `<html>` carries the `js` class, which `index.html` adds inline, so nothing hides without JavaScript.
- The hero CTA is chosen once at render from `navigator.userAgentData.platform`, then `navigator.platform`, then the user agent. Headless Chromium on Linux shows the "other" variant, which is the Windows buy button plus a "macOS coming soon" link.
- All animation collapses under `prefers-reduced-motion: reduce`.

## Deploy

The docroot is `/var/www/srtlovesvlc.com` on vm100, served by nginx from `ops/nginx-srtlovesvlc.com.conf`. Files there are owned by `techex`.

### From a Mac with SSH to vm100

```bash
npm ci && npm run build
./ops/deploy.sh root@vm100:/var/www/srtlovesvlc.com
```

`ops/deploy.sh` rsyncs `dist/` with `--delete` and excludes `downloads/`. The legal pages and fonts ship from `public/` with every build, so they no longer need excluding.

`ops/mac-appicon-deploy.sh` (refresh icons from the Xcode asset catalog, build, deploy, commit) and `ops/mac-deploy-oneshot.sh` (first-time nginx setup plus deploy) also protect `downloads/`.

### From vm100 itself

```bash
cd /opt/srtlovesvlc.com && git pull
npm ci && npm run build
sudo rsync -a --delete --exclude 'downloads/' --chown=techex:techex dist/ /var/www/srtlovesvlc.com/
```

Static files go live on copy; there is nothing to restart.

### After any deploy

```bash
for p in / /eula.html /privacy.html /legal.css /downloads/; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' https://srtlovesvlc.com$p)" "$p"
done
```

Everything except `/downloads/` should be 200 (`/downloads/` itself is 403 or 404 by design; the real fulfillment page lives under a tokenised path). First-time server setup, DNS and certbot steps are in [`ops/DEPLOY.md`](ops/DEPLOY.md).
