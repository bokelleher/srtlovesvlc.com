#!/usr/bin/env bash
# Run ON vm100 as root (or via: ssh vm100 'bash -s' < ops/install-nginx.sh)
# Installs nginx site config and enables it. Does not break other vhosts.
set -euo pipefail
CONF_SRC="${1:-/tmp/nginx-srtlovesvlc.com.conf}"
WWW="/var/www/srtlovesvlc.com"
AVAIL="/etc/nginx/sites-available/srtlovesvlc.com"
ENABLED="/etc/nginx/sites-enabled/srtlovesvlc.com"

mkdir -p "$WWW" /var/www/certbot
if [[ ! -f "$WWW/index.html" ]]; then
  echo "<!doctype html><title>srtlovesvlc.com</title><p>Deploy pending</p>" > "$WWW/index.html"
fi

install -m 0644 "$CONF_SRC" "$AVAIL"
ln -sfn "$AVAIL" "$ENABLED"
nginx -t
systemctl reload nginx
echo "nginx site srtlovesvlc.com enabled; nginx -t OK; reloaded"
