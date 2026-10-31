// ---------- Constants ----------
// Keep in step with the ?v= on the asset links in index.html; bump both on every release.
const APP_VERSION = '4.4';
const STORE_KEY = 'calendarBoy.v1'; // key kept from v1; the stored object carries its own version
const STATE_VERSION = 3;
const MAX_VISIBLE = 3;
const DEFAULT_TRIP_DAYS = 3;
const LONG_PRESS_MS = 500;
const DRAG_THRESHOLD = 6;
const STATUSES = ['todo', 'done', 'abandoned']; // a click cycles in this order
const STATUS_LABEL = { todo: 'To do', done: 'Done', abandoned: 'Abandoned' };

// ---------- State and storage ----------
let state = loadState();

function loadState() {
  try {
    const saved = migrate(JSON.parse(localStorage.getItem(STORE_KEY)));
    if (isValidState(saved)) return saved;
  } catch (err) { /* storage blocked or corrupt: fall back to the demo data */ }
  return structuredClone(SEED);
}
function migrate(s) {
  if (s && s.version === 1) {
    s.events.forEach(e => { e.status = e.done ? 'done' : 'todo'; delete e.done; });
    Object.assign(s.settings, { locked: true, viewMonth: s.settings.pretendToday.slice(0, 7) });
    s.version = 2;
  }
  if (s && s.version === 2) {
    // Backlog order moves from array position to a `seq` number, so it survives syncing item by item.
    s.events.forEach((e, i) => { e.seq = i; });
    s.version = 3;
  }
  return s;
}
function isValidState(s) {
  return !!s && s.version === STATE_VERSION && !!s.settings && Array.isArray(s.types) && Array.isArray(s.events);
}
// Set by sync.js: syncHook pushes changes to the cloud after every save; syncAccount is the signed-in email.
let syncHook = null, syncAccount = null;
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (err) { /* ignore */ }
  syncHook?.();
}
function commit() { saveState(); render(); }

// ---------- Date helpers (YYYY-MM-DD keys, local time) ----------
function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function key(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function shiftKey(k, n) { return key(addDays(parseDate(k), n)); }
function dayDiff(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
function shiftMonth(ym, n) { const [y, m] = ym.split('-').map(Number); return key(new Date(y, m - 1 + n, 1)).slice(0, 7); }
function monthTitle(ym) { return parseDate(ym + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); }
function fmtDate(k) { return parseDate(k).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
function fmtShort(k) { return parseDate(k).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// ---------- Queries ----------
// A null pretendToday means the real date.
const today = () => state.settings.pretendToday || key(new Date());
const viewMonth = () => state.settings.viewMonth;
const typeOf = e => state.types.find(t => t.id === e.typeId);
const typeById = id => state.types.find(t => t.id === id);
const byId = id => state.events.find(e => e.id === id);
// Events whose type is missing are skipped (while syncing, events can arrive before their types).
const live = () => state.events.filter(e => !e.deletedAt && typeOf(e));
const scheduled = () => live().filter(e => e.start);
const isTrip = e => !!typeOf(e)?.multiDay;
const isPast = e => !!e.start && e.start <= today(); // today counts as the past
// Show done hides everything that isn't done, past and future alike.
const isHidden = e => state.settings.showDoneOnly && e.status !== 'done';
const newId = prefix => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function eventsOn(k) {
  return scheduled()
    .filter(e => !e.end && e.start === k && !isHidden(e))
    .sort((a, b) => (a.time || '~').localeCompare(b.time || '~'));
}

// Goal and planned counts are for the month on screen; last done / next due look at everything.
function typeStats(t) {
  const all = scheduled().filter(e => e.typeId === t.id);
  const month = all.filter(e => e.start.startsWith(viewMonth()));
  const lastDone = all.filter(e => e.status === 'done' && e.start <= today()).map(e => e.start).sort().pop() || null;
  return {
    done: month.filter(e => e.status === 'done').length,
    planned: month.filter(e => e.status === 'todo' && !isPast(e)).length,
    lastDone,
    nextDue: t.cycleDays && lastDone ? shiftKey(lastDone, t.cycleDays) : null,
    ...streaks(t, all),
  };
}

// Streak = how many past events of a type in a row were done. Today's to-do doesn't break it (there's
// still time). For repeat-cycle types, a gap longer than the cycle also breaks it, as does being overdue.
function streaks(t, all) {
  if (t.multiDay) return { streak: 0, bestStreak: 0 };
  const past = all.filter(e => e.start <= today() && !(e.start === today() && e.status === 'todo'))
    .sort((a, b) => a.start.localeCompare(b.start) || (a.time || '~').localeCompare(b.time || '~'));
  let run = 0, best = 0, prev = null;
  for (const e of past) {
    if (e.status !== 'done') { run = 0; prev = null; continue; }
    if (t.cycleDays && prev && dayDiff(prev, e.start) > t.cycleDays) run = 0;
    run++;
    prev = e.start;
    best = Math.max(best, run);
  }
  if (t.cycleDays && prev && dayDiff(prev, today()) > t.cycleDays) run = 0;
  return { streak: run, bestStreak: best };
}

// Repeat-cycle types that have been done before and have nothing planned get a faint "due" icon on the
// day they're next due (today, if overdue). Returns day -> [type]. Hidden while Show done is on.
function dueGhosts() {
  const byDay = new Map();
  if (state.settings.showDoneOnly) return byDay;
  for (const t of state.types) {
    if (!t.cycleDays || t.multiDay) continue;
    const { nextDue } = typeStats(t);
    if (!nextDue) continue;
    if (scheduled().some(e => e.typeId === t.id && e.status === 'todo' && e.start >= today())) continue;
    const k = nextDue < today() ? today() : nextDue;
    byDay.set(k, [...(byDay.get(k) || []), t]);
  }
  return byDay;
}

// ---------- Elements ----------
const $ = id => document.getElementById(id);
const weeksEl = $('weeks'), typesEl = $('types'), backlogEl = $('backlog'), paletteEl = $('palette');
const popover = $('popover'), popBody = $('pop-body');
const typeDialog = $('type-dialog'), typeForm = $('type-form');
const todayInput = $('today-input'), importInput = $('import-file');

// ---------- Render ----------
function colorVars(type) {
  const c = COLORS[type.color] || COLORS.sky;
  return `--c:${c.c};--tint:${c.tint}`;
}
function chip(type, iconKey, cls = '') {
  return `<span class="chip${cls ? ' ' + cls : ''}" style="${colorVars(type)}">${ICONS[iconKey || type.icon] || ICONS.camera}</span>`;
}
function renderEvent(e) {
  return `<button class="event ${e.status}" data-id="${e.id}" data-drag="event" title="${esc(e.title)}">
    ${chip(typeOf(e))}<span class="label">${esc(e.title)}${e.time ? `<small>${esc(e.time)}</small>` : ''}</span>
  </button>`;
}
function renderGhost(t, k) {
  const overdue = k === today() && typeStats(t).nextDue < today();
  return `<button class="due${overdue ? ' overdue' : ''}" data-action="plan-due" data-type-id="${t.id}" data-date="${k}"
      title="${esc(t.name)}: ${overdue ? 'overdue' : 'due'}. Tap to plan it.">
    ${chip(t)}<span class="label">${esc(t.name)}<small>${overdue ? 'Overdue' : 'Due'}</small></span>
  </button>`;
}
// Events then "due" ghosts for one day, as HTML items.
function dayItems(k, ghosts) {
  return [...eventsOn(k).map(renderEvent), ...(ghosts.get(k) || []).map(t => renderGhost(t, k))];
}

function render() {
  const locked = state.settings.locked;
  document.body.classList.toggle('locked', locked);
  todayInput.value = today();
  $('month-title').textContent = monthTitle(viewMonth());
  $('filter-btn').setAttribute('aria-pressed', state.settings.showDoneOnly);
  const lockBtn = $('lock-btn');
  lockBtn.setAttribute('aria-pressed', locked);
  lockBtn.title = locked ? 'Icons are locked so scrolling never moves them. Tap to unlock.' : 'Icons can be dragged. Tap to lock.';
  lockBtn.innerHTML = `${locked ? ICONS.lock : ICONS.unlock}<span>${locked ? 'Locked' : 'Unlocked'}</span>`;
  const collapsed = !!state.settings.statsCollapsed;
  $('side').classList.toggle('collapsed', collapsed);
  $('side-toggle').setAttribute('aria-expanded', !collapsed);
  renderPalette();
  renderTypes();
  renderBacklog();
  renderWeeks();
  renderBin();
}

function renderPalette() {
  const how = state.settings.locked ? 'unlock, then drag onto a day' : 'drag onto a day or the backlog';
  paletteEl.innerHTML = state.types.map(t =>
    `<span class="type-chip" data-drag="type" data-type-id="${t.id}" title="${esc(t.name)}: ${how}">${chip(t)}</span>`).join('');
}

function renderWeeks() {
  const [y, m] = viewMonth().split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const gridStart = addDays(first, -first.getDay());
  const weekCount = Math.ceil((first.getDay() + new Date(y, m, 0).getDate()) / 7);
  const trips = scheduled().filter(e => e.end && !isHidden(e)).sort((a, b) => a.start.localeCompare(b.start));
  const ghosts = dueGhosts();
  let html = '';
  for (let w = 0; w < weekCount; w++) {
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
      const items = dayItems(k, ghosts);
      const shown = items.length > MAX_VISIBLE ? items.slice(0, MAX_VISIBLE - 1) : items;
      const hidden = items.length - shown.length;
      cells += `<div class="day${k.startsWith(viewMonth()) ? '' : ' other'}" data-drop="day" data-date="${k}">
        <div class="date${k === today() ? ' today' : ''}">${d.getDate()}</div>
        <div class="lane"></div>
        <div class="events">
          ${shown.join('')}
          ${hidden ? `<button class="more" data-action="more" data-day="${k}">+${hidden} more</button>` : ''}
        </div>
      </div>`;
    }
    html += `<div class="week" data-week-start="${ws}" style="--lanes:${laneEnds.length}">${cells}${segments.join('')}</div>`;
  }
  weeksEl.innerHTML = html;
}

// One strip per week row: takeoff at the start day, dashed path, landing at the end day.
// The takeoff and landing chips can be dragged on their own to change just that end.
function renderTripSegment(t, ws, from, to, lane) {
  const type = typeOf(t);
  const col = dayDiff(ws, from), span = dayDiff(from, to) + 1;
  const startsHere = from === t.start, endsHere = to === t.end;
  const pathClass = ['path', !endsHere && 'to-edge', !startsHere && 'from-edge'].filter(Boolean).join(' ');
  return `<button class="trip ${t.status}" data-id="${t.id}" data-drag="event" title="${esc(t.title)}"
      style="${colorVars(type)};--lane:${lane};left:calc(${col} * 100% / 7 + 4px);width:calc(${span} * 100% / 7 - ${endsHere ? 8 : 4}px)">
    ${startsHere ? chip(type, type.icon, 'trip-start') : ''}
    <span class="${pathClass}">${span >= 2 ? `<span>${esc(t.title)}${startsHere ? '' : ' (cont.)'}</span>` : ''}</span>
    ${endsHere ? chip(type, type.endIcon || type.icon, 'trip-end') : '<span class="arrow">&#8250;</span>'}
  </button>`;
}

function cycleLabel(n) {
  if (n === 1) return 'Every day';
  if (n % 7 === 0) return n === 7 ? 'Every week' : `Every ${n / 7} weeks`;
  return `Every ${n} days`;
}

function renderTypes() {
  $('types-month').textContent = `Counts for ${monthTitle(viewMonth())}`;
  typesEl.innerHTML = state.types.map(t => {
    const s = typeStats(t);
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
      ${chip(t)}
      <div class="type-info">
        <div class="type-name"><span>${esc(t.name)}</span>
          <button class="icon-btn" data-action="edit-type" data-type-id="${t.id}" aria-label="Edit ${esc(t.name)}" title="Edit">&#9998;</button></div>
        ${t.goalPerMonth ? `<div class="progress"><span style="width:${pct}%"></span></div>` : ''}
        <div class="stat">${s.done}${t.goalPerMonth ? ` / ${t.goalPerMonth}` : ''} done · ${s.planned} planned</div>
        ${s.streak >= 2 ? `<div class="stat streak" title="Done ${s.streak} times in a row">&#128293; ${s.streak} in a row${s.bestStreak > s.streak ? ` · best ${s.bestStreak}` : ''}</div>` : ''}
        <div class="stat">Last done ${s.lastDone ? fmtShort(s.lastDone) : '—'}</div>
        ${cycle}
      </div>
    </li>`;
  }).join('');
}

function renderBacklog() {
  const items = live().filter(e => !e.start).sort(bySeq);
  backlogEl.innerHTML = items.length
    ? items.map(renderEvent).join('')
    : '<p class="empty">Drop events here for “someday”.</p>';
}

function renderBin() {
  const n = state.events.filter(e => e.deletedAt).length;
  $('bin-icon').innerHTML = n ? ICONS.binFull : ICONS.bin;
  $('bin-badge').hidden = !n;
  $('bin-badge').textContent = n;
}

// ---------- Event changes ----------
// Status changes update classes in place rather than re-rendering, so an icon you're cycling
// stays put even if the Show done filter would now hide it.
function setStatus(id, status) {
  const e = byId(id);
  if (!e) return;
  e.status = status;
  saveState();
  document.querySelectorAll(`.event[data-id="${id}"], .trip[data-id="${id}"]`).forEach(el =>
    STATUSES.forEach(s => el.classList.toggle(s, s === status)));
  renderTypes();
}
function cycleStatus(id) {
  const e = byId(id);
  if (e) setStatus(id, STATUSES[(STATUSES.indexOf(e.status) + 1) % STATUSES.length]);
}

// Moves an event so it starts on `start`; a trip keeps its length.
function moveTo(e, start) {
  if (isTrip(e)) {
    const len = e.start && e.end ? dayDiff(e.start, e.end) + 1 : (e.days || DEFAULT_TRIP_DAYS);
    e.end = shiftKey(start, len - 1);
  }
  e.start = start;
}

function unschedule(e) {
  if (isTrip(e) && e.start && e.end) e.days = dayDiff(e.start, e.end) + 1;
  e.start = null;
  e.end = null;
}

// Backlog order comes from each event's `seq`; a moved event gets a seq between its new neighbours.
const bySeq = (a, b) => (a.seq ?? 0) - (b.seq ?? 0);
function placeInBacklog(e, beforeId) {
  unschedule(e);
  const items = live().filter(x => !x.start && x !== e).sort(bySeq);
  const i = beforeId ? items.findIndex(x => x.id === beforeId) : -1;
  if (i === -1) e.seq = items.length ? (items[items.length - 1].seq ?? 0) + 1 : 0;
  else if (i === 0) e.seq = (items[0].seq ?? 0) - 1;
  else e.seq = ((items[i - 1].seq ?? 0) + (items[i].seq ?? 0)) / 2;
}

function addEvent(type, start, beforeId) {
  const e = { id: newId('e'), typeId: type.id, title: type.name, start: null, end: null, time: '', notes: '', status: 'todo', deletedAt: null };
  state.events.push(e);
  if (start) moveTo(e, start);
  else placeInBacklog(e, beforeId);
  commit();
}

function duplicateEvent(id) {
  const e = byId(id);
  const copy = { ...e, id: newId('e'), status: 'todo', deletedAt: null };
  if (e.start) {
    copy.start = shiftKey(e.start, 1);
    copy.end = e.end ? shiftKey(e.end, 1) : null;
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

// ---------- Undo ----------
// One level of undo, offered in a toast for a few seconds (or Ctrl+Z). It remembers the earlier version
// of just the items a change touched, so changes synced in from another device meanwhile are kept.
const UNDO_MS = 6000;
const toastEl = $('toast');
// { before: Map('events:id' | 'types:id' -> { json, i }, or null if the item was new), timer }
let undo = null;

function itemsSnapshot() {
  const m = new Map();
  for (const coll of ['types', 'events']) state[coll].forEach((x, i) => m.set(`${coll}:${x.id}`, { json: JSON.stringify(x), i }));
  return m;
}

// Runs a change; fn returns the toast label.
function undoable(fn) {
  const before = itemsSnapshot();
  const label = fn();
  const after = itemsSnapshot();
  const changed = new Map();
  for (const [k, v] of before) if (after.get(k)?.json !== v.json) changed.set(k, v);
  for (const k of after.keys()) if (!before.has(k)) changed.set(k, null);
  if (!changed.size) return;
  // More changes to the same items (like tapping through the statuses) undo back to where they started.
  const same = undo && undo.before.size === changed.size && [...changed.keys()].every(k => undo.before.has(k));
  clearTimeout(undo?.timer);
  undo = { before: same ? undo.before : changed, timer: setTimeout(hideUndo, UNDO_MS) };
  $('toast-text').textContent = label;
  toastEl.hidden = false;
}

function applyUndo() {
  if (!undo) return;
  // New items go first, then the rest lowest index first, so removed items go back into their old places.
  const entries = [...undo.before].sort((a, b) => (a[1]?.i ?? -1) - (b[1]?.i ?? -1));
  for (const [k, old] of entries) {
    const coll = k.slice(0, k.indexOf(':')), id = k.slice(coll.length + 1);
    const list = state[coll], i = list.findIndex(x => x.id === id);
    if (!old) { if (i !== -1) list.splice(i, 1); }
    else if (i === -1) list.splice(Math.min(old.i, list.length), 0, JSON.parse(old.json));
    else list[i] = JSON.parse(old.json);
  }
  hideUndo();
  closePopover();
  commit();
}

function hideUndo() {
  clearTimeout(undo?.timer);
  undo = null;
  toastEl.hidden = true;
}

const statusLabel = id => `Marked ${STATUS_LABEL[byId(id).status].toLowerCase()}`;

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

// Long-press / right-click: show an event's details (inside a "+N more" list, swap in place).
function openInfo(item) {
  const view = { kind: 'event', id: item.dataset.id };
  if (popover.contains(item)) { popoverView = view; refreshPopover(); }
  else showPopover(view, item);
}

function eventDetail(e) {
  const type = typeOf(e);
  const when = !e.start ? 'In the backlog' : isPast(e) ? 'In the past' : 'Coming up';
  const dates = type.multiDay
    ? `<div class="field-row">
        <label class="field">Start<input type="date" data-field="start" value="${e.start || ''}"></label>
        <label class="field">End<input type="date" data-field="end" value="${e.end || ''}"></label>
      </div>`
    : `<label class="field">Date <small>(empty = backlog)</small><input type="date" data-field="start" value="${e.start || ''}"></label>`;
  return `<div class="pop-head ${e.status}">${chip(type)}<div>
      <input class="pop-title" data-field="title" value="${esc(e.title)}" aria-label="Title">
      <div class="pop-type">${esc(type.name)} · ${when}</div></div></div>
    <div class="pop-status seg" role="group" aria-label="Status">${STATUSES.map(s =>
      `<button class="seg-btn${e.status === s ? ' on' : ''}" data-action="set-status" data-status="${s}">${STATUS_LABEL[s]}</button>`).join('')}</div>
    ${dates}
    <label class="field">Time<input data-field="time" value="${esc(e.time)}" placeholder="e.g. 07:00"></label>
    <label class="field">Notes<textarea data-field="notes" rows="2">${esc(e.notes)}</textarea></label>
    <div class="pop-actions">
      <button class="btn" data-action="duplicate">Duplicate</button>
      <button class="btn danger" data-action="remove">Remove</button>
    </div>`;
}

function dayList(k) {
  return `<p class="pop-heading">${fmtDate(k)}</p>${dayItems(k, dueGhosts()).join('') || '<p class="empty">Nothing here.</p>'}
    <p class="hint">Tap to change status · long-press for details</p>`;
}

function binList() {
  const items = state.events.filter(e => e.deletedAt && typeOf(e)).sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
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
  undoable(() => { editField(byId(popoverView.id), field, ev.target.value); return 'Changed'; });
});

function editField(e, field, value) {
  if (field === 'title') e.title = value.trim() || typeOf(e).name;
  else if (field === 'time' || field === 'notes') e[field] = value.trim();
  else if (field === 'start') {
    // A trip's start moves on its own, like dragging the takeoff icon.
    if (!value) unschedule(e);
    else if (!isTrip(e) || !e.start) moveTo(e, value);
    else if (value <= e.end) e.start = value;
    else alert('The start must be on or before the end date.');
    refreshPopover();
  } else if (field === 'end') {
    if (e.start && value && value >= e.start) e.end = value;
    else alert('The end date must be on or after the start date.');
    refreshPopover();
  }
  commit();
}

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
  if (!confirm(`Delete "${t.name}" and its ${n} event${n === 1 ? '' : 's'}?`)) return;
  undoable(() => {
    state.types = state.types.filter(x => x.id !== id);
    state.events = state.events.filter(e => e.typeId !== id);
    typeDialog.close();
    closePopover();
    commit();
    return `Deleted "${t.name}"`;
  });
}

// ---------- Year heatmap ----------
// One grid per type up to today's week: a column per week, a row per weekday. A year on wide screens,
// six months on phones so the squares stay big enough. Done = the type's colour, planned but not done = its tint.
const yearDialog = $('year-dialog');
const narrowScreen = window.matchMedia('(max-width: 800px)');

function openYear() {
  const weeks = narrowScreen.matches ? 26 : 53;
  yearDialog.style.setProperty('--weeks', weeks);
  yearDialog.innerHTML = yearHtml(weeks);
  yearDialog.showModal();
}

function yearHtml(weeks) {
  const end = parseDate(today());
  const first = addDays(end, -end.getDay() - (weeks - 1) * 7); // a Sunday
  const from = key(first), to = today();
  const days = Array.from({ length: weeks * 7 }, (_, i) => key(addDays(first, i)));
  const months = days.filter((k, i) => i % 7 === 0).map((k, w) =>
    !w || k.slice(5, 7) === days[(w - 1) * 7].slice(5, 7) ? '' : `<span style="grid-column:${w + 1}">${parseDate(k).toLocaleDateString('en-GB', { month: 'short' })}</span>`).join('');
  const types = state.types.filter(t => !t.multiDay);
  const rows = types.map(t => {
    const evs = scheduled().filter(e => e.typeId === t.id && e.start >= from && e.start <= to);
    const done = new Map(), missed = new Set();
    evs.forEach(e => e.status === 'done' ? done.set(e.start, (done.get(e.start) || 0) + 1) : missed.add(e.start));
    const total = [...done.values()].reduce((a, b) => a + b, 0);
    const cells = days.map(k => {
      if (k > to) return '<i class="future"></i>';
      const n = done.get(k);
      const cls = n ? 'done' : missed.has(k) ? 'missed' : '';
      return `<i class="${cls}" title="${fmtDate(k)}${n ? `: done${n > 1 ? ` ×${n}` : ''}` : missed.has(k) ? ': not done' : ''}"></i>`;
    }).join('');
    const { bestStreak } = typeStats(t);
    return `<div class="heat-type" style="${colorVars(t)}">
      <div class="heat-head">${chip(t)}<span class="heat-name">${esc(t.name)}</span>
        <span class="stat">${total} done${bestStreak >= 2 ? ` · best streak ${bestStreak}` : ''}</span></div>
      <div class="heat-months">${months}</div><div class="heat">${cells}</div>
    </div>`;
  }).join('');
  const fmtYear = k => parseDate(k).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return `<h2>The last ${weeks > 26 ? '12' : '6'} months</h2>
    <p class="hint">${fmtYear(from)} – ${fmtYear(to)}. One square per day, a column per week.
      <span class="heat-key"><i class="done"></i> done <i class="missed"></i> planned, not done</span></p>
    ${rows || '<p class="empty">No event types yet.</p>'}
    <div class="dialog-actions"><span class="spacer"></span><button type="button" class="btn" data-action="close-year">Close</button></div>`;
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
      const data = migrate(JSON.parse(reader.result));
      if (!isValidState(data)) throw new Error('bad shape');
      state = data;
      hideUndo();
      closePopover();
      commit();
    } catch (err) {
      alert("That file isn't a Calendar Boy export.");
    }
    importInput.value = '';
  };
  reader.readAsText(file);
});

// When signed in, these replace the calendar in the account too (sync pushes the difference).
const ALSO_IN_ACCOUNT = () => (syncAccount ? '\n\nThis also replaces the calendar saved in your account.' : '');

function resetData() {
  if (!confirm('Replace everything with the demo data?' + ALSO_IN_ACCOUNT())) return;
  state = structuredClone(SEED);
  hideUndo();
  closePopover();
  commit();
}

// An empty calendar for real use: keeps the event types and this device's settings, follows the real date.
function startFresh() {
  if (!confirm('Start fresh? All events are deleted (event types are kept) and today becomes the real date.' + ALSO_IN_ACCOUNT())) return;
  state.events = [];
  hideUndo();
  setToday(null);
}

// null = follow the real date.
function setToday(k) {
  state.settings.pretendToday = k;
  state.settings.viewMonth = today().slice(0, 7);
  closePopover();
  commit();
}

// ---------- Clicks ----------
const ACTIONS = {
  more: el => showPopover({ kind: 'day', day: el.dataset.day }, el),
  'open-bin': el => showPopover({ kind: 'bin' }, el),
  'close-popover': closePopover,
  'set-status': el => {
    const id = popoverView.id;
    undoable(() => { setStatus(id, el.dataset.status); return statusLabel(id); });
    refreshPopover();
  },
  duplicate: () => undoable(() => { duplicateEvent(popoverView.id); return 'Duplicated'; }),
  remove: () => undoable(() => { removeEvent(popoverView.id); return 'Moved to the bin'; }),
  restore: el => { undoable(() => { byId(el.dataset.id).deletedAt = null; commit(); return 'Restored'; }); refreshPopover(); },
  'empty-bin': () => {
    if (!confirm('Permanently delete everything in the bin?')) return;
    undoable(() => { state.events = state.events.filter(e => !e.deletedAt); commit(); return 'Bin emptied'; });
    refreshPopover();
  },
  'plan-due': el => undoable(() => { addEvent(typeById(el.dataset.typeId), el.dataset.date); return 'Planned'; }),
  undo: applyUndo,
  'open-year': openYear,
  'close-year': () => yearDialog.close(),
  'prev-month': () => changeMonth(-1),
  'next-month': () => changeMonth(1),
  'go-today': () => goToMonth(today().slice(0, 7)),
  'real-today': () => setToday(null),
  'start-fresh': startFresh,
  'toggle-lock': () => { state.settings.locked = !state.settings.locked; commit(); },
  'toggle-stats': () => { state.settings.statsCollapsed = !state.settings.statsCollapsed; commit(); },
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

// Set after a long-press or a drop, so the click the browser fires afterwards is ignored.
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
    const id = item.dataset.id;
    undoable(() => { cycleStatus(id); return statusLabel(id); });
    return;
  }
  if (!popover.contains(ev.target)) closePopover();
});

// Right-click on desktop; on Android a long-press also arrives here.
document.addEventListener('contextmenu', ev => {
  const item = ev.target.closest('.event, .trip');
  if (!item) return;
  ev.preventDefault();
  if (press) { clearTimeout(press.timer); press = null; suppressClick = true; }
  if (popoverView?.kind === 'event' && popoverView.id === item.dataset.id) return;
  openInfo(item);
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape') { endDrag(); press = null; closePopover(); }
  // Ctrl+Z undoes the last change while its toast shows; inside a text field it's the field's own undo.
  if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z' && undo && !ev.target.closest?.('input, textarea')) {
    ev.preventDefault();
    applyUndo();
  }
});

// Only width changes: on phones the on-screen keyboard changes the height while editing popup fields.
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) closePopover();
  lastWidth = window.innerWidth;
});

todayInput.addEventListener('change', () => { if (todayInput.value) setToday(todayInput.value); });

// The Data menu opens right-aligned under its button, nudged sideways if that would leave the screen
// (on phones the header wraps and the button can end up at the left edge).
const dataMenu = document.querySelector('.menu');
dataMenu.addEventListener('toggle', () => {
  if (!dataMenu.open) return;
  const list = dataMenu.querySelector('.menu-list');
  const m = dataMenu.getBoundingClientRect(), w = list.offsetWidth, margin = 8;
  const left = Math.max(margin, Math.min(m.right - w, window.innerWidth - w - margin));
  list.style.left = (left - m.left) + 'px';
  list.style.right = 'auto';
});

// ---------- Changing month: wheel (desktop) and swipe (phone) ----------
const mainEl = document.querySelector('main');

// axis: 'x' for swipes and arrows (pages turn sideways), 'y' for the mouse wheel.
function changeMonth(n, axis = 'x') {
  goToMonth(shiftMonth(viewMonth(), n), axis);
}

function goToMonth(ym, axis = 'x') {
  if (ym === viewMonth()) return;
  const dir = ym > viewMonth() ? 1 : -1;
  const snapshot = snapshotWeeks();
  state.settings.viewMonth = ym;
  closePopover();
  commit();
  slideMonth(snapshot, dir, axis);
}

// ---------- Month slide animation ----------
const SLIDE_MS = 260;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// A lifeless copy of the current grid, laid over the new one while it slides away.
function snapshotWeeks() {
  document.querySelectorAll('.weeks-leaving').forEach(el => el.remove());
  if (reducedMotion.matches) return null;
  const copy = weeksEl.cloneNode(true);
  copy.removeAttribute('id');
  copy.classList.add('weeks-leaving');
  copy.inert = true;
  copy.style.height = weeksEl.offsetHeight + 'px';
  copy.querySelectorAll('[data-id], [data-date], [data-drop], [data-drag], [data-action]').forEach(el =>
    ['data-id', 'data-date', 'data-drop', 'data-drag', 'data-action'].forEach(a => el.removeAttribute(a)));
  return copy;
}

function slideMonth(snapshot, dir, axis) {
  if (!snapshot) return;
  weeksEl.after(snapshot);
  const move = pct => `translate${axis.toUpperCase()}(${pct}%)`;
  const timing = { duration: SLIDE_MS, easing: 'cubic-bezier(.2, .7, .3, 1)' };
  // fill: 'forwards' holds the copy off-screen after the slide ends; without it the copy snaps back over
  // the new month until the timer removes it, which shows as a flicker of the old icons.
  snapshot.animate([{ transform: move(0), opacity: 1 }, { transform: move(-dir * 100), opacity: 0 }], { ...timing, fill: 'forwards' });
  // A timer rather than onfinish: paused animations (background tab) would otherwise leave the copy behind.
  setTimeout(() => snapshot.remove(), SLIDE_MS + 50);
  weeksEl.animate([{ transform: move(dir * 100) }, { transform: move(0) }], timing);
  $('month-title').animate([{ opacity: 0 }, { opacity: 1 }], timing);
}

// The wheel scrolls the page as normal until the month's top or bottom edge is on screen; scrolling
// further turns the month. One gesture = one month: after a change, wheel events are ignored until
// they pause, so trackpad momentum doesn't skip several months.
const WHEEL_THRESHOLD = 60, WHEEL_PAUSE_MS = 250;
let wheelSum = 0, wheelQuietUntil = 0;
mainEl.addEventListener('wheel', ev => {
  if (ev.ctrlKey || Math.abs(ev.deltaX) > Math.abs(ev.deltaY) || !ev.deltaY) return; // pinch-zoom, sideways
  const dir = Math.sign(ev.deltaY);
  const r = weeksEl.getBoundingClientRect();
  const atEdge = dir > 0 ? r.bottom <= window.innerHeight + 1 : r.top >= -1;
  if (!atEdge) { wheelSum = 0; return; }
  ev.preventDefault();
  const now = Date.now();
  if (now < wheelQuietUntil) { wheelQuietUntil = now + WHEEL_PAUSE_MS; return; }
  wheelSum += ev.deltaY * (ev.deltaMode === 1 ? 16 : 1); // line-based wheels report lines, not pixels
  if (Math.abs(wheelSum) < WHEEL_THRESHOLD) return;
  wheelSum = 0;
  wheelQuietUntil = now + WHEEL_PAUSE_MS;
  changeMonth(dir, 'y');
  // Continue from the new month's matching edge if the page is taller than the window.
  (dir > 0 ? mainEl : weeksEl).scrollIntoView({ block: dir > 0 ? 'start' : 'end' });
}, { passive: false });

// Horizontal swipe on the calendar: left = next month, right = previous (like turning pages).
// Touch events rather than pointer events, because the browser cancels pointer events once it scrolls.
const SWIPE_MIN_PX = 60, SWIPE_MAX_MS = 700;
let swipe = null;
mainEl.addEventListener('touchstart', ev => {
  const draggable = !state.settings.locked && ev.target.closest('[data-drag]');
  const t = ev.touches[0];
  swipe = ev.touches.length === 1 && !draggable ? { x: t.clientX, y: t.clientY, time: Date.now() } : null;
}, { passive: true });
mainEl.addEventListener('touchend', ev => {
  if (!swipe) return;
  const t = ev.changedTouches[0];
  const dx = t.clientX - swipe.x, dy = t.clientY - swipe.y, quick = Date.now() - swipe.time < SWIPE_MAX_MS;
  swipe = null;
  if (!quick || Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < 2 * Math.abs(dy)) return;
  // A swipe shouldn't also count as a tap on the icon it started on.
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 300);
  changeMonth(dx < 0 ? 1 : -1);
}, { passive: true });

// ---------- Press: tap, long-press and drag (Pointer Events, so touch works too) ----------
// A press that moves more than DRAG_THRESHOLD drags (only when unlocked; when locked the page
// scrolls instead). A press held still for LONG_PRESS_MS opens the details.
let press = null, ghost = null, hoverTarget = null, insertMarker = null;

document.addEventListener('pointerdown', ev => {
  if (ev.button !== 0) return;
  const src = ev.target.closest('[data-drag]');
  if (!src) return;
  press = { src, x: ev.clientX, y: ev.clientY, dragging: false, part: 'whole', offset: 0, timer: null };
  if (src.matches('.event, .trip')) press.timer = setTimeout(longPress, LONG_PRESS_MS);
  if (src.classList.contains('trip')) {
    press.part = ev.target.closest('.trip-start') ? 'start' : ev.target.closest('.trip-end') ? 'end' : 'whole';
    if (press.part === 'whole') press.offset = grabOffset(src, ev.clientX);
  }
});

document.addEventListener('pointermove', ev => {
  if (!press) return;
  if (!press.dragging) {
    if (Math.hypot(ev.clientX - press.x, ev.clientY - press.y) < DRAG_THRESHOLD) return;
    clearTimeout(press.timer);
    if (state.settings.locked) { press = null; return; }
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
  const marker = target === backlogEl ? backlogInsertBefore(ev.clientX, ev.clientY, press.src) : null;
  if (marker !== insertMarker) {
    insertMarker?.classList.remove('insert-before');
    marker?.classList.add('insert-before');
    insertMarker = marker;
  }
  updateEdgeFlip(ev.clientX, ev.clientY, target);
});

// Holding a dragged icon at the calendar's left/right edge turns the month (and keeps turning while held).
const EDGE_PX = 36, EDGE_DELAY_MS = 600, EDGE_REPEAT_MS = 900;
const weeksWrap = weeksEl.parentElement;
let edgeDir = 0, edgeTimer = null;

function updateEdgeFlip(x, y, target) {
  const r = weeksWrap.getBoundingClientRect(); // the wrapper doesn't move during the slide
  // The bin sits over the calendar's bottom-right corner on phones; hovering it isn't an edge.
  const dir = y < r.top || y > r.bottom || target?.dataset.drop === 'bin' ? 0
    : x < r.left + EDGE_PX ? -1 : x > r.right - EDGE_PX ? 1 : 0;
  weeksWrap.style.setProperty('--edge-y', (y - r.top) + 'px');
  if (dir === edgeDir) return;
  stopEdgeFlip();
  edgeDir = dir;
  if (!dir) return;
  weeksWrap.classList.add(dir < 0 ? 'edge-prev' : 'edge-next');
  const flip = () => { changeMonth(edgeDir); edgeTimer = setTimeout(flip, EDGE_REPEAT_MS); };
  edgeTimer = setTimeout(flip, EDGE_DELAY_MS);
}

function stopEdgeFlip() {
  clearTimeout(edgeTimer);
  edgeTimer = null;
  edgeDir = 0;
  weeksWrap.classList.remove('edge-prev', 'edge-next');
}

document.addEventListener('pointerup', ev => {
  if (press) {
    clearTimeout(press.timer);
    if (press.dragging) {
      const p = press, target = dropTargetAt(ev.clientX, ev.clientY);
      endDrag();
      suppressClick = true;
      if (target) undoable(() => drop(p, target, ev.clientX, ev.clientY));
    }
    press = null;
  }
  // The suppressed click (if any) fires right after pointerup; clear the flag once it has had its chance.
  if (suppressClick) setTimeout(() => { suppressClick = false; }, 0);
});

document.addEventListener('pointercancel', () => {
  if (!press) return;
  clearTimeout(press.timer);
  endDrag();
  press = null;
});

function longPress() {
  if (!press || press.dragging) return;
  const item = press.src;
  press = null;
  suppressClick = true;
  openInfo(item);
}

// Which day of a trip strip was grabbed, so the trip keeps its position relative to the pointer.
function grabOffset(src, x) {
  const row = src.closest('.week');
  const r = row.getBoundingClientRect();
  const col = Math.max(0, Math.min(6, Math.floor((x - r.left) / (r.width / 7))));
  return dayDiff(byId(src.dataset.id).start, shiftKey(row.dataset.weekStart, col));
}

function backlogInsertBefore(x, y, src) {
  const items = [...backlogEl.querySelectorAll('.event')].filter(el => el !== src);
  return items.find(el => {
    const r = el.getBoundingClientRect();
    return y < r.top || (y <= r.bottom && x < r.left + r.width / 2);
  }) || null;
}

function startDrag() {
  press.dragging = true;
  closePopover();
  const { src, part } = press;
  const chipEl = src.querySelector(part === 'start' ? '.trip-start' : part === 'end' ? '.trip-end' : '.chip');
  ghost = document.createElement('div');
  ghost.className = 'ghost';
  ghost.innerHTML = chipEl ? chipEl.outerHTML : chip(typeOf(byId(src.dataset.id)));
  document.body.append(ghost);
  src.classList.add('drag-source');
  document.body.classList.add('dragging');
}

function endDrag() {
  stopEdgeFlip();
  ghost?.remove();
  ghost = null;
  hoverTarget?.classList.remove('drop-hover');
  hoverTarget = null;
  insertMarker?.classList.remove('insert-before');
  insertMarker = null;
  press?.src.classList.remove('drag-source');
  document.body.classList.remove('dragging');
}

function dropTargetAt(x, y) {
  return document.elementFromPoint(x, y)?.closest('[data-drop]') || null;
}

function drop(p, target, x, y) {
  const kind = target.dataset.drop;
  const beforeId = kind === 'backlog' ? backlogInsertBefore(x, y, p.src)?.dataset.id : null;
  if (p.src.dataset.drag === 'type') {
    const type = typeById(p.src.dataset.typeId);
    if (kind === 'day') addEvent(type, target.dataset.date);
    else if (kind === 'backlog') addEvent(type, null, beforeId);
    return 'Added';
  }
  const e = byId(p.src.dataset.id);
  if (!e) return;
  if (kind === 'bin') e.deletedAt = new Date().toISOString();
  else if (kind === 'backlog') placeInBacklog(e, beforeId);
  else if (kind === 'day') {
    const k = target.dataset.date;
    if (p.part === 'start' && e.end) { if (k > e.end) return; e.start = k; }
    else if (p.part === 'end' && e.start) { if (k < e.start) return; e.end = k; }
    else moveTo(e, shiftKey(k, -p.offset));
  }
  commit();
  return kind === 'bin' ? 'Moved to the bin' : kind === 'backlog' ? 'Moved to the backlog' : 'Moved';
}

// ---------- Start ----------
$('brand-icon').innerHTML = ICONS.camera;
$('app-version').textContent = `Version ${APP_VERSION}`;
render();
