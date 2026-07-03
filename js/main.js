/* ─── NAV ATIVA ──────────────────────────────────────────────────── */
function setActiveNav() {
  const path = location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', path.startsWith(a.getAttribute('href')) && a.getAttribute('href') !== '/');
    if (a.getAttribute('href') === '/' && path === '/') a.classList.add('active');
  });
}

/* ─── TABS ───────────────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.tabs').dataset.group || 'default';
      document.querySelectorAll(`.tab[data-group="${group}"], .tabs:not([data-group]) .tab`).forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => {
        if (c.dataset.tab && tab.dataset.target === c.dataset.tab) {
          c.classList.add('active');
        } else if (c.dataset.tab) {
          c.classList.remove('active');
        }
      });
      tab.classList.add('active');
    });
  });
}

/* ─── FILTROS ────────────────────────────────────────────────────── */
function initFilters(onFilterChange) {
  document.querySelectorAll('.pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.dataset.filterGroup || 'cat';
      document.querySelectorAll(`.pill[data-filter-group="${group}"]`).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filters = {};
      document.querySelectorAll('.pill.active[data-filter]').forEach(p => {
        const g = p.dataset.filterGroup || 'categoria';
        filters[g] = p.dataset.filter === 'all' ? null : p.dataset.filter;
      });
      onFilterChange(filters);
    });
  });
}

/* ─── HOME ───────────────────────────────────────────────────────── */
async function initHome() {
  const dossies = await fetchDossies({ sort: 'score' });
  const hero = dossies[0];
  const grid = dossies.slice(1, 7);

  // Hero
  const heroEl = document.getElementById('home-hero');
  if (heroEl && hero) {
    const color = catColor(hero.categoria);
    const bgStyle = hero.imagem_card
      ? `background-image:url('${hero.imagem_card}');background-size:cover;background-position:center;`
      : `background:${catBg(hero.categoria)};`;
    heroEl.innerHTML = `
      <div class="home-hero-right" style="${bgStyle}">
        ${hero.imagem_card ? '' : `<span class="hero-emoji">${catEmoji(hero.categoria)}</span>`}
      </div>
      <div class="home-hero-left">
        <div class="hero-case-tag">DOSSIÊ ${padCase(hero.case_number)}</div>
        <div class="hero-title">${(hero.titulo || hero.empresa).toUpperCase()}</div>
        <div class="hero-tagline">${hero.tagline}</div>
        <div class="hero-meta">${renderMetaBadges(hero)}</div>
        <div class="hero-rating">
          <span class="hero-rating-label">Popularidade</span>
          ${renderStars(hero.score_bf)}
          <span class="score-num">${hero.score_bf.toFixed(1)}</span>
        </div>
        <div class="hero-actions">
          <a href="/fails/?slug=${hero.slug}" class="btn btn-outline">VER DOSSIÊ →</a>
          <button class="btn hero-fav" title="Favoritar">☆</button>
        </div>
      </div>`;
  }

  // Grid de fails
  const gridEl = document.getElementById('fails-grid');
  if (gridEl) {
    gridEl.innerHTML = grid.map(d => renderFailCard(d)).join('');
  }

  // Coleções
  const colecoes = await fetchColecoes();
  const featEl = document.getElementById('colecao-destaque');
  if (featEl && colecoes[0]) {
    featEl.innerHTML = renderFeaturedColecao(colecoes[0]);
  }
  const colGridEl = document.getElementById('colecoes-grid');
  if (colGridEl) {
    colGridEl.innerHTML = colecoes.slice(1, 3).map(c => renderColecaoCard(c)).join('');
  }
}

/* ─── ARQUIVO / DOSSIÊ INDIVIDUAL ───────────────────────────────── */
async function initFails() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const content = document.getElementById('fails-content');
  if (!content) return;

  if (slug) {
    await renderDossiePage(slug, content);
  } else {
    await renderArchivePage(content);
  }
}

async function renderArchivePage(container) {
  document.title = 'Arquivo de Fails | Beta Fails';
  container.innerHTML = `
    <div class="page-hero">
      <div class="page-hero-label">Arquivo</div>
      <h1>TODOS OS DOSSIÊS</h1>
      <p>Cada fail documentado, arquivado e analisado. Filtre por categoria ou score.</p>
    </div>
    <div class="filter-bar">
      <span class="filter-bar-label">Filtrar:</span>
      <button class="pill active" data-filter="all" data-filter-group="categoria">Todos</button>
      <button class="pill" data-filter="Tecnologia" data-filter-group="categoria">Tecnologia</button>
      <button class="pill" data-filter="Empresas" data-filter-group="categoria">Empresas</button>
      <button class="pill" data-filter="Esportes" data-filter-group="categoria">Esportes</button>
      <button class="pill" data-filter="Marketing" data-filter-group="categoria">Marketing</button>
      <button class="pill" data-filter="Produtos" data-filter-group="categoria">Produtos</button>
      <div class="filter-sep"></div>
      <button class="pill active" data-filter="score" data-filter-group="sort">Por Score</button>
      <button class="pill" data-filter="vergonha" data-filter-group="sort">Por Vergonha</button>
      <button class="pill" data-filter="custo" data-filter-group="sort">Por Custo</button>
    </div>
    <div class="section">
      <div id="archive-grid" class="grid-3">${renderLoading()}</div>
    </div>`;

  let filtros = { sort: 'score' };
  const reload = async (f) => {
    Object.assign(filtros, f);
    document.getElementById('archive-grid').innerHTML = renderLoading();
    const data = await fetchDossies(filtros);
    document.getElementById('archive-grid').innerHTML = data.length
      ? data.map(d => renderFailCard(d)).join('')
      : renderEmpty('Nenhum fail nesta categoria ainda.');
  };
  initFilters(reload);
  await reload({});
}

async function renderDossiePage(slug, container) {
  container.innerHTML = renderLoading();
  const d = await fetchDossie(slug);
  if (!d) {
    container.innerHTML = renderEmpty('Dossiê não encontrado.');
    return;
  }

  document.title = `${d.empresa} — DOSSIÊ ${padCase(d.case_number)} | Beta Fails`;
  bfTrack('view_dossie', { empresa: d.empresa, slug: d.slug, categoria: d.categoria });

  const color = catColor(d.categoria);
  const ytEmbed = d.youtube_id
    ? `<div class="yt-embed"><iframe src="https://www.youtube.com/embed/${d.youtube_id}" allowfullscreen></iframe></div>`
    : `<div class="yt-embed"><div class="yt-play-btn">▶</div><div class="yt-label">Vídeo do dossiê — em breve</div></div>`;

  const textos = Array.isArray(d.texto_editorial)
    ? d.texto_editorial.map(p => `<p class="editorial-text">${p}</p>`).join('')
    : `<p class="editorial-text">${d.texto_editorial}</p>`;

  const timelineHTML = d.timeline && d.timeline.length
    ? `<div class="timeline-section">
        <h2 style="font-size:20px;margin-bottom:16px">Linha do Tempo</h2>
        <div class="timeline">${renderTimeline(d.timeline)}</div>
       </div>` : '';

  const relacionadosAll = await fetchDossies();
  const rels = (d.relacionados || []).map(s => relacionadosAll.find(x => x.slug === s)).filter(Boolean);
  const relsHTML = rels.length ? `
    <div class="related-section">
      <h2 style="font-size:20px;margin-bottom:14px">Dossiês Relacionados</h2>
      <div class="grid-3">${rels.map(r => renderFailCard(r)).join('')}</div>
    </div>` : '';

  container.innerHTML = `
    ${renderBreadcrumb([
      { label: 'Início', href: '/' },
      { label: 'Dossiês', href: '/fails/' },
      { label: d.categoria, href: `/fails/?cat=${d.categoria}` },
      { label: d.empresa }
    ])}
    <div class="dossie-hero">
      <div class="dossie-case-row">
        <div class="hero-case-tag" style="background:${color};color:#0A0E17">DOSSIÊ ${padCase(d.case_number)}</div>
        <button class="fav-btn">☆ Favoritar</button>
      </div>
      <div class="dossie-title">${(d.titulo || d.empresa).toUpperCase()}</div>
      <div class="dossie-tagline">${d.tagline}</div>
      <div class="dossie-meta">${renderMetaBadges(d)}</div>
      <div class="dossie-rating">
        ${renderStars(d.score_bf)}
        <span class="score-num">${d.score_bf.toFixed(1)}</span>
        <span style="font-size:12px;color:#475569;margin-left:4px">(Score BF)</span>
      </div>
    </div>

    <div class="dossie-body">
      <div class="dossie-main">
        ${ytEmbed}
        ${textos}
      </div>
      <div class="dossie-side">
        ${d.quote ? `
          <div class="aside-box">
            <div class="aside-title">Resumo do Caso</div>
            <div class="aside-quote">${d.quote}</div>
            <div class="aside-attr">${d.quote_attr}</div>
          </div>` : ''}
        <div class="aside-box">
          <div class="aside-title">Fail Index</div>
          <div class="score-list">
            ${renderScoreBar('Impacto', d.score_impacto, '#FF4B3E')}
            ${renderScoreBar('Custo', d.score_custo, '#FFD400')}
            ${renderScoreBar('Vergonha', d.score_vergonha, '#2AA9FF')}
          </div>
          <div class="score-total">
            <div class="score-total-lbl">Score BF</div>
            <div class="score-total-val">${renderStars(d.score_bf)} ${d.score_bf.toFixed(1)}</div>
          </div>
        </div>
        ${renderAmazonWidget(d)}
      </div>
    </div>

    ${timelineHTML}
    ${relsHTML}`;
}

/* ─── COLEÇÕES ───────────────────────────────────────────────────── */
async function initColecoes() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('colecao');
  const content = document.getElementById('colecoes-content');
  if (!content) return;

  if (slug) {
    await renderColecaoPage(slug, content);
  } else {
    await renderColecaoListing(content);
  }
}

async function renderColecaoListing(container) {
  document.title = 'Coleções | Beta Fails';
  const colecoes = await fetchColecoes();
  const destaque = colecoes.find(c => c.destaque);
  const resto = colecoes.filter(c => !c.destaque);

  container.innerHTML = `
    <div class="page-hero">
      <div class="page-hero-label">Curadoria editorial</div>
      <h1>COLEÇÕES</h1>
      <p>Fails agrupados por tema, época ou padrão de erro. Cada coleção é uma tese.</p>
    </div>
    <div class="section">
      ${destaque ? renderFeaturedColecao(destaque) : ''}
      <div class="section-head">
        <div class="section-title">Todas as Coleções</div>
        <span class="section-count">${colecoes.length} coleções</span>
      </div>
      <div class="grid-2">${resto.map(c => renderColecaoCard(c)).join('')}</div>
    </div>`;
}

async function renderColecaoPage(slug, container) {
  container.innerHTML = renderLoading();
  const col = await fetchColecao(slug);
  if (!col) { container.innerHTML = renderEmpty('Coleção não encontrada.'); return; }

  document.title = `${col.titulo} | Beta Fails`;
  const categorias = col.categorias || [];
  const catBadges = categorias.map(c => `<span class="badge" style="background:${catColor(c)}22;color:${catColor(c)};border:1px solid ${catColor(c)}44">${c}</span>`).join(' ');

  container.innerHTML = `
    ${renderBreadcrumb([{ label: 'Início', href: '/' }, { label: 'Coleções', href: '/colecoes/' }, { label: col.titulo }])}
    <div class="col-hero">
      <div class="col-hero-bg"></div>
      <div class="col-hero-watermark">${col.titulo.split(' ').slice(0,3).join('\n')}</div>
      <div class="col-hero-fade"></div>
      <div class="col-hero-content">
        <div class="col-hero-label">Coleção</div>
        <h1>${col.titulo.toUpperCase()}</h1>
        <div class="col-hero-sub">${col.descricao}</div>
        <div class="col-hero-meta">
          <span class="col-hero-count">${col.dossieLista.length} dossiês</span>
          ${catBadges}
        </div>
      </div>
    </div>
    <div class="section">
      <div class="grid-3">${col.dossieLista.map(d => renderFailCard(d)).join('')}</div>
      ${col.dossieLista.length > 6 ? `<div style="margin-top:16px"><a href="#" class="btn btn-red" style="width:100%;justify-content:center">VER TODOS OS DOSSIÊS DA COLEÇÃO →</a></div>` : ''}
    </div>
    <div class="newsletter-cta" style="margin-top:0">
      <h2>TEM UMA HISTÓRIA DE FAIL QUE AINDA NÃO CONTAMOS?</h2>
      <p>Sugira um caso para o Beta Fails investigar.</p>
      <a href="/sobre/" class="btn btn-yellow">Sugira um caso →</a>
    </div>`;
}

/* ─── RANKINGS ───────────────────────────────────────────────────── */
async function initRankings() {
  const content = document.getElementById('rankings-content');
  if (!content) return;

  content.innerHTML = `
    <div class="page-hero">
      <div class="page-hero-label">Hall of Fails</div>
      <h1>RANKINGS</h1>
      <p>Os maiores, mais caros e mais vergonhosos erros — ordenados pelo Fail Index BF.</p>
    </div>
    <div class="filter-bar">
      <span class="filter-bar-label">Filtrar:</span>
      <button class="pill active" data-filter="all" data-filter-group="categoria">Geral</button>
      <button class="pill" data-filter="Tecnologia" data-filter-group="categoria">Tecnologia</button>
      <button class="pill" data-filter="Empresas" data-filter-group="categoria">Empresas</button>
      <button class="pill" data-filter="Esportes" data-filter-group="categoria">Esportes</button>
      <div class="filter-sep"></div>
      <button class="pill active" data-filter="score" data-filter-group="sort">Score BF</button>
      <button class="pill" data-filter="custo" data-filter-group="sort">Por Custo</button>
      <button class="pill" data-filter="vergonha" data-filter-group="sort">Por Vergonha</button>
    </div>
    <div class="section">
      <div class="section-head">
        <div class="section-title">TOP FAILS</div>
        <span id="rank-count" class="section-count"></span>
      </div>
      <div id="rank-list">${renderLoading()}</div>
    </div>`;

  let filtros = { sort: 'score' };
  const reload = async (f) => {
    Object.assign(filtros, f);
    document.getElementById('rank-list').innerHTML = renderLoading();
    const data = await fetchRankings(filtros);
    document.getElementById('rank-count').textContent = `${data.length} dossiês · ${filtros.sort === 'vergonha' ? 'Por Vergonha' : filtros.sort === 'custo' ? 'Por Custo' : 'Score BF'}`;
    document.getElementById('rank-list').innerHTML = data.length
      ? data.map((d, i) => renderRankItem(d, i + 1)).join('')
      : renderEmpty('Nenhum fail encontrado.');
  };
  initFilters(reload);
  await reload({});
}

/* ─── LOJA ───────────────────────────────────────────────────────── */
async function initLoja() {
  const content = document.getElementById('loja-content');
  if (!content) return;

  const dossies = await fetchDossies({ sort: 'score' });
  const TAG = 'betafails-20';
  const produtos = dossies.filter(d => d.amazon_asin || d.amazon_query);

  content.innerHTML = `
    <div class="page-hero">
      <div class="page-hero-label">Vitrine curada</div>
      <h1>LOJA</h1>
      <p>Livros e leituras sobre os maiores fails da história. Comissão de afiliado revertida para o canal.</p>
    </div>
    <div class="section">
      <div class="section-head">
        <div class="section-title">LIVROS RECOMENDADOS</div>
        <span class="section-count">${produtos.length} indicações · Amazon Associados</span>
      </div>
      ${produtos.length ? `<div class="grid-3">
        ${produtos.map(d => {
          const isAsin = !!d.amazon_asin;
          const url = isAsin
            ? `https://www.amazon.com.br/dp/${d.amazon_asin}?tag=${TAG}`
            : `https://www.amazon.com.br/s?k=${encodeURIComponent(d.amazon_query)}&tag=${TAG}`;
          const titulo = isAsin ? (d.amazon_titulo || 'Leitura relacionada') : `Livros sobre ${d.empresa}`;
          const sub = isAsin ? (d.amazon_autor || '') : d.amazon_query;
          return `
          <a class="produto-card" href="${url}" target="_blank" rel="noopener">
            <div class="produto-img">📚</div>
            <div class="produto-body">
              <div class="produto-title">${titulo}</div>
              <div class="produto-author">${sub}</div>
              <div style="font-size:11px;color:#64748B;margin-bottom:10px">Indicado no dossiê ${d.empresa}</div>
              <div class="produto-foot">
                <span class="produto-comissao">Afiliado Amazon</span>
                <span class="produto-btn">Ver →</span>
              </div>
            </div>
          </a>`;
        }).join('')}
      </div>` : renderEmpty('A estante está sendo montada.')}
      <div class="amazon-disclosure" style="text-align:center;margin-top:22px">Como Associado da Amazon, o Beta Fails ganha com compras qualificadas.</div>
    </div>`;
}

/* ─── SOBRE ──────────────────────────────────────────────────────── */
function initSobre() {
  const content = document.getElementById('sobre-content');
  if (!content) return;
  content.innerHTML = `
    <div class="page-hero">
      <div class="page-hero-label">O projeto</div>
      <h1>SOBRE O BETA FAILS</h1>
    </div>
    <div class="section">
      <div class="sobre-block">
        <h2>O que é o Beta Fails?</h2>
        <p>Beta Fails é um canal de vídeo e site editorial dedicado a documentar, analisar e arquivar os maiores erros corporativos e históricos da humanidade.</p>
        <p>Cada fail é tratado como um dossiê: contexto histórico, análise de erro, impacto e lições. O objetivo não é zombar — é aprender com quem errou feio.</p>
      </div>
      <div class="sobre-block">
        <h2>Canal YouTube</h2>
        <p>Vídeos semanais sobre fails históricos, com narração, imagens e análise editorial.</p>
        <div class="social-links">
          <a href="https://youtube.com/@betafails" target="_blank" rel="noopener" class="social-link">▶ YouTube</a>
          <a href="https://instagram.com/betafails" target="_blank" rel="noopener" class="social-link">📷 Instagram</a>
          <a href="https://www.tiktok.com/@betafails" target="_blank" rel="noopener" class="social-link">♪ TikTok</a>
        </div>
      </div>
      <div class="sobre-block">
        <h2>Sugira um caso</h2>
        <p>Conhece um fail histórico que ainda não documentamos? Manda a sugestão.</p>
        <a href="mailto:ericpell@terra.com.br?subject=Sugestão de Fail" class="btn btn-yellow" style="width:fit-content">Sugerir fail →</a>
      </div>
    </div>`;
}

/* ─── BUSCA ──────────────────────────────────────────────────────── */
let _searchEl = null;
async function openSearch() {
  if (!_searchEl) {
    _searchEl = document.createElement('div');
    _searchEl.className = 'search-overlay';
    _searchEl.innerHTML = `
      <div class="search-box" onclick="event.stopPropagation()">
        <input type="text" class="search-input" placeholder="Buscar empresa, tema ou categoria…" autocomplete="off">
        <div class="search-results"></div>
        <div class="search-hint">Esc para fechar</div>
      </div>`;
    document.body.appendChild(_searchEl);
    const input = _searchEl.querySelector('.search-input');
    const results = _searchEl.querySelector('.search-results');
    const all = await getAllDossies();
    const render = (q) => {
      const term = q.trim().toLowerCase();
      if (!term) { results.innerHTML = '<div class="search-empty">Digite para buscar…</div>'; return; }
      const hits = all.filter(d =>
        (d.titulo || '').toLowerCase().includes(term) ||
        (d.empresa || '').toLowerCase().includes(term) ||
        (d.tagline || '').toLowerCase().includes(term) ||
        (d.categoria || '').toLowerCase().includes(term)
      ).slice(0, 8);
      results.innerHTML = hits.length
        ? hits.map(d => `<a class="search-hit" href="/fails/?slug=${d.slug}"><span class="sh-name">${d.titulo || d.empresa}</span><span class="sh-meta">${d.categoria} · ${d.ano}</span></a>`).join('')
        : '<div class="search-empty">Nenhum fail encontrado.</div>';
    };
    input.addEventListener('input', () => render(input.value));
    _searchEl.addEventListener('click', closeSearch);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
    render('');
  }
  _searchEl.classList.add('open');
  setTimeout(() => { const i = _searchEl.querySelector('.search-input'); if (i) i.focus(); }, 50);
}
function closeSearch() { if (_searchEl) _searchEl.classList.remove('open'); }

function goNewsletter() {
  const el = document.getElementById('newsletter');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  else location.href = '/#newsletter';
}

/* ─── NEWSLETTER (captura) ───────────────────────────────────────── */
function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = (input && input.value || '').trim();
      if (!email || !email.includes('@')) return;
      const btn = form.querySelector('button');
      const original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
      try {
        await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      } catch (err) { /* backend ainda pode não existir; não bloquear o feedback */ }
      form.innerHTML = '<div class="newsletter-ok">✓ Prontinho! Você está na lista. 🎉</div>';
    });
  });
}

/* ─── ANALYTICS (GA4) ────────────────────────────────────────────── */
function bfTrack(name, params) {
  if (typeof gtag === 'function') gtag('event', name, params || {});
}

function initConsent() {
  const c = localStorage.getItem('bf_consent');
  if (c === 'granted') { if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
  if (c === 'denied') return;
  const b = document.createElement('div');
  b.className = 'consent-banner';
  b.innerHTML = `
    <span class="consent-txt">🍪 Usamos cookies pra entender qual fail bomba mais. Tranquilo com isso?</span>
    <div class="consent-actions">
      <button class="consent-ok">Aceitar</button>
      <button class="consent-no">Agora não</button>
    </div>`;
  document.body.appendChild(b);
  b.querySelector('.consent-ok').onclick = () => { localStorage.setItem('bf_consent', 'granted'); if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'granted' }); b.remove(); };
  b.querySelector('.consent-no').onclick = () => { localStorage.setItem('bf_consent', 'denied'); b.remove(); };
}

function initTracking() {
  document.addEventListener('click', (e) => {
    const yt = e.target.closest('.yt-embed');
    if (yt) { const t = document.querySelector('.dossie-title'); bfTrack('play_video', { dossie: t ? t.textContent.trim() : '' }); return; }
    const az = e.target.closest('a[href*="amazon."]');
    if (az) { bfTrack('click_amazon', { url: az.href }); return; }
    const hit = e.target.closest('.search-hit');
    if (hit) { bfTrack('search_click', { url: hit.getAttribute('href') }); }
  });
}

/* ─── ROUTER ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  document.querySelectorAll('.js-year').forEach(e => e.textContent = new Date().getFullYear());
  initNewsletterForms();
  initConsent();
  initTracking();
  const path = location.pathname;

  if (path === '/' || path === '/index.html') initHome();
  else if (path.startsWith('/fails')) initFails();
  else if (path.startsWith('/colecoes')) initColecoes();
  else if (path.startsWith('/rankings')) initRankings();
  else if (path.startsWith('/loja')) initLoja();
  else if (path.startsWith('/sobre')) initSobre();
});
