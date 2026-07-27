# mjml-site — site institucional da MJML

Site estático da **MJML** (nome fantasia da JEL Consultoria e Desenvolvimento),
publicado na raiz de `mjml.com.br`. É o **primeiro deploy** do plano de Fase 1
(`../PLANO-DEPLOY-FASE1.md`, §6): valida DNS → Traefik → Let's Encrypt → container
antes de os SaaS entrarem.

**Stack:** Astro 7 · CSS puro · nginx alpine · GHCR · Coolify

---

## ⚠️ Antes de publicar

Editar `src/data/site.ts` — é a fonte única de verdade do conteúdo:

| Campo | Estado | O que fazer |
|---|---|---|
| `whatsapp` | `5500000000000` | Número real, formato internacional, só dígitos |
| `telefoneExibicao` | `(00) 00000-0000` | Como aparece para o visitante |
| `email` | `contato@mjml.com.br` | Confirmar que a caixa existe (MX no §4.3 do plano) |
| `formEndpoint` | vazio | Opcional. Vazio = página de contato mostra só WhatsApp e e-mail |
| `redes.instagram` / `linkedin` | vazio | Preencher quando os perfis existirem |

Também pendente: **`public/og.png` é a arte quadrada de 1024×1024** que veio das
logos. O formato certo para link em rede social é **1200×630** — trocar quando
houver a peça. Não bloqueia o deploy; só deixa a prévia do link menos bonita.

---

## Comandos

```bash
npm install
npm run dev            # http://localhost:4321
npx astro dev --background   # sobe em segundo plano (astro dev stop|status|logs)
npm run build          # gera ./dist
npm run preview        # serve o build local
npx astro check        # typecheck dos .astro e .ts
```

---

## Estrutura

```
src/
├── data/site.ts            # TODO o conteúdo: empresa, produtos, serviços, FAQ
├── styles/global.css       # tokens de design e base
├── layouts/Base.astro      # <head>, SEO, JSON-LD, header e footer
├── components/             # Logo, Header, Footer, Icon
└── pages/
    ├── index.astro         # home
    ├── [produto].astro     # /atende e /agenda — geradas de site.ts
    ├── contato.astro
    ├── politica-de-privacidade.astro
    ├── 404.astro
    └── sitemap.xml.ts

Dockerfile                  # build Node → runtime nginx alpine
nginx.conf                  # rotas, cache, gzip, redirect www → apex
security-headers.conf       # CSP e afins, incluído por cada location
docker-compose.coolify.yml  # recurso do Coolify
DEPLOY-COOLIFY.md           # passo a passo do deploy
```

**As páginas de produto são geradas a partir de `site.ts`.** Quando Aluga,
Delivery ou Loja saírem do "em breve", basta virar `disponivel: true` e
preencher `landing` — a rota, o card da home, o rodapé e o sitemap se atualizam
sozinhos.

---

## Decisões de projeto

**CSS puro, sem Tailwind.** São seis páginas. Tailwind traria uma dependência a
mais, configuração de PostCSS e acoplamento de versão (o v4 mudou a integração
com Astro) para gerar o que cabe em um arquivo de tokens. O Astro já dá escopo
automático ao `<style>` de cada componente.

**API de fontes nativa do Astro.** A Inter é baixada **no build** e servida pelo
próprio domínio. O navegador do visitante nunca fala com o Google — o que evita
o request extra e o problema de LGPD de vazar IP para terceiro. O Astro ainda
gera métricas de fallback, o que elimina o salto de layout no carregamento.

**Sitemap à mão, sem `@astrojs/sitemap`.** São seis URLs geradas do mesmo
`site.ts` que gera as rotas — não há como sair de sincronia.

**Sem `backdrop-filter` no header.** Um blur em elemento sticky do tamanho da
viewport força o compositor a refazer o desfoque a cada frame de scroll. Trava
em celular fraco, que é o aparelho do público deste site.

**Zero JavaScript de terceiro.** Sem analytics, sem pixel, sem cookie de
rastreamento — daí a política de privacidade poder ser honesta e a CSP do nginx
poder ser restritiva. Ao adicionar Google Analytics ou pixel de anúncio, é
preciso mexer em **três** lugares: `nginx.conf` (CSP), a política de privacidade
e, provavelmente, um aviso de cookies.

---

## Deploy no Coolify

**Passo a passo completo em [`DEPLOY-COOLIFY.md`](./DEPLOY-COOLIFY.md)**, com
checklist de verificação, rollback e tabela de erros comuns.

Repositório: <https://github.com/JoseDuDev/mjmlsite>

Resumo: push em `main` → GitHub Actions roda `astro check`, builda e publica em
`ghcr.io/josedudev/mjmlsite:latest` → webhook avisa o Coolify → deploy.

> O build precisa de **rede** para baixar as fontes. Funciona no GitHub Actions;
> se um dia buildar em ambiente isolado, é isso que vai falhar.

---

## Verificado

**No código:**
- Build limpo: 7 rotas geradas · `astro check`: 0 erros
- Home com 89,5 KB (HTML + CSS + fonte) e **zero arquivos JS** — o script do
  menu é inlinado no HTML pelo Astro
- Renderização em desktop (1536px) das 6 páginas
- Acordeão do FAQ e menu mobile (`aria-expanded` e `data-open` alternando)
- Inter servida do próprio domínio, com métricas de fallback (sem salto de layout)

**No container, com a imagem Docker rodando de verdade:**
- `nginx -t` válido
- Todas as rotas em **200**, `/nao-existe` em **404** (e não 200 com página de erro)
- `www.mjml.com.br/atende` → **301** para `https://mjml.com.br/atende`, preservando o caminho
- Páginas com CSP, `X-Frame-Options`, nosniff, `Referrer-Policy`, `Permissions-Policy`
- Assets com hash em `public, max-age=31536000, immutable`; HTML em `no-cache`
- gzip ativo

### Três defeitos encontrados nesse teste e corrigidos

1. **Todas as páginas devolviam 301 em vez de 200.** O `try_files $uri/` fazia o
   nginx redirecionar para acrescentar a barra final — um round-trip extra em
   toda navegação, caro a 200 ms de latência. Resolvido com `$uri/index.html`
   antes de `$uri/`.
2. **O HTML saía sem política de cache.** O bloco `location ~* \.html$` nunca
   casava, porque as páginas são servidas como `/contato`, sem extensão. Um
   deploy podia demorar a aparecer para quem já tinha visitado.
3. **Os headers de segurança sumiam.** No nginx, um `add_header` dentro de um
   `location` descarta todos os herdados do `server` — silenciosamente. Daí o
   `security-headers.conf` reincluído em cada bloco.

## Não verificado

**A renderização em largura de celular.** A janela do navegador de teste estava
maximizada e ignorou os comandos de redimensionamento (`innerWidth` travado em
1536), então o layout mobile foi construído mas **não foi visto**. A estrutura é
à prova de estouro por construção — grids em `minmax(min(100%, X), 1fr)`,
tipografia em `clamp()`, `overflow: hidden` nos blocos com elemento decorativo
sangrando — e o menu mobile foi testado por JS. Mas **abra no celular antes de
divulgar o link**.

**Não verificado:** a renderização em largura de celular. A janela do navegador
de teste estava maximizada e ignorou os comandos de redimensionamento, então o
layout mobile foi construído mas **não foi visto**. A estrutura é à prova de
estouro por construção — grids em `minmax(min(100%, X), 1fr)`, tipografia em
`clamp()`, `overflow: hidden` nos dois blocos com elemento decorativo sangrando —
mas **abra no celular antes de divulgar o link**.
