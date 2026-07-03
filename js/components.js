/* ─── STARS ──────────────────────────────────────────────────────── */
function renderStars(score) {
  const rounded = Math.round(score);
  const full = '★'.repeat(rounded);
  const empty = '☆'.repeat(5 - rounded);
  return `<span class="stars">${full}<span class="empty">${empty}</span></span>`;
}

/* ─── FAIL CARD ──────────────────────────────────────────────────── */
function renderFailCard(d, options = {}) {
  const color = catColor(d.categoria);
  const bg = d.imagem_card
    ? `background-image:url('${d.imagem_card}');background-size:cover;background-position:center;`
    : `background:${catBg(d.categoria)};`;
  const emoji = d.imagem_card ? '' : `<div class="fc-img-inner">${catEmoji(d.categoria)}</div>`;
  const href = options.colecaoSlug
    ? `/colecoes/?colecao=${options.colecaoSlug}`
    : `/fails/?slug=${d.slug}`;

  return `
    <a class="fail-card" href="${href}">
      <div class="fc-img" style="${bg}">
        ${emoji}
        <div class="fc-overlay"></div>
        <div class="fc-badge" style="background:${color};color:#0A0E17">${padCase(d.case_number)}</div>
      </div>
      <div class="fc-body">
        <div class="fc-name">${d.titulo || d.empresa}</div>
        <div class="fc-meta">${d.categoria} · ${d.ano}</div>
        <div class="fc-stars">${renderStars(d.score_bf)} <span style="font-size:12px;color:#FFD400;font-family:'Bangers',cursive;letter-spacing:1px">${d.score_bf.toFixed(1)}</span></div>
      </div>
    </a>`;
}

/* ─── RANK ITEM ──────────────────────────────────────────────────── */
function renderRankItem(d, rank) {
  const color = catColor(d.categoria);
  const bg = d.imagem_card
    ? `background-image:url('${d.imagem_card}');background-size:cover;background-position:center;`
    : `background:${catBg(d.categoria)};`;
  const numClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
  const isTop = rank <= 2 ? 'rank-top' : '';
  const emoji = catEmoji(d.categoria);

  return `
    <a class="rank-item ${isTop}" href="/fails/?slug=${d.slug}">
      <div class="ri-num ${numClass}">${rank}</div>
      <div class="ri-thumb" style="${bg}">
        ${d.imagem_card ? '' : `<div class="ri-thumb-inner"><span style="font-size:${isTop?'32':'26'}px">${emoji}</span><span class="label">${d.empresa.toUpperCase()}</span></div>`}
        <div class="ri-thumb-fade"></div>
      </div>
      <div class="ri-info">
        <div class="ri-case">DOSSIÊ ${padCase(d.case_number)}</div>
        <div class="ri-name">${d.titulo || d.empresa}</div>
        <div class="ri-tag">${d.tagline}</div>
      </div>
      <div class="ri-right">
        <span class="ri-cat badge badge-cat" data-cat="${d.categoria}" style="background:${color}22;color:${color};border-color:${color}55">${d.categoria} · ${d.ano}</span>
        <div class="ri-score">${renderStars(d.score_bf)} <span class="score-num">${d.score_bf.toFixed(1)}</span></div>
      </div>
    </a>`;
}

/* ─── SCORE BAR ──────────────────────────────────────────────────── */
function renderScoreBar(label, value, color) {
  const pct = (value / 10) * 100;
  return `
    <div class="score-row">
      <div class="score-lbl">
        <span>${label}</span>
        <span class="score-val">${value.toFixed(1)}</span>
      </div>
      <div class="score-track">
        <div class="score-fill" style="width:${pct}%;background:${color}"></div>
      </div>
    </div>`;
}

/* ─── TIMELINE ───────────────────────────────────────────────────── */
function renderTimeline(eventos) {
  return eventos.map((e, i) => {
    const isLast = i === eventos.length - 1;
    const dotClass = e.tipo === 'fail' ? 'fail' : '';
    return `
      <div class="tl-item">
        <div class="tl-date">${e.ano}</div>
        <div class="tl-dot-row">
          <div class="tl-dot ${dotClass}"></div>
          ${isLast ? '' : '<div class="tl-line"></div>'}
        </div>
        <div class="tl-text">${e.evento}</div>
      </div>`;
  }).join('');
}

/* ─── AMAZON WIDGET ──────────────────────────────────────────────── */
function renderAmazonWidget(d) {
  const TAG = 'betafails-20';
  // Seed: livro específico via ASIN (com título/autor).
  // Gerado: link de busca por tema (amazon_query) — sem risco de ASIN inválido.
  let url, titulo, autor;
  if (d.amazon_asin) {
    url = `https://www.amazon.com.br/dp/${d.amazon_asin}?tag=${TAG}`;
    titulo = d.amazon_titulo || 'Leitura relacionada';
    autor = d.amazon_autor || '';
  } else if (d.amazon_query) {
    url = `https://www.amazon.com.br/s?k=${encodeURIComponent(d.amazon_query)}&tag=${TAG}`;
    titulo = 'Livros sobre este tema';
    autor = d.amazon_query;
  } else {
    return '';
  }
  return `
    <div class="aside-box">
      <div class="aside-title">Leitura relacionada</div>
      <div class="amazon-card">
        <div class="amazon-cover">📚</div>
        <div class="amazon-info">
          <div class="amazon-book-title">${titulo}</div>
          <div class="amazon-author">${autor}</div>
          <a href="${url}" target="_blank" rel="noopener" class="amazon-btn">Ver na Amazon ↗</a>
        </div>
      </div>
    </div>`;
}

/* ─── COLECAO CARD ───────────────────────────────────────────────── */
function renderColecaoCard(col, dossiesMap) {
  const colors = col.categorias.map(c => catColor(c));
  const bandSegs = colors.map(c => `<div class="colecao-band-seg" style="background:${c}"></div>`).join('');
  const cats = col.categorias.length ? col.categorias : ['Tecnologia'];
  const previews = col.dossieLista || [];
  const thumbs = [0, 1, 2].map(i => {
    const d = previews[i];
    if (d && d.imagem_card) return `<div class="colecao-thumb" style="background-image:url('${d.imagem_card}');background-size:cover;background-position:center"></div>`;
    const cat = cats[i % cats.length];
    return `<div class="colecao-thumb" style="background:${catBg(cat)}">${catEmoji(cat)}</div>`;
  }).join('');

  return `
    <a class="colecao-card" href="/colecoes/?colecao=${col.slug}">
      <div class="colecao-thumbs">${thumbs}</div>
      <div class="colecao-band">${bandSegs}</div>
      <div class="colecao-body">
        <div class="colecao-num">COLEÇÃO ${padCase(col.numero)}</div>
        <div class="colecao-title">${col.titulo}</div>
        <div class="colecao-desc">${col.descricao}</div>
        <div class="colecao-foot">
          <span class="colecao-count">${col.count != null ? col.count : col.dossies.length} dossiês</span>
          <span class="colecao-cta">Ver →</span>
        </div>
      </div>
    </a>`;
}

/* ─── FEATURED COLECAO ───────────────────────────────────────────── */
function renderFeaturedColecao(col) {
  const cats = col.categorias.length ? col.categorias : ['Tecnologia'];
  const previews = col.dossieLista || [];
  const thumbs = [0, 1, 2].map(i => {
    const d = previews[i];
    if (d && d.imagem_card) return `<div class="thumb-mini" style="background-image:url('${d.imagem_card}');background-size:cover;background-position:center"></div>`;
    const cat = cats[i % cats.length];
    return `<div class="thumb-mini" style="background:${catBg(cat)}">${catEmoji(cat)}</div>`;
  }).join('');

  const catBadges = col.categorias.map(c => `<span class="badge" style="background:${catColor(c)}22;color:${catColor(c)};border:1px solid ${catColor(c)}44;font-size:10px;padding:2px 8px;border-radius:3px">${c}</span>`).join('');

  return `
    <a class="featured-col" href="/colecoes/?colecao=${col.slug}">
      <div class="featured-col-left">
        <div>
          <div class="featured-col-badge">★ EM DESTAQUE</div>
          <div class="featured-col-title">${col.titulo}</div>
          <div class="featured-col-desc">${col.descricao}</div>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <span style="font-size:12px;color:#FFD400;font-weight:500">● ${col.count != null ? col.count : col.dossies.length} dossiês</span>
            ${catBadges}
          </div>
          <span class="btn btn-outline" style="font-size:12px;padding:7px 16px">Ver coleção →</span>
        </div>
      </div>
      <div class="featured-col-right">
        <div class="thumb-stack">${thumbs}</div>
      </div>
    </a>`;
}

/* ─── BREADCRUMB ─────────────────────────────────────────────────── */
function renderBreadcrumb(items) {
  const parts = items.map((item, i) => {
    if (i === items.length - 1) return `<span class="current">${item.label}</span>`;
    return `<a href="${item.href}">${item.label}</a>`;
  });
  return `<nav class="breadcrumb">${parts.join('<span class="sep">›</span>')}</nav>`;
}

/* ─── BADGES META ────────────────────────────────────────────────── */
function renderMetaBadges(d) {
  const color = catColor(d.categoria);
  return `
    <span class="badge badge-cat" data-cat="${d.categoria}" style="border-color:${color}44;color:${color}">${d.categoria}</span>
    <span class="badge badge-year">${d.ano}</span>
    <span class="badge badge-fail">FAIL</span>
    <span class="badge badge-type">Histórico</span>`;
}

/* ─── LOADING / ERRO ─────────────────────────────────────────────── */
function renderLoading() {
  return `<div class="loading"><div class="spinner"></div> Carregando...</div>`;
}

function renderEmpty(msg = 'Nenhum dossiê encontrado.') {
  return `<div class="empty-state"><h3>Hmm.</h3><p>${msg}</p></div>`;
}
