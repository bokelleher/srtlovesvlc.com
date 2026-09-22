#!/usr/bin/env bash
# Deploy static build to vm100 (or any DEST).
# From a machine that can SSH to vm100 (e.g. Bo's Mac):
#   npm run build
#   ./ops/deploy.sh root@vm100:/var/www/srtlovesvlc.com
# Or:
#   DEST=root@vm100:/var/www/srtlovesvlc.com ./ops/deploy.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
DEST="${1:-${DEST:-}}"
if [[ -z "$DEST" ]]; then
  echo "Set DEST e.g. root@vm100:/var/www/srtlovesvlc.com" >&2
  exit 1
fi
if [[ ! -d "$DIST" ]]; then
  echo "Build first: npm run build" >&2
  exit 1
fi
# Keep the server-only fulfillment path. Legal pages now ship from public/ with every build.
rsync -avz --delete \
  --exclude 'downloads/' \
  "$DIST/" "$DEST/"
echo "Deployed $DIST -> $DEST"
