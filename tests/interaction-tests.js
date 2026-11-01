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

    // Wide screens: the window doesn't scroll, the top bar stays, and each day shows what fits
    click(q('[data-action="reset"]'));
    settle();
    const sv_fits = () => [...document.querySelectorAll('#weeks .events')].every(b => b.scrollHeight <= b.clientHeight + FIT_SLACK_PX);
    const sv_shownPlusMore = k => day(k).querySelectorAll('.event, .due').length + (parseInt(day(k).querySelector('.more')?.textContent.slice(1), 10) || 0);
    ok('desktop page does not scroll', document.documentElement.scrollHeight <= innerHeight + 1, document.documentElement.scrollHeight + ' > ' + innerHeight);
    ok('whole month on screen', q('#weeks').getBoundingClientRect().bottom <= innerHeight + 1);
    ok('no day overflows its cell', sv_fits());
    ok('busy desktop day shows all 4 (as icons if needed)', sv_shownPlusMore('2027-01-13') === 4 && day('2027-01-13').querySelectorAll('.event').length === 4);
    ok('quiet desktop day keeps its labels', !day('2027-01-09').querySelector('.events.compact'));
    const sv_gymType = typeById('gym');
    for (let i = 0; i < 12; i++) addEvent(sv_gymType, '2027-01-13');
    ok('16 items on a desktop day: icons that fit + "+N more"', sv_fits() && day('2027-01-13').querySelector('.events.compact') && !!day('2027-01-13').querySelector('.more') && sv_shownPlusMore('2027-01-13') === 16);
    // The shelf (Add icons + backlog) collapses and stays collapsed
    click(q('#shelf-toggle'));
    ok('shelf collapses', state.settings.shelfCollapsed && q('#palette').offsetParent === null && q('#shelf-toggle').getAttribute('aria-expanded') === 'false');
    ok('more room for the month when the shelf is collapsed', sv_shownPlusMore('2027-01-13') === 16 && sv_fits());
    click(q('#shelf-toggle'));
    ok('shelf expands', !state.settings.shelfCollapsed && q('#palette').offsetParent !== null);
    click(q('[data-action="reset"]'));

    // Strava import, through the real file input (the system file dialog itself can't be driven)
    ok('strava-export.js loaded from ../strava-lib', !!window.StravaExport);
    const sv_utc = (d, h) => new Date(Date.UTC(2027, 0, d, h));
    const sv_localDay = (d, h) => key(sv_utc(d, h));
    const sv_stamp = (d, h) => { const t = sv_utc(d, h); return `"Jan ${t.getUTCDate()}, 2027, ${t.getUTCHours() % 12 || 12}:00:00 ${t.getUTCHours() < 12 ? 'AM' : 'PM'}"`; };
    const sv_stravaCsv = rows => 'Activity ID,Activity Date,Activity Name,Activity Type,Elapsed Time,Distance,Moving Time,Distance\n' +
      rows.map(r => r.join(',')).join('\n') + '\n';
    const sv_feedStrava = async text => {
      const dt = new DataTransfer();
      dt.items.add(new File([text], 'activities.csv', { type: 'text/csv' }));
      stravaInput.files = dt.files;
      stravaInput.dispatchEvent(new Event('change'));
      await sleep(50);
    };
    const sv_csv1 = sv_stravaCsv([
      ['111', sv_stamp(11, 12), 'Easy <b>run</b>', 'Run', 1900, '5.20', 1800, '5200.0'],
      ['222', sv_stamp(12, 12), 'Commute', 'Ride', 900, '6.00', 900, '6000.0'],
      ['333', sv_stamp(14, 2), 'Long run', 'Run', 5400, '14.41', 5363, '14415.7'],
    ]);
    const sv_eventsBefore = state.events.length;
    await sv_feedStrava(sv_csv1);
    const sv_runType = findRunType();
    const sv_r1 = state.events.find(e => e.stravaId === '111');
    ok('import creates a Run type and adds only the runs', !!sv_runType && sv_runType.icon === 'shoe' && state.events.length === sv_eventsBefore + 2 && !state.events.some(e => e.stravaId === '222'));
    ok('run lands on its local day, done, with stats', sv_r1.start === sv_localDay(11, 12) && sv_r1.status === 'done' && sv_r1.distance === 5200 && sv_r1.moving === 1800);
    ok('import shows an undo toast', !toastEl.hidden && /2 added/.test(q('#toast-text').textContent));
    let sv_runEl = elOf(sv_r1);
    ok('run icon shows distance and pace', sv_runEl.querySelector('.chip.has-stats .run-km').textContent === '5.2' && sv_runEl.querySelector('.run-pace').textContent === '5:46');
    ok('run label shows km and pace', sv_runEl.querySelector('.label small').textContent === '5.2 km · 5:46 /km');
    ok('run names are escaped', !sv_runEl.querySelector('.label b'));
    click(q('[data-action="undo"]'));
    ok('undo removes the imported runs', state.events.length === sv_eventsBefore && !state.events.some(e => e.stravaId));
    await sv_feedStrava(sv_csv1);
    const sv_countAfter = state.events.length;
    await sv_feedStrava(sv_csv1);
    ok('importing the same file again adds nothing', state.events.length === sv_countAfter);
    // A planned run on the day of a new activity gets completed instead of duplicated
    const sv_runT = findRunType();
    addEvent(sv_runT, sv_localDay(16, 12));
    const sv_planned = state.events[state.events.length - 1];
    removeEvent(state.events.find(e => e.stravaId === '333').id);
    await sv_feedStrava(sv_stravaCsv([
      ['333', sv_stamp(14, 2), 'Long run', 'Run', 5400, '14.41', 5363, '14415.7'],
      ['444', sv_stamp(16, 12), 'Tempo', 'Run', 1500, '5.00', 1490, '5000.0'],
    ]));
    ok('a planned run is completed by the activity', sv_planned.stravaId === '444' && sv_planned.status === 'done' && sv_planned.distance === 5000 && state.events.filter(e => e.stravaId === '444').length === 1);
    ok('a run removed to the bin stays removed', state.events.filter(e => e.stravaId === '333').length === 1 && !!state.events.find(e => e.stravaId === '333').deletedAt);

    // Run fields in the details popup
    sv_runEl = elOf(state.events.find(e => e.stravaId === '111'));
    sv_runEl.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    const sv_distIn = q('[data-field="distance"]'), sv_durIn = q('[data-field="moving"]');
    ok('popup shows distance and duration', sv_distIn.value === '5.2' && sv_durIn.value === '30:00' && /Pace 5:46/.test(popover.textContent) && !!q('#popover a[href*="strava.com/activities/111"]'));
    sv_distIn.value = '10'; sv_distIn.dispatchEvent(new Event('change', { bubbles: true }));
    q('[data-field="moving"]').value = '50:00'; q('[data-field="moving"]').dispatchEvent(new Event('change', { bubbles: true }));
    const sv_r1b = state.events.find(e => e.stravaId === '111');
    ok('editing distance and duration updates the pace', sv_r1b.distance === 10000 && sv_r1b.moving === 3000 && /Pace 5:00/.test(popover.textContent) && elOf(sv_r1b).querySelector('.run-pace').textContent === '5:00');
    click(q('[data-action="duplicate"]'));
    const sv_runCopy = state.events[state.events.length - 1];
    ok('duplicating a Strava run makes a plain planned run', sv_runCopy.status === 'todo' && !sv_runCopy.stravaId && !sv_runCopy.distance && !elOf(sv_runCopy)?.querySelector('.run-km'));
    click(document.body);
    ok('durations parse', parseDuration('45') === 2700 && parseDuration('28:30') === 1710 && parseDuration('1:05:30') === 3930 && parseDuration('abc') === null);

    // Shortcut icons: 10 most recently used types, newest first
    click(q('[data-action="reset"]'));
    if (state.settings.locked) click(q('#lock-btn'));
    const sv_paletteIds = () => [...document.querySelectorAll('#palette .type-chip')].map(el => el.dataset.typeId);
    ok('unused types fill the shortcuts in sidebar order', sv_paletteIds().join() === state.types.map(t => t.id).join());
    dragTo(q('#palette .type-chip[data-type-id="bedsheets"]'), day('2027-01-28'));
    ok('dropping a shortcut moves it to the front', sv_paletteIds()[0] === 'bedsheets' && state.settings.recentTypes[0] === 'bedsheets');
    for (let i = 0; i < 6; i++) state.types.push({ id: 'extra' + i, name: 'Extra ' + i, icon: 'dice', color: 'red', goalPerMonth: null, cycleDays: null });
    commit();
    ok('at most 10 shortcuts', sv_paletteIds().length === 10 && sv_paletteIds()[0] === 'bedsheets' && !sv_paletteIds().includes('extra5'));
    dragTo(q('#types .side-chip[data-type-id="extra5"]'), day('2027-01-29'));
    ok('a type dragged from the sidebar is added and joins the shortcuts at the front', state.events.some(e => e.typeId === 'extra5' && e.start === '2027-01-29') && sv_paletteIds()[0] === 'extra5' && sv_paletteIds()[1] === 'bedsheets');
    // Type editor: icons grouped by category, with Trivia and Pub among them
    click(q('[data-action="add-type"]'));
    const sv_cats = [...document.querySelectorAll('#type-form .icon-cat')].map(el => el.textContent);
    ok('icon picker is grouped', sv_cats.length >= 5 && sv_cats.includes('Fun & social') && sv_cats.includes('Fitness'), sv_cats.join('|'));
    ok('about 50 icons, including trivia and pub', document.querySelectorAll('#type-form .icon-opt').length === ICON_LIBRARY.length && ICON_LIBRARY.length >= 45 && !!q('#type-form input[value="trivia"]') && !!q('#type-form input[value="beer"]'));
    ok('every icon in the picker draws', [...document.querySelectorAll('#type-form .icon-opt svg')].length === ICON_LIBRARY.length);
    const sv_save = q('#type-form [type="submit"]').getBoundingClientRect();
    ok('Save stays visible while the long picker scrolls', sv_save.bottom <= innerHeight && sv_save.top >= 0);
    click(q('[data-action="close-dialog"]'));
    click(q('[data-action="reset"]'));

    // The bin keeps the 5 most recently removed items
    click(q('[data-action="reset"]'));
    const sv_victims = state.events.filter(e => e.start && !e.end).slice(0, 6);
    sv_victims.slice(0, 4).forEach((e, i) => { e.deletedAt = `2020-01-0${i + 1}T00:00:00.000Z`; });
    commit();
    const sv_binCount = () => state.events.filter(e => e.deletedAt).length;
    ok('bin starts with 4', sv_binCount() === 4);
    undoable(() => { removeEvent(sv_victims[4].id); return 'Moved to the bin'; });
    ok('5th item fits', sv_binCount() === 5 && !!byId(sv_victims[0].id) && q('#bin-badge').textContent === '5');
    undoable(() => { removeEvent(sv_victims[5].id); return 'Moved to the bin'; });
    ok('6th item deletes the oldest for good', sv_binCount() === 5 && !byId(sv_victims[0].id) && !!byId(sv_victims[5].id)?.deletedAt && q('#bin-badge').textContent === '5');
    click(q('[data-action="undo"]'));
    ok('undo brings back the purged item too', !!byId(sv_victims[0].id)?.deletedAt && !byId(sv_victims[5].id).deletedAt && sv_binCount() === 5);
    click(q('[data-action="reset"]'));

    // Run streaks count weeks (Sun–Sat) with a done run; this week (from Sun 17 Jan) can't break it yet
    click(q('[data-action="reset"]'));
    state.types.push({ id: 'run', name: 'Run', icon: 'shoe', color: 'orange', goalPerMonth: 8, cycleDays: null });
    const addRun = (start, status = 'done') => state.events.push({ id: 'run' + start, typeId: 'run', title: 'Run', start, end: null, time: '', notes: '', status, deletedAt: null });
    ['2026-12-01', '2026-12-08', '2026-12-14', '2027-01-04', '2027-01-06', '2027-01-12'].forEach(k => addRun(k));
    addRun('2027-01-15', 'abandoned');
    commit();
    const runRow = () => [...document.querySelectorAll('.type-row')].find(r => r.textContent.includes('Run'));
    ok('run streak counts weeks, best kept', /2 weeks in a row · best 3/.test(runRow().textContent), runRow().querySelector('.streak')?.textContent);
    addRun('2027-01-18');
    commit();
    ok('a run this week extends the streak', /3 weeks in a row/.test(runRow().textContent) && !/best/.test(runRow().querySelector('.streak').textContent));
    setToday('2027-02-01');
    ok('a whole week without a run ends it', !runRow().querySelector('.streak'));
    click(q('[data-action="reset"]'));

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
