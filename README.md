# srtlovesvlc.com

Marketing site for **SRT ❤ VLC** — a macOS menu-bar helper that claims `srt://` and launches the user’s VLC (no embedded libvlc). Coming to the Mac App Store; Windows tray version planned.

## Stack

Vite + React + TypeScript. Dark informational page. No fake download links.

## Develop

```bash
npm install
npm run dev
npm run build
```

## Deploy

See [`ops/DEPLOY.md`](ops/DEPLOY.md). Static files → `/var/www/srtlovesvlc.com` on **vm100**, nginx site mirrored from `broadcastmcr.com`.

```bash
npm run build
./ops/deploy.sh root@vm100:/var/www/srtlovesvlc.com
```
