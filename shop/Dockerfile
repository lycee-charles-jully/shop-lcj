FROM node:14.16.1-alpine3.13

WORKDIR /usr/src/app/

COPY --chown=node:node package.json .

RUN npm set progress=false \
    && npm config set depth 0 \
    && npm install --no-package-lock \
    && npm cache clean --force

COPY --chown=node:node . .

ENV NODE_ENV production
ENV VITE_LOCAL_API_URL http://api:5000
ENV VITE_REMOTE_API_URL https://api.shop-lcj.fr

RUN npm run build

USER node
CMD npm run start -- --host
