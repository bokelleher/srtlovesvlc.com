#!/usr/bin/env bash
# Run on Bo's Mac (has ssh Host vm100). Expects this repo checked out with dist/ built,
# OR pass DIST_TGZ path to a prebuilt tarball.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST_TGZ="${1:-}"
WWW="/var/www/srtlovesvlc.com"

ssh -o BatchMode=yes -o ConnectTimeout=15 vm100 "mkdir -p '$WWW' /var/www/certbot /tmp/srtlovesvlc-upload"

if [[ -n "$DIST_TGZ" && -f "$DIST_TGZ" ]]; then
  scp -o BatchMode=yes "$DIST_TGZ" vm100:/tmp/srtlovesvlc-dist.tgz
  ssh -o BatchMode=yes vm100 "rm -rf '$WWW'/* && tar -xzf /tmp/srtlovesvlc-dist.tgz -C '$WWW' && chown -R www-data:www-data '$WWW' 2>/dev/null || true"
elif [[ -d "$ROOT/dist" ]]; then
  rsync -avz --delete "$ROOT/dist/" "root@vm100:$WWW/"
else
  echo "Need dist/ or a dist tarball path" >&2
  exit 1
fi

scp -o BatchMode=yes "$ROOT/ops/nginx-srtlovesvlc.com.conf" vm100:/tmp/nginx-srtlovesvlc.com.conf
ssh -o BatchMode=yes vm100 'bash -s' < "$ROOT/ops/install-nginx.sh"

echo "=== smoke (Host header) ==="
ssh -o BatchMode=yes vm100 'curl -sI -H "Host: srtlovesvlc.com" http://127.0.0.1/ | head -20'
ssh -o BatchMode=yes vm100 'curl -s -H "Host: srtlovesvlc.com" http://127.0.0.1/ | head -c 400; echo'
ssh -o BatchMode=yes vm100 'nginx -t; ls -la /etc/nginx/sites-enabled/srtlovesvlc.com /var/www/srtlovesvlc.com | head'

echo
echo "DNS: srtlovesvlc.com is NXDOMAIN as of build time. Add Route53:"
echo "  A    srtlovesvlc.com      -> 208.86.66.74"
echo "  A    www.srtlovesvlc.com  -> 208.86.66.74"
echo "Then: certbot --nginx -d srtlovesvlc.com -d www.srtlovesvlc.com"
