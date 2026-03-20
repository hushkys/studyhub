/* ============================================================
   STUDYHUB — app.js  (redesign 2026)
   ============================================================ */

const S = {
  theme:    localStorage.getItem('theme')    || 'dark',
  fontSize: localStorage.getItem('fontSize') || 'md',
  density:  localStorage.getItem('density')  || 'normal',
  cat:      null,
  topic:    null,
  cdIdx:    0,
};

// ---- EXAM DATES (from official document) ----
const EXAMS = [
  { label: 'Písemná práce — AJ',    date: '2026-04-07', color: '#f59e0b', type: 'Profilová část' },
  { label: 'Písemná práce — ČJ',    date: '2026-04-08', color: '#f59e0b', type: 'Profilová část' },
  { label: 'Praktická zkouška', date: '2026-04-20', color: '#3b82f6', type: 'Profilová část' },
  { label: 'Didaktické testy',      date: '2026-05-04', color: '#8b5cf6', type: 'Společná část' },
  { label: 'Ústní zkoušky',         date: '2026-05-25', color: '#10b981', type: 'Profilová část' },
];

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  try {
    applyAll();
    buildSidebar();
    buildCountdownWidget();
    buildCatCards();
    setupEvents();
    setupParallax();
    setupReveal();
    initGameBg();
    triggerReveal();
    initTooltip();
    initHeroCanvas();
    initHeroTypewriter();
    buildTicker();
    buildStatsSection();
    buildQuoteSection();
    setupProgressBars();
    handleRoute();
  } catch(e) {
    console.error('INIT ERROR:', e);
    const errDiv = document.createElement('div');
    errDiv.style.cssText = 'position:fixed;top:60px;left:10px;right:10px;background:red;color:white;padding:12px;z-index:9999;font-family:monospace;font-size:12px;border-radius:8px;white-space:pre-wrap;';
    errDiv.textContent = 'INIT ERROR: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0,4).join('\n');
    document.body.appendChild(errDiv);
  }
});

// ---- SETTINGS ----
function applyAll() {
  document.documentElement.setAttribute('data-theme', S.theme);
  document.documentElement.setAttribute('data-font-size', S.fontSize);
  document.documentElement.setAttribute('data-density', S.density);
  document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === S.fontSize));
  document.querySelectorAll('.density-btn').forEach(b => b.classList.toggle('active', b.dataset.density === S.density));
  document.querySelectorAll('.theme-swatch').forEach(b => b.classList.toggle('active', b.dataset.theme === S.theme));
}
function setFontSize(sz) {
  S.fontSize = sz; localStorage.setItem('fontSize', sz);
  document.documentElement.setAttribute('data-font-size', sz);
  document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === sz));
}
function setDensity(d) {
  S.density = d; localStorage.setItem('density', d);
  document.documentElement.setAttribute('data-density', d);
  document.querySelectorAll('.density-btn').forEach(b => b.classList.toggle('active', b.dataset.density === d));
}
function setTheme(th) {
  S.theme = th; localStorage.setItem('theme', th);
  document.documentElement.setAttribute('data-theme', th);
  document.querySelectorAll('.theme-swatch').forEach(b => b.classList.toggle('active', b.dataset.theme === th));
  const active = document.querySelector(`.theme-swatch[data-theme="${th}"] .swatch-label`);
  const lbl = document.getElementById('themePickerLabel');
  if (lbl && active) lbl.textContent = active.textContent;
}

// ---- COUNTDOWN WIDGET ----
function buildCountdownWidget() {
  const tabs = document.getElementById('cdTabs');
  const display = document.getElementById('cdDisplay');
  if (!tabs || !display) return;

  const now = new Date();

  // Build tabs
  tabs.innerHTML = EXAMS.map((ex, i) =>
    `<button class="cd-tab${i === 0 ? ' active' : ''}" data-idx="${i}">${ex.label}</button>`
  ).join('');

  tabs.querySelectorAll('.cd-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.cd-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      S.cdIdx = +btn.dataset.idx;
      renderCdDisplay();
    });
  });

  renderCdDisplay();
}

function renderCdDisplay() {
  const display = document.getElementById('cdDisplay');
  const ex = EXAMS[S.cdIdx];
  const now = new Date();
  const target = new Date(ex.date);
  const diff = Math.ceil((target - now) / 86400000);
  const dateStr = target.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Progress: assume semester started ~2025-09-01
  const start = new Date('2025-09-01');
  const total = target - start;
  const elapsed = now - start;
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));

  const cls = diff < 0 ? 'done' : diff < 14 ? 'urgent' : diff < 45 ? 'soon' : 'ok';
  const numText = diff < 0 ? '✓' : diff;
  const unitText = diff < 0 ? 'hotovo' : 'dní zbývá';

  display.innerHTML = `
    <div class="cd-big">
      <div class="cd-number ${cls}">${numText}</div>
      <div class="cd-unit">${unitText}</div>
    </div>
    <div class="cd-info">
      <div class="cd-exam-name">${ex.label}</div>
      <div class="cd-exam-date">${dateStr}</div>
      <div class="cd-exam-type">${ex.type}</div>
      <div class="cd-progress-bar">
        <div class="cd-progress-fill" style="width:${pct}%; background: linear-gradient(90deg, ${ex.color}, ${ex.color}aa)"></div>
      </div>
    </div>
  `;
}

// ---- CATEGORY CARDS ----
function buildCatCards() {
  const wrap = document.getElementById('catCards');
  if (!wrap) return;
  wrap.innerHTML = '';
  let totalTopics = 0;
  CATEGORIES.forEach(cat => {
    const count = cat.topics.length;
    totalTopics += count;
    const unit = cat.id === 'ces' ? 'knih' : 'témat';
    const card = document.createElement('div');
    card.className = 'cat-card ' + cat.color;
    card.innerHTML = `
      <div class="cat-card-id">${cat.id.toUpperCase()}</div>
      <div class="cat-card-name">${cat.name_cs}</div>
      <div class="cat-card-desc">${cat.desc_cs}</div>
      <div class="cat-card-footer">
        <span class="cat-card-count">${count} ${unit}</span>
        <span class="cat-card-arrow">→</span>
      </div>
    `;
    card.addEventListener('click', () => goCategory(cat.id));
    wrap.appendChild(card);
  });
  const el = document.getElementById('heroTopicCount');
  if (el) el.textContent = totalTopics;
  // Also update stats section
  const statEl = document.getElementById('statTopics');
  if (statEl) statEl.textContent = totalTopics;
}

// ---- SIDEBAR ----
function buildSidebar() {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;
  nav.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const wrap = document.createElement('div');
    wrap.className = 'sb-cat';
    wrap.innerHTML = `
      <button class="sb-cat-btn">
        <span class="sb-cat-label">${cat.name_cs}</span>
        <span class="sb-cat-chevron">▶</span>
      </button>
      <div class="sb-items" id="sb-items-${cat.id}"></div>
    `;
    wrap.querySelector('.sb-cat-btn').addEventListener('click', () => wrap.classList.toggle('open'));
    const items = wrap.querySelector('.sb-items');
    cat.topics.forEach(topic => {
      const btn = document.createElement('button');
      btn.className = 'sb-item';
      btn.dataset.id = topic.id;
      btn.textContent = (topic.num && topic.num !== '—' ? topic.num + '. ' : '') + topic.title;
      btn.addEventListener('click', () => { closeSidebar(); goTopic(cat.id, topic.id); });
      items.appendChild(btn);
    });
    nav.appendChild(wrap);
  });

  // Practice shortcuts — compact bottom bar
  const practiceSection = document.createElement('div');
  practiceSection.className = 'sb-practice-bar';
  practiceSection.innerHTML = `
    <div class="sb-practice-label">Procvičování</div>
    <div class="sb-practice-btns">
      <div class="sb-practice-item">
        <div class="sb-practice-icon sb-practice-quiz-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="3" stroke-linecap="round"/></svg>
        </div>
        <select class="sb-practice-select" id="sbQuizCat">
          <option value="kyb">KYB</option>
          <option value="prg">PRG</option>
          <option value="ces">ČJ</option>
          <option value="mat">MAT</option>
        </select>
        <button class="sb-practice-go" id="sbStartQuiz">Kvíz \u2192</button>
      </div>
      <div class="sb-practice-item">
        <div class="sb-practice-icon sb-practice-ex-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </div>
        <select class="sb-practice-select" id="sbExTopic">
          <option value="all">Vše</option>
          <option value="java-basics">Java/C#</option>
          <option value="oop">OOP</option>
          <option value="methods">Metody</option>
          <option value="constructors">Konstruktory</option>
          <option value="interfaces">Rozhraní</option>
          <option value="collections">Kolekce</option>
          <option value="design-patterns">Vzory</option>
          <option value="sql">SQL</option>
          <option value="html-css">HTML/CSS</option>
          <option value="algorithms">Algoritmy</option>
        </select>
        <button class="sb-practice-go sb-practice-go-ex" id="sbStartEx">Cvičení \u2192</button>
      </div>
    </div>
  `;
  nav.parentElement.appendChild(practiceSection);
  practiceSection.querySelector('#sbStartQuiz').addEventListener('click', () => {
    const catId = practiceSection.querySelector('#sbQuizCat').value;
    const mainSel = document.getElementById('quizCatSelect');
    if (mainSel) mainSel.value = catId;
    closeSidebar();
    buildQuiz(catId);
    history.pushState(null, '', '#quiz');
    showPage('quiz'); showGameBg(true);
    setBreadcrumb([{ label: 'Home', action: 'home' }, { label: 'Kvíz' }]);
    renderQuizQuestion();
  });
  practiceSection.querySelector('#sbStartEx').addEventListener('click', () => {
    const tid = practiceSection.querySelector('#sbExTopic').value;
    const mainSel = document.getElementById('exTopicSelect');
    if (mainSel) mainSel.value = tid;
    closeSidebar();
    buildExercises(tid);
    history.pushState(null, '', '#exercises');
    showPage('exercises'); showGameBg(true);
    setBreadcrumb([{ label: 'Home', action: 'home' }, { label: 'Cvičení' }]);
    renderExercise();
  });
}

// ---- NAVIGATION ----
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'home') triggerReveal();
}
function goHome() {
  S.cat = null; S.topic = null;
  history.pushState(null, '', '#');
  showPage('home');
  setBreadcrumb([]);
}
function goCategory(catId) {
  S.cat = catId; S.topic = null;
  history.pushState(null, '', '#' + catId);
  renderCategory(catId);
  showPage('category');
}
function goTopic(catId, topicId) {
  S.cat = catId; S.topic = topicId;
  history.pushState(null, '', '#' + catId + '/' + topicId);
  renderTopic(catId, topicId);
  showPage('topic');
  document.querySelectorAll('.sb-item').forEach(b => b.classList.toggle('active', b.dataset.id === topicId));
}

// ---- ROUTING ----
function handleRoute() {
  const hash = location.hash.replace('#', '');
  if (!hash) { showPage('home'); setBreadcrumb([]); return; }
  const parts = hash.split('/');
  if (parts.length === 1) {
    const page = parts[0];
    if (page === 'quiz' || page === 'exercises') {
      showPage(page);
      showGameBg(true);
    } else {
      S.cat = page;
      renderCategory(page);
      showPage('category');
    }
  } else if (parts.length === 2) {
    S.cat = parts[0]; S.topic = parts[1];
    renderTopic(parts[0], parts[1]);
    showPage('topic');
    document.querySelectorAll('.sb-item').forEach(b => b.classList.toggle('active', b.dataset.id === parts[1]));
  }
}
window.addEventListener('popstate', handleRoute);
function setBreadcrumb(crumbs) {
  const el = document.getElementById('navBreadcrumb');
  const notch = document.getElementById('navNotchBc');
  if (!el) return;
  if (!crumbs.length) { el.innerHTML = ''; if (notch) notch.innerHTML = ''; return; }
  const buildHtml = (mobile) => crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const arrow = i > 0 ? '<span class="bc-arrow">\u203a</span>' : '';
    const cls = isLast ? 'bc-item bc-active' : 'bc-item bc-link';
    const action = c.action ? ` data-action="${c.action}"` : '';
    const dot = isLast ? '<span class="bc-dot"></span>' : '';
    const maxLen = mobile ? (isLast ? 18 : 8) : (isLast ? 32 : 16);
    const label = c.label.length > maxLen ? c.label.slice(0, maxLen) + '\u2026' : c.label;
    return `${arrow}<span class="${cls}"${action} title="${c.label}">${dot}${label}</span>`;
  }).join('');
  el.innerHTML = buildHtml(false);
  if (notch) notch.innerHTML = buildHtml(true);
  [el, notch].forEach(container => {
    if (!container) return;
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.action === 'home') goHome();
        else if (btn.dataset.action === 'cat') goCategory(S.cat);
      });
    });
  });
}

// ---- RENDER CATEGORY ----
function renderCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  document.getElementById('catTitle').textContent = cat.name_cs;
  document.getElementById('catDesc').textContent = cat.desc_cs;
  document.getElementById('catHeroBg').className = 'page-hero-bg ' + cat.color;
  setBreadcrumb([{ label: 'Home', action: 'home' }, { label: cat.name_cs }]);
  const list = document.getElementById('topicList');
  list.innerHTML = '';
  cat.topics.forEach((topic, i) => {
    const row = document.createElement('div');
    row.className = 'topic-row';
    row.innerHTML = `
      <span class="topic-row-num">${topic.num || (i + 1)}</span>
      <span class="topic-row-title">${topic.title}</span>
      <span class="topic-row-arrow">→</span>
    `;
    row.addEventListener('click', () => goTopic(catId, topic.id));
    list.appendChild(row);
    if (i < cat.topics.length - 1) {
      const sep = document.createElement('div'); sep.className = 'topic-divider'; list.appendChild(sep);
    }
  });
}

// ---- CONTENT PARSERS ----
function parseContent(rawText) {
  const parts = rawText.split(/\n---EXTRA---\n/);
  const base = parts[0] || '';
  const extra = parts[1] || '';
  const lines = base.split('\n').map(l => l.trim()).filter(Boolean);
  const isMd = /^#{1,6}\s/.test(base) || base.includes('**') || base.includes('###');
  let html = isMd ? parseMd(base) : parseDocx(lines);
  if (extra.trim()) {
    const extraIsMd = /^#{1,6}\s/.test(extra) || extra.includes('**');
    const extraHtml = extraIsMd ? parseMd(extra) : parseDocx(extra.split('\n').map(l => l.trim()).filter(Boolean));
    html += `<div class="extra-section"><div class="extra-label">Doplňující poznámky</div>${extraHtml}</div>`;
  }
  return html;
}

function parseMd(text) {
  // Pre-process: collect fenced code blocks first
  const codeBlocks = [];
  text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const placeholder = `__CODE_${codeBlocks.length}__`;
    codeBlocks.push({ lang: lang || 'text', code });
    return placeholder;
  });

  // Pre-process: collect table blocks, replace with placeholders
  const tableBlocks = [];
  const lines = text.split('\n');
  const processedLines = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    // Detect table: line contains | and next line is separator (---|:---)
    if (line.startsWith('|') && i + 1 < lines.length && /^\|[\s|:\-]+\|/.test(lines[i+1].trim())) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const placeholder = `__TABLE_${tableBlocks.length}__`;
      tableBlocks.push(renderMdTable(tableLines));
      processedLines.push(placeholder);
    } else {
      processedLines.push(lines[i]);
      i++;
    }
  }

  const src = processedLines.join('\n');
  let html = '', inUl = false, inOl = false, buffer = [];
  const flushBuf = () => { if (buffer.length) { html += `<p>${mdInline(buffer.join(' ').trim())}</p>`; buffer = []; } };
  const closeUl = () => { if (inUl) { html += '</ul>'; inUl = false; } };
  const closeOl = () => { if (inOl) { html += '</ol>'; inOl = false; } };

  for (const raw of src.split('\n')) {
    const line = raw.trim();
    // Table placeholder
    if (/^__TABLE_\d+__$/.test(line)) {
      flushBuf(); closeUl(); closeOl();
      html += tableBlocks[parseInt(line.match(/\d+/)[0])];
      continue;
    }
    // Code block placeholder
    if (/^__CODE_\d+__$/.test(line)) {
      flushBuf(); closeUl(); closeOl();
      const cb = codeBlocks[parseInt(line.match(/\d+/)[0])];
      html += `<pre data-lang="${esc(cb.lang)}"><code>${esc(cb.code.replace(/^\n|\n$/g,''))}</code></pre>`;
      continue;
    }
    if (!line) { flushBuf(); closeUl(); closeOl(); continue; }
    const hm = line.match(/^(#{1,6})\s+(.+)/);
    if (hm) { flushBuf(); closeUl(); closeOl(); const lvl = hm[1].length; const tag = lvl <= 2 ? 'h2' : lvl === 3 ? 'h3' : 'h4'; html += `<${tag}>${mdInline(hm[2])}</${tag}>`; continue; }
    if (/^---+$/.test(line)) { flushBuf(); closeUl(); closeOl(); html += '<hr>'; continue; }
    const ulm = raw.match(/^(\s*)[-*+]\s+(.+)/);
    if (ulm) { flushBuf(); if (!inUl) { html += '<ul>'; inUl = true; } html += `<li${Math.floor(ulm[1].length/2) > 0 ? ' class="sub-item"' : ''}>${mdInline(ulm[2])}</li>`; continue; }
    const olm = line.match(/^\d+\.\s+(.+)/);
    if (olm) { flushBuf(); closeUl(); if (!inOl) { html += '<ol>'; inOl = true; } html += `<li>${mdInline(olm[1])}</li>`; continue; }
    closeUl(); closeOl();
    const kvm = line.match(/^\*{0,2}([^:*]{2,40})\*{0,2}:\s*(.+)/);
    if (kvm && kvm[1].length < 35) { flushBuf(); html += `<div class="kv-row"><span class="kv-key">${esc(kvm[1])}:</span><span class="kv-val">${mdInline(kvm[2])}</span></div>`; continue; }
    if (line.startsWith('>')) { flushBuf(); html += `<blockquote>${mdInline(line.replace(/^>\s*/,''))}</blockquote>`; continue; }
    buffer.push(line);
  }
  flushBuf(); closeUl(); closeOl();
  return html;
}

function renderMdTable(lines) {
  // lines[0] = header row, lines[1] = separator, lines[2+] = data rows
  const parseRow = (line) => {
    // Replace [[TERM:x|y]] pipes temporarily so they don't split cells
    const safe = line.replace(/\[\[TERM:([^|\]]+)\|([^\]]+)\]\]/g, (_, n, d) =>
      `[[TERM:${n} ${d}]]`);
    return safe.replace(/^\||\|$/g, '').split('|')
      .map(c => c.trim().replace(/\[\[TERM:([^ \]]+) ([^\]]+)\]\]/g, '[[TERM:$1|$2]]'));
  };
  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);
  let t = '<div class="md-table-wrap"><table class="md-table"><thead><tr>';
  headers.forEach(h => { t += `<th>${mdInline(h)}</th>`; });
  t += '</tr></thead><tbody>';
  rows.forEach(row => {
    t += '<tr>';
    row.forEach((cell, ci) => {
      t += `<td${ci === 0 ? ' class="td-first"' : ''}>${mdInline(cell)}</td>`;
    });
    t += '</tr>';
  });
  t += '</tbody></table></div>';
  return t;
}

function mdInline(s) {
  // First resolve [[TERM:name|def]] before escaping
  const termDefs = {};
  const placeholder = [];
  s = s.replace(/\[\[TERM:([^|\]]+)\|([^\]]+)\]\]/g, (_, name, def) => {
    const key = '\x00T' + placeholder.length + '\x00';
    placeholder.push({ name: name.trim(), def: def.trim() });
    return key;
  });
  let result = esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, (_, term) => {
      const def = GLOSSARY[term];
      if (def) {
        const safeDef = def.replace(/"/g, '&quot;');
        return `<span class="code-term" data-term="${term}" data-def="${safeDef}" tabindex="0" role="button" aria-label="${term}: ${def}">${term}</span>`;
      }
      return `<code>${term}</code>`;
    })
    .replace(/\*\*/g, '')
    .replace(/(?<![a-zA-Z0-9])\*(?![a-zA-Z0-9])/g, '');
  // Restore [[TERM]] placeholders as clickable spans
  placeholder.forEach((p, i) => {
    const safeDef = p.def.replace(/"/g, '&quot;');
    const span = `<span class="code-term term-inline" data-term="${esc(p.name)}" data-def="${safeDef}" tabindex="0" role="button">${esc(p.name)}</span>`;
    result = result.replace('\x00T' + i + '\x00', span);
  });
  return result;
}

function parseDocx(lines) {
  const sections = [];
  let pendingHeading = null, pendingItems = [], pendingType = 'list';
  const flush = () => {
    if (pendingHeading || pendingItems.length) sections.push({ heading: pendingHeading, items: [...pendingItems], type: pendingType });
    pendingHeading = null; pendingItems = []; pendingType = 'list';
  };
  lines.forEach((line, i) => {
    if (i === 0 && /^(KYB|PRG)\s*[-–]/.test(line)) return;
    const isBullet = /^[-•]\s/.test(line);
    const isShort = line.length < 70 && !/[.,;]$/.test(line) && !isBullet;
    const next = lines[i+1] || '';
    if (isBullet) { pendingItems.push({ type: 'bullet', text: line.replace(/^[-•]\s*/,'') }); }
    else if (isShort && (/^[-•]\s/.test(next) || (next.length < 70 && next.length > 0)) && i > 0) { flush(); pendingHeading = line; }
    else { if (pendingItems.length && !pendingHeading) flush(); pendingItems.push({ type: 'prose', text: line }); pendingType = 'prose'; }
  });
  flush();
  let html = '';
  sections.forEach(sec => {
    if (sec.heading) html += `<h3>${esc(sec.heading)}</h3>`;
    let i = 0;
    while (i < sec.items.length) {
      const item = sec.items[i];
      if (item.type === 'bullet') {
        let bullets = [];
        while (i < sec.items.length && sec.items[i].type === 'bullet') { bullets.push(sec.items[i].text); i++; }
        const hasDash = bullets.filter(b => /\s[–-]\s/.test(b)).length > bullets.length / 2;
        if (hasDash && bullets.length > 2) {
          html += '<dl>';
          bullets.forEach(b => { const p = b.split(/\s[–-]\s/); html += p.length >= 2 ? `<dt>${esc(p[0])}</dt><dd>${esc(p.slice(1).join(' – '))}</dd>` : `<dt>${esc(b)}</dt>`; });
          html += '</dl>';
        } else { html += '<ul>' + bullets.map(b => `<li>${esc(b)}</li>`).join('') + '</ul>'; }
      } else { html += `<p>${esc(item.text)}</p>`; i++; }
    }
  });
  return html;
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ---- RENDER TOPIC ----
function renderTopic(catId, topicId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  const topic = cat.topics.find(t => t.id === topicId);
  document.getElementById('topicTitle').textContent = (topic.num && topic.num !== '—' ? topic.num + '. ' : '') + topic.title;
  document.getElementById('topicBadge').textContent = cat.name_cs;
  document.getElementById('topicBadge').className = 'topic-badge ' + cat.color;
  document.getElementById('topicHeroBg').className = 'page-hero-bg ' + cat.color;
  setBreadcrumb([{ label: 'Home', action: 'home' }, { label: cat.name_cs, action: 'cat' }, { label: topic.title }]);

  const main = document.getElementById('topicMain');
  const idx = cat.topics.findIndex(t => t.id === topicId);

  main.innerHTML = `
    <div class="content-block">
      <h3>Obsah</h3>
      ${parseContent(topic.content)}
    </div>
    <div class="topic-nav-row">
      <button class="topic-nav-btn" id="prevBtn" ${idx === 0 ? 'disabled' : ''}>← Předchozí</button>
      <button class="topic-nav-btn" id="nextBtn" ${idx === cat.topics.length - 1 ? 'disabled' : ''}>Další →</button>
    </div>
  `;
  document.getElementById('prevBtn').addEventListener('click', () => { if (idx > 0) goTopic(catId, cat.topics[idx-1].id); });
  document.getElementById('nextBtn').addEventListener('click', () => { if (idx < cat.topics.length-1) goTopic(catId, cat.topics[idx+1].id); });

  // Attach glossary tooltips
  attachTooltips(document.getElementById('topicMain'));
  // Syntax highlight code blocks
  highlightCodeBlocks(document.getElementById('topicMain'));

  const tips = (typeof getTips === 'function') ? getTips(cat.id, topicId) : [];
  const noteKey = 'notes_' + topicId;
  const savedNotes = JSON.parse(localStorage.getItem(noteKey) || '[]');

  document.getElementById('topicAside').innerHTML = `
    ${tips.length ? `<div class="aside-block tips">
      <div class="aside-title">Tipy pro komisi</div>
      <ul class="tips-list">${tips.map(tip => `<li>${esc(tip)}</li>`).join('')}</ul>
    </div>` : ''}
    <div class="aside-block notes">
      <div class="aside-title">Moje poznámky</div>
      <div class="notes-display" id="notesDisplay"></div>
      <textarea class="notes-textarea" id="notesArea" placeholder="Přidej poznámku..."></textarea>
      <div class="notes-footer">
        <button class="notes-save-btn" id="saveNoteBtn">Přidat poznámku</button>
        <span class="notes-saved-msg" id="savedMsg">Uloženo ✓</span>
      </div>
    </div>
  `;

  function renderNotes() {
    const notes = JSON.parse(localStorage.getItem(noteKey) || '[]');
    const display = document.getElementById('notesDisplay');
    if (!notes.length) {
      display.innerHTML = '<div class="notes-empty">Zatím žádné poznámky</div>';
      return;
    }
    display.innerHTML = notes.map((n, i) => `
      <div class="note-card">
        <div>${esc(n.text)}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
          <span class="note-card-time">${n.time}</span>
          <button onclick="deleteNote('${topicId}',${i})" style="font-size:11px;color:var(--text3);padding:2px 6px;border-radius:4px;background:var(--surface);border:1px solid var(--border)">✕</button>
        </div>
      </div>
    `).join('');
  }
  renderNotes();

  document.getElementById('saveNoteBtn').addEventListener('click', () => {
    const val = document.getElementById('notesArea').value.trim();
    if (!val) return;
    const notes = JSON.parse(localStorage.getItem(noteKey) || '[]');
    notes.unshift({ text: val, time: new Date().toLocaleString('cs-CZ', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) });
    localStorage.setItem(noteKey, JSON.stringify(notes));
    document.getElementById('notesArea').value = '';
    renderNotes();
    const msg = document.getElementById('savedMsg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 2000);
  });
}

// ---- SEARCH ----
function setupSearch() {
  const toggle = document.getElementById('searchToggle');
  const bar = document.getElementById('searchBar');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const open = () => { bar.classList.add('open'); input.focus(); };
  const close = () => { bar.classList.remove('open'); input.value = ''; results.innerHTML = ''; };
  toggle.addEventListener('click', () => bar.classList.contains('open') ? close() : open());
  document.getElementById('searchClose').addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
  });
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (!q || q.length < 2) return;
    const hits = [];
    CATEGORIES.forEach(cat => cat.topics.forEach(topic => {
      if (topic.title.toLowerCase().includes(q) || topic.content.toLowerCase().includes(q)) hits.push({ cat, topic });
    }));
    if (!hits.length) { results.innerHTML = `<div class="search-empty">Žádné výsledky</div>`; return; }
    hits.slice(0, 12).forEach(({ cat, topic }) => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `<span class="search-result-cat ${cat.color}">${cat.id.toUpperCase()}</span><span class="search-result-title">${topic.title}</span>`;
      item.addEventListener('click', () => { close(); goTopic(cat.id, topic.id); });
      results.appendChild(item);
    });
  });
}

// ---- CANVAS HERO ANIMATION ----
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, points, animId;
  const COLS = 32, ROWS = 20;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildGrid();
  }

  function buildGrid() {
    points = [];
    const cellW = W / COLS, cellH = H / ROWS;
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        points.push({
          ox: c * cellW, oy: r * cellH,
          x: c * cellW, y: r * cellH,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          phase: Math.random() * Math.PI * 2,
          amp: 5 + Math.random() * 12,
        });
      }
    }
  }

  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });
  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.007;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
      && document.documentElement.getAttribute('data-theme') !== 'rose';

    // Update point positions with mouse repulsion
    points.forEach(p => {
      const dx = p.ox - mouse.x, dy = p.oy - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const repel = dist < 120 ? (120 - dist) / 120 * 18 : 0;
      p.x = p.ox + Math.sin(t * 0.7 + p.phase) * p.amp + (dist < 120 ? dx/dist * repel : 0);
      p.y = p.oy + Math.cos(t * 0.5 + p.phase * 1.3) * p.amp * 0.6 + (dist < 120 ? dy/dist * repel : 0);
    });

    // Draw grid lines
    ctx.lineWidth = 0.6;
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        const idx = r * (COLS + 1) + c;
        const p = points[idx];
        if (c < COLS) {
          const p2 = points[idx + 1];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          const alpha = Math.max(0, 0.22 - dist * 0.002);
          ctx.strokeStyle = isDark ? `rgba(99,102,241,${alpha})` : `rgba(79,70,229,${alpha * 0.8})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
        if (r < ROWS) {
          const p2 = points[idx + (COLS + 1)];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          const alpha = Math.max(0, 0.22 - dist * 0.002);
          ctx.strokeStyle = isDark ? `rgba(99,102,241,${alpha})` : `rgba(79,70,229,${alpha * 0.8})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
        // Dot — brighter near mouse
        const mdist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        const dotAlpha = mdist < 180 ? 0.65 - mdist/360 : (isDark ? 0.22 : 0.14);
        const dotR = mdist < 180 ? 2 : 1;
        ctx.fillStyle = isDark ? `rgba(129,140,248,${dotAlpha})` : `rgba(99,102,241,${dotAlpha})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2); ctx.fill();
      }
    }
    animId = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();
  draw();
}

// ---- HERO TYPEWRITER ----
function initHeroTypewriter() {
  const el = document.getElementById('heroDesc');
  if (!el) return;
  const phrases = [
    'Všechno na jednom místě — učivo, odpočty, procvičování.',
    'Připrav se na maturitu chytře a efektivně.',
    'Flashcards, kvízy, párování — 4 herní módy.',
    'Tvoje poznámky, tvoje tempo, tvůj úspěch.',
  ];
  let pi = 0, ci = 0, deleting = false, pauseTimer = null;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      ci++;
      el.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) {
        deleting = true;
        pauseTimer = setTimeout(tick, 2800);
        return;
      }
      setTimeout(tick, 38 + Math.random() * 28);
    } else {
      ci--;
      el.textContent = phrase.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 320);
        return;
      }
      setTimeout(tick, 18);
    }
  }
  setTimeout(tick, 600);
}

// ---- TICKER ----
function buildTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = [
    'KYB — Kybernetická bezpečnost',
    'PRG — Programování v Javě a C#',
    'ČJ — Česká literatura a sloh',
    'MAT — Matematika',
    'ANG — Anglický jazyk',
    'Maturita 2026',
    'Flashcards pro rychlé opakování',
    'Kvíz — otestuj se',
    'Párování pojmů',
    'Doplňování definic',
    'Odpočet do zkoušek',
    'Vlastní poznámky ke každému tématu',
  ];
  // Duplicate for seamless loop
  const all = [...items, ...items];
  track.innerHTML = all.map(t =>
    `<span class="ticker-item"><span class="ticker-dot"></span>${t}</span>`
  ).join('');
}

// ---- STATS SECTION ----
function buildStatsSection() {
  // Days to nearest future exam
  const now = new Date();
  const future = EXAMS.filter(e => new Date(e.date) > now);
  const nearest = future.length ? future[0] : EXAMS[EXAMS.length - 1];
  const diff = Math.max(0, Math.ceil((new Date(nearest.date) - now) / 86400000));

  const el = document.getElementById('statDaysLeft');
  if (el) el.textContent = diff;

  // Total topics
  let total = 0;
  CATEGORIES.forEach(c => total += c.topics.length);
  const el2 = document.getElementById('statTopics');
  if (el2) el2.textContent = total;

  // Animate numbers counting up — triggered by IntersectionObserver when section enters view
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(el, diff, 1400);
        animateCount(el2, total, 1200);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  statsObserver.observe(statsSection);
}

function animateCount(el, target, duration) {
  if (!el || isNaN(target)) return;
  const start = performance.now();
  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---- QUOTE ROTATOR ----
const QUOTES = [
  { text: 'Vzdělání není příprava na život — vzdělání je život sám.', author: 'John Dewey' },
  { text: 'Čím více čteš, tím více věcí budeš vědět. Čím více se učíš, tím více míst navštívíš.', author: 'Dr. Seuss' },
  { text: 'Investice do znalostí přináší nejlepší úroky.', author: 'Benjamin Franklin' },
  { text: 'Vzdělání je nejsilnější zbraň, kterou můžeš použít ke změně světa.', author: 'Nelson Mandela' },
  { text: 'Úspěch je součet malých snah opakovaných den za dnem.', author: 'Robert Collier' },
];
function buildQuoteSection() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const textEl = document.getElementById('quoteText');
  const authorEl = document.getElementById('quoteAuthor');
  if (textEl) textEl.textContent = `"${q.text}"`;
  if (authorEl) authorEl.textContent = `— ${q.author}`;

  // Rotate quote every 12s
  let qi = QUOTES.indexOf(q);
  setInterval(() => {
    qi = (qi + 1) % QUOTES.length;
    const next = QUOTES[qi];
    if (textEl) { textEl.style.opacity = '0'; setTimeout(() => { textEl.textContent = `"${next.text}"`; textEl.style.opacity = '1'; }, 400); }
    if (authorEl) { authorEl.style.opacity = '0'; setTimeout(() => { authorEl.textContent = `— ${next.author}`; authorEl.style.opacity = '1'; }, 400); }
  }, 12000);
}

function setupProgressBars() {
  const section = document.querySelector('.progress-section');
  if (!section) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.querySelectorAll('.progress-bar-fill').forEach(bar => {
          const target = bar.dataset.target || '0';
          setTimeout(() => { bar.style.width = target + '%'; }, 200);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(section);
}


function setupParallax() {
  // Cursor glow
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (document.getElementById('page-home').classList.contains('active')) {
          const content = document.getElementById('heroContent');
          if (content) content.style.transform = `translateY(${y * 0.12}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ---- REVEAL ON SCROLL ----
let revealObserver = null;
function setupReveal() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    revealObserver.observe(el);
  });
}

function triggerReveal() {
  // For elements already in viewport, make visible immediately
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 30) {
      el.classList.add('visible');
    } else if (revealObserver) {
      revealObserver.observe(el);
    }
  });
}

// ---- GAME BACKGROUND (animated, mouse-reactive) ----
let gameBgAnimId = null;
function initGameBg() {
  const canvas = document.getElementById('gameBgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, orbs, particles = [], mouse = { x: 0.5, y: 0.5 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildOrbs();
  }

  function buildOrbs() {
    const palette = [
      'rgba(99,102,241,', 'rgba(139,92,246,', 'rgba(14,165,233,',
      'rgba(52,211,153,', 'rgba(249,115,22,', 'rgba(236,72,153,',
    ];
    orbs = Array.from({ length: 9 }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      r: 0.12 + Math.random() * 0.22,
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.6,
      color: palette[i % palette.length],
    }));
  }

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
    // Spawn particle on move
    if (canvas.classList.contains('active') && Math.random() < 0.15) {
      particles.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.5,
        life: 1, r: 2 + Math.random() * 3,
        color: ['rgba(99,102,241,', 'rgba(139,92,246,', 'rgba(52,211,153,'][Math.floor(Math.random()*3)],
      });
    }
  }, { passive: true });

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.004;

    // Draw orbs
    orbs.forEach(o => {
      const mx = mouse.x - o.x, my = mouse.y - o.y;
      o.x += o.vx + mx * 0.00010;
      o.y += o.vy + my * 0.00010;
      o.x = ((o.x % 1) + 1) % 1;
      o.y = ((o.y % 1) + 1) % 1;
      const pulse = 0.80 + 0.20 * Math.sin(t * (o.speed || 0.6) + o.phase);
      const r = o.r * Math.min(W, H) * pulse;
      const grd = ctx.createRadialGradient(o.x * W, o.y * H, 0, o.x * W, o.y * H, r);
      grd.addColorStop(0, o.color + '0.18)');
      grd.addColorStop(0.4, o.color + '0.08)');
      grd.addColorStop(1, o.color + '0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(o.x * W, o.y * H, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw mouse particles
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life -= 0.035; p.vy -= 0.02;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color + (p.life * 0.5) + ')';
      ctx.fill();
    });

    gameBgAnimId = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(document.body);
  resize();
  draw();
}

function showGameBg(show) {
  const canvas = document.getElementById('gameBgCanvas');
  if (canvas) canvas.classList.toggle('active', show);
}

// ---- STREAM TEXT (typewriter reveal for game content) ----
function streamText(el, text, speed = 16) {
  el.textContent = '';
  // Add blinking cursor
  const cursor = document.createElement('span');
  cursor.className = 'stream-cursor';
  el.appendChild(cursor);

  let i = 0;
  const chars = [...text]; // unicode-safe
  function next() {
    if (i < chars.length) {
      // Batch chars for longer texts to feel snappier
      const batch = chars.length > 200 ? 4 : chars.length > 80 ? 2 : 1;
      for (let b = 0; b < batch && i < chars.length; b++) {
        el.insertBefore(document.createTextNode(chars[i++]), cursor);
      }
      setTimeout(next, speed + Math.random() * 6);
    } else {
      // Remove cursor when done
      setTimeout(() => cursor.remove(), 600);
    }
  }
  next();
}


// ---- QUIZ ----
let quizQuestions = [], quizIdx = 0, quizScore = 0, quizDifficulty = 'all';
let quizPoints = 0, quizAnswered = 0, quizCatIdCurrent = 'kyb', quizAllPool = [];
const QUIZ_BADGES = [
  { id: 'bronze', label: 'Bronz',  threshold: 100, color: '#cd7f32' },
  { id: 'silver', label: 'St\u0159\xedbro', threshold: 250, color: '#a8a9ad' },
  { id: 'gold',   label: 'Zlato',  threshold: 500, color: '#ffd700' },
];

function buildQuiz(catId) {
  quizCatIdCurrent = catId;
  const pool = (GENERATED_QUESTIONS[catId] || []);
  const filtered = quizDifficulty === 'all' ? pool : pool.filter(q => q.difficulty === quizDifficulty);
  quizAllPool = filtered;
  quizQuestions = shuffle([...filtered]);
  quizIdx = 0; quizScore = 0; quizPoints = 0; quizAnswered = 0;
}
function quizRefillIfNeeded() {
  if (quizIdx >= quizQuestions.length) {
    quizQuestions = shuffle([...quizAllPool]);
    quizIdx = 0;
  }
}
function quizBadgeHtml(pts) {
  let html = '';
  QUIZ_BADGES.forEach(b => {
    const earned = pts >= b.threshold;
    html += `<div class="qbadge ${earned ? 'earned' : ''}" title="${b.label}: ${b.threshold} bod\u016f" style="--bc:${b.color}">
      <svg viewBox="0 0 24 24" fill="${earned ? b.color : 'none'}" stroke="${earned ? b.color : 'currentColor'}" stroke-width="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <span>${b.label}</span>
    </div>`;
  });
  return html;
}

function startQuiz() {
  const catId = document.getElementById('quizCatSelect').value;
  buildQuiz(catId);
  history.pushState(null, '', '#quiz');
  showPage('quiz');
  showGameBg(true);
  setBreadcrumb([{ label: 'Home', action: 'home' }, { label: 'Kvíz' }]);
  const diffDisplay = document.getElementById('quizDiffDisplay');
  if (diffDisplay) {
    const labels = { all: 'Vše', easy: 'Lehká', medium: 'Střední', hard: 'Těká' };
    diffDisplay.innerHTML = `<span class="diff-badge ${quizDifficulty}">${labels[quizDifficulty] || 'Vše'}</span>`;
  }
  renderQuizQuestion();
}

function updateBadgeBar() {
  const badgeBar = document.getElementById('quizBadgeBar');
  if (!badgeBar) return;
  const nextThreshold = QUIZ_BADGES.find(b => quizPoints < b.threshold);
  const progressToNext = nextThreshold
    ? Math.min(quizPoints / nextThreshold.threshold * 100, 100)
    : 100;
  badgeBar.innerHTML = `
    <div class="qbadge-row">${quizBadgeHtml(quizPoints)}</div>
    <div class="qbadge-pts-row">
      <span class="qbadge-pts">${quizPoints} bodů</span>
      ${nextThreshold ? `<span class="qbadge-next">Další štítek: ${nextThreshold.label} (${nextThreshold.threshold})</span>` : '<span class="qbadge-next">Všechny štítky získány! 🏆</span>'}
    </div>
    <div class="qbadge-progress-wrap"><div class="qbadge-progress-fill" style="width:${progressToNext}%"></div></div>
  `;
}

function renderQuizQuestion() {
  const wrap = document.getElementById('quizWrap');
  quizRefillIfNeeded();
  const q = quizQuestions[quizIdx];

  // Badge bar (persistent above question)
  let badgeBar = document.getElementById('quizBadgeBar');
  if (!badgeBar) {
    badgeBar = document.createElement('div');
    badgeBar.id = 'quizBadgeBar';
    badgeBar.className = 'quiz-badge-bar';
    wrap.parentElement.insertBefore(badgeBar, wrap);
  }
  updateBadgeBar();

  document.getElementById('quizProgress').textContent = `Otázka ${quizAnswered + 1}`;

  const diffLabels = { easy: 'Lehká', medium: 'Střední', hard: 'Těžká' };
  const diffBadge = q.difficulty ? `<span class="diff-badge ${q.difficulty}">${diffLabels[q.difficulty] || q.difficulty}</span>` : '';

  wrap.innerHTML = `
    <div class="quiz-question glass-card card-enter">
      <div class="quiz-q-label" style="display:flex;align-items:center;gap:8px;">${diffBadge}</div>
      <div class="quiz-q-text" id="quizQText"></div>
    </div>
    <div class="quiz-options">
      ${q.options.map(opt => `<button class="quiz-option glass-opt">${esc(opt)}</button>`).join('')}
    </div>
    <div class="quiz-feedback" id="quizFeedback"></div>
    <button class="quiz-next-btn" id="quizNext">Další otázka</button>
  `;
  streamText(document.getElementById('quizQText'), q.question, 14);

  const qShownAt = Date.now();

  wrap.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
      const isCorrect = btn.textContent.trim() === q.correct.trim();
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      if (!isCorrect) wrap.querySelectorAll('.quiz-option').forEach(b => {
        if (b.textContent.trim() === q.correct.trim()) b.classList.add('correct');
      });
      quizAnswered++;
      const prevPts = quizPoints;

      let delta;
      if (isCorrect) {
        quizScore++;
        const elapsed = (Date.now() - qShownAt) / 1000; // seconds
        // Fast (<5s)=+15, medium (5-15s)=+10, slow (>15s)=+5
        delta = elapsed < 5 ? 15 : elapsed < 15 ? 10 : 5;
        quizPoints += delta;
      } else {
        delta = -8;
        quizPoints = Math.max(0, quizPoints + delta);
      }

      // Update badge bar immediately
      updateBadgeBar();

      // Check newly earned badges
      const newBadge = QUIZ_BADGES.find(b => prevPts < b.threshold && quizPoints >= b.threshold);

      const fb = document.getElementById('quizFeedback');
      fb.className = 'quiz-feedback show ' + (isCorrect ? 'ok' : 'fail');
      const expText = q.explanation ? `<em>${esc(q.explanation)}</em>` : '';
      const sign = delta > 0 ? '+' : '';
      const ptsDelta = `<span class="pts-delta ${delta > 0 ? 'plus' : 'minus'}">${sign}${delta} bodů</span>`;
      fb.innerHTML = (isCorrect
        ? `Správně. ${expText}`
        : `Správná odpověď: <strong>${esc(q.correct)}</strong>${expText ? '<br>' + expText : ''}`)
        + ptsDelta;

      if (newBadge) {
        const toast = document.createElement('div');
        toast.className = 'badge-toast';
        toast.innerHTML = `<svg viewBox="0 0 24 24" fill="${newBadge.color}" width="22" height="22"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Štítek odemčen: <strong>${newBadge.label}</strong>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 50);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
      }

      document.getElementById('quizNext').classList.add('show');
    });
  });
  document.getElementById('quizNext').addEventListener('click', () => { quizIdx++; renderQuizQuestion(); });
}

// ---- SYNTAX HIGHLIGHTER (Monokai) ----
function highlightCodeBlocks(container) {
  container.querySelectorAll('pre code').forEach(block => {
    const lang = (block.parentElement.dataset.lang || '').toLowerCase();
    let code = block.innerHTML;

    // Detect language from content if not specified
    const effectiveLang = lang || (code.includes('namespace') || code.includes('Console.') ? 'csharp' : 'java');

    if (effectiveLang === 'java' || effectiveLang === 'csharp' || effectiveLang === 'cs' || effectiveLang === 'c#') {
      code = highlightJavaCSharp(code);
    } else if (effectiveLang === 'sql') {
      code = highlightSQL(code);
    } else if (effectiveLang === 'css') {
      code = highlightCSS(code);
    }
    block.innerHTML = code;
  });
}


function highlightJavaCSharp(code) {
  // Unicode-aware word boundary helper — matches identifier chars including Czech diacritics
  // \p{L} = any unicode letter, so PONDĚLÍ, Žlutá etc. stay as one token
  const KW = /(?<![.\p{L}\p{N}_])(?:public|private|protected|static|final|abstract|class|interface|enum|extends|implements|new|return|void|if|else|for|while|do|switch|case|break|continue|null|true|false|this|super|override|delegate|event|namespace|using|get|set|base|readonly|const|var|int|string|bool|double|float|char|long|byte|short|String|boolean|throws|try|catch|finally|import|package|synchronized|volatile|transient)(?![\p{L}\p{N}_])/gu;
  // Type = PascalCase (starts uppercase, has at least one lowercase) — excludes ALL_CAPS constants
  const TYPES = /(?<![.\p{L}\p{N}_])(\p{Lu}[\p{L}\p{N}_]*\p{Ll}[\p{L}\p{N}_]*)(?![\p{L}\p{N}_])/gu;
  const STRINGS = /(&quot;.*?&quot;|&#39;.*?&#39;)/g;
  const NUMBERS = /(?<![\p{L}_])(\d+)(?![\p{L}_])/gu;
  const ANNOT = /(@\w+)/g;

  function highlightCode(seg) {
    // Reset lastIndex for stateful regexes
    KW.lastIndex = 0; TYPES.lastIndex = 0; NUMBERS.lastIndex = 0;
    return seg
      .replace(ANNOT, m => `<span class="mk-builtin">${m}</span>`)
      .replace(KW, m => `<span class="mk-keyword">${m}</span>`)
      .replace(TYPES, m => `<span class="mk-type">${m}</span>`)
      .replace(NUMBERS, m => `<span class="mk-number">${m}</span>`)
      .replace(STRINGS, m => `<span class="mk-string">${m}</span>`);
  }

  // Tokenize: protect comments first so their text isn't highlighted
  const parts = [];
  const tokenRe = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
  let last = 0, m;
  while ((m = tokenRe.exec(code)) !== null) {
    if (m.index > last) parts.push({ type: 'code', val: code.slice(last, m.index) });
    parts.push({ type: 'comment', val: m[0] });
    last = m.index + m[0].length;
  }
  if (last < code.length) parts.push({ type: 'code', val: code.slice(last) });

  return parts.map(p =>
    p.type === 'comment'
      ? `<span class="mk-comment">${p.val}</span>`
      : highlightCode(p.val)
  ).join('');
}

function highlightSQL(code) {
  const keywords = /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|ON|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AND|OR|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN)\b/gi;
  return code.replace(keywords, m => `<span class="mk-keyword">${m}</span>`);
}

function highlightCSS(code) {
  return code
    .replace(/(\/\*[\s\S]*?\*\/)/g, m => `<span class="mk-comment">${m}</span>`)
    .replace(/(&quot;[^&]*&quot;)/g, m => `<span class="mk-string">${m}</span>`)
    .replace(/(#[0-9a-fA-F]{3,6})\b/g, m => `<span class="mk-number">${m}</span>`);
}

// ---- TOOLTIP / GLOSSARY ----
const GLOSSARY = {
  // Sítě & protokoly
  'TCP': 'Transmission Control Protocol — spolehlivý protokol zajišťující doručení dat ve správném pořadí. Používá potvrzování každého paketu.',
  'UDP': 'User Datagram Protocol — rychlý protokol bez potvrzování. Vhodný pro streaming nebo hry, kde nevadí ztráta pár paketů.',
  'IP': 'Internet Protocol — protokol zajišťující adresování a směrování paketů v síti. Každé zařízení má svou IP adresu.',
  'HTTP': 'HyperText Transfer Protocol — protokol pro přenos webových stránek. Komunikace probíhá na portu 80.',
  'HTTPS': 'HTTP Secure — šifrovaná verze HTTP pomocí TLS/SSL. Komunikace probíhá na portu 443. Zámeček v prohlížeči.',
  'FTP': 'File Transfer Protocol — protokol pro přenos souborů. Používá porty 20 (data) a 21 (příkazy).',
  'DNS': 'Domain Name System — "telefonní seznam internetu". Překládá doménová jména (google.com) na IP adresy.',
  'DHCP': 'Dynamic Host Configuration Protocol — automaticky přiděluje IP adresy zařízením v síti. Bez něj by se musely nastavovat ručně.',
  'SMTP': 'Simple Mail Transfer Protocol — protokol pro odesílání e-mailů. Používá port 25.',
  'IMAP': 'Internet Message Access Protocol — protokol pro příjem e-mailů se synchronizací na serveru. Port 143.',
  'IMAP4': 'Internet Message Access Protocol v4 — synchronizuje poštu mezi serverem a klientem. Vyžaduje stálé připojení.',
  'POP3': 'Post Office Protocol v3 — stahuje e-maily ze serveru do klienta a ze serveru je maže. Port 110.',
  'SSL': 'Secure Sockets Layer — starší protokol pro šifrování komunikace. Dnes nahrazen TLS.',
  'TLS': 'Transport Layer Security — moderní protokol pro šifrování síťové komunikace. Základ HTTPS.',
  'SSH': 'Secure Shell — šifrovaný protokol pro vzdálený přístup k příkazové řádce serveru. Port 22.',
  'VPN': 'Virtual Private Network — šifrovaný tunel přes internet. Chrání soukromí a umožňuje vzdálený přístup do firemní sítě.',
  'MAC': 'Media Access Control — unikátní fyzická adresa síťové karty přidělená výrobcem. Nelze změnit (ale lze "spoofovat").',
  'VLAN': 'Virtual Local Area Network — logické rozdělení fyzické sítě na izolované segmenty bez nutnosti fyzického oddělení.',
  'LAN': 'Local Area Network — lokální síť v rámci budovy nebo areálu (škola, firma).',
  'WAN': 'Wide Area Network — rozsáhlá síť pokrývající velké území. Internet je největší WAN.',
  'MAN': 'Metropolitan Area Network — síť pokrývající město nebo větší areál (např. univerzitní kampus).',
  'PAN': 'Personal Area Network — osobní síť na krátkou vzdálenost, např. Bluetooth mezi telefonem a sluchátky.',
  'NIC': 'Network Interface Card — síťová karta zajišťující fyzické připojení zařízení k síti.',
  'ARP': 'Address Resolution Protocol — překládá IP adresy na MAC adresy v lokální síti.',
  'ICMP': 'Internet Control Message Protocol — diagnostický protokol. Používá ho příkaz ping pro testování dostupnosti.',
  'NAT': 'Network Address Translation — překlad privátních IP adres na veřejnou. Umožňuje více zařízením sdílet jednu veřejnou IP.',
  'APIPA': 'Automatic Private IP Addressing — OS automaticky přidělí IP z rozsahu 169.254.x.x, když není dostupný DHCP server.',
  'PoE': 'Power over Ethernet — napájení zařízení (kamery, AP) přímo přes datový kabel. Odpadá nutnost zásuvky 230V.',
  'SSID': 'Service Set Identifier — název bezdrátové Wi-Fi sítě, který vidíte při připojování.',
  'WEP': 'Wired Equivalent Privacy — zastaralý a snadno prolomitelný protokol zabezpečení Wi-Fi. Nepoužívat.',
  'WPA': 'Wi-Fi Protected Access — protokol zabezpečení bezdrátových sítí. WPA3 je aktuální nejbezpečnější verze.',
  'PSK': 'Pre-Shared Key — předem sdílené heslo pro přístup k Wi-Fi síti.',
  'RADIUS': 'Remote Authentication Dial-In User Service — centrální server pro ověřování uživatelů při přístupu do sítě.',
  'IoT': 'Internet of Things — "internet věcí". Chytrá zařízení připojená k internetu (ledničky, kamery, senzory).',
  'RFC': 'Request for Comments — oficiální dokumenty popisující internetové standardy a protokoly.',
  'MUA': 'Mail User Agent — poštovní klient (aplikace jako Outlook nebo Thunderbird).',
  'MTA': 'Mail Transfer Agent — přesouvá e-maily mezi servery pomocí protokolu SMTP.',
  'MDA': 'Mail Delivery Agent — doručuje e-maily do schránky příjemce (POP3, IMAP).',
  'FSO': 'Free Space Optics — bezdrátový přenos dat pomocí laserového paprsku ve volném prostoru.',

  // Bezpečnost
  'SIEM': 'Security Information and Event Management — systém pro centrální sběr, analýzu a korelaci bezpečnostních logů ze všech zařízení v síti.',
  'IDS': 'Intrusion Detection System — pasivní systém detekující podezřelou aktivitu v síti a upozorňující správce.',
  'IPS': 'Intrusion Prevention System — aktivní systém, který nejen detekuje, ale automaticky blokuje hrozby.',
  'DLP': 'Data Loss Prevention — systém zabraňující úniku citlivých dat z organizace (e-mail, USB, cloud).',
  'MFA': 'Multi-Factor Authentication — vícefaktorové ověření. Kombinuje heslo s druhým faktorem (SMS, app, biometrika).',
  '2FA': 'Two-Factor Authentication — dvoufaktorové ověření. I při krádeži hesla útočník neuspěje bez druhého faktoru.',
  'CVE': 'Common Vulnerabilities and Exposures — standardizovaný seznam veřejně známých bezpečnostních zranitelností.',
  'DDoS': 'Distributed Denial of Service — útok z tisíců počítačů (botnet) zahlcující server požadavky až do výpadku.',
  'DoS': 'Denial of Service — útok z jednoho zdroje zahlcující server, dokud nespadne.',
  'MitM': 'Man-in-the-Middle — útočník se vloží mezi dvě komunikující strany a může data číst nebo měnit.',
  'XSS': 'Cross-Site Scripting — útok vkládající škodlivý JavaScript do webové stránky, který se spustí v prohlížeči oběti.',
  'SQLi': 'SQL Injection — útok vkládající škodlivý SQL kód do vstupních polí aplikace pro manipulaci s databází.',
  'CSRF': 'Cross-Site Request Forgery — útok přinutí přihlášeného uživatele provést nechtěnou akci na webu.',
  'RTO': 'Recovery Time Objective — maximální přípustná doba výpadku. Jak rychle musíme obnovit provoz po incidentu.',
  'RPO': 'Recovery Point Objective — maximální přípustná ztráta dat. Kolik dat si můžeme dovolit ztratit.',
  'GDPR': 'General Data Protection Regulation — nařízení EU o ochraně osobních údajů. Platí od roku 2018.',
  'NIS2': 'Network and Information Security Directive 2 — evropská směrnice o bezpečnosti sítí a informačních systémů.',
  'ZKB': 'Zákon o kybernetické bezpečnosti (č. 181/2014 Sb.) — český zákon stanovující povinnosti pro provozovatele kritické infrastruktury.',
  'NUKIB': 'Národní úřad pro kybernetickou a informační bezpečnost — ústřední správní orgán ČR pro kybernetickou bezpečnost.',
  'ENISA': 'European Union Agency for Cybersecurity — evropská agentura pro kybernetickou bezpečnost se sídlem v Aténách.',
  'CERT': 'Computer Emergency Response Team — tým reagující na kybernetické incidenty a koordinující jejich řešení.',
  'CSIRT': 'Computer Security Incident Response Team — specializovaný tým pro reakci na bezpečnostní incidenty.',
  'CISO': 'Chief Information Security Officer — nejvyšší odpovědná osoba za informační bezpečnost v organizaci.',
  'SOC': 'Security Operations Center — tým nepřetržitě (24/7) monitorující bezpečnostní události v organizaci.',
  'EULA': 'End-User License Agreement — licenční smlouva s koncovým uživatelem. Kupujete právo k užívání, ne vlastnictví.',
  'GPL': 'GNU General Public License — svobodná licence. Software lze volně používat, upravovat a šířit.',

  // Kryptografie
  'AES': 'Advanced Encryption Standard — nejpoužívanější symetrický šifrovací algoritmus. Délky klíčů 128/192/256 bitů.',
  'RSA': 'Rivest–Shamir–Adleman — nejrozšířenější asymetrický šifrovací algoritmus. Bezpečnost je založena na faktorizaci velkých čísel.',
  'ECC': 'Elliptic Curve Cryptography — moderní asymetrická kryptografie. Stejná bezpečnost jako RSA s kratšími klíči.',
  'MD5': 'Message Digest 5 — hashovací funkce generující 128bitový otisk. Dnes považována za nedostatečně bezpečnou.',
  'SHA': 'Secure Hash Algorithm — rodina hashovacích funkcí. SHA-256 je bezpečný standard pro ověření integrity dat.',
  'SHA-256': 'Secure Hash Algorithm 256 — generuje 256bitový hash. Bezpečný standard používaný např. v Bitcoinu.',
  'DES': 'Data Encryption Standard — starý symetrický algoritmus s 56bitovým klíčem. Dnes považován za nedostatečně bezpečný.',
  '3DES': 'Triple DES — aplikuje DES třikrát za sebou. Bezpečnější než DES, ale pomalejší. Postupně nahrazován AES.',
  'CA': 'Certificate Authority — certifikační autorita vydávající digitální certifikáty ověřující identitu webů a osob.',

  // Hardware & OS
  'BIOS': 'Basic Input/Output System — firmware spouštějící se při startu počítače. Inicializuje hardware před načtením OS.',
  'UEFI': 'Unified Extensible Firmware Interface — moderní náhrada BIOSu. Podporuje větší disky a rychlejší start.',
  'RAID': 'Redundant Array of Independent Disks — technologie kombinující více disků pro zvýšení výkonu nebo redundance. RAID 1 = zrcadlení.',
  'UPS': 'Uninterruptible Power Supply — záložní zdroj napájení. Při výpadku proudu udrží zařízení v chodu.',
  'CLI': 'Command Line Interface — textové rozhraní pro ovládání počítače příkazy (terminál, příkazová řádka).',
  'GUI': 'Graphical User Interface — grafické rozhraní s okny, ikonami a myší. Uživatelsky přívětivější než CLI.',
  'CPU': 'Central Processing Unit — procesor, "mozek" počítače. Vykonává instrukce programů.',
  'RAM': 'Random Access Memory — operační paměť. Dočasně ukládá data běžících programů. Po vypnutí se vymaže.',
  'SSD': 'Solid State Drive — rychlé úložiště bez pohyblivých částí. Rychlejší a odolnější než HDD.',
  'HDD': 'Hard Disk Drive — tradiční magnetické úložiště s rotujícími plotnami. Pomalejší než SSD, ale levnější na GB.',
  'GPU': 'Graphics Processing Unit — grafická karta. Zpracovává grafiku, ale také AI výpočty a kryptomining.',
  'NFC': 'Near Field Communication — bezdrátová komunikace na velmi krátkou vzdálenost (do 10 cm). Platby kartou, přístupové karty.',
  'USB': 'Universal Serial Bus — standardní rozhraní pro připojení periferií k počítači.',
  'HDMI': 'High-Definition Multimedia Interface — rozhraní pro přenos obrazu a zvuku ve vysokém rozlišení.',
  'PCIe': 'Peripheral Component Interconnect Express — vysokorychlostní sběrnice pro připojení GPU, SSD a dalších karet.',
  'GRUB': 'Grand Unified Bootloader — zavaděč operačního systému v Linuxu. Umožňuje výběr OS při startu.',
  'AD': 'Active Directory — adresářová služba Microsoftu pro správu uživatelů, skupin a oprávnění v podnikové síti.',
  'DHCP Server': 'Server automaticky přidělující IP adresy zařízením v síti pomocí protokolu DHCP.',
  'DNS Server': 'Server překládající doménová jména na IP adresy. Bez něj bychom museli znát IP adresy všech webů.',

  // Síťové pojmy
  'L2 switch': 'Switch pracující na linkové vrstvě (vrstva 2 OSI). Přeposílá rámce na základě MAC adres.',
  'L3 switch': 'Switch pracující na síťové vrstvě (vrstva 3 OSI). Umí směrovat pakety jako router a spravovat VLAN.',
  'Hub': 'Zastaralý síťový prvek posílající data všem připojeným zařízením najednou. Nahrazen switchem.',
  'Repeater': 'Opakovač signálu — zesiluje a regeneruje síťový signál pro překonání větších vzdáleností.',
  'Bridge': 'Síťový most spojující dva segmenty sítě. Filtruje provoz na základě MAC adres.',
  'Router': 'Směrovač — propojuje různé sítě a určuje nejlepší cestu pro pakety. Základ domácí i firemní sítě.',
  'Firewall': 'Síťové zařízení nebo software řídící provoz na základě pravidel. Blokuje neoprávněný přístup.',
  'Proxy': 'Prostředník mezi klientem a serverem. Může filtrovat obsah, cachovat data nebo skrývat IP adresu.',
  'Botnet': 'Síť infikovaných počítačů ovládaných útočníkem. Používá se pro DDoS útoky nebo rozesílání spamu.',
  'Patch panel': 'Pasivní prvek organizující kabeláž v racku. Propojuje rozvody v budově s aktivními prvky.',
  'Rack': 'Standardizovaná skříň pro montáž síťových a serverových zařízení. Výška se měří v "U" (1U = 44,45 mm).',
  'RJ45': 'Standardní konektor pro síťové kabely (kroucená dvojlinka). Používá se pro Ethernet připojení.',
  'Ethernet': 'Nejrozšířenější technologie pro drátové lokální sítě. Definuje fyzické a linkové standardy.',
  'Wi-Fi': 'Bezdrátová síťová technologie pro lokální sítě. Pracuje na frekvencích 2,4 GHz, 5 GHz a 6 GHz.',
  'Bluetooth': 'Bezdrátová technologie pro krátké vzdálenosti (do 10 m). Propojuje periferie a mobilní zařízení.',
  'GPS': 'Global Positioning System — satelitní navigační systém pro určování polohy kdekoliv na Zemi.',
  'GSM': 'Global System for Mobile Communications — standard pro mobilní telefonní sítě (2G).',
  'Li-Fi': 'Light Fidelity — experimentální technologie přenášející data pomocí světla (LED). Rychlejší než Wi-Fi.',
  'BTS': 'Base Transceiver Station — základnová stanice mobilní sítě. "Věž" zajišťující pokrytí signálem.',
  'ČTÚ': 'Český telekomunikační úřad — regulátor telekomunikačního trhu v ČR. Vydává licence pro frekvenční pásma.',
  'RSMA': 'Reverse SMA — typ koaxiálního konektoru používaný pro připojení antén k Wi-Fi zařízením.',
  'Yagi': 'Směrová anténa pro Wi-Fi nebo TV signál. Vysílá úzký paprsek na velkou vzdálenost (1–15 km).',

  // Malware
  'Malware': 'Malicious Software — škodlivý software navržený k poškození, krádeži dat nebo neoprávněnému přístupu.',
  'Ransomware': 'Typ malwaru šifrující soubory a požadující výkupné za jejich odemčení. Jedinou jistotou jsou zálohy.',
  'Trojan': 'Trojský kůň — malware maskující se jako legitimní program. Na pozadí páchá škody.',
  'Spyware': 'Špionážní software sledující aktivitu uživatele a odesílající data útočníkovi.',
  'Adware': 'Software zobrazující nevyžádanou reklamu. Zpomaluje zařízení a narušuje soukromí.',
  'Keylogger': 'Typ spywaru zaznamenávající stisky kláves. Útočník tak získá hesla a citlivé informace.',
  'Phishing': 'Podvodné e-maily nebo weby napodobující důvěryhodné instituce. Cílem je vylákat přihlašovací údaje.',
  'Vishing': 'Voice phishing — podvodné telefonáty vydávající se za banku nebo technickou podporu.',
  'Spam': 'Nevyžádaná hromadná elektronická pošta. Může obsahovat reklamu, phishing nebo malware.',
  'Backdoor': 'Skrytý vstupní bod do systému obcházející standardní autentizaci. Instaluje ho malware nebo útočník.',

  // Ostatní
  'ping': 'Síťový příkaz testující dostupnost zařízení v síti. Odesílá ICMP pakety a měří dobu odezvy.',
  'APIPA': 'Automatic Private IP Addressing — OS přidělí IP z rozsahu 169.254.x.x při nedostupnosti DHCP serveru.',
  'Zero Trust': 'Bezpečnostní model "nikomu nevěř". Každý přístup musí být ověřen bez ohledu na polohu v síti.',
  'IANA': 'Internet Assigned Numbers Authority — organizace spravující globální přidělování IP adres a doménových jmen.',
  'HTML': 'HyperText Markup Language — značkovací jazyk pro tvorbu webových stránek.',
  'PHP': 'Hypertext Preprocessor — skriptovací jazyk pro tvorbu dynamických webových stránek na straně serveru.',
  'JavaScript': 'Programovací jazyk pro interaktivní prvky webových stránek. Běží v prohlížeči na straně klienta.',
  'Apache': 'Nejrozšířenější open-source webový server. Obsluhuje HTTP požadavky a doručuje webové stránky.',
  'CNAME': 'Canonical Name — DNS záznam přesměrovávající doménu na jinou doménu (alias).',
  'MX': 'Mail Exchange — DNS záznam určující poštovní server pro danou doménu.',
  'TXT': 'Text — DNS záznam obsahující libovolný text. Používá se pro ověření domény nebo SPF záznamy.',
  'Cloudflare': 'Cloudová služba poskytující CDN, ochranu před DDoS útoky a DNS. Chrání weby před přetížením.',
  'VLAN hopping': 'Útok umožňující přístup do jiné VLAN než té, ke které je útočník přiřazen.',
  'Subnetting': 'Rozdělení IP sítě na menší podsítě pomocí masky sítě. Zvyšuje efektivitu a bezpečnost.',
  'Kensington lock': 'Mechanický bezpečnostní zámek pro notebooky. Lankem připevní notebook k pevnému bodu.',
  'GRUB': 'Grand Unified Bootloader — zavaděč OS v Linuxu. Zobrazí menu pro výběr operačního systému při startu.',
  'ReactOS': 'Open-source operační systém kompatibilní s Windows. Vyvíjen jako svobodná alternativa.',
  'Proton': 'Švýcarská cloudová služba (ProtonMail, ProtonDrive) s důrazem na šifrování a soukromí.',
  'Mega': 'Cloudové úložiště s end-to-end šifrováním. Soubory jsou šifrovány ještě před nahráním na server.',
  'DHCPACK': 'DHCP Acknowledgement — potvrzení od DHCP serveru, že IP adresa byla úspěšně přidělena klientovi.',
  'DHCP discover': 'Broadcast zpráva klienta hledající DHCP server v síti při prvním připojení.',
  'DHCP offer': 'Nabídka IP adresy od DHCP serveru jako odpověď na DHCP discover.',
  'DHCP request': 'Žádost klienta o přidělení konkrétní IP adresy nabídnuté DHCP serverem.',
  'NetID': 'Část IP adresy identifikující síť. Určena maskou sítě — bity odpovídající jedničkám v masce.',
  'HostID': 'Část IP adresy identifikující konkrétní zařízení v síti. Určena nulami v masce sítě.',
  'Trunk': 'Tagovaný port switche přenášející provoz více VLAN najednou. Používá se pro propojení switchů.',
  'Access': 'Netagovaný port switche přiřazený jedné VLAN. Připojují se k němu koncová zařízení.',
  'Broadband': 'Širokopásmové připojení k internetu s vysokou přenosovou rychlostí.',
  'Broadcast': 'Zpráva odeslaná všem zařízením v síti najednou. Používá se např. pro DHCP discover.',

  // ---- PRG / Java / C# ----
  'class': 'Šablona (blueprint) pro vytváření objektů. Definuje atributy (data) a metody (chování).',
  'object': 'Konkrétní instance třídy. Má vlastní stav (hodnoty atributů) a chování (metody).',
  'abstract': 'Abstraktní třída nebo metoda — nelze přímo instanciovat, slouží jako základ pro potomky.',
  'interface': 'Kontrakt definující metody, které musí implementující třída povinně obsahovat.',
  'extends': 'Klíčové slovo pro dědičnost v Javě — potomek přebírá vlastnosti a metody rodiče.',
  'implements': 'Klíčové slovo v Javě — třída se zavazuje implementovat všechny metody rozhraní.',
  'override': 'Přepsání metody rodiče v potomkovi. Metoda má stejný podpis, ale jiné tělo.',
  'super': 'Odkaz na nadřazenou třídu (rodiče). Používá se pro volání konstruktoru nebo metod rodiče.',
  'this': 'Odkaz na aktuální instanci třídy. Rozlišuje atributy od parametrů se stejným názvem.',
  'static': 'Člen třídy (atribut/metoda) patřící třídě, ne instanci. Volá se přes název třídy.',
  'final': 'Proměnná, metoda nebo třída, která nemůže být změněna ani přepsána.',
  'private': 'Přístupový modifikátor — člen je viditelný pouze uvnitř dané třídy.',
  'protected': 'Přístupový modifikátor — člen je viditelný v dané třídě a všech jejích potomcích.',
  'public': 'Přístupový modifikátor — člen je viditelný odkudkoliv.',
  'void': 'Návratový typ metody, která nic nevrací.',
  'new': 'Operátor pro vytvoření nové instance třídy (alokace paměti a volání konstruktoru).',
  'null': 'Speciální hodnota označující, že proměnná neodkazuje na žádný objekt.',
  'enum': 'Výčtový typ — definuje pojmenované konstanty (např. dny v týdnu, barvy).',
  'constructor': 'Speciální metoda volaná při vytvoření objektu. Má stejné jméno jako třída.',
  'getter': 'Metoda vracející hodnotu privátního atributu (get + NázevAtributu).',
  'setter': 'Metoda nastavující hodnotu privátního atributu s možností validace.',
  'ArrayList': 'Dynamické pole v Javě — automaticky se zvětšuje. Část Collections Framework.',
  'List': 'Rozhraní v Javě pro uspořádané kolekce. Implementace: ArrayList, LinkedList.',
  'HashMap': 'Datová struktura ukládající páry klíč-hodnota. Rychlé vyhledávání O(1).',
  'for-each': 'Zkrácený cyklus pro procházení kolekcí: for (Typ prvek : kolekce) { }',
  'polymorphism': 'Polymorfismus — stejná metoda se chová různě podle skutečného typu objektu.',
  'encapsulation': 'Zapouzdření — skrývání implementace za přístupové modifikátory (private/public).',
  'inheritance': 'Dědičnost — potomek přebírá atributy a metody rodiče a může je rozšířit.',
  'Singleton': 'Návrhový vzor zajišťující existenci právě jedné instance třídy v celé aplikaci.',
  'Utility': 'Třída se statickými metodami, nelze instanciovat. Příklad: Math, Arrays, Collections.',
  'Messenger': 'Návrhový vzor — přepravka dat mezi objekty bez přímé závislosti (immutable objekt).',
  'Servant': 'Návrhový vzor — objekt poskytující funkcionalitu jiným objektům přes interface.',
  'delegate': 'V C# typově bezpečný ukazatel na metodu. Základ pro události (events).',
  'event': 'V C# mechanismus oznámení — objekt informuje ostatní, že nastala určitá situace.',
  'property': 'V C# kombinace get/set přístupu k privátnímu atributu. Umožňuje validaci.',
  'namespace': 'Jmenný prostor v C# — logické seskupení tříd, zabraňuje kolizím názvů.',
  'using': 'V C# direktiva pro import jmenného prostoru nebo správu zdrojů (IDisposable).',
  'Console': 'Třída v C# pro vstup/výstup na příkazové řádce. Console.WriteLine() vypíše text.',
  'String': 'Datový typ pro řetězce znaků. V Javě i C# je immutable (neměnný).',
  'int': 'Celé číslo (integer). V Javě 32-bit (-2 147 483 648 až 2 147 483 647).',
  'boolean': 'Logická hodnota — true nebo false. Základ podmínek a cyklů.',
  'OOP': 'Object-Oriented Programming — objektově orientované programování. Základní paradigma Javy a C#.',
  'JVM': 'Java Virtual Machine — virtuální stroj spouštějící Java bytecode. Zajišťuje přenositelnost.',
  'bytecode': 'Mezikód generovaný Java kompilátorem. Spouští ho JVM, ne přímo procesor.',
  'BlueJ': 'Výukové IDE pro Javu. Vizualizuje třídy a jejich vztahy v diagramu.',
  'IDE': 'Integrated Development Environment — vývojové prostředí (BlueJ, Visual Studio, IntelliJ).',
  'SQL': 'Structured Query Language — jazyk pro práci s relačními databázemi.',
  'SELECT': 'SQL příkaz pro výběr dat z tabulky. SELECT * FROM tabulka WHERE podmínka.',
  'JOIN': 'SQL operace spojující záznamy ze dvou tabulek na základě společného sloupce.',
  'PRIMARY KEY': 'Primární klíč — unikátní identifikátor záznamu v tabulce databáze.',
  'FOREIGN KEY': 'Cizí klíč — odkaz na primární klíč jiné tabulky. Zajišťuje referenční integritu.',
  'normalization': 'Normalizace databáze — proces odstraňování redundance a závislostí (1NF, 2NF, 3NF).',
  'ACID': 'Vlastnosti databázových transakcí: Atomicity, Consistency, Isolation, Durability.',
  'CSS': 'Cascading Style Sheets — jazyk pro stylování HTML dokumentů (barvy, rozložení, fonty).',
  'DOM': 'Document Object Model — stromová reprezentace HTML dokumentu v paměti prohlížeče.',
  'AJAX': 'Asynchronní komunikace se serverem bez obnovení celé stránky. Základ moderních webů.',
  'PHP': 'Serverový skriptovací jazyk pro dynamické webové stránky. Kód běží na serveru.',
  'Arduino': 'Open-source platforma pro programování mikrokontrolérů. Populární pro IoT projekty.',
  'ROS': 'Robot Operating System — framework pro vývoj robotického softwaru.',

  // ---- Matematika ----
  'derivace': 'Okamžitá rychlost změny funkce v daném bodě. Geometricky: směrnice tečny ke grafu.',
  'integrál': 'Opačná operace k derivaci. Geometricky: plocha pod grafem funkce.',
  'limita': 'Hodnota, ke které se funkce přibližuje, když se argument blíží určité hodnotě.',
  'matice': 'Obdélníkové pole čísel uspořádané do řádků a sloupců. Základ lineární algebry.',
  'determinant': 'Číslo přiřazené čtvercové matici. Nulový determinant = matice je singulární.',
  'vektor': 'Matematický objekt s velikostí a směrem. Reprezentován jako uspořádaná n-tice čísel.',
  'funkce': 'Předpis přiřazující každému prvku z definičního oboru právě jeden prvek z oboru hodnot.',
  'logaritmus': 'Inverzní funkce k exponenciální. log_a(x) = y znamená a^y = x.',
  'kombinatorika': 'Matematická disciplína zabývající se počítáním uspořádání a výběrů prvků.',
  'permutace': 'Uspořádané pořadí všech prvků množiny. P(n) = n! (faktoriál).',
  'kombinace': 'Výběr k prvků z n bez ohledu na pořadí. C(n,k) = n! / (k! * (n-k)!)',
  'pravděpodobnost': 'Míra náhodnosti jevu. P(A) = počet příznivých výsledků / celkový počet výsledků.',
  'statistika': 'Věda o sběru, analýze a interpretaci dat. Průměr, medián, rozptyl, směrodatná odchylka.',
  'geometrie': 'Matematická disciplína studující tvary, velikosti a vlastnosti prostoru.',
  'trigonometrie': 'Část geometrie zabývající se vztahy mezi stranami a úhly trojúhelníků (sin, cos, tan).',
  'kvadratická': 'Rovnice druhého stupně: ax² + bx + c = 0. Řeší se diskriminantem D = b² - 4ac.',
  'aritmetika': 'Základní matematické operace: sčítání, odčítání, násobení, dělení.',
  'algebra': 'Matematická disciplína pracující s proměnnými a algebraickými strukturami.',

  // ---- Angličtina ----
  'present simple': 'Přítomný čas prostý — vyjadřuje opakované děje, fakta, zvyky. I work every day.',
  'present continuous': 'Přítomný čas průběhový — děj probíhající právě teď. I am working now.',
  'past simple': 'Minulý čas prostý — ukončený děj v minulosti. I worked yesterday.',
  'past continuous': 'Minulý čas průběhový — děj probíhající v určitý okamžik v minulosti.',
  'present perfect': 'Předpřítomný čas — minulý děj s vazbou na přítomnost. I have finished.',
  'future simple': 'Budoucí čas — will + infinitiv. I will work tomorrow.',
  'conditional': 'Podmínkové věty. Type 1: If I study, I will pass. Type 2: If I studied, I would pass.',
  'passive voice': 'Trpný rod — předmět se stává podmětem. The book was written by him.',
  'modal verbs': 'Modální slovesa: can, could, may, might, must, should, would. Vyjadřují možnost, povinnost.',
  'gerund': 'Slovesné podstatné jméno — sloveso + -ing jako podstatné jméno. Swimming is fun.',
  'infinitive': 'Infinitiv — základní tvar slovesa (to + verb). I want to learn.',
  'phrasal verb': 'Frázové sloveso — sloveso + předložka/příslovce s novým významem. Give up = vzdát se.',
  'vocabulary': 'Slovní zásoba — soubor slov, která člověk zná a používá.',
  'grammar': 'Gramatika — soubor pravidel jazyka pro tvorbu správných vět.',
  'pronunciation': 'Výslovnost — způsob, jakým se slova vyslovují.',
  'IoT devices': 'Chytrá zařízení připojená k internetu — senzory, kamery, chytré spotřebiče.',
  'cybersecurity': 'Kybernetická bezpečnost — ochrana systémů a dat před digitálními hrozbami.',
  'algorithm': 'Algoritmus — přesný postup řešení problému. Základ programování.',
  'database': 'Databáze — organizovaná kolekce strukturovaných dat uložených elektronicky.',
  'network': 'Síť — propojení zařízení umožňující sdílení dat a komunikaci.',
  'encryption': 'Šifrování — převod dat do nečitelné podoby pro ochranu před neoprávněným přístupem.',
  'cloud computing': 'Cloudové výpočty — poskytování IT zdrojů přes internet na vyžádání.',
  'artificial intelligence': 'Umělá inteligence — simulace lidského myšlení počítačem.',
  'machine learning': 'Strojové učení — AI systémy, které se učí z dat bez explicitního programování.',
  'open source': 'Otevřený zdrojový kód — software, jehož kód je veřejně dostupný a upravitelný.',

  // ---- Čeština / Literatura ----
  'metafora': 'Přenesení pojmenování na základě podobnosti. "Zlaté ruce" = šikovný člověk.',
  'metonymie': 'Přenesení pojmenování na základě věcné souvislosti. "Číst Nerudu" = číst jeho dílo.',
  'personifikace': 'Přiřazení lidských vlastností neživým věcem nebo zvířatům. "Vítr si zpívá."',
  'hyperbola': 'Záměrné přehánění pro zdůraznění. "Čekal jsem věčnost." = čekal jsem dlouho.',
  'ironie': 'Říkáme opak toho, co myslíme. "To je ale krásné počasí!" (při dešti).',
  'epifora': 'Opakování stejného slova nebo skupiny slov na konci veršů.',
  'anafora': 'Opakování stejného slova nebo skupiny slov na začátku veršů.',
  'aliterace': 'Opakování stejné hlásky nebo skupiny hlásek na začátku slov. "Přes práh práší prach."',
  'rým': 'Zvuková shoda na konci veršů. Sdružený (AABB), střídavý (ABAB), obkročný (ABBA).',
  'verš': 'Jeden řádek básně. Skupina veršů tvoří strofu.',
  'strofa': 'Skupina veršů oddělená od ostatních. Analogie odstavce v próze.',
  'próza': 'Literární forma bez pravidelného rytmu a rýmu. Romány, povídky, novely.',
  'poezie': 'Literární forma s rytmem, rýmem a zvýšenou expresivitou jazyka.',
  'drama': 'Literární forma určená k divadelnímu provedení. Dialog jako hlavní prostředek.',
  'epika': 'Literární druh vyprávějící příběh. Zahrnuje romány, povídky, eposy.',
  'lyrika': 'Literární druh vyjadřující pocity a nálady autora. Básně, ódy, elegie.',
  'realismus': 'Literární směr 19. stol. — věrné zobrazení skutečnosti bez idealizace.',
  'naturalismus': 'Krajní forma realismu — determinismus, vliv prostředí a dědičnosti na člověka.',
  'romantismus': 'Literární směr 1. pol. 19. stol. — důraz na city, přírodu, individualismus.',
  'klasicismus': 'Literární směr 17.-18. stol. — vzor v antice, rozum nad city, pravidla tří jednot.',
  'existencialismus': 'Filozofický a literární směr — člověk je svobodný a zodpovědný za svá rozhodnutí.',
  'absurdní drama': 'Divadelní žánr zobrazující nesmyslnost lidské existence. Beckett, Ionesco, Havel.',
  'dystopie': 'Fiktivní negativní společnost budoucnosti. Opak utopie. Orwell: 1984, Huxley.',
  'alegorie': 'Rozvinutá metafora — celý příběh má přenesený smysl. Farma zvířat = SSSR.',
  'symbol': 'Obraz zastupující abstraktní pojem. Holubice = mír, had = zlo, kříž = křesťanství.',
  'motiv': 'Nejmenší tematická jednotka díla. Opakující se prvek nesoucí určitý význam.',
  'téma': 'Hlavní myšlenka nebo problém, který dílo zpracovává.',
  'kompozice': 'Způsob uspořádání a výstavby literárního díla (chronologická, retrospektivní).',
  'vypravěč': 'Ten, kdo v díle vypráví příběh. Er-forma (3. osoba) nebo Ich-forma (1. osoba).',
};

// Tooltip state
let tooltipEl = null;
let tooltipTimeout = null;

function initTooltip() {
  tooltipEl = document.getElementById('glossaryTooltip');
  if (!tooltipEl) return;

  // Close on outside click / scroll
  document.addEventListener('click', e => {
    if (!e.target.closest('.code-term') && !e.target.closest('#glossaryTooltip')) {
      hideTooltip();
    }
  });
  document.addEventListener('scroll', hideTooltip, { passive: true });
  tooltipEl.querySelector('.tooltip-close').addEventListener('click', hideTooltip);
}

function showTooltip(el, term, def) {
  if (!tooltipEl) return;
  clearTimeout(tooltipTimeout);

  tooltipEl.querySelector('.tooltip-term').textContent = term;
  tooltipEl.querySelector('.tooltip-def').textContent = def;
  tooltipEl.classList.add('visible');

  // Position
  positionTooltip(el);
}

function positionTooltip(anchor) {
  const rect = anchor.getBoundingClientRect();
  const tw = tooltipEl.offsetWidth || 300;
  const th = tooltipEl.offsetHeight || 100;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 10;

  let left = rect.left + rect.width / 2 - tw / 2;
  let top = rect.bottom + 8;

  // Clamp horizontally
  left = Math.max(margin, Math.min(left, vw - tw - margin));

  // Flip above if not enough space below
  if (top + th > vh - margin) {
    top = rect.top - th - 8;
  }

  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top = (top + window.scrollY) + 'px';
}

function hideTooltip() {
  if (!tooltipEl) return;
  tooltipEl.classList.remove('visible');
}

// Called after any content render to attach tooltip handlers
function attachTooltips(container) {
  container.querySelectorAll('.code-term[data-def]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const term = el.dataset.term;
      const def = el.dataset.def;
      // Toggle
      if (tooltipEl.classList.contains('visible') && tooltipEl.querySelector('.tooltip-term').textContent === term) {
        hideTooltip();
      } else {
        showTooltip(el, term, def);
      }
    });
    // Touch support
    el.addEventListener('touchend', e => {
      e.preventDefault();
      e.stopPropagation();
      const term = el.dataset.term;
      const def = el.dataset.def;
      if (tooltipEl.classList.contains('visible') && tooltipEl.querySelector('.tooltip-term').textContent === term) {
        hideTooltip();
      } else {
        showTooltip(el, term, def);
      }
    });
  });
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i+1)); [a[i],a[j]] = [a[j],a[i]]; }
  return a;
}

function deleteNote(topicId, idx) {
  const noteKey = 'notes_' + topicId;
  const notes = JSON.parse(localStorage.getItem(noteKey) || '[]');
  notes.splice(idx, 1);
  localStorage.setItem(noteKey, JSON.stringify(notes));
  // re-render by re-triggering topic render
  if (S.topic === topicId) renderTopic(S.cat, topicId);
}

// ---- EVENTS ----
function setupEvents() {
  document.getElementById('logoLink').addEventListener('click', e => { e.preventDefault(); goHome(); });
  document.getElementById('sidebarToggle').addEventListener('click', openSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
  document.getElementById('backdrop').addEventListener('click', closeSidebar);
  document.getElementById('backFromCat').addEventListener('click', goHome);
  document.getElementById('backFromTopic').addEventListener('click', () => { if (S.cat) goCategory(S.cat); else goHome(); });
  document.querySelectorAll('.hero-btn[data-cat]').forEach(btn => btn.addEventListener('click', () => goCategory(btn.dataset.cat)));

  // Hero CTA buttons
  const heroScrollBtn = document.getElementById('heroScrollBtn');
  if (heroScrollBtn) heroScrollBtn.addEventListener('click', () => {
    document.getElementById('countdownSection').scrollIntoView({ behavior: 'smooth' });
  });
  const heroQuizBtn = document.getElementById('heroQuizBtn');
  if (heroQuizBtn) heroQuizBtn.addEventListener('click', () => {
    buildQuiz('kyb'); history.pushState(null,'','#quiz'); showPage('quiz'); showGameBg(true);
    setBreadcrumb([{ label: 'Home', action: 'home' }, { label: 'Kvíz' }]);
    renderQuizQuestion();
  });

  // Accessibility panel
  const accessBtn = document.getElementById('accessBtn');
  const panel = document.getElementById('accessPanel');
  accessBtn.addEventListener('click', e => { e.stopPropagation(); panel.classList.toggle('open'); });
  document.addEventListener('click', e => { if (!panel.contains(e.target) && e.target !== accessBtn) panel.classList.remove('open'); });
  document.getElementById('accessClose').addEventListener('click', () => panel.classList.remove('open'));

  document.querySelectorAll('.size-btn').forEach(b => b.addEventListener('click', () => setFontSize(b.dataset.size)));
  document.querySelectorAll('.density-btn').forEach(b => b.addEventListener('click', () => setDensity(b.dataset.density)));
  document.getElementById('themeBtn').addEventListener('click', () => {
    // cycle through themes
    const themes = ['dark','light','midnight','slate','nordic','cyber','crimson','forest','ocean','amber','sunset','rose','lavender','mint','peach','sepia','noir','chalk'];
    const next = themes[(themes.indexOf(S.theme) + 1) % themes.length];
    setTheme(next);
  });
  document.querySelectorAll('.theme-swatch').forEach(b => b.addEventListener('click', () => {
    setTheme(b.dataset.theme);
    const lbl = document.getElementById('themePickerLabel');
    const dot = document.getElementById('themePickerDot');
    if (lbl) lbl.textContent = b.querySelector('.swatch-label').textContent;
    if (dot) dot.style.background = b.querySelector('.swatch-dot').style.background;
    document.getElementById('themeGrid').hidden = true;
    document.getElementById('themePickerToggle').classList.remove('open');
  }));
  const themeToggle = document.getElementById('themePickerToggle');
  const themeGrid = document.getElementById('themeGrid');
  if (themeToggle && themeGrid) {
    themeToggle.addEventListener('click', () => {
      const open = !themeGrid.hidden;
      themeGrid.hidden = open;
      themeToggle.classList.toggle('open', !open);
    });
  }

  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Practice
  document.getElementById('startQuiz').addEventListener('click', startQuiz);
  document.getElementById('startExercises').addEventListener('click', startExercises);
  document.getElementById('backFromExercises').addEventListener('click', () => { showGameBg(false); goHome(); });
  document.querySelectorAll('[data-diff-ex]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-diff-ex]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); exDifficulty = btn.dataset.diffEx;
    });
  });
  document.getElementById('backFromQuiz').addEventListener('click', () => { showGameBg(false); goHome(); });

  // Difficulty buttons
  document.querySelectorAll('.diff-btn[data-diff]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn[data-diff]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      quizDifficulty = btn.dataset.diff;
    });
  });

  setupSearch();
}



// ---- EXERCISES ----
let exQuestions = [], exIdx = 0, exScore = 0, exDifficulty = 'all';

function buildExercises(topicId) {
  if (typeof EXERCISES === 'undefined') { exQuestions = []; return; }
  let pool = [];
  EXERCISES.forEach(t => {
    if (topicId === 'all' || t.topic_id === topicId) pool.push(...t.exercises);
  });
  if (exDifficulty !== 'all') pool = pool.filter(e => e.difficulty === exDifficulty);
  exQuestions = shuffle(pool).slice(0, 20);
  exIdx = 0; exScore = 0;
}

function startExercises() {
  const topicId = document.getElementById('exTopicSelect').value;
  buildExercises(topicId);
  if (!exQuestions.length) return;
  history.pushState(null, '', '#exercises');
  showPage('exercises');
  showGameBg(true);
  setBreadcrumb([{ label: 'Home', action: 'home' }, { label: 'Cvi\u010den\u00ed' }]);
  renderExercise();
}

function renderExercise() {
  const wrap = document.getElementById('exWrap');
  if (!wrap) return;
  if (exIdx >= exQuestions.length) {
    const pct = Math.round(exScore / exQuestions.length * 100);
    const grade = pct >= 80 ? '\u2713 Vyborn\u011b!' : pct >= 60 ? 'Dob\u0159e' : 'Procvi\u010duj d\u00e1l';
    wrap.innerHTML = `<div class="ex-score glass-card card-enter">
      <div class="ex-score-num">${exScore}<span>/${exQuestions.length}</span></div>
      <div class="ex-score-pct">${pct}%</div>
      <div class="ex-score-label">${grade}</div>
      <button class="ex-restart-btn" id="exRestart">Zkusit znovu</button>
    </div>`;
    document.getElementById('exRestart').addEventListener('click', () => {
      buildExercises(document.getElementById('exTopicSelect').value); renderExercise();
    });
    return;
  }
  const q = exQuestions[exIdx];
  document.getElementById('exProgress').textContent = `${exIdx + 1} / ${exQuestions.length}`;
  let bar = document.getElementById('exProgressBar');
  if (!bar) {
    const bw = document.createElement('div');
    bw.className = 'ex-progress-bar-wrap';
    bw.innerHTML = '<div class="ex-progress-bar-fill" id="exProgressBar"></div>';
    wrap.parentElement.insertBefore(bw, wrap);
    bar = document.getElementById('exProgressBar');
  }
  bar.style.width = Math.round(exIdx / exQuestions.length * 100) + '%';
  if (q.type === 'dragdrop') renderDragDrop(wrap, q);
  else if (q.type === 'fill') renderFillEx(wrap, q);
  else if (q.type === 'order') renderOrder(wrap, q);
  else { exIdx++; renderExercise(); }
}

function exDiffBadge(d) {
  const l = { easy: 'Lehk\u00e1', medium: 'St\u0159edn\u00ed', hard: 'T\u011bk\u00e1' };
  return `<span class="diff-badge ${d}">${l[d]||d}</span>`;
}
function exTypeIcon(t) {
  const icons = {
    dragdrop: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l4-4 4 4M9 5v14M19 15l-4 4-4-4M15 19V5"/></svg> Drag & Drop`,
    fill:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg> Dopln\u011b`,
    order:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></svg> Se\u0159a\u010f`,
  };
  return icons[t] || t;
}
function exHeader(q) {
  return `<div class="ex-header"><span class="ex-type-badge">${exTypeIcon(q.type)}</span>${exDiffBadge(q.difficulty)}</div>
  <div class="ex-instruction">${esc(q.instruction)}</div>`;
}
function showFeedback(ok, explanation) {
  const fb = document.getElementById('exFeedback');
  fb.className = 'ex-feedback show ' + (ok ? 'ok' : 'fail');
  fb.innerHTML = `<strong>${ok ? '\u2713 Spr\u00e1vn\u011b!' : '\u2717 \u0160patn\u011b'}</strong>${explanation ? ' \u2014 ' + esc(explanation) : ''}`;
  document.getElementById('exCheck').disabled = true;
  document.getElementById('exNext').classList.add('show');
}
function bindNext() {
  document.getElementById('exNext').addEventListener('click', () => { exIdx++; renderExercise(); });
}

// ── DRAG & DROP ───────────────────────────────────────────────────────────────
function renderDragDrop(wrap, q) {
  const blanks = q.blanks || [];
  let bi = 0;
  const codeHtml = esc(q.code.replace(/\\n/g, '\n')).replace(/___BLANK___/g, () => {
    const i = bi++;
    return `<span class="ex-blank" data-blank="${i}" data-answer="${esc(blanks[i]||'')}"><span class="ex-blank-inner">?</span></span>`;
  });
  const opts = shuffle([...q.options]);
  wrap.innerHTML = `<div class="ex-card card-enter">
    ${exHeader(q)}
    <div class="ex-code-wrap"><div class="ex-code-lang">C# / Java</div><pre class="ex-code">${codeHtml}</pre></div>
    <div class="ex-options" id="exOptions">${opts.map((o,i)=>`<div class="ex-option" draggable="true" data-idx="${i}" data-val="${esc(o)}">${esc(o)}</div>`).join('')}</div>
    <div class="ex-feedback" id="exFeedback"></div>
    <div class="ex-btn-row"><button class="ex-check-btn" id="exCheck">Zkontrolovat</button><button class="ex-next-btn" id="exNext">Dal\u0161\u00ed \u2192</button></div>
  </div>`;

  const allBlanks = wrap.querySelectorAll('.ex-blank');
  const allOpts   = wrap.querySelectorAll('.ex-option');

  function fillBlank(blank, val, optEl) {
    blank.querySelector('.ex-blank-inner').textContent = val;
    blank.classList.add('filled'); blank.dataset.filled = val;
    blank.setAttribute('draggable','true');
    if (optEl) optEl.classList.add('used');
  }
  function clearBlank(blank) {
    const val = blank.dataset.filled;
    blank.querySelector('.ex-blank-inner').textContent = '?';
    blank.classList.remove('filled','correct','wrong');
    delete blank.dataset.filled; blank.removeAttribute('draggable');
    wrap.querySelectorAll('.ex-option').forEach(o => { if (o.dataset.val === val) o.classList.remove('used'); });
  }

  allOpts.forEach(opt => {
    opt.addEventListener('dragstart', e => {
      e.dataTransfer.setData('val', opt.dataset.val);
      e.dataTransfer.setData('src', 'opt');
      e.dataTransfer.setData('optIdx', opt.dataset.idx);
      opt.classList.add('dragging');
    });
    opt.addEventListener('dragend', () => opt.classList.remove('dragging'));
    opt.addEventListener('click', () => {
      if (opt.classList.contains('used')) return;
      const next = wrap.querySelector('.ex-blank:not(.filled)');
      if (next) fillBlank(next, opt.dataset.val, opt);
    });
  });

  allBlanks.forEach(blank => {
    blank.addEventListener('dragstart', e => {
      if (!blank.classList.contains('filled')) { e.preventDefault(); return; }
      e.dataTransfer.setData('val', blank.dataset.filled);
      e.dataTransfer.setData('src', 'blank');
      e.dataTransfer.setData('blankIdx', blank.dataset.blank);
      blank.classList.add('dragging');
    });
    blank.addEventListener('dragend', () => blank.classList.remove('dragging'));
    blank.addEventListener('dragover', e => { e.preventDefault(); blank.classList.add('drag-over'); });
    blank.addEventListener('dragleave', () => blank.classList.remove('drag-over'));
    blank.addEventListener('drop', e => {
      e.preventDefault(); blank.classList.remove('drag-over');
      const val = e.dataTransfer.getData('val');
      const src = e.dataTransfer.getData('src');
      if (src === 'blank') {
        const srcBlank = wrap.querySelector(`.ex-blank[data-blank="${e.dataTransfer.getData('blankIdx')}"]`);
        if (srcBlank && srcBlank !== blank) {
          const dstVal = blank.dataset.filled;
          if (dstVal) fillBlank(srcBlank, dstVal, null);
          else clearBlank(srcBlank);
          fillBlank(blank, srcBlank.dataset.filled || val, null);
        }
      } else {
        if (blank.dataset.filled) {
          wrap.querySelectorAll('.ex-option').forEach(o => { if (o.dataset.val === blank.dataset.filled) o.classList.remove('used'); });
        }
        const optEl = wrap.querySelector(`.ex-option[data-idx="${e.dataTransfer.getData('optIdx')}"]`);
        fillBlank(blank, val, optEl);
      }
    });
    blank.addEventListener('click', () => { if (blank.classList.contains('filled')) clearBlank(blank); });
  });

  // Drop on options area = return blank to pool
  document.getElementById('exOptions').addEventListener('dragover', e => e.preventDefault());
  document.getElementById('exOptions').addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer.getData('src') !== 'blank') return;
    const b = wrap.querySelector(`.ex-blank[data-blank="${e.dataTransfer.getData('blankIdx')}"]`);
    if (b) clearBlank(b);
  });

  document.getElementById('exCheck').addEventListener('click', () => {
    let ok = 0;
    allBlanks.forEach(b => {
      const correct = (b.dataset.filled||'').trim().toLowerCase() === (b.dataset.answer||'').trim().toLowerCase();
      b.classList.add(correct ? 'correct' : 'wrong');
      if (correct) ok++;
    });
    if (ok === allBlanks.length) exScore++;
    showFeedback(ok === allBlanks.length, q.explanation);
  });
  bindNext();
}

// ── FILL ─────────────────────────────────────────────────────────────────────
function renderFillEx(wrap, q) {
  wrap.innerHTML = `<div class="ex-card card-enter">
    ${exHeader(q)}
    <div class="ex-fill-row">
      <input class="ex-fill-input" id="exFillInput" placeholder="Napi\u0161 odpov\u011b\u010f\u2026" autocomplete="off" spellcheck="false">
      <button class="ex-check-btn" id="exCheck">OK</button>
    </div>
    <div class="ex-feedback" id="exFeedback"></div>
    <button class="ex-next-btn" id="exNext">Dal\u0161\u00ed \u2192</button>
  </div>`;
  const input = document.getElementById('exFillInput');
  setTimeout(() => input.focus(), 80);
  function check() {
    const val = input.value.trim().toLowerCase();
    if (!val) return;
    const correct = (q.answer||'').trim().toLowerCase();
    const alts = (q.accept_also||[]).map(a=>a.trim().toLowerCase());
    const ok = val === correct || alts.includes(val);
    input.classList.add(ok ? 'correct' : 'wrong');
    input.disabled = true;
    if (ok) exScore++;
    const fb = document.getElementById('exFeedback');
    fb.className = 'ex-feedback show ' + (ok ? 'ok' : 'fail');
    fb.innerHTML = ok
      ? `<strong>\u2713 Spr\u00e1vn\u011b!</strong>${q.explanation ? ' \u2014 ' + esc(q.explanation) : ''}`
      : `<strong>\u2717 Spr\u00e1vn\u00e1 odpov\u011b\u010f: <code>${esc(q.answer)}</code></strong>${q.explanation ? '<br>' + esc(q.explanation) : ''}`;
    document.getElementById('exCheck').disabled = true;
    document.getElementById('exNext').classList.add('show');
  }
  document.getElementById('exCheck').addEventListener('click', check);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  bindNext();
}

// ── ORDER ─────────────────────────────────────────────────────────────────────
function renderOrder(wrap, q) {
  const correctLines = (q.correct_order||[]).map(i => q.lines[i]);
  const shuffled = shuffle([...q.lines]);
  wrap.innerHTML = `<div class="ex-card card-enter">
    ${exHeader(q)}
    <div class="ex-order-hint">P\u0159et\u00e1hni \u0159\u00e1dky do spr\u00e1vn\u00e9ho po\u0159ad\u00ed</div>
    <div class="ex-order-list" id="exOrderList">
      ${shuffled.map(l=>`<div class="ex-order-item" draggable="true" data-line="${esc(l)}">
        <span class="ex-order-handle"><svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor"><circle cx="3" cy="3" r="1.5"/><circle cx="7" cy="3" r="1.5"/><circle cx="3" cy="8" r="1.5"/><circle cx="7" cy="8" r="1.5"/><circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/></svg></span>
        <code>${esc(l)}</code>
      </div>`).join('')}
    </div>
    <div class="ex-feedback" id="exFeedback"></div>
    <div class="ex-btn-row"><button class="ex-check-btn" id="exCheck">Zkontrolovat</button><button class="ex-next-btn" id="exNext">Dal\u0161\u00ed \u2192</button></div>
  </div>`;

  const list = document.getElementById('exOrderList');
  let dragItem = null;

  function moveItem(target) {
    if (!dragItem || dragItem === target) return;
    const items = [...list.querySelectorAll('.ex-order-item')];
    if (items.indexOf(dragItem) < items.indexOf(target)) list.insertBefore(dragItem, target.nextSibling);
    else list.insertBefore(dragItem, target);
  }

  list.querySelectorAll('.ex-order-item').forEach(item => {
    // Desktop drag
    item.addEventListener('dragstart', e => { dragItem = item; item.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); list.querySelectorAll('.ex-order-item').forEach(i=>i.classList.remove('drag-over')); });
    item.addEventListener('dragover', e => { e.preventDefault(); if (item===dragItem) return; list.querySelectorAll('.ex-order-item').forEach(i=>i.classList.remove('drag-over')); item.classList.add('drag-over'); });
    item.addEventListener('drop', e => {
      e.preventDefault(); item.classList.remove('drag-over');
      moveItem(item);
    });

    // Touch drag
    item.addEventListener('touchstart', e => {
      dragItem = item;
      item.classList.add('dragging');
    }, { passive: true });
    item.addEventListener('touchend', e => {
      item.classList.remove('dragging');
      list.querySelectorAll('.ex-order-item').forEach(i => i.classList.remove('drag-over'));
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.ex-order-item');
      if (target && target !== dragItem) moveItem(target);
      dragItem = null;
    });
    item.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.touches[0];
      list.querySelectorAll('.ex-order-item').forEach(i => i.classList.remove('drag-over'));
      const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.ex-order-item');
      if (target && target !== dragItem) target.classList.add('drag-over');
    }, { passive: false });
  });

  document.getElementById('exCheck').addEventListener('click', () => {
    const current = [...list.querySelectorAll('.ex-order-item')].map(i=>i.dataset.line);
    const ok = current.every((l,i) => l === correctLines[i]);
    if (ok) exScore++;
    list.querySelectorAll('.ex-order-item').forEach((item,i) => item.classList.add(item.dataset.line===correctLines[i]?'correct':'wrong'));
    showFeedback(ok, q.explanation);
  });
  bindNext();
}


function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('backdrop').classList.add('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('backdrop').classList.remove('show');
}
