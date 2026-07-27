# Deploy do site no Coolify — passo a passo

Primeiro deploy da plataforma. Serve de teste da cadeia inteira — DNS → Traefik →
Let's Encrypt → container — antes de o AGENDA e o ATENDE entrarem. Se o cadeado
aparecer aqui, os SaaS sobem sem surpresa.

Pré-requisito: Etapas 1 a 3 do `../PLANO-DEPLOY-FASE1.md` concluídas (VPS criada,
`fase1-setup.sh` rodado, Coolify no ar em `painel.mjml.com.br`).

> Os nomes de menu do Coolify podem variar entre versões. O que precisa ser
> verdade ao final está na checklist do passo 8 — se a UI estiver diferente,
> use-a como referência.

---

## 1. Publicar no GitHub — ✅ repositório local pronto

Repositório: <https://github.com/JoseDuDev/mjmlsite> (público)

O `git init`, os dois commits e o `git remote add origin` **já estão feitos**.
Falta só o push, que precisa da sua autenticação no GitHub:

```powershell
cd C:\Projects\jel\mjml-site
git push -u origin main
```

Na primeira vez o Git Credential Manager abre uma janela pedindo login. Depois
disso ele guarda a credencial e os pushes seguintes são diretos.

O push em `main` dispara `.github/workflows/deploy.yml`: roda `astro check`,
builda a imagem e publica em `ghcr.io/josedudev/mjmlsite:latest`.

> Se o workflow falhar com erro de permissão ao publicar o pacote, habilite em
> **Settings → Actions → General → Workflow permissions** a opção
> **Read and write permissions**.

Confirme em **GitHub → seu perfil → Packages** que o pacote apareceu.

### Visibilidade do pacote

O repositório é público, mas **o pacote do GHCR nasce privado mesmo assim**.
Depois do primeiro build, vá em **GitHub → seu perfil → Packages → mjmlsite →
Package settings → Change visibility → Public**.

Vale a pena porque:

- O plano Free dá só **500 MB** para pacotes privados. Com Atendefy e Horafy no
  mesmo lugar, isso estoura rápido.
- A imagem **não contém segredo nenhum** — é HTML estático mais nginx. Todas as
  variáveis entram em runtime pelo Coolify.
- Pacote público dispensa cadastrar credencial de registry no Coolify (passo 3).

Se preferir mantê-lo privado, gere um PAT clássico com escopo `read:packages` e
cadastre em **Coolify → Settings → Docker Registries**.

---

## 2. DNS na Cloudflare

| Nome | Tipo | Valor | Proxy |
|---|---|---|---|
| `@` | A | IP da VPS | 🔘 **DNS-only** |
| `www` | A | IP da VPS | 🔘 **DNS-only** |

> ⚠️ **Nuvem cinza obrigatória neste momento.** O Traefik emite o certificado por
> desafio HTTP-01, que precisa alcançar a VPS direto. Com o proxy da Cloudflare na
> frente, a emissão falha. Só ligue a nuvem laranja depois do passo 8.

`www` como registro A (e não CNAME para o apex) porque o Traefik precisa de
roteamento próprio para esse host emitir o certificado dele. O redirecionamento
para o apex é feito pelo nginx dentro do container.

Confirme a propagação antes de seguir:

```bash
dig +short mjml.com.br
dig +short www.mjml.com.br
# os dois devem devolver o IP da VPS
```

---

## 3. Criar o recurso no Coolify

**Project** → `MJML` → **Environment** `production` → **+ New Resource**

Duas formas. A primeira é a mais simples; a segunda mantém a configuração
versionada no repositório, igual ao Atendefy e ao Horafy.

### Opção A — Docker Image (mais direto)

| Campo | Valor |
|---|---|
| Tipo | **Docker Image** |
| Image | `ghcr.io/josedudev/mjmlsite:latest` (tudo minúsculo) |
| Ports Exposes | `80` |
| Ports Mappings | *(vazio — o Traefik alcança pela rede interna)* |

### Opção B — Docker Compose (versionada)

| Campo | Valor |
|---|---|
| Tipo | **Docker Compose** → *Public Repository* |
| Repositório | `https://github.com/JoseDuDev/mjmlsite` |
| Branch | `main` |
| Compose file | `docker-compose.coolify.yml` |

Variáveis de ambiente (aba **Environment Variables**):

```
GITHUB_REPOSITORY=josedudev/mjmlsite
IMAGE_TAG=latest
```

> ⚠️ **`josedudev` em minúsculo, não `JoseDuDev`.** O GHCR rejeita maiúscula no
> nome do pacote. O CI normaliza sozinho na hora do push (`${GITHUB_REPOSITORY,,}`),
> mas aqui é digitado à mão — é o erro mais fácil de cometer neste passo.

---

## 4. Domínios

Na aba do serviço, campo **Domains**:

```
https://mjml.com.br
https://www.mjml.com.br
```

Os dois com `https://`. O Coolify gera as labels do Traefik e pede o certificado
ao Let's Encrypt. Os dois hosts precisam estar aqui: sem o `www` cadastrado, ele
não ganha certificado e o visitante que digitar `www.mjml.com.br` vê erro de
segurança **antes** de o redirect acontecer.

Não configure redirect na UI — o nginx do container já devolve 301 de `www` para
o apex (ver `nginx.conf`).

---

## 5. Deploy

Botão **Deploy**. Acompanhe os logs.

A primeira subida leva ~1 min: puxar a imagem e emitir dois certificados. Se o
certificado demorar, é quase sempre DNS ainda propagando ou nuvem laranja ligada.

---

## 6. Deploy automático a cada push

1. No recurso: **Webhooks** → copie a URL de **Deploy**
2. **Coolify → Keys & Tokens → API tokens** → gere um token
3. No GitHub: **Settings → Secrets and variables → Actions → New secret**

```
COOLIFY_WEBHOOK = <a URL do passo 1>
COOLIFY_TOKEN   = <o token do passo 2>
```

Sem esses dois secrets, o passo de deploy do workflow é **pulado sem falhar o
job** — o que permite publicar a imagem antes de o Coolify existir.

---

## 7. Ligar a nuvem laranja

**Só depois do cadeado funcionando nos dois endereços.**

Na Cloudflare, mude `@` e `www` para 🟠 **Proxied**, e em **SSL/TLS → Overview**
escolha **Full (strict)**.

Este é o único lugar da plataforma onde a nuvem laranja pode ser ligada com
segurança agora: apex e `www` são cobertos pelo Universal SSL grátis. Os hosts
dos SaaS são de 4º nível e ficam descobertos (§4.1 do plano).

Ganho real: o site institucional é o que mais recebe visita fria, e passa a ser
servido pelo edge da Cloudflare em São Paulo — o que compensa boa parte dos
200 ms da VPS em Falkenstein.

> **Nunca use SSL/TLS em modo "Flexible".** Ele fala HTTP com a sua origem, o
> que quebra o redirect do nginx e cria loop de redirecionamento.

---

## 8. Checklist de verificação

```bash
# 1. Apex responde 200 com cadeado válido
curl -sI https://mjml.com.br | head -1

# 2. www devolve 301 para o apex
curl -sI https://www.mjml.com.br | grep -iE 'HTTP/|location'
#    esperado: HTTP/2 301  +  location: https://mjml.com.br/

# 3. As páginas existem
for p in atende agenda contato politica-de-privacidade; do
  echo -n "/$p → "; curl -so /dev/null -w '%{http_code}\n' https://mjml.com.br/$p
done

# 4. Sitemap e robots
curl -s https://mjml.com.br/sitemap.xml | head -3
curl -s https://mjml.com.br/robots.txt

# 5. 404 responde 404 de verdade (e não 200 com página de erro)
curl -so /dev/null -w '%{http_code}\n' https://mjml.com.br/pagina-que-nao-existe

# 6. Cabeçalhos de segurança
curl -sI https://mjml.com.br | grep -iE 'content-security|x-frame|x-content|referrer'

# 7. Assets com hash são cacheados para sempre
curl -sI https://mjml.com.br/_astro/$(curl -s https://mjml.com.br | grep -o '_astro/[^"]*\.css' | head -1 | cut -d/ -f2) | grep -i cache-control
#    esperado: public, immutable
```

No navegador, confirmar também:

- [ ] Cadeado válido, sem aviso de conteúdo misto
- [ ] Fonte Inter carregando (título em peso 800, não serifado)
- [ ] Menu mobile abrindo e fechando **no celular de verdade** — é o que ficou
      sem verificação na construção
- [ ] Acordeão do FAQ abrindo
- [ ] Botões de WhatsApp abrindo a conversa no número certo

---

## Rollback

O CI marca cada imagem com o SHA do commit. Para voltar uma versão:

- **Opção A:** troque a Image para `ghcr.io/josedudev/mjmlsite:<sha-anterior>` → Deploy
- **Opção B:** troque `IMAGE_TAG` de `latest` para o SHA anterior → Redeploy

Volta em segundos, sem rebuild, sem git.

---

## Se der errado

| Sintoma | Causa provável |
|---|---|
| Certificado não emite | Nuvem laranja ligada cedo demais, ou DNS não propagado. Volte para cinza, aguarde o `dig` responder o IP certo e redeploy |
| `www` dá erro de certificado | Não foi cadastrado no campo **Domains** do passo 4 — o redirect do nginx só roda *depois* do TLS |
| Loop de redirecionamento | SSL/TLS da Cloudflare em **Flexible**. Mude para **Full (strict)** |
| 404 em todas as páginas | Ports Exposes diferente de `80`, ou a imagem não subiu. Confira os logs do container |
| `manifest unknown` no pull | `JoseDuDev` com maiúscula em vez de `josedudev`, ou pacote ainda privado sem credencial de registry cadastrada |
| Deploy não dispara no push | `COOLIFY_WEBHOOK` ou `COOLIFY_TOKEN` ausente — o passo é pulado de propósito, veja o log do job |
| Container reiniciando | Erro de sintaxe no `nginx.conf`. `docker logs <container>` mostra a linha exata |
