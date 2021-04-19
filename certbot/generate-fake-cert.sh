#!/bin/bash
cd /var/lib/docker/volumes/certificates/_data || exit

openssl req -nodes -x509 -newkey rsa:2048 -keyout temp.key -out temp.crt -days 30
cat temp.key temp.crt > shop-lcj.fr.pem
rm temp.crt temp.key
