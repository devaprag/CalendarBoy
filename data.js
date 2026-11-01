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

// Icons offered in the type editor, grouped to make them easier to find. The groups exist only in
// the editor; types and events don't store them. (planeLanding and the UI icons aren't choices.)
const ICON_CATEGORIES = [
  ['Fun & social', [
    ['camera', 'Movie camera'], ['beer', 'Pub / drinks'], ['trivia', 'Trivia / quiz'], ['dinner', 'Plate'],
    ['coffee', 'Coffee'], ['cake', 'Cake'], ['gift', 'Present'], ['phone', 'Phone'], ['gamepad', 'Video games'],
    ['dice', 'Board games'], ['masks', 'Theatre'], ['mic', 'Karaoke / gig'], ['music', 'Music'],
  ]],
  ['Fitness', [
    ['shoe', 'Running shoe'], ['dumbbell', 'Dumbbell'], ['bike', 'Bike'], ['swim', 'Swim ring'],
    ['tennis', 'Tennis'], ['football', 'Football'], ['stones', 'Zen stones'],
  ]],
  ['Health', [
    ['apple', 'Apple'], ['water', 'Water bottle'], ['moon', 'Sleep'], ['pill', 'Pills'], ['tooth', 'Tooth'], ['medkit', 'First-aid kit'],
  ]],
  ['Housework & pets', [
    ['washingMachine', 'Washing machine'], ['bed', 'Bed'], ['spray', 'Spray bottle'], ['broom', 'Broom'],
    ['wheelieBin', 'Bins'], ['pot', 'Cooking pot'], ['wateringCan', 'Watering can'], ['hammer', 'DIY'], ['paw', 'Paw'],
  ]],
  ['Errands & appointments', [
    ['bag', 'Shopping bag'], ['cart', 'Groceries'], ['coins', 'Money'], ['envelope', 'Post'], ['car', 'Car'], ['scissors', 'Scissors'],
  ]],
  ['Learning & creative', [
    ['book', 'Book'], ['laptop', 'Laptop (coding)'], ['pencil', 'Pencil'], ['palette', 'Art'], ['gradCap', 'Study'],
  ]],
  ['Travel & outdoors', [
    ['planeTakeoff', 'Plane'], ['mountain', 'Hike'], ['tent', 'Camping'], ['beach', 'Beach'],
  ]],
];
const ICON_LIBRARY = ICON_CATEGORIES.flatMap(([, icons]) => icons);

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
  { name: 'Coding',         icon: 'laptop',         color: 'purple', goalPerMonth: 10,   cycleDays: null },
  { name: 'Trivia night',   icon: 'trivia',         color: 'purple', goalPerMonth: null, cycleDays: null },
  { name: 'Pub / drinks',   icon: 'beer',           color: 'yellow', goalPerMonth: null, cycleDays: null },
  { name: 'Coffee catch-up', icon: 'coffee',        color: 'orange', goalPerMonth: null, cycleDays: null },
  { name: 'Board games',    icon: 'dice',           color: 'red',    goalPerMonth: null, cycleDays: null },
  { name: 'Gaming',         icon: 'gamepad',        color: 'purple', goalPerMonth: null, cycleDays: null },
  { name: 'Tennis',         icon: 'tennis',         color: 'green',  goalPerMonth: 4,    cycleDays: null },
  { name: 'Football',       icon: 'football',       color: 'green',  goalPerMonth: 4,    cycleDays: null },
  { name: 'Hike',           icon: 'mountain',       color: 'teal',   goalPerMonth: 2,    cycleDays: null },
  { name: 'Bins out',       icon: 'wheelieBin',     color: 'green',  goalPerMonth: null, cycleDays: 7 },
  { name: 'Meal prep',      icon: 'pot',            color: 'red',    goalPerMonth: null, cycleDays: 7 },
  { name: 'Vitamins',       icon: 'pill',           color: 'sky',    goalPerMonth: null, cycleDays: 1 },
  { name: 'Study',          icon: 'gradCap',        color: 'purple', goalPerMonth: 12,   cycleDays: null },
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
    events.push({ id: 'e' + (events.length + 1), typeId, title, start, end, time, notes, status, deletedAt: null, seq: events.length });
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
    version: 3,
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
