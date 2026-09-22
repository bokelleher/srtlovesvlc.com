# Deploy srtlovesvlc.com to vm100

Public IP shared with `broadcastmcr.com` / `mcr.techexlab.com`: **208.86.66.74** (A only; no AAAA today).

## Route53 (required before TLS)

| Name | Type | Value |
|------|------|-------|
| `srtlovesvlc.com` | A | `208.86.66.74` |
| `www.srtlovesvlc.com` | A | `208.86.66.74` |
| *(optional)* `www.srtlovesvlc.com` | CNAME | `srtlovesvlc.com` instead of a second A |

No AAAA unless/until the host publishes IPv6 for the sibling sites.

NS for the zone must already be the Route53-assigned nameservers for the registered domain.

## From Mac (machineId `1e4e5183-6182-4cbd-8728-345e6a55e424`)

```bash
# 1) Ensure build artifacts exist (or clone + npm ci && npm run build)
# 2) Create docroot + push files
ssh -o BatchMode=yes vm100 'mkdir -p /var/www/srtlovesvlc.com /var/www/certbot'
rsync -avz --delete ./dist/ root@vm100:/var/www/srtlovesvlc.com/

# 3) Install nginx site (copy conf first)
scp -o BatchMode=yes ops/nginx-srtlovesvlc.com.conf vm100:/tmp/nginx-srtlovesvlc.com.conf
ssh -o BatchMode=yes vm100 'bash -s' < ops/install-nginx.sh

# 4) Smoke test (before public DNS)
ssh -o BatchMode=yes vm100 'curl -sI -H "Host: srtlovesvlc.com" http://127.0.0.1/ | head -20'

# 5) After Route53 A records propagate:
ssh -o BatchMode=yes vm100 'certbot --nginx -d srtlovesvlc.com -d www.srtlovesvlc.com --non-interactive --agree-tos -m YOUR@EMAIL --redirect'
```

Do **not** run certbot until DNS A records resolve to 208.86.66.74.
