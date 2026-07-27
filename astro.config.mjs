// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // Usado para canonical, Open Graph e sitemap. Trocar aqui se o domínio mudar.
  site: 'https://mjml.com.br',

  // URLs sem barra final, batendo com o canonical e o sitemap. Explícito para
  // que o dev server se comporte igual à produção — o default 'ignore' aceita
  // as duas formas em dev e esconde divergência que só aparece no ar.
  trailingSlash: 'never',

  // API de fontes nativa do Astro: baixa a Inter no BUILD e serve do próprio
  // domínio. O navegador do visitante nunca fala com o Google — o que evita
  // tanto o request extra quanto o problema de LGPD de vazar IP para terceiro.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
    },
  ],
})
