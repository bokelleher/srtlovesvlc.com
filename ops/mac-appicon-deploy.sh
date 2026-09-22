#!/usr/bin/env bash
# Run on Bo's Mac (has Xcode AppIcon + ssh Host vm100).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ICON_SET="${ICON_SET:-$HOME/Documents/_xcode/SRTlovesVLC/SRTlovesVLC/Assets.xcassets/AppIcon.appiconset}"
WWW="/var/www/srtlovesvlc.com"

die() { echo "$*" >&2; exit 1; }
[[ -d "$ICON_SET" ]] || die "Missing AppIcon set: $ICON_SET"

SRC_1024="$ICON_SET/icon_512x512@2x.png"
SRC_512="$ICON_SET/icon_512x512@1x.png"
SRC_32="$ICON_SET/icon_32x32@1x.png"
SRC_64="$ICON_SET/icon_32x32@2x.png"
[[ -f "$SRC_1024" || -f "$SRC_512" ]] || die "No 512/1024 icon in $ICON_SET"

mkdir -p "$ROOT/public" "$ROOT/scripts"
# app-icon: prefer 512@1x (512px) else 512@2x
if [[ -f "$SRC_512" ]]; then
  cp "$SRC_512" "$ROOT/public/app-icon.png"
else
  cp "$SRC_1024" "$ROOT/public/app-icon.png"
fi
# favicon-32
if [[ -f "$SRC_32" ]]; then
  cp "$SRC_32" "$ROOT/public/favicon-32.png"
elif [[ -f "$SRC_64" ]]; then
  sips -z 32 32 "$SRC_64" --out "$ROOT/public/favicon-32.png"
else
  sips -z 32 32 "$ROOT/public/app-icon.png" --out "$ROOT/public/favicon-32.png"
fi
# apple-touch 180
sips -z 180 180 "$ROOT/public/app-icon.png" --out "$ROOT/public/apple-touch-icon.png"

# Keep b64 in sync for CI/prebuild
python3 - <<PY
from pathlib import Path
import base64
root = Path("$ROOT")
for name in ["app-icon.png", "favicon-32.png", "apple-touch-icon.png"]:
    data = (root / "public" / name).read_bytes()
    (root / "scripts" / f"{name}.b64").write_text(base64.b64encode(data).decode() + "\n")
    print("b64", name, len(data))
PY

cd "$ROOT"
npm ci
npm run build
[[ -d dist ]] || die "dist missing"

ssh -o BatchMode=yes -o ConnectTimeout=15 vm100 "mkdir -p '$WWW'"
rsync -avz --delete "$ROOT/dist/" "root@vm100:$WWW/"
ssh -o BatchMode=yes vm100 "chown -R techex:techex '$WWW' 2>/dev/null || chown -R www-data:www-data '$WWW' 2>/dev/null || true"

echo "=== smoke ==="
ssh -o BatchMode=yes vm100 'curl -sI -H "Host: srtlovesvlc.com" http://127.0.0.1/app-icon.png | head -15'
curl -sI http://srtlovesvlc.com/app-icon.png | head -15 || true

# Commit if cleanable
cd "$ROOT"
git add public/app-icon.png public/favicon-32.png public/apple-touch-icon.png \
  scripts/app-icon.png.b64 scripts/favicon-32.png.b64 scripts/apple-touch-icon.png.b64 \
  index.html scripts/decode-icons.mjs 2>/dev/null || true
if ! git diff --cached --quiet; then
  git commit -m "Add Xcode AppIcon to marketing site (nav, favicon, apple-touch)"
  git push origin HEAD:main
  echo "Pushed $(git rev-parse HEAD)"
else
  echo "No git changes to commit (or not a checkout)"
fi
