# syntax=docker/dockerfile:1

FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx astro check && npx astro build

FROM nginxinc/nginx-unprivileged:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# Hors de conf.d/ : nginx y charge automatiquement tout *.conf.
COPY docker/security-headers.conf /etc/nginx/security-headers.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
