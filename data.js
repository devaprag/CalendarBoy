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

function seedEvent(id, typeId, start, title, time, done, notes = '', end = null) {
  return { id, typeId, title, start, end, time, notes, done, deletedAt: null };
}

// Demo data. Pretend-today is 18 Jan, so the first half of the month has done / not-done history.
const SEED = {
  version: 1,
  settings: { pretendToday: '2027-01-18', showDoneOnly: false },
  types: [
    { id: 'movie',     name: 'Movie',            icon: 'camera',       color: 'purple', goalPerMonth: 4,    cycleDays: null },
    { id: 'holiday',   name: 'Overseas holiday', icon: 'planeTakeoff', endIcon: 'planeLanding', multiDay: true, color: 'sky', goalPerMonth: null, cycleDays: null },
    { id: 'gym',       name: 'Gym',              icon: 'dumbbell',     color: 'orange', goalPerMonth: 10,   cycleDays: null },
    { id: 'shopping',  name: 'Shopping',         icon: 'bag',          color: 'pink',   goalPerMonth: null, cycleDays: null },
    { id: 'call',      name: 'Call friend',      icon: 'phone',        color: 'green',  goalPerMonth: null, cycleDays: 7 },
    { id: 'bedsheets', name: 'Wash bedsheets',   icon: 'bed',          color: 'teal',   goalPerMonth: null, cycleDays: 14 },
  ],
  events: [
    seedEvent('e1',  'call',      '2027-01-01', 'New Year call with Sam', '11:00', true,  'Wish Sam a happy new year and hear about the party.'),
    seedEvent('e2',  'shopping',  '2027-01-02', 'January sales',          '10:00', true,  'New running shoes and a winter coat.'),
    seedEvent('e3',  'movie',     '2027-01-02', 'Cinema: new release',    '19:30', true,  'Screen 4. Booked seats G12–G13.'),
    seedEvent('e4',  'bedsheets', '2027-01-03', 'Wash bedsheets',         '',      true),
    seedEvent('e5',  'gym',       '2027-01-04', 'Gym: legs',              '07:00', true,  'Squats, lunges, leg press.'),
    seedEvent('e6',  'gym',       '2027-01-06', 'Gym: upper body',        '07:00', true,  'Bench, rows, shoulder press.'),
    seedEvent('e7',  'gym',       '2027-01-08', 'Gym: cardio',            '07:00', false, '30 min intervals on the bike.'),
    seedEvent('e8',  'shopping',  '2027-01-09', 'Travel adapters',        '14:00', true,  'Type A plug adapters, sunscreen, travel pillow.'),
    seedEvent('e9',  'call',      '2027-01-09', 'Call Mum',               '18:00', true,  'Share the trip itinerary.'),
    seedEvent('e10', 'gym',       '2027-01-11', 'Gym: full body',         '07:00', true,  'Last session before the trip.'),
    seedEvent('e11', 'gym',       '2027-01-13', 'Gym: stretch',           '07:00', false, 'Light yoga and mobility.'),
    seedEvent('e12', 'shopping',  '2027-01-13', 'Last-minute packing',    '12:00', true,  'Toiletries and snacks for the flight.'),
    seedEvent('e13', 'call',      '2027-01-13', 'Call Priya',             '18:00', true,  'Ask her to water the plants while I am away.'),
    seedEvent('e14', 'movie',     '2027-01-13', 'Movie night at home',    '20:30', false, 'Something light before an early flight.'),
    seedEvent('e15', 'holiday',   '2027-01-14', 'Trip to Tokyo',          'Departs 09:15 · Lands 16:40', true, 'Flight out on the 14th, home on the 20th. Hotel in Shinjuku.', '2027-01-20'),
    seedEvent('e16', 'bedsheets', '2027-01-17', 'Wash bedsheets',         '',      false, 'Away in Tokyo, so this one slipped.'),
    seedEvent('e17', 'movie',     '2027-01-22', 'Cinema with Alex',       '20:00', false, 'Alex is choosing the film this time.'),
    seedEvent('e18', 'call',      '2027-01-23', 'Catch-up with Jo',       '15:00', false, 'Tell Jo all about Tokyo.'),
    seedEvent('e19', 'bedsheets', '2027-01-24', 'Wash bedsheets',         '',      false),
    seedEvent('e20', 'gym',       '2027-01-25', 'Gym: back on it',        '07:00', false, 'Easy session after the holiday.'),
    seedEvent('e21', 'gym',       '2027-01-27', 'Gym: upper body',        '07:00', false),
    seedEvent('e22', 'gym',       '2027-01-29', 'Gym: cardio',            '07:00', false),
    seedEvent('e23', 'shopping',  '2027-01-30', 'Weekly groceries',       '10:00', false, 'Fruit, veg, coffee beans.'),
    seedEvent('e24', 'call',      '2027-01-31', 'Sunday call with Gran',  '17:00', false),
    seedEvent('e25', 'movie',     null,         "Watch the director's cut", '',    false),
    seedEvent('e26', 'shopping',  null,         'Buy new trainers',       '',      false),
    seedEvent('e27', 'call',      null,         'Video call with cousins', '',     false),
  ],
};
