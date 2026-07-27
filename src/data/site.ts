/**
 * Fonte única de verdade do conteúdo do site.
 *
 * Editar aqui muda o site inteiro — header, footer, páginas de produto,
 * sitemap e dados estruturados. Nenhum texto institucional deve ser digitado
 * direto num componente.
 *
 * ⚠️ ANTES DE PUBLICAR: preencher `whatsapp`, `email` e `telefoneExibicao`.
 */

export const empresa = {
  marca: 'MJML',
  razaoSocial: 'JEL Consultoria e Desenvolvimento',
  cnpj: '50.486.136/0001-21',
  slogan: 'Tecnologia que faz sua empresa vender mais e trabalhar melhor.',
  descricao:
    'Desenvolvemos sistemas, sites e automações sob medida para pequenas e médias empresas.',
  dominio: 'mjml.com.br',
  url: 'https://mjml.com.br',

  // TODO: trocar pelo número real, formato internacional só com dígitos.
  whatsapp: '5500000000000',
  telefoneExibicao: '(00) 00000-0000',
  email: 'contato@mjml.com.br',

  // Endpoint do formulário de contato (Web3Forms, Formspree ou similar).
  // Vazio = a página de contato mostra só WhatsApp e e-mail, sem formulário.
  formEndpoint: '',

  cidade: 'Brasil',
  redes: {
    instagram: '',
    linkedin: '',
  },
} as const

export const whatsappLink = (
  mensagem = 'Olá! Vim pelo site e gostaria de saber mais sobre as soluções da MJML.',
) => `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(mensagem)}`

/* ─────────────────────────── Produtos ─────────────────────────── */

export type Produto = {
  id: string
  nome: string
  tagline: string
  descricao: string
  bullets: string[]
  icone: string
  url: string | null
  disponivel: boolean
  paraQuem: string
  /** Só nos produtos disponíveis: alimenta a landing em /{id}. */
  landing?: {
    /** A dor, na linguagem do cliente. Abre a página. */
    problema: string
    /** Três passos concretos, do cadastro ao resultado. */
    passos: { titulo: string; texto: string }[]
  }
}

export const produtos: Produto[] = [
  {
    id: 'atende',
    nome: 'Atende',
    tagline: 'Automação de atendimento no WhatsApp',
    descricao:
      'Uma inteligência artificial atende, responde dúvidas e qualifica clientes no seu WhatsApp 24 horas por dia — inclusive quando sua equipe já foi embora.',
    bullets: [
      'Responde na hora, todo dia, a qualquer hora',
      'Entende o cliente e responde no contexto do seu negócio',
      'Passa para um humano quando a conversa exige',
      'Histórico completo de cada conversa',
    ],
    icone: 'chat',
    url: 'https://app.atende.mjml.com.br',
    disponivel: true,
    paraQuem: 'Negócios que perdem venda por demorar a responder no WhatsApp.',
    landing: {
      problema:
        'Cliente que não é respondido em minutos procura o concorrente. Só que ninguém consegue ficar no WhatsApp o dia inteiro — e à noite, no fim de semana e no horário de almoço a conversa simplesmente morre.',
      passos: [
        {
          titulo: 'Conectamos o seu número',
          texto:
            'O Atende passa a atender no WhatsApp que seus clientes já conhecem. Você não troca de número nem avisa ninguém.',
        },
        {
          titulo: 'Ensinamos o seu negócio à IA',
          texto:
            'Serviços, preços, horários, endereço, regras. A IA responde com a sua informação, não com invenção.',
        },
        {
          titulo: 'Você assume quando quiser',
          texto:
            'A conversa fica visível em tempo real. Quando o assunto exige gente, sua equipe entra e a IA sai do caminho.',
        },
      ],
    },
  },
  {
    id: 'agenda',
    nome: 'Agenda',
    tagline: 'Agendamento online automático',
    descricao:
      'Seu cliente escolhe o horário sozinho, pelo celular, sem ligação e sem troca de mensagem. Você para de perder horário e de remarcar por telefone.',
    bullets: [
      'Página de agendamento com seu nome e sua marca',
      'Lembrete automático que reduz falta',
      'Agenda por profissional, serviço e horário',
      'Cliente remarca sozinho, sem te procurar',
    ],
    icone: 'calendar',
    url: 'https://agenda.mjml.com.br',
    disponivel: true,
    paraQuem: 'Clínicas, salões, barbearias, consultórios e prestadores de serviço.',
    landing: {
      problema:
        'Marcar horário por telefone e WhatsApp consome o dia da recepção, gera agenda furada e ainda deixa o cliente esperando resposta para saber se tem vaga na quinta.',
      passos: [
        {
          titulo: 'Montamos a sua agenda',
          texto:
            'Serviços, duração, profissionais e horário de funcionamento. Sua página fica no ar com o nome do seu negócio.',
        },
        {
          titulo: 'O cliente marca sozinho',
          texto:
            'Ele abre o link, vê o que está livre de verdade e escolhe. Sem ligação, sem espera e sem risco de marcar em cima de outro.',
        },
        {
          titulo: 'O lembrete faz o resto',
          texto:
            'Aviso automático antes do horário. Quem não pode ir, remarca sozinho — e a vaga volta para a agenda em vez de virar prejuízo.',
        },
      ],
    },
  },
  {
    id: 'aluga',
    nome: 'Aluga',
    tagline: 'Aluguel de itens online',
    descricao:
      'Catálogo, reserva por período, contrato e devolução — tudo em um lugar só, sem planilha e sem caderno.',
    bullets: [
      'Catálogo com disponibilidade em tempo real',
      'Reserva por período com cálculo automático',
      'Controle de devolução e atraso',
    ],
    icone: 'box',
    url: null,
    disponivel: false,
    paraQuem: 'Locadoras de equipamento, festa, ferramenta e material de construção.',
  },
  {
    id: 'delivery',
    nome: 'Delivery',
    tagline: 'Pedidos e pagamento online',
    descricao:
      'Cardápio digital, pedido pelo celular e pagamento online. Sem comissão de aplicativo mordendo sua margem.',
    bullets: [
      'Cardápio digital que você mesmo edita',
      'Pedido direto, sem comissão de marketplace',
      'Pagamento online integrado',
    ],
    icone: 'bag',
    url: null,
    disponivel: false,
    paraQuem: 'Restaurantes, lanchonetes, pizzarias e food service.',
  },
  {
    id: 'loja',
    nome: 'Loja',
    tagline: 'E-commerce completo',
    descricao:
      'Sua loja virtual com catálogo, carrinho, frete e pagamento — pronta para vender sem depender de marketplace.',
    bullets: [
      'Catálogo com variação, estoque e preço',
      'Pagamento e frete integrados',
      'Painel de pedidos e clientes',
    ],
    icone: 'cart',
    url: null,
    disponivel: false,
    paraQuem: 'Lojas que querem vender direto, sem intermediário.',
  },
]

export const produtosDisponiveis = produtos.filter((p) => p.disponivel)

/* ─────────────────────────── Serviços ─────────────────────────── */

export const servicos = [
  {
    titulo: 'Sites e lojas virtuais',
    descricao:
      'Site institucional, catálogo de produtos ou loja completa com pagamento online. Rápido, no celular e encontrável no Google.',
    itens: ['Site institucional', 'Site catálogo', 'Loja virtual', 'Landing pages'],
    icone: 'globe',
  },
  {
    titulo: 'Sistemas sob medida',
    descricao:
      'Quando nenhum sistema de prateleira serve, desenvolvemos o seu — do jeito que sua operação funciona de verdade.',
    itens: ['Sistemas de gestão', 'Portais e áreas do cliente', 'Aplicativos', 'Dashboards'],
    icone: 'code',
  },
  {
    titulo: 'Inteligência artificial e automação',
    descricao:
      'Tarefa repetitiva não precisa de gente. Automatizamos atendimento, triagem e processos com IA aplicada ao seu negócio.',
    itens: ['Agentes de IA', 'Automação de WhatsApp', 'Automação de processos', 'Chatbots'],
    icone: 'spark',
  },
  {
    titulo: 'Integrações e APIs',
    descricao:
      'Fazemos seus sistemas conversarem entre si — ERP, e-commerce, meio de pagamento, planilha e o que mais existir.',
    itens: ['Integração entre sistemas', 'APIs', 'Migração de dados', 'Consultoria técnica'],
    icone: 'plug',
  },
]

/* ─────────────────────────── Como funciona ─────────────────────────── */

export const etapas = [
  {
    numero: '01',
    titulo: 'Conversa',
    descricao:
      'Uma conversa de 30 minutos para entender seu processo e o problema real. Sem custo e sem compromisso.',
  },
  {
    numero: '02',
    titulo: 'Proposta',
    descricao:
      'Escopo, prazo e preço por escrito, antes de começar. Você sabe exatamente o que vai receber e quanto vai pagar.',
  },
  {
    numero: '03',
    titulo: 'Desenvolvimento',
    descricao:
      'Entregas parciais para você acompanhar e opinar durante o caminho — não só no final, quando mudar sai caro.',
  },
  {
    numero: '04',
    titulo: 'Entrega e suporte',
    descricao:
      'Publicação, treinamento da equipe e suporte continuado. Você não fica sozinho depois que o sistema entra no ar.',
  },
]

/* ─────────────────────────── Público ─────────────────────────── */

export const publico = [
  'Clínicas e consultórios',
  'Salões e barbearias',
  'Escritórios de advocacia',
  'Contabilidades',
  'Restaurantes e delivery',
  'Autopeças',
  'Imobiliárias',
  'Revendas de veículos',
  'Lojas e comércio',
  'Prestadores de serviço',
]

/* ─────────────────────────── FAQ ─────────────────────────── */

export const faq = [
  {
    pergunta: 'Quanto custa?',
    resposta:
      'Depende do que você precisa. Os produtos prontos (Atende e Agenda) funcionam por mensalidade e começam baixo, porque a estrutura é compartilhada. Projetos sob medida são orçados por escopo. Em qualquer caso, o preço vai por escrito antes de começar — nunca há cobrança surpresa.',
  },
  {
    pergunta: 'Quanto tempo leva para ficar pronto?',
    resposta:
      'Os produtos prontos entram no ar em poucos dias, porque só precisam de configuração. Um site institucional leva de duas a quatro semanas. Sistemas sob medida dependem do escopo, e o prazo é definido na proposta.',
  },
  {
    pergunta: 'O sistema fica sendo meu?',
    resposta:
      'Em projetos sob medida, sim: o código é seu e você recebe tudo ao final. Nos produtos por assinatura (Atende, Agenda e os próximos), você usa a plataforma e os seus dados continuam sendo seus — pode exportá-los quando quiser.',
  },
  {
    pergunta: 'Vocês também hospedam?',
    resposta:
      'Sim. Cuidamos de servidor, domínio, certificado de segurança, backup e monitoramento. Você não precisa entender nada de infraestrutura para ter um sistema no ar com segurança.',
  },
  {
    pergunta: 'Atendem fora da minha cidade?',
    resposta:
      'Atendemos todo o Brasil. Reuniões por vídeo, entregas remotas e suporte por WhatsApp. Distância não muda prazo nem preço.',
  },
  {
    pergunta: 'Preciso já saber exatamente o que quero?',
    resposta:
      'Não. A maior parte dos clientes chega com um problema, não com uma especificação. A primeira conversa serve justamente para transformar o problema em escopo.',
  },
]
