import type { APIRoute } from 'astro'
import { empresa, produtosDisponiveis } from '../data/site'

/**
 * Sitemap escrito à mão em vez de @astrojs/sitemap.
 *
 * São seis URLs. Uma integração aqui adicionaria uma dependência e um
 * acoplamento de versão para gerar o que cabe em 20 linhas — e as páginas de
 * produto já vêm do mesmo `site.ts` que gera as rotas, então não há risco de
 * o sitemap sair de sincronia com o site.
 */
export const GET: APIRoute = () => {
  const rotas: { caminho: string; prioridade: string }[] = [
    { caminho: '/', prioridade: '1.0' },
    ...produtosDisponiveis.map((p) => ({ caminho: `/${p.id}`, prioridade: '0.9' })),
    { caminho: '/contato', prioridade: '0.8' },
    { caminho: '/politica-de-privacidade', prioridade: '0.3' },
  ]

  const urls = rotas
    .map(
      ({ caminho, prioridade }) => `  <url>
    <loc>${empresa.url}${caminho === '/' ? '/' : caminho}</loc>
    <changefreq>monthly</changefreq>
    <priority>${prioridade}</priority>
  </url>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
