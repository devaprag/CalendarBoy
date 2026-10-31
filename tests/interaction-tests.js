// Interaction tests. Loaded after app.js by tests/run-tests.sh, which prints the PASS/FAIL lines.
// Fires synthetic pointer/click/contextmenu events against the real page; state starts from SEED.
const out = [];
const ok = (name, cond, extra = '') => out.push((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  [' + extra + ']' : ''));
window.alert = () => {}; window.confirm = () => true;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const center = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
const pe = (type, el, x, y) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0, pointerId: 1, isPrimary: true }));
const click = el => el.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
const q = s => document.querySelector(s);
const find = (start, title) => state.events.find(e => e.start === start && e.title === title && !e.deletedAt);
const elOf = e => q(`.event[data-id="${e.id}"], .trip[data-id="${e.id}"]`);
const day = k => q(`.day[data-date="${k}"]`);
// Jump any month slide to its end, so measured positions are where things finally sit
// (headless Edge doesn't reliably run animation frames).
const settle = () => document.getAnimations().forEach(a => a.finish());
const backlogTitles =() => [...document.querySelectorAll('#backlog .event')].map(el => byId(el.dataset.id).title);
function dragTo(src, target, from, to) {
  const a = from || center(src), b = to || center(target);
  pe('pointerdown', src, a.x, a.y); pe('pointermove', src, a.x + 10, a.y + 10); pe('pointermove', src, b.x, b.y); pe('pointerup', src, b.x, b.y);
  click(document.body); // the click a real drag produces must be swallowed
}

(async () => {
  try {
    ok('opens on January 2027', q('#month-title').textContent === 'January 2027' && q('.date.today').textContent === '18');

    // Tap cycles To do -> Done -> Abandoned -> To do
    const cinema = find('2027-01-22', 'Cinema with Alex');
    let el = elOf(cinema);
    ok('future to-do has ring class', el.classList.contains('todo'));
    click(el); ok('tap -> done', cinema.status === 'done' && el.classList.contains('done'));
    click(el); ok('tap -> abandoned', cinema.status === 'abandoned' && el.classList.contains('abandoned'));
    click(el); ok('tap -> back to to do', cinema.status === 'todo' && el.classList.contains('todo'));
    ok('saved to localStorage', JSON.parse(localStorage.getItem('calendarBoy.v1')).events.find(e => e.id === cinema.id).status === 'todo');

    // Long-press opens info and the click after it doesn't change status
    pe('pointerdown', el, center(el).x, center(el).y);
    await sleep(LONG_PRESS_MS + 100);
    pe('pointerup', el, center(el).x, center(el).y); click(el);
    ok('long-press opens info', !popover.hidden && q('.pop-title').value === 'Cinema with Alex');
    ok('long-press does not cycle', cinema.status === 'todo');
    await sleep(10);
    click(q('[data-action="set-status"][data-status="done"]'));
    ok('popup status buttons', cinema.status === 'done' && q('.seg-btn.on').dataset.status === 'done');
    click(document.body);

    // Right-click opens info
    el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    ok('right-click opens info', !popover.hidden && q('.pop-title').value === 'Cinema with Alex');

    // Duplicate, remove, bin, restore
    const n = state.events.length;
    click(q('[data-action="duplicate"]'));
    const dup = state.events[state.events.length - 1];
    ok('duplicate on next day, to do', state.events.length === n + 1 && dup.start === '2027-01-23' && dup.status === 'todo');
    const jo = find('2027-01-23', 'Catch-up with Jo');
    elOf(jo).dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    click(q('[data-action="remove"]'));
    ok('remove sends to bin', !!jo.deletedAt && !elOf(jo) && q('#bin-badge').textContent === '1');
    click(q('#bin'));
    click(q('[data-action="restore"]'));
    ok('restore', !jo.deletedAt && !!elOf(jo) && q('#bin-badge').hidden);
    click(document.body);

    // Locked: dragging does nothing
    ok('starts locked', state.settings.locked && document.body.classList.contains('locked'));
    const gym = find('2027-01-25', 'Gym: legs') || state.events.find(e => e.typeId === 'gym' && e.start === '2027-01-25');
    dragTo(elOf(gym), day('2027-01-26'));
    ok('locked: drag ignored', gym.start === '2027-01-25');
    click(q('#lock-btn'));
    ok('unlock', !state.settings.locked && q('#lock-btn').textContent.includes('Unlocked'));

    dragTo(elOf(gym), day('2027-01-26'));
    ok('drag moves event', gym.start === '2027-01-26', gym.start);

    // Trips: whole, start only, end only
    const tokyo = find('2027-01-14', 'Trip to Tokyo');
    const c15 = center(day('2027-01-15'));
    dragTo(elOf(tokyo), day('2027-01-22'), { x: c15.x, y: center(elOf(tokyo)).y });
    ok('drag trip middle moves whole trip', tokyo.start === '2027-01-21' && tokyo.end === '2027-01-27', tokyo.start + '..' + tokyo.end);
    dragTo(q(`.trip[data-id="${tokyo.id}"] .trip-start`), day('2027-01-19'));
    ok('drag takeoff moves start only', tokyo.start === '2027-01-19' && tokyo.end === '2027-01-27', tokyo.start + '..' + tokyo.end);
    dragTo(q(`.trip[data-id="${tokyo.id}"] .trip-end`), day('2027-01-29'));
    ok('drag landing moves end only', tokyo.start === '2027-01-19' && tokyo.end === '2027-01-29', tokyo.start + '..' + tokyo.end);
    dragTo(q(`.trip[data-id="${tokyo.id}"] .trip-start`), day('2027-01-30'));
    ok('start after end rejected', tokyo.start === '2027-01-19');

    // Palette and backlog ordering
    ok('backlog seed order', backlogTitles().join('|') === "Watch the director's cut|Buy new trainers|Video call with cousins");
    const firstBacklog = q('#backlog .event'), r1 = firstBacklog.getBoundingClientRect();
    dragTo(q('.type-chip[data-type-id="gym"]'), backlogEl, null, { x: r1.left + 4, y: r1.top + r1.height / 2 });
    ok('palette -> backlog inserts at drop position', backlogTitles()[0] === 'Gym' && backlogTitles().length === 4, backlogTitles().join('|'));
    const last = [...document.querySelectorAll('#backlog .event')].pop();
    const second = document.querySelectorAll('#backlog .event')[1], r2 = second.getBoundingClientRect();
    dragTo(last, backlogEl, null, { x: r2.left + 4, y: r2.top + r2.height / 2 });
    ok('reorder backlog', backlogTitles().join('|') === "Gym|Video call with cousins|Watch the director's cut|Buy new trainers", backlogTitles().join('|'));
    const before = state.events.length;
    dragTo(q('.type-chip[data-type-id="movie"]'), day('2027-01-28'));
    ok('palette -> day creates to-do event', state.events.length === before + 1 && state.events[state.events.length - 1].start === '2027-01-28');
    dragTo(q('#backlog .event'), day('2027-01-12'));
    ok('backlog -> day', state.events.some(e => e.title === 'Gym' && e.start === '2027-01-12'));
    dragTo(elOf(find('2027-01-23', 'Catch-up with Jo')), q('#bin'));
    ok('drag to bin', !!jo.deletedAt);

    // Months
    click(q('[data-action="next-month"]'));
    ok('next month', q('#month-title').textContent === 'February 2027' && !!day('2027-02-13'));
    click(q('[data-action="prev-month"]')); click(q('[data-action="prev-month"]'));
    ok('prev month shows Lisbon trip', q('#month-title').textContent === 'December 2026' && !!q('.trip[title="Christmas in Lisbon"]'));
    click(q('[data-action="go-today"]'));
    ok('Today button', q('#month-title').textContent === 'January 2027');
    await sleep(SLIDE_MS + 100);

    // Holding a dragged icon at the calendar edge turns the month
    const mover = find('2027-01-27', 'Gym: upper body') || state.events.find(e => e.typeId === 'gym' && e.start === '2027-01-27');
    const wr = q('.weeks-wrap').getBoundingClientRect(), mc = center(elOf(mover));
    pe('pointerdown', elOf(mover), mc.x, mc.y); pe('pointermove', document.body, mc.x + 10, mc.y);
    pe('pointermove', document.body, wr.right - 10, mc.y);
    ok('edge hint shows', q('.weeks-wrap').classList.contains('edge-next'));
    await sleep(EDGE_DELAY_MS + 100);
    ok('holding at the right edge -> next month', q('#month-title').textContent === 'February 2027');
    await sleep(EDGE_REPEAT_MS);
    ok('keeps turning while held', q('#month-title').textContent === 'March 2027');
    await sleep(SLIDE_MS + 100);
    pe('pointermove', document.body, wr.left - 5 + EDGE_PX * 3, mc.y);
    ok('leaving the edge stops it', !q('.weeks-wrap').classList.contains('edge-next') && !edgeTimer);
    settle();
    const d = center(day('2027-03-10'));
    pe('pointermove', document.body, d.x, d.y); pe('pointerup', document.body, d.x, d.y); click(document.body);
    ok('drop lands in the new month', mover.start === '2027-03-10', mover.start);
    // Left edge goes back; hovering the bin never turns the month
    settle();
    const mc2 = center(elOf(mover));
    pe('pointerdown', elOf(mover), mc2.x, mc2.y); pe('pointermove', document.body, mc2.x + 10, mc2.y);
    pe('pointermove', document.body, wr.left + 5, mc2.y);
    await sleep(EDGE_DELAY_MS + 100);
    ok('holding at the left edge -> previous month', q('#month-title').textContent === 'February 2027');
    const bc = center(q('#bin'));
    updateEdgeFlip(wr.right - 5, bc.y, q('#bin'));
    ok('hovering the bin is not an edge', !edgeTimer && !q('.weeks-wrap').classList.contains('edge-next'));
    pe('pointercancel', document.body, 0, 0);
    ok('cancelled drag clears the edge state', !edgeTimer && !document.body.classList.contains('dragging'));
    await sleep(SLIDE_MS + 100);
    click(q('[data-action="go-today"]'));
    await sleep(SLIDE_MS + 100);

    // Show done filter: only done events show, past and future alike
    click(q('[data-action="reset"]'));
    const missedGym = state.events.find(e => e.typeId === 'gym' && e.start < '2027-01-18' && e.status === 'todo' && e.start >= '2027-01-01');
    const abandoned = find('2027-01-13', 'Movie night at home');
    const doneEv = find('2027-01-09', 'Call Mum');
    const futureEv = find('2027-01-22', 'Cinema with Alex');
    click(q('#filter-btn'));
    ok('filter hides past to-do + abandoned', !elOf(missedGym) && !q(`[data-id="${abandoned.id}"]`));
    ok('filter keeps past done', !!elOf(doneEv));
    ok('filter hides future to-do', !elOf(futureEv));
    futureEv.status = 'done'; render();
    ok('filter keeps future done', !!elOf(futureEv));
    futureEv.status = 'todo';
    click(q('#filter-btn'));
    ok('filter off shows future to-do again', !!elOf(futureEv));

    // Sidebar stats
    const rows = [...document.querySelectorAll('.type-row')].map(r => r.textContent.replace(/\s+/g, ' '));
    ok('gym goal line', rows[2].includes('/ 12 done'), rows[2]);
    ok('bedsheets overdue', rows[5].includes('overdue since 17 Jan'), rows[5]);

    // Streaks: done in a row; a not-done event breaks it; today's to-do doesn't
    state.types.push({ id: 'tst', name: 'Test habit', icon: 'book', color: 'yellow', goalPerMonth: null, cycleDays: null });
    const mk = (start, status) => state.events.push({ id: 'tst-' + start, typeId: 'tst', title: 'T', start, end: null, time: '', notes: '', status, deletedAt: null, seq: 0 });
    [['2027-01-05', 'done'], ['2027-01-06', 'done'], ['2027-01-07', 'done'], ['2027-01-08', 'abandoned'],
      ['2027-01-10', 'done'], ['2027-01-12', 'done'], ['2027-01-18', 'todo'], ['2027-01-20', 'todo']].forEach(a => mk(...a));
    render();
    const tstRow = () => [...document.querySelectorAll('.type-row')].pop().textContent.replace(/\s+/g, ' ');
    ok('streak with best', tstRow().includes('2 in a row · best 3'), tstRow());
    byId('tst-2027-01-18').status = 'abandoned'; render();
    ok('a not-done event breaks the streak', !tstRow().includes('in a row'), tstRow());
    byId('tst-2027-01-18').status = 'todo';
    typeById('tst').cycleDays = 2; render();
    ok('overdue cycle type has no streak', !tstRow().includes('in a row'), tstRow());
    ok('planned cycle type has no due ghost', !q('.due[data-type-id="tst"]'));

    // "Due" ghosts: overdue -> today, red; otherwise on the due day; tap plans a to-do there (undoable)
    byId('tst-2027-01-18').status = 'abandoned'; byId('tst-2027-01-20').status = 'abandoned'; render();
    ok('overdue ghost on today', !!day('2027-01-18').querySelector('.due.overdue[data-type-id="tst"]'));
    typeById('tst').cycleDays = 10; render();
    const ghost = day('2027-01-22').querySelector('.due[data-type-id="tst"]');
    ok('due ghost on the due day', !!ghost && !ghost.classList.contains('overdue') && !q('.due.overdue'));
    click(q('#filter-btn'));
    ok('Show done hides ghosts', !q('.due'));
    click(q('#filter-btn'));
    click(day('2027-01-22').querySelector('.due[data-type-id="tst"]'));
    const planned = state.events.find(e => e.typeId === 'tst' && e.start === '2027-01-22');
    ok('tapping a ghost plans it', !!planned && planned.status === 'todo' && !!elOf(planned) && !q('.due[data-type-id="tst"]'));
    ok('undo toast shows', !q('#toast').hidden && q('#toast-text').textContent === 'Planned');
    click(q('[data-action="undo"]'));
    ok('undo removes the planned event', !state.events.some(e => e.typeId === 'tst' && e.start === '2027-01-22') && !!q('.due[data-type-id="tst"]') && q('#toast').hidden);
    state.types = state.types.filter(t => t.id !== 'tst'); state.events = state.events.filter(e => e.typeId !== 'tst'); render();

    // Undo: status taps undo back to where they started; remove; Ctrl+Z; delete type
    const cin = find('2027-01-22', 'Cinema with Alex');
    click(elOf(cin)); click(elOf(cin));
    ok('toast names the change', q('#toast-text').textContent === 'Marked abandoned');
    click(q('[data-action="undo"]'));
    ok('undo after two taps restores to do', byId(cin.id).status === 'todo' && elOf(byId(cin.id)).classList.contains('todo'));
    elOf(byId(cin.id)).dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    click(q('[data-action="remove"]'));
    ok('remove offers undo', !!byId(cin.id).deletedAt && q('#toast-text').textContent === 'Moved to the bin');
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true }));
    ok('Ctrl+Z undoes', !byId(cin.id).deletedAt && !!elOf(byId(cin.id)) && q('#bin-badge').hidden);
    const movieCount = state.events.filter(e => e.typeId === 'movie').length, movieIdx = state.types.findIndex(t => t.id === 'movie');
    click(q('[data-action="edit-type"][data-type-id="movie"]'));
    click(q('[data-action="delete-type"]'));
    ok('type deleted', !typeById('movie'));
    click(q('[data-action="undo"]'));
    ok('undo restores a deleted type in place, with its events', state.types.findIndex(t => t.id === 'movie') === movieIdx
      && state.events.filter(e => e.typeId === 'movie').length === movieCount && !!elOf(find('2027-01-22', 'Cinema with Alex')));

    // Year heatmap
    click(q('[data-action="open-year"]'));
    const gymDone = state.events.filter(e => e.typeId === 'gym' && e.status === 'done' && e.start <= today()).length;
    const gymHeat = [...document.querySelectorAll('.heat-type')].find(el => el.textContent.includes('Gym'));
    ok('year view: one heatmap per single-day type', yearDialog.open && document.querySelectorAll('.heat-type').length === state.types.filter(t => !t.multiDay).length);
    ok('year view: done days coloured', gymHeat.querySelectorAll('.heat i.done').length === gymDone && gymHeat.querySelectorAll('.heat i').length === 53 * 7, gymHeat.querySelectorAll('.heat i.done').length + ' vs ' + gymDone);
    ok('year view: missed days marked', gymHeat.querySelectorAll('.heat i.missed').length > 0);
    click(q('[data-action="close-year"]'));
    ok('year view closes', !yearDialog.open);

    // Type editor
    click(q('[data-action="add-type"]'));
    click(q('[data-action="preset"][data-preset="1"]'));
    typeForm.requestSubmit();
    ok('add type from preset', state.types[state.types.length - 1].name === 'Laundry' && !!q('.type-chip[data-type-id="' + state.types[state.types.length - 1].id + '"]'));
    click(q('[data-action="edit-type"][data-type-id="shopping"]'));
    click(q('[data-action="delete-type"]'));
    ok('delete type removes its events', !typeById('shopping') && !state.events.some(e => e.typeId === 'shopping'));

    // Month change slides: a lifeless snapshot of the old month animates away, then is removed
    click(q('[data-action="next-month"]'));
    const leaving = q('.weeks-leaving');
    ok('old month snapshot slides away', !!leaving && !leaving.querySelector('[data-id], [data-drop]') && leaving.inert);
    const slide = leaving.getAnimations()[0]?.effect;
    ok('snapshot stays hidden after its slide (no flicker)', slide?.getTiming().fill === 'forwards' && slide.getKeyframes().pop().opacity === '0');
    ok('new month rendered underneath', q('#month-title').textContent === 'February 2027' && !!day('2027-02-13'));
    await sleep(SLIDE_MS + 150);
    ok('snapshot removed after the slide', !q('.weeks-leaving'));
    click(q('[data-action="go-today"]'));
    ok('Today slides back', q('#month-title').textContent === 'January 2027' && !!q('.weeks-leaving'));
    await sleep(SLIDE_MS + 150);

    // Wheel over the calendar changes month; one gesture = one month
    const wheel = dy => q('#weeks').dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: dy }));
    ok('month fits the window (wheel test precondition)', q('#weeks').getBoundingClientRect().bottom <= innerHeight);
    wheel(120);
    ok('wheel down -> next month', q('#month-title').textContent === 'February 2027');
    wheel(120); wheel(120);
    ok('momentum in the same gesture ignored', q('#month-title').textContent === 'February 2027');
    await sleep(WHEEL_PAUSE_MS + 100);
    wheel(-120);
    ok('wheel up after a pause -> previous month', q('#month-title').textContent === 'January 2027');
    await sleep(WHEEL_PAUSE_MS + 100);

    // Horizontal swipe changes month; mostly-vertical swipes don't
    const touch = (type, x, y) => {
      const t = new Touch({ identifier: 1, target: q('#weeks'), clientX: x, clientY: y });
      q('#weeks').dispatchEvent(new TouchEvent(type, { bubbles: true, touches: type === 'touchend' ? [] : [t], changedTouches: [t] }));
    };
    touch('touchstart', 300, 500); touch('touchend', 180, 510);
    ok('swipe left -> next month', q('#month-title').textContent === 'February 2027');
    touch('touchstart', 180, 500); touch('touchend', 320, 495);
    ok('swipe right -> previous month', q('#month-title').textContent === 'January 2027');
    touch('touchstart', 300, 300); touch('touchend', 230, 450);
    ok('vertical-ish swipe ignored', q('#month-title').textContent === 'January 2027');
    await sleep(350);

    // Habit panel collapses (only visible on phones, but the state works everywhere) and is remembered
    click(q('#side-toggle'));
    ok('collapse habit panel', state.settings.statsCollapsed && q('#side').classList.contains('collapsed') && q('#side-toggle').getAttribute('aria-expanded') === 'false');
    click(q('#side-toggle'));
    ok('expand habit panel', !state.settings.statsCollapsed && !q('#side').classList.contains('collapsed'));
    click(q('.shelf-add'));
    ok('shelf + Add opens new type dialog', typeDialog.open && q('#type-form h2').textContent === 'New event type');
    click(q('[data-action="close-dialog"]'));

    // Data menu opens inside the window
    q('.menu').open = true;
    await sleep(20);
    const mr = q('.menu-list').getBoundingClientRect();
    ok('Data menu stays on screen', mr.left >= 0 && mr.right <= innerWidth, Math.round(mr.left) + '..' + Math.round(mr.right));
    q('.menu').open = false;

    // Cloud sync logic, against a fake Firestore that records writes
    click(q('[data-action="reset"]'));
    ok('sync off on file:// pages', syncStatus.state === 'local' && !fb);
    const writes = [];
    fb = { user: { uid: 'u1', email: 'me@example.com' }, unsubscribe: [], db: {
      collection: () => ({ doc: () => ({ collection: name => ({ doc: id => ({ name, id }) }) }) }),
      batch: () => ({ set: (ref, data) => writes.push(['set', ref.name, ref.id, data]), delete: ref => writes.push(['delete', ref.name, ref.id]), commit: () => Promise.resolve() }),
    } };
    const snapOf = (items, changes = [], meta = {}) => ({
      docs: items.map(d => ({ id: d.id, data: () => toDoc(d) })), empty: !items.length, size: items.length,
      docChanges: () => changes, metadata: { hasPendingWrites: false, fromCache: false, ...meta },
    });
    const cloudCopy = structuredClone(state);
    fresh = { types: true, events: true }; ready = false; synced = emptySynced();
    applyRemote('events', snapOf([], [], { fromCache: true }));
    ok('empty first answer from device cache is ignored', fresh.events && state.events.length === cloudCopy.events.length);
    applyRemote('types', snapOf(cloudCopy.types)); applyRemote('events', snapOf(cloudCopy.events));
    ok('first snapshot loads the account copy, then pushing starts', ready && synced.events.size === cloudCopy.events.length && writes.length === 0);
    const synEv = find('2027-01-22', 'Cinema with Alex');
    cycleStatus(synEv.id);
    await sleep(0);
    ok('a tap uploads just that event', writes.length === 1 && writes[0][0] === 'set' && writes[0][2] === synEv.id && writes[0][3].status === 'done', JSON.stringify(writes));
    writes.length = 0;
    applyRemote('events', snapOf([], [{ type: 'modified', doc: { id: synEv.id, data: () => ({ ...toDoc(synEv), title: 'Cinema (changed on phone)' }) } }]));
    ok('change from the other device shows up', byId(synEv.id).title === 'Cinema (changed on phone)' && !!q(`.event[data-id="${synEv.id}"]`));
    ok('...and is not echoed back', writes.length === 0);
    applyRemote('events', snapOf([], [{ type: 'removed', doc: { id: synEv.id, data: () => ({}) } }]));
    ok('deletion from the other device', !byId(synEv.id));
    applyRemote('events', snapOf([], [{ type: 'added', doc: { id: 'zz', data: () => ({ typeId: 'not-yet', title: 'Early', start: '2027-01-05', end: null, time: '', notes: '', status: 'todo', deletedAt: null }) } }]));
    ok('event arriving before its type does not break the page', !!byId('zz') && !q('[data-id="zz"]') && !!q('#weeks .day'));
    state.events = state.events.filter(e => e.id !== 'zz'); synced.events.delete('zz');
    writes.length = 0;
    const doomed = find('2027-01-23', 'Catch-up with Jo');
    removeEvent(doomed.id);
    click(q('#bin')); click(q('[data-action="empty-bin"]'));
    await sleep(0);
    ok('emptying the bin deletes in the account', writes.some(w => w[0] === 'delete' && w[2] === doomed.id));
    fb = null; ready = false; syncAccount = null; synced = emptySynced();
    click(document.body);

    // Real date and Start fresh
    click(q('[data-action="real-today"]'));
    ok('"use real date" follows the clock', state.settings.pretendToday === null && today() === key(new Date()) && todayInput.value === today());
    const typeCount = state.types.length;
    click(q('[data-action="start-fresh"]'));
    ok('start fresh empties events, keeps types', state.events.length === 0 && state.types.length === typeCount && state.settings.pretendToday === null);

    // Migration from the phase 2 (v1) format
    const v1 = { version: 1, settings: { pretendToday: '2027-01-18', showDoneOnly: false }, types: [], events: [{ id: 'x', done: true }, { id: 'y', done: false }] };
    const m = migrate(v1);
    ok('migrates v1 data', isValidState(m) && m.events[0].status === 'done' && m.events[1].status === 'todo' && m.settings.viewMonth === '2027-01');

    click(q('[data-action="reset"]'));
    ok('reset restores seed', state.events.length === SEED.events.length && !!typeById('shopping'));
  } catch (err) { out.push('ERROR ' + err.stack); }
  document.body.innerHTML = '<pre id="out">' + out.join('\n') + '</pre>';
})();
