#!/usr/bin/env python3
import re

with open('/root/maturita-web-uceni3/app.js', 'rb') as f:
    content = f.read()

start_marker = b"\n// ---- EXERCISES ----\n"
end_marker   = b"\nfunction openSidebar() {"

start_idx = content.find(start_marker)
end_idx   = content.find(end_marker)
print(f"start={start_idx}, end={end_idx}")

new_exercises = """
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
  setBreadcrumb([{ label: 'Home', action: 'home' }, { label: 'Cvi\\u010den\\u00ed' }]);
  renderExercise();
}

function renderExercise() {
  const wrap = document.getElementById('exWrap');
  if (!wrap) return;
  if (exIdx >= exQuestions.length) {
    const pct = Math.round(exScore / exQuestions.length * 100);
    const grade = pct >= 80 ? '\\u2713 Vyborn\\u011b!' : pct >= 60 ? 'Dob\\u0159e' : 'Procvi\\u010duj d\\u00e1l';
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
  const l = { easy: 'Lehk\\u00e1', medium: 'St\\u0159edn\\u00ed', hard: 'T\\u011bk\\u00e1' };
  return `<span class="diff-badge ${d}">${l[d]||d}</span>`;
}
function exTypeIcon(t) {
  const icons = {
    dragdrop: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l4-4 4 4M9 5v14M19 15l-4 4-4-4M15 19V5"/></svg> Drag & Drop`,
    fill:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg> Dopln\\u011b`,
    order:    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></svg> Se\\u0159a\\u010f`,
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
  fb.innerHTML = `<strong>${ok ? '\\u2713 Spr\\u00e1vn\\u011b!' : '\\u2717 \\u0160patn\\u011b'}</strong>${explanation ? ' \\u2014 ' + esc(explanation) : ''}`;
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
  const codeHtml = esc(q.code.replace(/\\\\n/g, '\\n')).replace(/___BLANK___/g, () => {
    const i = bi++;
    return `<span class="ex-blank" data-blank="${i}" data-answer="${esc(blanks[i]||'')}"><span class="ex-blank-inner">?</span></span>`;
  });
  const opts = shuffle([...q.options]);
  wrap.innerHTML = `<div class="ex-card card-enter">
    ${exHeader(q)}
    <div class="ex-code-wrap"><div class="ex-code-lang">C# / Java</div><pre class="ex-code">${codeHtml}</pre></div>
    <div class="ex-options" id="exOptions">${opts.map((o,i)=>`<div class="ex-option" draggable="true" data-idx="${i}" data-val="${esc(o)}">${esc(o)}</div>`).join('')}</div>
    <div class="ex-feedback" id="exFeedback"></div>
    <div class="ex-btn-row"><button class="ex-check-btn" id="exCheck">Zkontrolovat</button><button class="ex-next-btn" id="exNext">Dal\\u0161\\u00ed \\u2192</button></div>
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
      <input class="ex-fill-input" id="exFillInput" placeholder="Napi\\u0161 odpov\\u011b\\u010f\\u2026" autocomplete="off" spellcheck="false">
      <button class="ex-check-btn" id="exCheck">OK</button>
    </div>
    <div class="ex-feedback" id="exFeedback"></div>
    <button class="ex-next-btn" id="exNext">Dal\\u0161\\u00ed \\u2192</button>
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
      ? `<strong>\\u2713 Spr\\u00e1vn\\u011b!</strong>${q.explanation ? ' \\u2014 ' + esc(q.explanation) : ''}`
      : `<strong>\\u2717 Spr\\u00e1vn\\u00e1 odpov\\u011b\\u010f: <code>${esc(q.answer)}</code></strong>${q.explanation ? '<br>' + esc(q.explanation) : ''}`;
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
    <div class="ex-order-hint">P\\u0159et\\u00e1hni \\u0159\\u00e1dky do spr\\u00e1vn\\u00e9ho po\\u0159ad\\u00ed</div>
    <div class="ex-order-list" id="exOrderList">
      ${shuffled.map(l=>`<div class="ex-order-item" draggable="true" data-line="${esc(l)}">
        <span class="ex-order-handle"><svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor"><circle cx="3" cy="3" r="1.5"/><circle cx="7" cy="3" r="1.5"/><circle cx="3" cy="8" r="1.5"/><circle cx="7" cy="8" r="1.5"/><circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/></svg></span>
        <code>${esc(l)}</code>
      </div>`).join('')}
    </div>
    <div class="ex-feedback" id="exFeedback"></div>
    <div class="ex-btn-row"><button class="ex-check-btn" id="exCheck">Zkontrolovat</button><button class="ex-next-btn" id="exNext">Dal\\u0161\\u00ed \\u2192</button></div>
  </div>`;

  const list = document.getElementById('exOrderList');
  let dragItem = null;
  list.querySelectorAll('.ex-order-item').forEach(item => {
    item.addEventListener('dragstart', e => { dragItem = item; item.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); list.querySelectorAll('.ex-order-item').forEach(i=>i.classList.remove('drag-over')); });
    item.addEventListener('dragover', e => { e.preventDefault(); if (item===dragItem) return; list.querySelectorAll('.ex-order-item').forEach(i=>i.classList.remove('drag-over')); item.classList.add('drag-over'); });
    item.addEventListener('drop', e => {
      e.preventDefault(); item.classList.remove('drag-over');
      if (!dragItem || dragItem===item) return;
      const items = [...list.querySelectorAll('.ex-order-item')];
      if (items.indexOf(dragItem) < items.indexOf(item)) list.insertBefore(dragItem, item.nextSibling);
      else list.insertBefore(dragItem, item);
    });
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

"""

new_bytes = new_exercises.encode('utf-8')
result = content[:start_idx] + new_bytes + content[end_idx:]
with open('/root/maturita-web-uceni3/app.js', 'wb') as f:
    f.write(result)
print("OK")
