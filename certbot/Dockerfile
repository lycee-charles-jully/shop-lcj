FROM certbot/certbot
# Install socat
RUN apk update && apk add socat
# Copy scripts
COPY ./scripts/ /etc/scripts/
