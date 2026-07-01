/* ─── CONFIG ─────────────────────────────────────────────────────── */
/* O site lê os dossiês via a Pages Function /api/dossies, que acessa o
   Airtable no servidor (o token nunca vem ao cliente). Se a API não estiver
   configurada ou não retornar registros, cai no fallback DOSSIES_SEED. */
const BF_API = '/api/dossies';

/* ─── DADOS HARDCODED (fallback antes do Airtable existir) ────────── */
const DOSSIES_SEED = [
  {
    case_number: 18, slug: 'blockbuster', empresa: 'Blockbuster',
    categoria: 'Empresas', ano: 2004,
    tagline: 'Recusou comprar a Netflix por US$ 50 milhões.',
    score_impacto: 9.5, score_custo: 8.0, score_vergonha: 9.5, score_bf: 5.0,
    youtube_id: '', imagem_card: '',
    texto_editorial: [
      'Em 2000, Reed Hastings viajou ao Texas para oferecer a Netflix ao CEO da Blockbuster por US$ 50 milhões. <strong>John Antioco recusou</strong> — e saiu da reunião sem esconder a risada.',
      'Na época, a Blockbuster tinha 60.000 funcionários e 9.000 lojas. A Netflix operava no vermelho com 300.000 assinantes. O negócio parecia absurdo demais para ser levado a sério.',
      'Uma década depois, a Blockbuster pediu falência com US$ 1 bilhão em dívidas. A Netflix valia US$ 13 bilhões. A risada de Antioco entrou para a história como um dos momentos mais caros do capitalismo americano.'
    ],
    quote: '"Este negócio não faz sentido para nós."',
    quote_attr: '— John Antioco, CEO da Blockbuster, 2000',
    amazon_asin: '0525537090', amazon_titulo: 'No Rules Rules', amazon_autor: 'Reed Hastings & Erin Meyer',
    timeline: [
      { ano: 1985, evento: 'Blockbuster fundada em Dallas, Texas' },
      { ano: 1994, evento: 'Vendida à Viacom por US$ 8,4 bilhões' },
      { ano: 2000, evento: 'Recusa oferta de compra da Netflix por US$ 50 mi' },
      { ano: 2007, evento: 'Lança streaming tardio sem modelo claro' },
      { ano: 2010, evento: 'Pede falência com US$ 1 bi em dívidas', tipo: 'fail' },
    ],
    relacionados: ['kodak', 'yahoo', 'nokia'],
    status: 'publicado',
  },
  {
    case_number: 43, slug: 'kodak', empresa: 'Kodak',
    categoria: 'Tecnologia', ano: 1997,
    tagline: 'Inventou a câmera digital. Ignorou a câmera digital.',
    score_impacto: 8.5, score_custo: 7.0, score_vergonha: 9.0, score_bf: 4.8,
    youtube_id: '', imagem_card: '',
    texto_editorial: [
      'Líder mundial em fotografia por décadas, a <strong>Kodak inventou a primeira câmera digital em 1975</strong>. Mas, com medo de canibalizar seu negócio de filmes, decidiu não apostar na tecnologia que ela mesma criou.',
      'Em 1997, a Kodak ainda faturava US$ 16 bilhões por ano com filmes. A receita parecia sólida demais para ser abandonada. Os executivos apostaram no tempo. O tempo não cooperou.',
      'Em 2012, a Kodak pediu falência. A empresa que poderia ter liderado a revolução digital tornou-se o símbolo de como o medo do novo pode destruir até os mais poderosos.'
    ],
    quote: '"Digital technology is neither photography nor relevant."',
    quote_attr: '— Executivo da Kodak, 1981',
    amazon_asin: '0062040421', amazon_titulo: "The Innovator's Dilemma", amazon_autor: 'Clayton M. Christensen',
    timeline: [
      { ano: 1975, evento: 'Inventa a primeira câmera digital do mundo' },
      { ano: 1981, evento: 'Relatório interno: investir no digital — ignorado' },
      { ano: 1991, evento: 'Lança câmera digital comercial sem convicção' },
      { ano: 2004, evento: 'Anuncia saída do mercado analógico' },
      { ano: 2012, evento: 'Pede proteção de falência (Chapter 11)', tipo: 'fail' },
    ],
    relacionados: ['blockbuster', 'nokia', 'yahoo'],
    status: 'publicado',
  },
  {
    case_number: 7, slug: 'nokia', empresa: 'Nokia',
    categoria: 'Tecnologia', ano: 2007,
    tagline: 'Liderava celulares. Ignorou o touchscreen.',
    score_impacto: 8.0, score_custo: 7.5, score_vergonha: 8.5, score_bf: 4.6,
    youtube_id: '', imagem_card: '',
    texto_editorial: [
      'Em 2007, a Nokia controlava <strong>40% do mercado mundial de celulares</strong>. Quando Steve Jobs apresentou o iPhone naquele ano, executivos da Nokia disseram internamente que o produto era "bonito mas impraticável".',
      'O que não viram: o iPhone não era um celular melhor. Era uma plataforma. E a Nokia não tinha plataforma — tinha hardware excelente sem ecossistema de aplicativos.',
      'Em 2013, a Nokia vendeu sua divisão de celulares à Microsoft por US$ 7,2 bilhões — menos de 10% do que valia no auge. A divisão foi extinta dois anos depois.'
    ],
    quote: '"Um iPhone bem-feito não é ameaça para nós."',
    quote_attr: '— Executivo da Nokia, 2007',
    amazon_asin: '0525553369', amazon_titulo: 'Competing in the Age of AI', amazon_autor: 'Marco Iansiti & Karim Lakhani',
    timeline: [
      { ano: 1992, evento: 'Nokia lança o primeiro smartphone da história' },
      { ano: 2003, evento: 'Controla 35% do mercado mundial' },
      { ano: 2007, evento: 'Apple lança o iPhone. Nokia não se preocupa' },
      { ano: 2010, evento: 'Perde liderança para Samsung e Apple' },
      { ano: 2013, evento: 'Vende divisão de celulares à Microsoft por US$ 7,2 bi', tipo: 'fail' },
    ],
    relacionados: ['kodak', 'blackberry', 'yahoo'],
    status: 'publicado',
  },
  {
    case_number: 31, slug: 'theranos', empresa: 'Theranos',
    categoria: 'Tecnologia', ano: 2018,
    tagline: 'Prometeu revolucionar exames de sangue. Era tudo mentira.',
    score_impacto: 7.5, score_custo: 9.0, score_vergonha: 10.0, score_bf: 4.5,
    youtube_id: '', imagem_card: '',
    texto_editorial: [
      '<strong>Elizabeth Holmes fundou a Theranos aos 19 anos</strong> com uma promessa revolucionária: exames de sangue completos com apenas uma gota, baratos e rápidos. Investidores despejaram US$ 700 milhões sem exigir provas.',
      'O problema: a tecnologia não funcionava. A Theranos usava equipamentos convencionais enquanto dizia usar os próprios. Resultados falsos colocaram pacientes em risco real.',
      'Em 2018, Holmes foi indiciada por fraude. Em 2022, condenada a 11 anos de prisão. A Theranos virou sinônimo de "fake it till you make it" levado ao extremo criminoso.'
    ],
    quote: '"Esta tecnologia vai salvar vidas."',
    quote_attr: '— Elizabeth Holmes, 2013',
    amazon_asin: '152473165X', amazon_titulo: 'Bad Blood', amazon_autor: 'John Carreyrou',
    timeline: [
      { ano: 2003, evento: 'Holmes funda a Theranos aos 19 anos' },
      { ano: 2010, evento: 'Valuation atinge US$ 1 bilhão' },
      { ano: 2013, evento: 'Parceria com rede Walgreens' },
      { ano: 2015, evento: 'WSJ publica investigação: tecnologia é fraude' },
      { ano: 2022, evento: 'Holmes condenada a 11 anos de prisão', tipo: 'fail' },
    ],
    relacionados: ['nokia', 'yahoo', 'new-coke'],
    status: 'publicado',
  },
  {
    case_number: 12, slug: 'new-coke', empresa: 'New Coke',
    categoria: 'Produtos', ano: 1985,
    tagline: 'Mudou a fórmula da Coca-Cola. O mundo não perdoou.',
    score_impacto: 6.5, score_custo: 7.0, score_vergonha: 9.5, score_bf: 4.4,
    youtube_id: '', imagem_card: '',
    texto_editorial: [
      'Em abril de 1985, a Coca-Cola fez o impensável: mudou a <strong>fórmula centenária</strong> para um sabor mais doce, batizado de New Coke. Pesquisas mostravam que consumidores preferiam o novo sabor em testes cegos.',
      'O que as pesquisas não mediram: o vínculo emocional com a fórmula original. A reação foi histórica. Consumidores ligaram para a empresa em prantos. Grupos de protestos se formaram. Estoque original virou moeda de troca.',
      'Apenas 79 dias depois, a Coca-Cola anunciou o retorno da fórmula original como "Coca-Cola Classic". O episódio entrou para os livros de marketing como o maior erro de produto do século XX.'
    ],
    quote: '"Não percebemos que estávamos tocando em algo sagrado."',
    quote_attr: '— Roberto Goizueta, CEO da Coca-Cola, 1985',
    amazon_asin: '006256477X', amazon_titulo: 'For God, Country and Coca-Cola', amazon_autor: 'Mark Pendergrast',
    timeline: [
      { ano: 1975, evento: 'Pepsi Challenge: consumidores preferem Pepsi cegos' },
      { ano: 1985, evento: 'Coca-Cola lança New Coke com nova fórmula' },
      { ano: 1985, evento: '79 dias depois: retorno da Coca-Cola Classic', tipo: 'fail' },
      { ano: 1985, evento: 'Classic volta com vendas recordes' },
      { ano: 2002, evento: 'New Coke descontinuada oficialmente' },
    ],
    relacionados: ['theranos', 'blockbuster', 'yahoo'],
    status: 'publicado',
  },
  {
    case_number: 21, slug: 'yahoo', empresa: 'Yahoo!',
    categoria: 'Tecnologia', ano: 1998,
    tagline: 'Recusou comprar o Google por US$ 1 milhão.',
    score_impacto: 9.0, score_custo: 8.5, score_vergonha: 9.0, score_bf: 4.2,
    youtube_id: '', imagem_card: '',
    texto_editorial: [
      'Em 1998, dois estudantes de Stanford — <strong>Larry Page e Sergey Brin</strong> — tentaram vender o Google ao Yahoo por US$ 1 milhão. O Yahoo recusou, considerando caro demais para um mecanismo de busca.',
      'Os anos seguintes foram uma sequência de oportunidades perdidas. Em 2002, o Yahoo tentou comprar o Google por US$ 3 bilhões — o Google queria US$ 5 bilhões. Negócio desfeito. Em 2008, a Microsoft ofereceu US$ 44 bilhões pelo Yahoo. Jerry Yang recusou.',
      'Em 2016, o Yahoo foi vendido à Verizon por US$ 4,5 bilhões — menos de 10% da oferta da Microsoft. O Google hoje vale mais de US$ 2 trilhões.'
    ],
    quote: '"O Google não é estratégico o suficiente para nós."',
    quote_attr: '— Executivo do Yahoo, 2002',
    amazon_asin: '1101902787', amazon_titulo: 'In the Plex', amazon_autor: 'Steven Levy',
    timeline: [
      { ano: 1995, evento: 'Yahoo! fundada por Jerry Yang e David Filo' },
      { ano: 1998, evento: 'Recusa comprar Google por US$ 1 milhão' },
      { ano: 2002, evento: 'Tenta comprar Google por US$ 3 bi — fracassa' },
      { ano: 2008, evento: 'Recusa oferta da Microsoft por US$ 44 bi' },
      { ano: 2016, evento: 'Vendida à Verizon por US$ 4,5 bilhões', tipo: 'fail' },
    ],
    relacionados: ['blockbuster', 'kodak', 'nokia'],
    status: 'publicado',
  },
];

const COLECOES_SEED = [
  {
    slug: 'empresas-que-ignoraram-o-futuro',
    titulo: 'Empresas que ignoraram o futuro',
    descricao: 'Gigantes que subestimaram a revolução digital e pagaram o preço.',
    dossies: ['kodak', 'blockbuster', 'nokia', 'yahoo'],
    destaque: true,
    numero: 1,
    emojis: ['📼', '📷', '📱'],
    categorias: ['Tecnologia', 'Empresas'],
  },
  {
    slug: 'maiores-escandalos-corporativos',
    titulo: 'Os Maiores Escândalos Corporativos',
    descricao: 'Theranos, Enron, WeWork — fraudes bilionárias e mentiras que desmoronaram.',
    dossies: ['theranos'],
    destaque: false,
    numero: 2,
    emojis: ['🩸', '💊', '💣'],
    categorias: ['Tecnologia', 'Empresas'],
  },
  {
    slug: 'marketing-que-deu-errado',
    titulo: 'Marketing que deu muito errado',
    descricao: 'New Coke, Pepsi Kendall, Bud Light — campanhas que viraram catástrofe.',
    dossies: ['new-coke'],
    destaque: false,
    numero: 3,
    emojis: ['🥤', '🎯', '📺'],
    categorias: ['Produtos', 'Marketing'],
  },
  {
    slug: 'unicornios-que-viraram-po',
    titulo: 'Unicórnios que viraram pó',
    descricao: 'WeWork, Quibi, MoviePass — startups bilionárias que colapsaram.',
    dossies: [],
    destaque: false,
    numero: 4,
    emojis: ['🦄', '🏢', '📱'],
    categorias: ['Tecnologia', 'Empresas'],
  },
];

/* ─── UTILITÁRIOS ────────────────────────────────────────────────── */
function catColor(categoria) {
  const map = {
    'Tecnologia': '#FFD400', 'Esportes': '#2AA9FF', 'Empresas': '#FF4B3E',
    'Marketing': '#00C896', 'Produtos': '#FF8C00', 'Política': '#9B59B6',
  };
  return map[categoria] || '#64748B';
}

function catBg(categoria) {
  const map = {
    'Tecnologia': 'linear-gradient(135deg,#1a1500 0%,#3d3200 100%)',
    'Esportes':   'linear-gradient(135deg,#001a2a 0%,#003d5c 100%)',
    'Empresas':   'linear-gradient(135deg,#1a0800 0%,#3d1400 100%)',
    'Marketing':  'linear-gradient(135deg,#001a10 0%,#003d25 100%)',
    'Produtos':   'linear-gradient(135deg,#1a0800 0%,#3d1a00 100%)',
    'Política':   'linear-gradient(135deg,#100018 0%,#250040 100%)',
  };
  return map[categoria] || 'linear-gradient(135deg,#0D1117 0%,#1a2035 100%)';
}

function catEmoji(categoria) {
  const map = {
    'Tecnologia': '💻', 'Esportes': '⚽', 'Empresas': '🏢',
    'Marketing': '📣', 'Produtos': '📦', 'Política': '🗳️',
  };
  return map[categoria] || '⚡';
}

function padCase(n) {
  return '#' + String(n).padStart(3, '0');
}

/* ─── API (Pages Function → Airtable) ────────────────────────────── */
async function apiFetch(query = '') {
  const resp = await fetch(`${BF_API}${query}`);
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  return resp.json();
}

function airtableRecord(r) {
  const f = r.fields;
  const imp = Number(f.score_impacto) || 0;
  const cus = Number(f.score_custo) || 0;
  const ver = Number(f.score_vergonha) || 0;
  // média das 3 sub-scores (escala 0–10) convertida para a escala 0–5 do card
  const score_bf = Math.round(((imp + cus + ver) / 3 / 2) * 10) / 10;

  let timeline = [];
  if (f.timeline) {
    try { timeline = JSON.parse(f.timeline); } catch (e) { timeline = []; }
  }

  return {
    id: r.id,
    case_number: f.case_number,
    slug: f.slug,
    empresa: f.empresa,
    titulo: f.titulo || f.empresa || '',
    canal: f.canal || '',
    categoria: f.categoria,
    ano: f.ano,
    tagline: f.tagline || '',
    score_impacto: imp,
    score_custo: cus,
    score_vergonha: ver,
    score_bf,
    youtube_id: f.youtube_id || '',
    imagem_card: f.imagem_card || '',
    texto_editorial: f.texto_editorial ? f.texto_editorial.split('\n\n') : [],
    quote: f.quote || '',
    quote_attr: f.quote_attr || '',
    timeline: Array.isArray(timeline) ? timeline : [],
    amazon_query: f.amazon_query || '',
    amazon_asin: '', amazon_titulo: '', amazon_autor: '',
    relacionados: [],
    status: 'publicado',
    publicado_em: f.publicado_em || '',
  };
}

/* ─── FUNÇÕES PÚBLICAS ───────────────────────────────────────────── */
function applyFilters(data, filtros = {}) {
  let out = data.slice();
  if (filtros.categoria) out = out.filter(d => d.categoria === filtros.categoria);
  if (filtros.sort === 'score')    out.sort((a, b) => b.score_bf - a.score_bf);
  if (filtros.sort === 'custo')    out.sort((a, b) => b.score_custo - a.score_custo);
  if (filtros.sort === 'vergonha') out.sort((a, b) => b.score_vergonha - a.score_vergonha);
  return out;
}

// cache da lista publicada, para não refazer o fetch a cada seção da página
let _dossiesCache = null;
async function getAllDossies() {
  if (_dossiesCache) return _dossiesCache;
  try {
    const data = await apiFetch('');
    const recs = (data.records || []).map(airtableRecord);
    _dossiesCache = recs.length ? recs : DOSSIES_SEED.filter(d => d.status === 'publicado');
  } catch (e) {
    console.warn('API indisponível, usando dados seed', e);
    _dossiesCache = DOSSIES_SEED.filter(d => d.status === 'publicado');
  }
  return _dossiesCache;
}

async function fetchDossies(filtros = {}) {
  const all = await getAllDossies();
  return applyFilters(all, filtros);
}

async function fetchDossie(slug) {
  try {
    const data = await apiFetch(`?slug=${encodeURIComponent(slug)}`);
    if (data.records && data.records.length) {
      const d = airtableRecord(data.records[0]);
      // relacionados: mesma categoria, top 3, excluindo o próprio
      const all = await getAllDossies();
      d.relacionados = all
        .filter(x => x.categoria === d.categoria && x.slug !== d.slug)
        .slice(0, 3)
        .map(x => x.slug);
      return d;
    }
  } catch (e) {
    console.warn('API indisponível, usando dados seed', e);
  }
  return DOSSIES_SEED.find(d => d.slug === slug) || null;
}

async function fetchColecoes() {
  return COLECOES_SEED;
}

async function fetchColecao(slug) {
  const col = COLECOES_SEED.find(c => c.slug === slug);
  if (!col) return null;
  const all = await fetchDossies();
  col.dossieLista = col.dossies.map(s => all.find(d => d.slug === s)).filter(Boolean);
  return col;
}

async function fetchRankings(filtros = {}) {
  const data = await fetchDossies({ sort: filtros.sort || 'score', categoria: filtros.categoria });
  return data;
}
