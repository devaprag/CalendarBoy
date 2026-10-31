// Fixed palette for event types: c = strong colour (ring, path), tint = chip background.
const COLORS = {
  purple: { c: '#8b5cf6', tint: '#ede9fe' },
  sky:    { c: '#0ea5e9', tint: '#e0f2fe' },
  orange: { c: '#f97316', tint: '#ffedd5' },
  pink:   { c: '#ec4899', tint: '#fce7f3' },
  green:  { c: '#22c55e', tint: '#dcfce7' },
  red:    { c: '#ef4444', tint: '#fee2e2' },
  yellow: { c: '#eab308', tint: '#fef9c3' },
  teal:   { c: '#14b8a6', tint: '#ccfbf1' },
};

// Icons offered in the type editor (planeLanding and the bin icons are not standalone choices).
const ICON_LIBRARY = [
  ['camera', 'Movie camera'], ['planeTakeoff', 'Plane'], ['dumbbell', 'Dumbbell'], ['bag', 'Shopping bag'],
  ['phone', 'Phone'], ['bed', 'Bed'], ['washingMachine', 'Washing machine'], ['scissors', 'Scissors'],
  ['tooth', 'Tooth'], ['medkit', 'First-aid kit'], ['shoe', 'Running shoe'], ['swim', 'Swim ring'],
  ['book', 'Book'], ['stones', 'Zen stones'], ['spray', 'Spray bottle'], ['wateringCan', 'Watering can'],
  ['coins', 'Money'], ['cake', 'Cake'], ['dinner', 'Plate'], ['bike', 'Bike'], ['music', 'Music'], ['paw', 'Paw'],
];

const PRESET_TYPES = [
  { name: 'Wash bedsheets', icon: 'bed',            color: 'teal',   goalPerMonth: null, cycleDays: 14 },
  { name: 'Laundry',        icon: 'washingMachine', color: 'sky',    goalPerMonth: null, cycleDays: 7 },
  { name: 'Haircut',        icon: 'scissors',       color: 'pink',   goalPerMonth: null, cycleDays: 42 },
  { name: 'Dentist',        icon: 'tooth',          color: 'sky',    goalPerMonth: null, cycleDays: 180 },
  { name: 'Doctor',         icon: 'medkit',         color: 'red',    goalPerMonth: null, cycleDays: null },
  { name: 'Run',            icon: 'shoe',           color: 'orange', goalPerMonth: 8,    cycleDays: null },
  { name: 'Swim',           icon: 'swim',           color: 'sky',    goalPerMonth: 4,    cycleDays: null },
  { name: 'Read',           icon: 'book',           color: 'yellow', goalPerMonth: 15,   cycleDays: null },
  { name: 'Meditate',       icon: 'stones',         color: 'green',  goalPerMonth: 20,   cycleDays: null },
  { name: 'Cleaning',       icon: 'spray',          color: 'teal',   goalPerMonth: null, cycleDays: 7 },
  { name: 'Water plants',   icon: 'wateringCan',    color: 'green',  goalPerMonth: null, cycleDays: 4 },
  { name: 'Pay bills',      icon: 'coins',          color: 'yellow', goalPerMonth: null, cycleDays: 30 },
  { name: 'Birthday',       icon: 'cake',           color: 'pink',   goalPerMonth: null, cycleDays: null },
  { name: 'Dinner out',     icon: 'dinner',         color: 'red',    goalPerMonth: null, cycleDays: null },
  { name: 'Cycle',          icon: 'bike',           color: 'orange', goalPerMonth: 6,    cycleDays: null },
  { name: 'Music practice', icon: 'music',          color: 'purple', goalPerMonth: 12,   cycleDays: null },
  { name: 'Walk the dog',   icon: 'paw',            color: 'yellow', goalPerMonth: null, cycleDays: 1 },
];


// Demo data for the Nov 2026 – Mar 2027 playground. Pretend-today is 18 Jan 2027, so earlier
// events have done / to-do / abandoned history and later ones are plans.
const SEED = (() => {
  const TODAY = '2027-01-18';
  const keyOf = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const TRIPS = [
    ['2026-12-23', '2026-12-28', 'Christmas in Lisbon', 'Out 08:40 · Back 19:10', 'Family Christmas. Pack the presents!'],
    ['2027-01-14', '2027-01-20', 'Trip to Tokyo', 'Departs 09:15 · Lands 16:40', 'Hotel in Shinjuku.'],
    ['2027-03-13', '2027-03-20', 'Ski week in the Alps', 'Departs 07:30', 'Ski hire booked for six days.'],
  ];
  const away = k => TRIPS.some(([from, to]) => k >= from && k <= to);
  const events = [];
  const add = (typeId, start, title, time, status, notes = '', end = null) =>
    events.push({ id: 'e' + (events.length + 1), typeId, title, start, end, time, notes, status, deletedAt: null });
  // Past routine events are mostly done; a fixed pattern marks a few as missed (to do) or abandoned.
  const status = (k, i, todoEvery, abandonEvery) => k > TODAY ? 'todo'
    : (i + 3) % todoEvery === 0 ? 'todo' : (i + 2) % abandonEvery === 0 ? 'abandoned' : 'done';

  const GYM = ['Gym: legs', 'Gym: upper body', 'Gym: cardio'];
  let gym = 0, shop = 0, call = 0;
  for (let d = new Date(2026, 10, 1); d <= new Date(2027, 2, 31); d.setDate(d.getDate() + 1)) {
    const k = keyOf(d), dow = d.getDay();
    if (away(k)) continue;
    if (dow === 1 || dow === 3 || dow === 5) add('gym', k, GYM[gym % 3], '07:00', status(k, gym++, 7, 11));
    if (dow === 6) add('shopping', k, 'Weekly groceries', '10:00', status(k, shop++, 9, 5));
    if (dow === 0) add('call', k, 'Sunday call with Gran', '17:00', status(k, call++, 6, 13));
  }
  // Every two weeks; the ones that fall during a trip were missed, so bedsheets end up overdue on 18 Jan.
  for (let d = new Date(2026, 10, 8); d <= new Date(2027, 2, 31); d.setDate(d.getDate() + 14)) {
    const k = keyOf(d);
    add('bedsheets', k, 'Wash bedsheets', '', k <= TODAY && !away(k) ? 'done' : 'todo');
  }
  TRIPS.forEach(([from, to, title, time, notes]) => add('holiday', from, title, time, from <= TODAY ? 'done' : 'todo', notes, to));
  [
    ['movie',    '2026-11-07', 'Cinema: autumn blockbuster', '19:30', 'done', 'Screen 2.'],
    ['call',     '2026-11-19', 'Call Sam',                   '18:30', 'done'],
    ['movie',    '2026-11-21', 'Movie night at home',        '20:00', 'todo', 'Fell asleep on the sofa instead.'],
    ['shopping', '2026-11-27', 'Black Friday deals',         '09:00', 'abandoned', "Decided I didn't need anything."],
    ['shopping', '2026-12-12', 'Christmas presents',         '11:00', 'done', 'Gran, Mum, Sam, Priya.'],
    ['movie',    '2026-12-18', 'Christmas movie night',      '20:00', 'done'],
    ['call',     '2026-12-31', "New Year's Eve call with Sam", '23:30', 'done'],
    ['movie',    '2027-01-02', 'Cinema: new release',        '19:30', 'done', 'Booked seats G12–G13.'],
    ['shopping', '2027-01-09', 'Travel adapters',            '14:00', 'done', 'Type A plugs, sunscreen, travel pillow.'],
    ['call',     '2027-01-09', 'Call Mum',                   '18:00', 'done', 'Share the Tokyo itinerary.'],
    ['shopping', '2027-01-13', 'Last-minute packing',        '12:00', 'done'],
    ['call',     '2027-01-13', 'Call Priya',                 '18:00', 'done', 'Ask her to water the plants.'],
    ['movie',    '2027-01-13', 'Movie night at home',        '20:30', 'abandoned', 'Early flight, so skipped it.'],
    ['movie',    '2027-01-22', 'Cinema with Alex',           '20:00', 'todo', 'Alex is choosing the film.'],
    ['call',     '2027-01-23', 'Catch-up with Jo',           '15:00', 'todo', 'Tell Jo all about Tokyo.'],
    ['movie',    '2027-02-13', "Valentine's film",           '19:00', 'todo'],
    ['shopping', '2027-02-20', 'New ski jacket',             '11:00', 'todo'],
    ['call',     '2027-02-25', 'Call Sam',                   '18:30', 'todo'],
    ['movie',    '2027-03-06', 'Cinema: spring premiere',    '19:45', 'todo'],
  ].forEach(e => add(...e));
  add('movie', null, "Watch the director's cut", '', 'todo');
  add('shopping', null, 'Buy new trainers', '', 'todo');
  add('call', null, 'Video call with cousins', '', 'todo');

  return {
    version: 2,
    settings: { pretendToday: TODAY, viewMonth: '2027-01', showDoneOnly: false, locked: true },
    types: [
      { id: 'movie',     name: 'Movie',            icon: 'camera',       color: 'purple', goalPerMonth: 2,    cycleDays: null },
      { id: 'holiday',   name: 'Overseas holiday', icon: 'planeTakeoff', endIcon: 'planeLanding', multiDay: true, color: 'sky', goalPerMonth: null, cycleDays: null },
      { id: 'gym',       name: 'Gym',              icon: 'dumbbell',     color: 'orange', goalPerMonth: 12,   cycleDays: null },
      { id: 'shopping',  name: 'Shopping',         icon: 'bag',          color: 'pink',   goalPerMonth: null, cycleDays: null },
      { id: 'call',      name: 'Call friend',      icon: 'phone',        color: 'green',  goalPerMonth: null, cycleDays: 7 },
      { id: 'bedsheets', name: 'Wash bedsheets',   icon: 'bed',          color: 'teal',   goalPerMonth: null, cycleDays: 14 },
    ],
    events,
  };
})();
