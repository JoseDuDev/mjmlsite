# ── Build ────────────────────────────────────────────────────────────────────
# O build precisa de REDE: a API de fontes do Astro baixa a Inter do provedor
# e grava os .woff2 em dist/_astro/fonts. Sem rede, o build falha.
FROM node:22-alpine AS build

WORKDIR /app

# Camada de dependências separada: só reinstala quando o lockfile muda.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runtime ──────────────────────────────────────────────────────────────────
# nginx alpine servindo HTML estático: ~15 MB de RAM, sem Node em produção.
FROM nginx:1.27-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Incluído por cada bloco `location` do nginx.conf — ver o comentário no arquivo.
COPY security-headers.conf /etc/nginx/security-headers.conf

# O Traefik do Coolify alcança este container pela rede interna; a porta não é
# publicada no host.
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
