#!/bin/bash
if [ -f /etc/letsencrypt/live/shop-lcj.fr/fullchain.pem -a -f /etc/letsencrypt/live/shop-lcj.fr/privkey.pem ]; then
  cat /etc/letsencrypt/live/shop-lcj.fr/fullchain.pem /etc/letsencrypt/live/shop-lcj.fr/privkey.pem > /etc/certificates/shop-lcj.fr.pem
fi
