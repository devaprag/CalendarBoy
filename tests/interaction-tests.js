// Interaction tests. Loaded after app.js by tests/run-tests.sh, which prints the PASS/FAIL lines.
// Fires synthetic pointer/click/dblclick events against the real page; state starts from SEED.
const out = [];
const ok =(name, cond, extra = '') => out.push((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  [' + extra + ']' : ''));
window.alert = () => {}; window.confirm = () => true;
const center = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
const pe = (type, el, x, y) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0, pointerId: 1, isPrimary: true }));
const click = el => el.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
const dbl = el => { click(el); click(el); el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); };
const q = s => document.querySelector(s);
const ev = id => q(`.event[data-id="${id}"]`);
const day = k => q(`.day[data-date="${k}"]`);
function dragTo(src, target, from) {
  const a = from || center(src), b = center(target);
  pe('pointerdown', src, a.x, a.y); pe('pointermove', src, a.x + 10, a.y + 10); pe('pointermove', src, b.x, b.y); pe('pointerup', src, b.x, b.y);
  click(document.body); // the click a real drag produces must be swallowed
}
try {
  let el = ev('e7');
  ok('e7 starts missed', el.classList.contains('missed'));
  click(el);
  ok('click marks done', byId('e7').done && el.classList.contains('done') && !el.classList.contains('missed'));
  ok('saved to localStorage', JSON.parse(localStorage.getItem('calendarBoy.v1')).events.find(e => e.id === 'e7').done);
  click(el);
  ok('click again un-does', !byId('e7').done && el.classList.contains('missed'));
  ok('gym stats', q('.type-row:nth-child(3)').textContent.includes('3 / 10 done'));

  dbl(ev('e5'));
  ok('dblclick leaves done unchanged', byId('e5').done === true);
  ok('dblclick opens popup', !popover.hidden && q('.pop-title').value === 'Gym: legs');

  const n = state.events.length;
  click(q('[data-action="duplicate"]'));
  const dup = state.events[state.events.length - 1];
  ok('duplicate on next day, not done', state.events.length === n + 1 && dup.start === '2027-01-05' && !dup.done && popover.hidden);

  dbl(ev('e23'));
  click(q('[data-action="remove"]'));
  ok('remove sends to bin', !!byId('e23').deletedAt && !ev('e23') && q('#bin-badge').textContent === '1');
  click(q('#bin'));
  ok('bin popup lists item', !popover.hidden && popover.textContent.includes('Weekly groceries'));
  click(q('[data-action="restore"]'));
  ok('restore', !byId('e23').deletedAt && !!ev('e23') && q('#bin-badge').hidden);
  click(document.body);

  dbl(ev('e17'));
  const t = q('.pop-title'); t.value = 'Cinema with Alex & Sam'; t.dispatchEvent(new Event('change', { bubbles: true }));
  ok('edit title', byId('e17').title === 'Cinema with Alex & Sam');
  const d = q('[data-field="start"]'); d.value = '2027-01-21'; d.dispatchEvent(new Event('change', { bubbles: true }));
  ok('edit date moves event', byId('e17').start === '2027-01-21' && !!day('2027-01-21').querySelector('[data-id="e17"]'));
  click(document.body);

  dragTo(ev('e5'), day('2027-01-07'));
  ok('drag moves event', byId('e5').start === '2027-01-07' && byId('e5').done === true, byId('e5').start);

  const trip = q('.trip[data-id="e15"]');
  const cell15 = center(day('2027-01-15'));
  dragTo(trip, day('2027-01-22'), { x: cell15.x, y: center(trip).y });
  ok('drag trip keeps length + grab offset', byId('e15').start === '2027-01-21' && byId('e15').end === '2027-01-27', byId('e15').start + '..' + byId('e15').end);
  dragTo(q('.trip[data-id="e15"]'), day('2027-01-30'));
  ok('trip drop outside January rejected', byId('e15').start === '2027-01-21');

  const before = state.events.length;
  dragTo(q('.type-chip[data-type-id="gym"]'), day('2027-01-26'));
  const created = state.events[state.events.length - 1];
  ok('palette drag creates event', state.events.length === before + 1 && created.typeId === 'gym' && created.start === '2027-01-26');
  dragTo(q('.type-chip[data-type-id="holiday"]'), day('2027-01-30'));
  const trip2 = state.events[state.events.length - 1];
  ok('new trip clamps at month end', trip2.start === '2027-01-30' && trip2.end === '2027-01-31');

  dragTo(ev('e18'), q('#backlog'));
  ok('drag to backlog', byId('e18').start === null && !!q('#backlog [data-id="e18"]'));
  dragTo(q('#backlog [data-id="e18"]'), day('2027-01-28'));
  ok('backlog to day', byId('e18').start === '2027-01-28');
  dragTo(q('.trip[data-id="e15"]'), q('#backlog'));
  dragTo(q('#backlog [data-id="e15"]'), day('2027-01-03'));
  ok('trip via backlog keeps length', byId('e15').start === '2027-01-03' && byId('e15').end === '2027-01-09', byId('e15').start + '..' + byId('e15').end);

  dragTo(ev('e24'), q('#bin'));
  ok('drag to bin', !!byId('e24').deletedAt);
  ok('drag did not toggle done', byId('e24').done === false && byId('e5').done === true);

  click(q('#filter-btn'));
  ok('filter hides past missed, keeps future', !ev('e7') && !ev('e11') && !!ev('e22') && !!ev('e6'));
  click(q('#filter-btn'));
  ok('filter off shows again', !!ev('e7'));

  todayInput.value = '2027-01-31'; todayInput.dispatchEvent(new Event('change'));
  ok('moving today greys unfinished events', ev('e22').classList.contains('missed') && q('.date.today').textContent === '31');
  todayInput.value = '2027-01-18'; todayInput.dispatchEvent(new Event('change'));

  click(q('[data-action="add-type"]'));
  click(q('[data-action="preset"][data-preset="1"]'));
  typeForm.requestSubmit();
  const nt = state.types[state.types.length - 1];
  ok('add type from preset', nt.name === 'Laundry' && nt.icon === 'washingMachine' && nt.cycleDays === 7 && !typeDialog.open);
  click(q('[data-action="edit-type"][data-type-id="gym"]'));
  typeForm.elements.name.value = 'Gym & weights'; typeForm.elements.goal.value = '12';
  typeForm.requestSubmit();
  ok('edit type', typeById('gym').name === 'Gym & weights' && typeById('gym').goalPerMonth === 12);
  click(q('[data-action="edit-type"][data-type-id="shopping"]'));
  click(q('[data-action="delete-type"]'));
  ok('delete type removes its events', !typeById('shopping') && !state.events.some(e => e.typeId === 'shopping'));

  ok('state persisted', JSON.parse(localStorage.getItem('calendarBoy.v1')).types.length === state.types.length);
  click(q('[data-action="reset"]'));
  ok('reset restores seed', state.events.length === SEED.events.length && !!typeById('shopping'));
} catch (err) { out.push('ERROR ' + err.stack); }
document.body.innerHTML = '<pre id="out">' + out.join('\n') + '</pre>';
