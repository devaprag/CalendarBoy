// ---------- Constants ----------
const STORE_KEY = 'calendarBoy.v1';
const YEAR = 2027, MONTH = 0; // January
const MONTH_FIRST = '2027-01-01', MONTH_LAST = '2027-01-31';
const MAX_VISIBLE = 3;
const DEFAULT_TRIP_DAYS = 3;

// ---------- State and storage ----------
let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (isValidState(saved)) return saved;
  } catch (err) { /* storage blocked or corrupt: fall back to the demo data */ }
  return structuredClone(SEED);
}
function isValidState(s) {
  return !!s && s.version === 1 && !!s.settings && Array.isArray(s.types) && Array.isArray(s.events);
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (err) { /* ignore */ }
}
function commit() { saveState(); render(); }

// ---------- Date helpers (YYYY-MM-DD keys, local time) ----------
function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function key(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function shiftKey(k, n) { return key(addDays(parseDate(k), n)); }
function dayDiff(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
function inMonth(k) { return !!k && k >= MONTH_FIRST && k <= MONTH_LAST; }
function fmtDate(k) { return parseDate(k).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
function fmtShort(k) { return parseDate(k).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

const firstOfMonth = new Date(YEAR, MONTH, 1);
const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());

// ---------- Queries ----------
const today = () => state.settings.pretendToday;
const typeOf = e => state.types.find(t => t.id === e.typeId);
const typeById = id => state.types.find(t => t.id === id);
const byId = id => state.events.find(e => e.id === id);
const live = () => state.events.filter(e => !e.deletedAt);
const scheduled = () => live().filter(e => e.start);
const isTrip = e => !!typeOf(e)?.multiDay;
const isPast = e => !!e.start && e.start <= today(); // today counts as the past
const isMissed = e => isPast(e) && !e.done;
const isHidden = e => state.settings.showDoneOnly && isMissed(e);
const stateClass = e => [e.done && 'done', isMissed(e) && 'missed'].filter(Boolean).join(' ');
const newId = prefix => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function eventsOn(k) {
  return scheduled()
    .filter(e => !e.end && e.start === k && !isHidden(e))
    .sort((a, b) => (a.time || '~').localeCompare(b.time || '~'));
}

function typeStats(t) {
  const evs = scheduled().filter(e => e.typeId === t.id);
  const lastDone = evs.filter(e => e.done && e.start <= today()).map(e => e.start).sort().pop() || null;
  const nextDue = t.cycleDays && lastDone ? shiftKey(lastDone, t.cycleDays) : null;
  return {
    done: evs.filter(e => e.done).length,
    planned: evs.filter(e => !e.done && !isPast(e)).length,
    lastDone,
    nextDue,
  };
}

// ---------- Elements ----------
const $ = id => document.getElementById(id);
const weeksEl = $('weeks'), typesEl = $('types'), backlogEl = $('backlog');
const popover = $('popover'), popBody = $('pop-body');
const typeDialog = $('type-dialog'), typeForm = $('type-form');
const todayInput = $('today-input'), importInput = $('import-file');

// ---------- Render ----------
function colorVars(type) {
  const c = COLORS[type.color] || COLORS.sky;
  return `--c:${c.c};--tint:${c.tint}`;
}
function chip(type, iconKey) {
  return `<span class="chip" style="${colorVars(type)}">${ICONS[iconKey || type.icon] || ICONS.camera}</span>`;
}
function renderEvent(e) {
  return `<button class="event ${stateClass(e)}" data-id="${e.id}" data-drag="event" title="${esc(e.title)}">
    ${chip(typeOf(e))}<span class="label">${esc(e.title)}${e.time ? `<small>${esc(e.time)}</small>` : ''}</span>
  </button>`;
}

function render() {
  todayInput.value = today();
  $('filter-btn').setAttribute('aria-pressed', state.settings.showDoneOnly);
  renderTypes();
  renderBacklog();
  renderWeeks();
  renderBin();
}

function renderWeeks() {
  const trips = scheduled().filter(e => e.end && !isHidden(e)).sort((a, b) => a.start.localeCompare(b.start));
  let html = '';
  for (let w = 0; w < 6; w++) {
    const weekStart = addDays(gridStart, w * 7);
    const ws = key(weekStart), we = key(addDays(weekStart, 6));

    // Overlapping trips in the same week get stacked lanes.
    const laneEnds = [];
    const segments = trips.filter(t => t.start <= we && t.end >= ws).map(t => {
      const from = t.start > ws ? t.start : ws, to = t.end < we ? t.end : we;
      let lane = laneEnds.findIndex(end => end < from);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = to;
      return renderTripSegment(t, ws, from, to, lane);
    });

    let cells = '';
    for (let i = 0; i < 7; i++) {
      const d = addDays(weekStart, i), k = key(d);
      const evs = eventsOn(k);
      const shown = evs.length > MAX_VISIBLE ? evs.slice(0, MAX_VISIBLE - 1) : evs;
      const hidden = evs.length - shown.length;
      cells += `<div class="day${inMonth(k) ? '' : ' other'}"${inMonth(k) ? ` data-drop="day" data-date="${k}"` : ''}>
        <div class="date${k === today() ? ' today' : ''}">${d.getDate()}</div>
        <div class="lane"></div>
        <div class="events">
          ${shown.map(renderEvent).join('')}
          ${hidden ? `<button class="more" data-action="more" data-day="${k}">+${hidden} more</button>` : ''}
        </div>
      </div>`;
    }
    html += `<div class="week" data-week-start="${ws}" style="--lanes:${laneEnds.length}">${cells}${segments.join('')}</div>`;
  }
  weeksEl.innerHTML = html;
}

// One strip per week row: takeoff at the start day, dashed path, landing at the end day.
function renderTripSegment(t, ws, from, to, lane) {
  const type = typeOf(t);
  const col = dayDiff(ws, from), span = dayDiff(from, to) + 1;
  const startsHere = from === t.start, endsHere = to === t.end;
  const pathClass = ['path', !endsHere && 'to-edge', !startsHere && 'from-edge'].filter(Boolean).join(' ');
  return `<button class="trip ${stateClass(t)}" data-id="${t.id}" data-drag="event" title="${esc(t.title)}"
      style="${colorVars(type)};--lane:${lane};left:calc(${col} * 100% / 7 + 4px);width:calc(${span} * 100% / 7 - ${endsHere ? 8 : 4}px)">
    ${startsHere ? chip(type, type.icon) : ''}
    <span class="${pathClass}">${span >= 2 ? `<span>${esc(t.title)}${startsHere ? '' : ' (cont.)'}</span>` : ''}</span>
    ${endsHere ? chip(type, type.endIcon || type.icon) : '<span class="arrow">&#8250;</span>'}
  </button>`;
}

function cycleLabel(n) {
  if (n === 1) return 'Every day';
  if (n % 7 === 0) return n === 7 ? 'Every week' : `Every ${n / 7} weeks`;
  return `Every ${n} days`;
}

function renderTypes() {
  typesEl.innerHTML = state.types.map(t => {
    const s = typeStats(t);
    const counts = `${s.done}${t.goalPerMonth ? ` / ${t.goalPerMonth}` : ''} done · ${s.planned} planned`;
    const pct = t.goalPerMonth ? Math.min(100, Math.round(s.done / t.goalPerMonth * 100)) : 0;
    let cycle = '';
    if (t.cycleDays) {
      let due = 'not done yet';
      let overdue = false;
      if (s.nextDue) {
        overdue = s.nextDue < today();
        due = overdue ? `overdue since ${fmtShort(s.nextDue)}`
          : s.nextDue === today() ? 'due today' : `next due ${fmtShort(s.nextDue)}`;
      }
      cycle = `<div class="stat${overdue ? ' overdue' : ''}">${cycleLabel(t.cycleDays)} · ${due}</div>`;
    }
    return `<li class="type-row" style="${colorVars(t)}">
      <span class="type-chip" data-drag="type" data-type-id="${t.id}" title="Drag onto a day">${chip(t)}</span>
      <div class="type-info">
        <div class="type-name"><span>${esc(t.name)}</span>
          <button class="icon-btn" data-action="edit-type" data-type-id="${t.id}" aria-label="Edit ${esc(t.name)}" title="Edit">&#9998;</button></div>
        ${t.goalPerMonth ? `<div class="progress"><span style="width:${pct}%"></span></div>` : ''}
        <div class="stat">${counts}</div>
        <div class="stat">Last done ${s.lastDone ? fmtShort(s.lastDone) : '—'}</div>
        ${cycle}
      </div>
    </li>`;
  }).join('');
}

function renderBacklog() {
  const items = live().filter(e => !e.start);
  backlogEl.innerHTML = items.length
    ? items.map(renderEvent).join('')
    : '<p class="empty">Drag events here for “someday”.</p>';
}

function renderBin() {
  const n = state.events.filter(e => e.deletedAt).length;
  $('bin-icon').innerHTML = n ? ICONS.binFull : ICONS.bin;
  $('bin-badge').hidden = !n;
  $('bin-badge').textContent = n;
}

// ---------- Event changes ----------
// Updates classes in place instead of re-rendering, so the second click of a double-click
// still lands on the same element (two clicks toggle twice, then dblclick opens the popup).
function toggleDone(id) {
  const e = byId(id);
  if (!e) return;
  e.done = !e.done;
  saveState();
  document.querySelectorAll(`.event[data-id="${id}"], .trip[data-id="${id}"]`).forEach(el => {
    el.classList.toggle('done', e.done);
    el.classList.toggle('missed', isMissed(e));
  });
  renderTypes();
}

// Moves an event so it starts on `start`, keeping a trip's length. Returns false if it won't fit in January.
function moveTo(e, start) {
  if (isTrip(e)) {
    const len = e.start && e.end ? dayDiff(e.start, e.end) + 1 : (e.days || DEFAULT_TRIP_DAYS);
    const end = shiftKey(start, len - 1);
    if (!inMonth(start) || !inMonth(end)) return false;
    e.start = start;
    e.end = end;
  } else {
    if (!inMonth(start)) return false;
    e.start = start;
  }
  return true;
}

function unschedule(e) {
  if (isTrip(e) && e.start && e.end) e.days = dayDiff(e.start, e.end) + 1;
  e.start = null;
  e.end = null;
}

function addEvent(type, start) {
  const e = { id: newId('e'), typeId: type.id, title: type.name, start: null, end: null, time: '', notes: '', done: false, deletedAt: null };
  if (start && !moveTo(e, start)) { e.start = start; e.end = MONTH_LAST; }
  state.events.push(e);
  commit();
}

function duplicateEvent(id) {
  const e = byId(id);
  const copy = { ...e, id: newId('e'), done: false, deletedAt: null };
  if (e.start) {
    const start = shiftKey(e.start, 1), end = e.end ? shiftKey(e.end, 1) : null;
    if ((end || start) <= MONTH_LAST) { copy.start = start; copy.end = end; }
  }
  state.events.push(copy);
  closePopover();
  commit();
}

function removeEvent(id) {
  byId(id).deletedAt = new Date().toISOString();
  closePopover();
  commit();
}

// ---------- Popover ----------
let popoverView = null; // { kind: 'event', id } | { kind: 'day', day } | { kind: 'bin' }

function popoverHtml(v) {
  if (v.kind === 'day') return dayList(v.day);
  if (v.kind === 'bin') return binList();
  return eventDetail(byId(v.id));
}

function showPopover(view, anchor) {
  popoverView = view;
  popBody.innerHTML = popoverHtml(view);
  popover.hidden = false;
  const r = anchor.getBoundingClientRect();
  const pw = popover.offsetWidth, ph = popover.offsetHeight, margin = 16;
  let left = r.right + 8;
  if (left + pw > window.innerWidth - margin) left = r.left - pw - 8;
  left = Math.max(margin, Math.min(left, window.innerWidth - pw - margin));
  const top = Math.max(margin, Math.min(r.top, window.innerHeight - ph - margin));
  popover.style.left = left + 'px';
  popover.style.top = top + 'px';
}

function refreshPopover() {
  if (popover.hidden || !popoverView) return;
  if (popoverView.kind === 'event' && !byId(popoverView.id)) return closePopover();
  popBody.innerHTML = popoverHtml(popoverView);
}

function closePopover() { popover.hidden = true; popoverView = null; }

function eventDetail(e) {
  const type = typeOf(e);
  const status = !e.start ? 'In backlog' : e.done ? 'Done' : isPast(e) ? 'Not done' : 'Planned';
  const range = `min="${MONTH_FIRST}" max="${MONTH_LAST}"`;
  const dates = type.multiDay
    ? `<div class="field-row">
        <label class="field">Start<input type="date" data-field="start" ${range} value="${e.start || ''}"></label>
        <label class="field">End<input type="date" data-field="end" ${range} value="${e.end || ''}"></label>
      </div>`
    : `<label class="field">Date <small>(empty = backlog)</small><input type="date" data-field="start" ${range} value="${e.start || ''}"></label>`;
  return `<div class="pop-head ${stateClass(e)}">${chip(type)}<div>
      <input class="pop-title" data-field="title" value="${esc(e.title)}" aria-label="Title">
      <div class="pop-type">${esc(type.name)}</div></div></div>
    <div class="pop-status">
      <button class="btn ${e.done ? 'on' : ''}" data-action="toggle-done">${e.done ? '&#10003; Done' : 'Mark as done'}</button>
      <span>${status}</span>
    </div>
    ${dates}
    <label class="field">Time<input data-field="time" value="${esc(e.time)}" placeholder="e.g. 07:00"></label>
    <label class="field">Notes<textarea data-field="notes" rows="2">${esc(e.notes)}</textarea></label>
    <div class="pop-actions">
      <button class="btn" data-action="duplicate">Duplicate</button>
      <button class="btn danger" data-action="remove">Remove</button>
    </div>`;
}

function dayList(k) {
  const evs = eventsOn(k);
  return `<p class="pop-heading">${fmtDate(k)}</p>${evs.map(renderEvent).join('') || '<p class="empty">Nothing here.</p>'}
    <p class="hint">Click to mark done · double-click for details</p>`;
}

function binList() {
  const items = state.events.filter(e => e.deletedAt).sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
  if (!items.length) return '<p class="pop-heading">Recycling bin</p><p class="empty">The bin is empty.</p>';
  return `<p class="pop-heading">Recycling bin</p>
    ${items.map(e => `<div class="bin-item">${chip(typeOf(e))}
      <span class="label">${esc(e.title)}<small>${e.start ? fmtShort(e.start) : 'Backlog'}</small></span>
      <button class="btn small" data-action="restore" data-id="${e.id}">Restore</button></div>`).join('')}
    <div class="pop-actions"><button class="btn danger" data-action="empty-bin">Empty bin</button></div>`;
}

popover.addEventListener('change', ev => {
  const field = ev.target.dataset.field;
  if (!field || popoverView?.kind !== 'event') return;
  const e = byId(popoverView.id);
  const value = ev.target.value;
  if (field === 'title') e.title = value.trim() || typeOf(e).name;
  else if (field === 'time' || field === 'notes') e[field] = value.trim();
  else if (field === 'start') {
    if (!value) unschedule(e);
    else if (!moveTo(e, value)) alert("That doesn't fit inside January 2027.");
    refreshPopover();
  } else if (field === 'end') {
    if (e.start && inMonth(value) && value >= e.start) e.end = value;
    else alert('The end date must be on or after the start date, within January.');
    refreshPopover();
  }
  commit();
});

// ---------- Type editor ----------
let editingTypeId = null;

function openTypeEditor(id) {
  editingTypeId = id;
  const t = id ? typeById(id) : { name: '', icon: ICON_LIBRARY[0][0], color: 'sky', goalPerMonth: null, cycleDays: null };
  typeForm.innerHTML = `
    <h2>${id ? 'Edit event type' : 'New event type'}</h2>
    ${id ? '' : `<p class="field-label">Start from a preset</p>
      <div class="presets">${PRESET_TYPES.map((p, i) =>
        `<button type="button" class="preset" data-action="preset" data-preset="${i}">${chip(p)}<span>${esc(p.name)}</span></button>`).join('')}</div>
      <p class="field-label">…or make your own</p>`}
    <label class="field">Name<input name="name" required maxlength="40" value="${esc(t.name)}"></label>
    ${t.multiDay ? '<p class="hint">Trips use the takeoff and landing icons.</p>' : `<p class="field-label">Icon</p>
      <div class="icon-grid">${ICON_LIBRARY.map(([k, label]) =>
        `<label class="icon-opt" title="${label}"><input type="radio" name="icon" value="${k}"${k === t.icon ? ' checked' : ''}><span class="chip">${ICONS[k]}</span></label>`).join('')}</div>`}
    <p class="field-label">Colour</p>
    <div class="swatches">${Object.entries(COLORS).map(([k, c]) =>
      `<label class="swatch" title="${k}"><input type="radio" name="color" value="${k}"${k === t.color ? ' checked' : ''}><span style="background:${c.c}"></span></label>`).join('')}</div>
    <div class="field-row" style="margin-top:14px">
      <label class="field">Monthly goal<input name="goal" type="number" min="1" max="31" placeholder="None" value="${t.goalPerMonth ?? ''}"></label>
      <label class="field">Repeat every (days)<input name="cycle" type="number" min="1" max="365" placeholder="None" value="${t.cycleDays ?? ''}"></label>
    </div>
    <div class="dialog-actions">
      ${id ? '<button type="button" class="btn danger" data-action="delete-type">Delete type…</button>' : ''}
      <span class="spacer"></span>
      <button type="button" class="btn" data-action="close-dialog">Cancel</button>
      <button type="submit" class="btn primary">Save</button>
    </div>`;
  typeDialog.showModal();
}

function applyPreset(p) {
  typeForm.elements.name.value = p.name;
  typeForm.querySelector(`input[name="icon"][value="${p.icon}"]`).checked = true;
  typeForm.querySelector(`input[name="color"][value="${p.color}"]`).checked = true;
  typeForm.elements.goal.value = p.goalPerMonth ?? '';
  typeForm.elements.cycle.value = p.cycleDays ?? '';
}

typeForm.addEventListener('submit', ev => {
  ev.preventDefault();
  const f = new FormData(typeForm);
  const name = f.get('name').trim();
  if (!name) return;
  const num = v => { const n = parseInt(v, 10); return n > 0 ? n : null; };
  let t = editingTypeId && typeById(editingTypeId);
  if (!t) { t = { id: newId('t') }; state.types.push(t); }
  Object.assign(t, { name, color: f.get('color') || 'sky', goalPerMonth: num(f.get('goal')), cycleDays: num(f.get('cycle')) });
  if (!t.multiDay) t.icon = f.get('icon') || t.icon || ICON_LIBRARY[0][0];
  typeDialog.close();
  commit();
});

function deleteType(id) {
  const t = typeById(id);
  const n = state.events.filter(e => e.typeId === id).length;
  if (!confirm(`Delete "${t.name}" and its ${n} event${n === 1 ? '' : 's'}? This can't be undone.`)) return;
  state.types = state.types.filter(x => x.id !== id);
  state.events = state.events.filter(e => e.typeId !== id);
  typeDialog.close();
  closePopover();
  commit();
}

// ---------- Data: export / import / reset ----------
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'calendar-boy-data.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

importInput.addEventListener('change', () => {
  const file = importInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!isValidState(data)) throw new Error('bad shape');
      state = data;
      closePopover();
      commit();
    } catch (err) {
      alert("That file isn't a Calendar Boy export.");
    }
    importInput.value = '';
  };
  reader.readAsText(file);
});

function resetData() {
  if (!confirm('Replace everything with the demo data?')) return;
  state = structuredClone(SEED);
  closePopover();
  commit();
}

// ---------- Clicks ----------
const ACTIONS = {
  more: el => showPopover({ kind: 'day', day: el.dataset.day }, el),
  'open-bin': el => showPopover({ kind: 'bin' }, el),
  'close-popover': closePopover,
  'toggle-done': () => { toggleDone(popoverView.id); refreshPopover(); },
  duplicate: () => duplicateEvent(popoverView.id),
  remove: () => removeEvent(popoverView.id),
  restore: el => { byId(el.dataset.id).deletedAt = null; commit(); refreshPopover(); },
  'empty-bin': () => {
    if (!confirm('Permanently delete everything in the bin?')) return;
    state.events = state.events.filter(e => !e.deletedAt);
    commit();
    refreshPopover();
  },
  'toggle-filter': () => { state.settings.showDoneOnly = !state.settings.showDoneOnly; commit(); },
  'add-type': () => openTypeEditor(null),
  'edit-type': el => openTypeEditor(el.dataset.typeId),
  preset: el => applyPreset(PRESET_TYPES[el.dataset.preset]),
  'close-dialog': () => typeDialog.close(),
  'delete-type': () => deleteType(editingTypeId),
  export: exportData,
  import: () => importInput.click(),
  reset: resetData,
};

let suppressClick = false;

document.addEventListener('click', ev => {
  if (suppressClick) { suppressClick = false; return; }
  const actionEl = ev.target.closest('[data-action]');
  if (actionEl) {
    if (!popover.contains(actionEl)) closePopover();
    actionEl.closest('details')?.removeAttribute('open');
    ACTIONS[actionEl.dataset.action]?.(actionEl);
    return;
  }
  const item = ev.target.closest('.event, .trip');
  if (item) {
    if (!popover.contains(item)) closePopover();
    toggleDone(item.dataset.id);
    return;
  }
  if (!popover.contains(ev.target)) closePopover();
});

document.addEventListener('dblclick', ev => {
  const item = ev.target.closest('.event, .trip');
  if (!item) return;
  const view = { kind: 'event', id: item.dataset.id };
  // Drilling in from a "+N more" list keeps the popover where it is.
  if (popover.contains(item)) { popoverView = view; refreshPopover(); }
  else showPopover(view, item);
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape') { cancelDrag(); closePopover(); }
});
// Only width changes: on phones the on-screen keyboard changes the height while editing popup fields.
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) closePopover();
  lastWidth = window.innerWidth;
});

todayInput.addEventListener('change', () => {
  if (inMonth(todayInput.value)) state.settings.pretendToday = todayInput.value;
  closePopover();
  commit();
});

// ---------- Drag and drop (Pointer Events, so it works with touch too) ----------
let drag = null, ghost = null, hoverTarget = null;

document.addEventListener('pointerdown', ev => {
  if (ev.button !== 0) return;
  const src = ev.target.closest('[data-drag]');
  if (!src) return;
  drag = { src, x: ev.clientX, y: ev.clientY, active: false, offset: 0 };
  if (src.classList.contains('trip')) drag.offset = grabOffset(src, ev.clientX);
});

document.addEventListener('pointermove', ev => {
  if (!drag) return;
  if (!drag.active) {
    if (Math.hypot(ev.clientX - drag.x, ev.clientY - drag.y) < 6) return;
    startDrag();
  }
  ghost.style.left = ev.clientX + 'px';
  ghost.style.top = ev.clientY + 'px';
  const target = dropTargetAt(ev.clientX, ev.clientY);
  if (target !== hoverTarget) {
    hoverTarget?.classList.remove('drop-hover');
    target?.classList.add('drop-hover');
    hoverTarget = target;
  }
});

document.addEventListener('pointerup', ev => {
  if (!drag) return;
  if (drag.active) {
    const d = drag, target = dropTargetAt(ev.clientX, ev.clientY);
    cancelDrag();
    // The click that follows a drag must not toggle done.
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    if (target) drop(d, target);
  }
  drag = null;
});
document.addEventListener('pointercancel', cancelDrag);

// Which day of a trip strip was grabbed, so the trip keeps its position relative to the pointer.
function grabOffset(src, x) {
  const row = src.closest('.week');
  const r = row.getBoundingClientRect();
  const col = Math.max(0, Math.min(6, Math.floor((x - r.left) / (r.width / 7))));
  return dayDiff(byId(src.dataset.id).start, shiftKey(row.dataset.weekStart, col));
}

function startDrag() {
  drag.active = true;
  closePopover();
  const chipEl = drag.src.querySelector('.chip') || drag.src;
  ghost = document.createElement('div');
  ghost.className = 'ghost';
  ghost.innerHTML = chipEl.outerHTML;
  document.body.append(ghost);
  drag.src.classList.add('drag-source');
  document.body.classList.add('dragging');
}

function cancelDrag() {
  if (!drag) return;
  ghost?.remove();
  ghost = null;
  hoverTarget?.classList.remove('drop-hover');
  hoverTarget = null;
  drag.src.classList.remove('drag-source');
  document.body.classList.remove('dragging');
  drag = null;
}

function dropTargetAt(x, y) {
  return document.elementFromPoint(x, y)?.closest('[data-drop]') || null;
}

function drop(d, target) {
  const kind = target.dataset.drop;
  if (d.src.dataset.drag === 'type') {
    const type = typeById(d.src.dataset.typeId);
    if (kind === 'day') addEvent(type, target.dataset.date);
    else if (kind === 'backlog') addEvent(type, null);
    return;
  }
  const e = byId(d.src.dataset.id);
  if (!e) return;
  if (kind === 'bin') e.deletedAt = new Date().toISOString();
  else if (kind === 'backlog') unschedule(e);
  else if (kind === 'day' && !moveTo(e, shiftKey(target.dataset.date, -d.offset))) return;
  commit();
}

// ---------- Start ----------
$('brand-icon').innerHTML = ICONS.camera;
render();
