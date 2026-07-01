/**
 * Cloudflare Pages Function — /api/dossies
 *
 * Lê a tabela DOSSIÊS do Airtable no servidor (token nunca vai ao cliente).
 * Env vars do projeto Pages:
 *   AIRTABLE_TOKEN  — Personal Access Token (idealmente read-only escopado à base)
 *   AIRTABLE_BASE   — ex.: appRJMQSDUrA8544U
 *   AIRTABLE_TABLE  — opcional, default "DOSSIÊS"
 *
 * Query params:
 *   ?slug=kodak     → retorna 1 dossiê publicado com esse slug
 *   (sem params)    → retorna todos os dossiês publicados
 *
 * Resposta: { records: [...] } no formato cru do Airtable — o cliente mapeia.
 * Se não configurado ou erro, responde { records: [] } com 200 para o site
 * cair no fallback de dados seed sem quebrar.
 */

function esc(v) {
  // escapa aspas para uso dentro de filterByFormula do Airtable
  return String(v).replace(/"/g, '\\"');
}

function jsonResponse(obj, status = 200, cacheSeconds = 60) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${cacheSeconds}`,
    },
  });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const token = env.AIRTABLE_TOKEN;
  const base = env.AIRTABLE_BASE;
  const table = env.AIRTABLE_TABLE || 'DOSSIÊS';

  // Sem credenciais → cliente usa dados seed
  if (!token || !base) {
    return jsonResponse({ records: [], _note: 'not_configured' }, 200, 30);
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  // Canal do site: só mostra dossiês deste canal. Default BF PT.
  // O site BF EN futuro reusa a mesma Function com SITE_CANAL="BF EN".
  const canal = env.SITE_CANAL || 'BF PT';

  const formula = slug
    ? `AND(status="Publicado",canal="${esc(canal)}",slug="${esc(slug)}")`
    : `AND(status="Publicado",canal="${esc(canal)}")`;

  const endpoint = `https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`;

  try {
    // pagina o Airtable (100 por página) até esgotar
    const records = [];
    let offset = null;
    do {
      const params = new URLSearchParams();
      params.set('filterByFormula', formula);
      params.set('pageSize', '100');
      if (slug) params.set('maxRecords', '1');
      if (offset) params.set('offset', offset);

      const resp = await fetch(`${endpoint}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        // erro upstream → deixa o cliente cair no seed
        return jsonResponse({ records: [], _error: `airtable_${resp.status}` }, 200, 15);
      }
      const data = await resp.json();
      for (const r of data.records || []) records.push(r);
      offset = slug ? null : data.offset || null;
    } while (offset);

    return jsonResponse({ records }, 200, 60);
  } catch (e) {
    return jsonResponse({ records: [], _error: 'fetch_failed' }, 200, 15);
  }
}
