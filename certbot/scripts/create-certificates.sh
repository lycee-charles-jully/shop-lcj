#!/bin/bash
# Request certificates
certbot certonly --standalone \
  --non-interactive --agree-tos --email lcjoff@gmail.com --http-01-port=380 \
  --cert-name shop-lcj.fr \
  -d shop-lcj.fr -d www.shop-lcj.fr
# Concatenate certificates
. /etc/scripts/concatenate-certificates.sh
# Update certificates in HAProxy
. /etc/scripts/update-haproxy-certificates.sh
