// Cartoon icons: 64x64 viewBox, flat fills, thick dark outline.
const OUTLINE = 'stroke="#2b2b2b" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const THIN = 'stroke="#2b2b2b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';

const PLANE = `
  <path d="M10 27 L6 13 H13 L23 27 Z" fill="#38bdf8" ${OUTLINE}/>
  <path d="M8 31 Q8 26 15 26 H47 Q58 26 60 31.5 Q58 37 47 37 H15 Q8 37 8 31 Z" fill="#f8fafc" ${OUTLINE}/>
  <path d="M52 28.5 Q56 29 57.5 31 H52 Z" fill="#7dd3fc" stroke="#2b2b2b" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="22" cy="31" r="1.8" fill="#0ea5e9"/><circle cx="28" cy="31" r="1.8" fill="#0ea5e9"/>
  <circle cx="34" cy="31" r="1.8" fill="#0ea5e9"/><circle cx="40" cy="31" r="1.8" fill="#0ea5e9"/>
  <circle cx="46" cy="31" r="1.8" fill="#0ea5e9"/>
  <path d="M26 34 H38 L29 48 H22 Z" fill="#0ea5e9" ${OUTLINE}/>`;

const svg = body => `<svg viewBox="0 0 64 64" aria-hidden="true">${body}</svg>`;

const ICONS = {
  camera: svg(`
    <circle cx="19" cy="16" r="10" fill="#c4b5fd" ${OUTLINE}/><circle cx="19" cy="16" r="3" fill="#2b2b2b"/>
    <circle cx="40" cy="16" r="10" fill="#c4b5fd" ${OUTLINE}/><circle cx="40" cy="16" r="3" fill="#2b2b2b"/>
    <rect x="7" y="27" width="38" height="25" rx="5" fill="#8b5cf6" ${OUTLINE}/>
    <path d="M45 34 L58 27 V52 L45 45 Z" fill="#ddd6fe" ${OUTLINE}/>
    <circle cx="14" cy="34" r="2.5" fill="#f43f5e"/>
    <rect x="13" y="40" width="20" height="6" rx="3" fill="#ede9fe"/>`),

  planeTakeoff: svg(`
    <path d="M4 58 H34" stroke="#64748b" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4"/>
    <circle cx="8" cy="50" r="3.5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="14" cy="53" r="2.5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <g transform="rotate(-24 34 31) translate(0 -2)">${PLANE}</g>`),

  planeLanding: svg(`
    <path d="M28 58 H60" stroke="#64748b" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4"/>
    <g transform="rotate(16 34 31) translate(-2 -6)">
      ${PLANE}
      <path d="M44 37 V42" stroke="#2b2b2b" stroke-width="2.5"/><circle cx="44" cy="44" r="2.5" fill="#2b2b2b"/>
      <path d="M20 37 V42" stroke="#2b2b2b" stroke-width="2.5"/><circle cx="20" cy="44" r="2.5" fill="#2b2b2b"/>
    </g>`),

  dumbbell: svg(`
    <rect x="16" y="29" width="32" height="6" rx="2" fill="#94a3b8" ${OUTLINE}/>
    <rect x="9" y="17" width="9" height="30" rx="3" fill="#f97316" ${OUTLINE}/>
    <rect x="46" y="17" width="9" height="30" rx="3" fill="#f97316" ${OUTLINE}/>
    <rect x="3" y="23" width="7" height="18" rx="2.5" fill="#fdba74" ${OUTLINE}/>
    <rect x="54" y="23" width="7" height="18" rx="2.5" fill="#fdba74" ${OUTLINE}/>
    <path d="M12 21 V27" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M49 21 V27" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`),

  bag: svg(`
    <path d="M23 22 V16 Q23 7 32 7 Q41 7 41 16 V22" fill="none" ${OUTLINE}/>
    <path d="M11 20 H53 L50 57 H14 Z" fill="#ec4899" ${OUTLINE}/>
    <circle cx="23" cy="27" r="2.5" fill="#2b2b2b"/><circle cx="41" cy="27" r="2.5" fill="#2b2b2b"/>
    <path d="M32 49 C24 43 23 37 27 35 C29.5 34 31 35.5 32 37 C33 35.5 34.5 34 37 35 C41 37 40 43 32 49 Z" fill="#fce7f3" ${THIN}/>`),

  phone: svg(`
    <rect x="8" y="14" width="26" height="44" rx="6" fill="#22c55e" ${OUTLINE}/>
    <rect x="12" y="20" width="18" height="28" rx="2" fill="#dcfce7"/>
    <circle cx="21" cy="53" r="2" fill="#2b2b2b"/>
    <path d="M36 6 H58 Q61 6 61 9 V24 Q61 27 58 27 H46 L39 33 V27 H36 Q33 27 33 24 V9 Q33 6 36 6 Z" fill="#fff" ${OUTLINE}/>
    <circle cx="40" cy="16.5" r="2.2" fill="#22c55e"/><circle cx="47" cy="16.5" r="2.2" fill="#22c55e"/><circle cx="54" cy="16.5" r="2.2" fill="#22c55e"/>
    <path d="M17 33 Q21 27 25 33" fill="none" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/>`),

  bed: svg(`
    <rect x="5" y="16" width="9" height="40" rx="3" fill="#b45309" ${OUTLINE}/>
    <rect x="12" y="34" width="47" height="13" rx="3" fill="#fff" ${OUTLINE}/>
    <rect x="16" y="25" width="15" height="10" rx="5" fill="#e0f2fe" ${OUTLINE}/>
    <path d="M30 31 H55 Q59 31 59 35 V47 H30 Z" fill="#14b8a6" ${OUTLINE}/>
    <path d="M36 37 H52 M36 42 H48" stroke="#ccfbf1" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M56 47 V55" ${OUTLINE}/>`),

  washingMachine: svg(`
    <rect x="10" y="6" width="44" height="52" rx="6" fill="#f8fafc" ${OUTLINE}/>
    <path d="M10 18 H54" ${OUTLINE}/>
    <circle cx="18" cy="12" r="2.5" fill="#0ea5e9"/><rect x="34" y="10" width="14" height="4" rx="2" fill="#94a3b8"/>
    <circle cx="32" cy="38" r="13" fill="#7dd3fc" ${OUTLINE}/>
    <path d="M22 40 Q27 35 32 40 T42 40" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),

  scissors: svg(`
    <path d="M26 34 L56 12 L59 17 L30 38 Z" fill="#e2e8f0" ${OUTLINE}/>
    <path d="M26 30 L56 52 L59 47 L30 26 Z" fill="#e2e8f0" ${OUTLINE}/>
    <path d="M19 27 L30 32 L19 37" fill="none" ${OUTLINE}/>
    <circle cx="13" cy="22" r="8" fill="#ec4899" ${OUTLINE}/><circle cx="13" cy="22" r="3" fill="#fff"/>
    <circle cx="13" cy="42" r="8" fill="#ec4899" ${OUTLINE}/><circle cx="13" cy="42" r="3" fill="#fff"/>
    <circle cx="30" cy="32" r="2.5" fill="#2b2b2b"/>`),

  tooth: svg(`
    <path d="M16 14 Q16 6 25 7 Q32 9 39 7 Q48 6 48 14 Q48 26 44 34 Q42 48 39 56 Q36 58 35 54 Q34 42 32 40 Q30 42 29 54 Q28 58 25 56 Q22 48 20 34 Q16 26 16 14 Z" fill="#fff" ${OUTLINE}/>
    <path d="M22 17 Q23 12 28 12" stroke="#7dd3fc" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M52 8 L54 12 L58 13 L54 15 L52 19 L50 15 L46 13 L50 12 Z" fill="#facc15"/>`),

  medkit: svg(`
    <path d="M24 16 V11 Q24 8 27 8 H37 Q40 8 40 11 V16" fill="none" ${OUTLINE}/>
    <rect x="8" y="16" width="48" height="38" rx="6" fill="#fff" ${OUTLINE}/>
    <path d="M28 24 H36 V31 H43 V39 H36 V46 H28 V39 H21 V31 H28 Z" fill="#ef4444" ${THIN}/>`),

  shoe: svg(`
    <path d="M6 46 Q6 36 12 34 L22 30 L26 20 Q28 16 32 18 L36 22 Q40 30 50 34 Q58 37 58 44 V48 H6 Z" fill="#3b82f6" ${OUTLINE}/>
    <path d="M6 48 H58 V52 Q58 55 55 55 H9 Q6 55 6 52 Z" fill="#fff" ${OUTLINE}/>
    <path d="M29 26 L34 29 M26 31 L31 34" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M44 40 H52" stroke="#bfdbfe" stroke-width="3" stroke-linecap="round"/>`),

  swim: svg(`
    <circle cx="32" cy="27" r="18" fill="#ef4444" ${OUTLINE}/>
    <path d="M32 11 V19 M32 35 V43 M16 27 H24 M40 27 H48" stroke="#fff" stroke-width="6"/>
    <circle cx="32" cy="27" r="8" fill="#e0f2fe" ${OUTLINE}/>
    <path d="M4 52 Q11 46 18 52 T32 52 T46 52 T60 52" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>
    <path d="M4 60 Q11 54 18 60 T32 60 T46 60 T60 60" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>`),

  book: svg(`
    <path d="M32 14 Q22 8 8 10 V52 Q22 50 32 56 Z" fill="#fde68a" ${OUTLINE}/>
    <path d="M32 14 Q42 8 56 10 V52 Q42 50 32 56 Z" fill="#fef3c7" ${OUTLINE}/>
    <path d="M14 20 Q20 19 26 21 M14 28 Q20 27 26 29 M14 36 Q20 35 26 37 M38 21 Q44 19 50 20 M38 29 Q44 27 50 28 M38 37 Q44 35 50 36" stroke="#b45309" stroke-width="2" fill="none" stroke-linecap="round"/>`),

  stones: svg(`
    <ellipse cx="32" cy="50" rx="21" ry="8" fill="#94a3b8" ${OUTLINE}/>
    <ellipse cx="32" cy="36" rx="15" ry="6.5" fill="#cbd5e1" ${OUTLINE}/>
    <ellipse cx="32" cy="25" rx="9" ry="5" fill="#94a3b8" ${OUTLINE}/>
    <path d="M32 20 Q30 9 41 5 Q43 16 32 20 Z" fill="#22c55e" ${OUTLINE}/>`),

  spray: svg(`
    <path d="M22 22 V17 Q22 11 28 11 H42 V22 Z" fill="#14b8a6" ${OUTLINE}/>
    <path d="M42 13 H50 L52 18 H42" fill="#14b8a6" ${OUTLINE}/>
    <path d="M24 22 H40 L44 32 V54 Q44 58 40 58 H24 Q20 58 20 54 V32 Z" fill="#99f6e4" ${OUTLINE}/>
    <rect x="25" y="38" width="14" height="10" rx="2" fill="#fff" ${THIN}/>
    <circle cx="57" cy="12" r="2.2" fill="#14b8a6"/><circle cx="59" cy="19" r="2.2" fill="#14b8a6"/><circle cx="56" cy="25" r="2.2" fill="#14b8a6"/>`),

  wateringCan: svg(`
    <path d="M18 26 Q27 14 36 26" fill="none" ${OUTLINE}/>
    <path d="M14 26 H40 V52 Q40 56 36 56 H18 Q14 56 14 52 Z" fill="#22c55e" ${OUTLINE}/>
    <path d="M40 42 L55 23 L59 26 L42 49 Z" fill="#22c55e" ${OUTLINE}/>
    <path d="M14 32 Q4 32 6 42 Q7 48 14 48" fill="none" ${OUTLINE}/>
    <circle cx="59" cy="34" r="2.2" fill="#38bdf8"/><circle cx="54" cy="38" r="2.2" fill="#38bdf8"/><circle cx="60" cy="42" r="2.2" fill="#38bdf8"/>`),

  coins: svg(`
    <rect x="6" y="12" width="40" height="26" rx="4" fill="#86efac" ${OUTLINE}/>
    <circle cx="26" cy="25" r="7" fill="#22c55e" ${OUTLINE}/>
    <circle cx="44" cy="44" r="14" fill="#facc15" ${OUTLINE}/>
    <circle cx="44" cy="44" r="8" fill="none" stroke="#a16207" stroke-width="2.5"/>`),

  cake: svg(`
    <path d="M22.5 8 Q26 13 22.5 16 Q19 13 22.5 8 Z M32.5 8 Q36 13 32.5 16 Q29 13 32.5 8 Z M42.5 8 Q46 13 42.5 16 Q39 13 42.5 8 Z" fill="#f59e0b"/>
    <rect x="20" y="18" width="5" height="14" rx="1.5" fill="#60a5fa" ${THIN}/>
    <rect x="30" y="18" width="5" height="14" rx="1.5" fill="#a78bfa" ${THIN}/>
    <rect x="40" y="18" width="5" height="14" rx="1.5" fill="#34d399" ${THIN}/>
    <rect x="10" y="32" width="44" height="21" rx="4" fill="#f9a8d4" ${OUTLINE}/>
    <path d="M11 40 Q16 46 21 40 Q27 46 32 40 Q37 46 43 40 Q48 46 53 40" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <rect x="6" y="52" width="52" height="6" rx="3" fill="#e2e8f0" ${OUTLINE}/>`),

  dinner: svg(`
    <circle cx="32" cy="34" r="18" fill="#fff" ${OUTLINE}/>
    <circle cx="32" cy="34" r="11" fill="#fef3c7" stroke="#cbd5e1" stroke-width="2"/>
    <path d="M7 12 V22 M11 12 V22 M15 12 V22 M7 22 Q7 28 11 28 Q15 28 15 22 M11 28 V56" fill="none" ${OUTLINE}/>
    <path d="M57 12 Q50 20 52 34 H57 Z M57 34 V56" fill="#e2e8f0" ${OUTLINE}/>`),

  bike: svg(`
    <circle cx="15" cy="42" r="11" fill="#fff" ${OUTLINE}/>
    <circle cx="49" cy="42" r="11" fill="#fff" ${OUTLINE}/>
    <path d="M15 42 L25 26 H44 L49 42 M25 26 L33 42 H15 M33 42 L44 26" fill="none" stroke="#f97316" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M21 20 H30 M25 20 V26" fill="none" ${OUTLINE}/>
    <path d="M44 26 L42 17 H49" fill="none" ${OUTLINE}/>
    <circle cx="33" cy="42" r="3" fill="#2b2b2b"/>`),

  music: svg(`
    <path d="M24 46 V15 L50 9 V40" fill="none" stroke="#2b2b2b" stroke-width="4" stroke-linejoin="round"/>
    <path d="M24 15 L50 9 V17 L24 23 Z" fill="#2b2b2b"/>
    <ellipse cx="18" cy="47" rx="8" ry="6" fill="#8b5cf6" ${OUTLINE}/>
    <ellipse cx="44" cy="41" rx="8" ry="6" fill="#8b5cf6" ${OUTLINE}/>`),

  paw: svg(`
    <path d="M32 31 Q44 31 46 44 Q47 54 39 54 Q35 54 32 51 Q29 54 25 54 Q17 54 18 44 Q20 31 32 31 Z" fill="#b45309" ${OUTLINE}/>
    <ellipse cx="14" cy="27" rx="5.5" ry="7" fill="#b45309" ${OUTLINE}/>
    <ellipse cx="25" cy="16" rx="5.5" ry="7.5" fill="#b45309" ${OUTLINE}/>
    <ellipse cx="39" cy="16" rx="5.5" ry="7.5" fill="#b45309" ${OUTLINE}/>
    <ellipse cx="50" cy="27" rx="5.5" ry="7" fill="#b45309" ${OUTLINE}/>`),

  laptop: svg(`
    <rect x="11" y="12" width="42" height="30" rx="4" fill="#334155" ${OUTLINE}/>
    <rect x="15" y="16" width="34" height="22" rx="1.5" fill="#1e293b"/>
    <path d="M25 22 L20 27 L25 32 M39 22 L44 27 L39 32" fill="none" stroke="#4ade80" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M34.5 20.5 L29.5 33.5" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
    <path d="M4 46 H60 L56 53 Q55 55 52 55 H12 Q9 55 8 53 Z" fill="#cbd5e1" ${OUTLINE}/>
    <path d="M27 46 V48 Q27 49 28 49 H36 Q37 49 37 48 V46" fill="#94a3b8" stroke="#2b2b2b" stroke-width="2" stroke-linejoin="round"/>`),

  // ---- Fun & social ----
  beer: svg(`
    <path d="M45 24 H51 Q57 24 57 31 V39 Q57 46 51 46 H45" fill="none" stroke="#2b2b2b" stroke-width="5" stroke-linecap="round"/>
    <path d="M12 18 H46 V53 Q46 58 41 58 H17 Q12 58 12 53 Z" fill="#fbbf24" ${OUTLINE}/>
    <circle cx="20" cy="36" r="2" fill="#fef3c7"/><circle cx="27" cy="46" r="2" fill="#fef3c7"/>
    <circle cx="37" cy="31" r="2" fill="#fef3c7"/><circle cx="38" cy="49" r="2" fill="#fef3c7"/>
    <path d="M10 19 Q8 10 17 10 Q20 4 28 6 Q34 2 40 7 Q49 6 48 15 Q50 22 44 22 Q44 27 40 26 Q37 24 37 21 H14 Q10 22 10 19 Z" fill="#fff" ${OUTLINE}/>`),

  trivia: svg(`
    <path d="M20 46 L16 59 L32 46" fill="#8b5cf6" ${OUTLINE}/>
    <rect x="7" y="8" width="46" height="40" rx="9" fill="#8b5cf6" ${OUTLINE}/>
    <path d="M20 46.5 L16 59 L32 46.5" fill="#8b5cf6"/>
    <path d="M23 22 Q23 14 30.5 14 Q38 14 38 21 Q38 26 33 28 Q30.5 29 30.5 33 V34" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="30.5" cy="41" r="3" fill="#fff"/>
    <path d="M54 2 L56.5 7.5 L62 8 L58 12 L59 18 L54 15 L49 18 L50 12 L46 8 L51.5 7.5 Z" fill="#facc15" ${THIN}/>`),

  coffee: svg(`
    <path d="M21 4 Q17 9 21 13 Q25 17 21 22 M31 4 Q27 9 31 13 Q35 17 31 22" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <path d="M45 31 H50 Q57 31 57 38 Q57 45 50 45 H44" fill="none" ${OUTLINE}/>
    <path d="M9 27 H47 V39 Q47 54 33 54 H23 Q9 54 9 39 Z" fill="#fff" ${OUTLINE}/>
    <path d="M10 34 H46" stroke="#f97316" stroke-width="4"/>
    <rect x="4" y="54" width="50" height="5" rx="2.5" fill="#e2e8f0" ${OUTLINE}/>`),

  gift: svg(`
    <rect x="12" y="37" width="40" height="21" rx="3" fill="#fb7185" ${OUTLINE}/>
    <rect x="8" y="26" width="48" height="12" rx="3" fill="#f43f5e" ${OUTLINE}/>
    <rect x="28" y="26" width="8" height="32" fill="#facc15" ${THIN}/>
    <path d="M32 26 Q21 11 15 18 Q11 25 32 26 Z M32 26 Q43 11 49 18 Q53 25 32 26 Z" fill="#facc15" ${OUTLINE}/>`),

  gamepad: svg(`
    <path d="M15 20 H49 Q59 20 61 35 Q62 50 54 50 Q48 50 45 42 H19 Q16 50 10 50 Q2 50 3 35 Q5 20 15 20 Z" fill="#6366f1" ${OUTLINE}/>
    <path d="M17 27 V39 M11 33 H23" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="45" cy="29" r="3.5" fill="#facc15" ${THIN}/><circle cx="52" cy="36" r="3.5" fill="#f43f5e" ${THIN}/>
    <rect x="28" y="29" width="8" height="3" rx="1.5" fill="#c7d2fe"/>`),

  dice: svg(`
    <g transform="rotate(14 44 24)">
      <rect x="30" y="10" width="28" height="28" rx="6" fill="#ef4444" ${OUTLINE}/>
      <circle cx="37.5" cy="17.5" r="2.7" fill="#fff"/><circle cx="50.5" cy="17.5" r="2.7" fill="#fff"/>
      <circle cx="37.5" cy="30.5" r="2.7" fill="#fff"/><circle cx="50.5" cy="30.5" r="2.7" fill="#fff"/>
    </g>
    <g transform="rotate(-12 21 39)">
      <rect x="6" y="24" width="30" height="30" rx="6" fill="#fff" ${OUTLINE}/>
      <circle cx="13.5" cy="31.5" r="3" fill="#2b2b2b"/><circle cx="21" cy="39" r="3" fill="#2b2b2b"/><circle cx="28.5" cy="46.5" r="3" fill="#2b2b2b"/>
    </g>`),

  masks: svg(`
    <g transform="rotate(14 42 28)">
      <path d="M28 9 H56 V27 Q56 44 42 46 Q28 44 28 27 Z" fill="#a78bfa" ${OUTLINE}/>
      <path d="M33 20 Q36 23 39 20 M45 20 Q48 23 51 20" fill="none" stroke="#2b2b2b" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M36 37 Q42 31 48 37" fill="none" stroke="#2b2b2b" stroke-width="3" stroke-linecap="round"/>
    </g>
    <g transform="rotate(-12 22 36)">
      <path d="M8 18 H36 V36 Q36 53 22 55 Q8 53 8 36 Z" fill="#facc15" ${OUTLINE}/>
      <path d="M13 30 Q16 26 19 30 M25 30 Q28 26 31 30" fill="none" stroke="#2b2b2b" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M14 38 Q22 48 30 38 Z" fill="#2b2b2b" ${THIN}/>
    </g>`),

  mic: svg(`
    <g transform="rotate(-30 32 32)">
      <rect x="26.5" y="31" width="11" height="27" rx="4" fill="#334155" ${OUTLINE}/>
      <circle cx="32" cy="19" r="13" fill="#cbd5e1" ${OUTLINE}/>
      <path d="M24 13 H40 M21.5 19 H42.5 M24 25 H40" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
      <rect x="24" y="30" width="16" height="5" rx="2" fill="#ec4899" ${OUTLINE}/>
    </g>
    <path d="M52 40 V52" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
    <path d="M52 40 L58 42" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="49" cy="53" rx="4" ry="3" fill="#8b5cf6"/>`),

  // ---- Fitness ----
  tennis: svg(`
    <g transform="rotate(35 30 30)">
      <rect x="27" y="40" width="6" height="20" rx="3" fill="#334155" ${OUTLINE}/>
      <ellipse cx="30" cy="22" rx="15" ry="18" fill="#ef4444" ${OUTLINE}/>
      <ellipse cx="30" cy="22" rx="11" ry="14" fill="#f0f9ff" stroke="#2b2b2b" stroke-width="2"/>
      <path d="M24 11 V33 M30 9 V35 M36 11 V33 M21 16 H39 M19 22 H41 M21 28 H39" stroke="#94a3b8" stroke-width="1.5"/>
    </g>
    <circle cx="51" cy="51" r="8" fill="#d9f99d" ${OUTLINE}/>
    <path d="M44 47 Q51 51 47 58 M58 55 Q51 51 55 44" fill="none" stroke="#fff" stroke-width="2"/>`),

  football: svg(`
    <circle cx="32" cy="32" r="24" fill="#fff" ${OUTLINE}/>
    <path d="M32 9 V22 M41.5 29 L53.5 25 M38 40 L45 51 M26 40 L19 51 M22.5 29 L10.5 25" stroke="#2b2b2b" stroke-width="2.5"/>
    <path d="M32 22 L41.5 29 L38 40 H26 L22.5 29 Z" fill="#2b2b2b"/>
    <path d="M26 9.5 Q32 8 38 9.5 L35 14 H29 Z" fill="#2b2b2b"/>
    <path d="M55.5 30 Q56 37 53 43 L49 39 L51 32 Z" fill="#2b2b2b"/>
    <path d="M8.5 30 Q8 37 11 43 L15 39 L13 32 Z" fill="#2b2b2b"/>`),

  // ---- Health ----
  apple: svg(`
    <path d="M32 18 Q31 10 35 5" fill="none" stroke="#2b2b2b" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M32 18 Q24 10 15 16 Q6 24 10 40 Q14 56 24 57 Q28 57 32 55 Q36 57 40 57 Q50 56 54 40 Q58 24 49 16 Q40 10 32 18 Z" fill="#ef4444" ${OUTLINE}/>
    <path d="M35 10 Q44 2 51 8 Q44 15 35 10 Z" fill="#22c55e" ${OUTLINE}/>
    <path d="M17 27 Q15 34 18 41" fill="none" stroke="#fecaca" stroke-width="3.5" stroke-linecap="round"/>`),

  water: svg(`
    <rect x="25" y="4" width="14" height="8" rx="2" fill="#0ea5e9" ${OUTLINE}/>
    <path d="M26 12 H38 V16 Q46 20 46 28 V54 Q46 58 42 58 H22 Q18 58 18 54 V28 Q18 20 26 16 Z" fill="#e0f2fe" ${OUTLINE}/>
    <path d="M19.5 34 Q25.5 31 32 34 T44.5 34 V54 Q44.5 56.5 42 56.5 H22 Q19.5 56.5 19.5 54 Z" fill="#7dd3fc"/>
    <path d="M24 23 V29" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <circle cx="38" cy="45" r="2.5" fill="#e0f2fe"/><circle cx="29" cy="50" r="1.8" fill="#e0f2fe"/>`),

  moon: svg(`
    <path d="M38 7 Q18 10 15 30 Q13 51 33 56 Q48 59 56 46 Q36 48 30 34 Q24 19 38 7 Z" fill="#facc15" ${OUTLINE}/>
    <path d="M42 14 H51 L42 23 H51" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M52 28 H58 L52 34 H58" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="9" cy="12" r="2" fill="#a5b4fc"/><circle cx="54" cy="6" r="1.8" fill="#a5b4fc"/>`),

  pill: svg(`
    <g transform="rotate(-40 32 30)">
      <path d="M20 20 H32 V40 H20 Q10 40 10 30 Q10 20 20 20 Z" fill="#ef4444" ${OUTLINE}/>
      <path d="M32 20 H44 Q54 20 54 30 Q54 40 44 40 H32 Z" fill="#fff" ${OUTLINE}/>
      <path d="M17 25 Q15 28 16 32" fill="none" stroke="#fecaca" stroke-width="3" stroke-linecap="round"/>
    </g>
    <circle cx="49" cy="50" r="8" fill="#7dd3fc" ${OUTLINE}/>
    <path d="M44 50 H54" stroke="#2b2b2b" stroke-width="2.5" stroke-linecap="round"/>`),

  // ---- Housework ----
  broom: svg(`
    <path d="M48 4 L31 37" stroke="#2b2b2b" stroke-width="8" stroke-linecap="round"/>
    <path d="M48 4 L31 37" stroke="#d97706" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M22 34 L39 42 L31 60 Q16 58 8 50 Z" fill="#facc15" ${OUTLINE}/>
    <path d="M20.5 38 L37 46" stroke="#ef4444" stroke-width="4"/>
    <path d="M14 50 L22 43 M20 55 L27 46 M26 58 L31 48" stroke="#a16207" stroke-width="2" stroke-linecap="round"/>
    <circle cx="48" cy="56" r="2.5" fill="#cbd5e1"/><circle cx="54" cy="51" r="2" fill="#cbd5e1"/><circle cx="56" cy="58" r="1.8" fill="#cbd5e1"/>`),

  wheelieBin: svg(`
    <path d="M50 14 H57" ${OUTLINE}/>
    <path d="M14 18 H50 L47 53 H17 Z" fill="#22c55e" ${OUTLINE}/>
    <rect x="11" y="10" width="42" height="8" rx="3" fill="#15803d" ${OUTLINE}/>
    <path d="M32 26 L40 40 H24 Z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="20" cy="55" r="5" fill="#334155" ${OUTLINE}/><circle cx="44" cy="55" r="5" fill="#334155" ${OUTLINE}/>`),

  pot: svg(`
    <path d="M24 4 Q20 8 24 12 Q28 16 24 19 M34 4 Q30 8 34 12 Q38 16 34 19 M44 4 Q40 8 44 12 Q48 16 44 19" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M14 36 H6 V43 H14 M50 36 H58 V43 H50" fill="#ef4444" ${OUTLINE}/>
    <path d="M14 30 H50 V48 Q50 57 41 57 H23 Q14 57 14 48 Z" fill="#ef4444" ${OUTLINE}/>
    <path d="M28 25 Q28 20 32 20 Q36 20 36 25" fill="#64748b" ${OUTLINE}/>
    <rect x="10" y="24" width="44" height="7" rx="3" fill="#94a3b8" ${OUTLINE}/>
    <path d="M20 37 V48" stroke="#fecaca" stroke-width="3" stroke-linecap="round"/>`),

  hammer: svg(`
    <g transform="rotate(-40 32 32)">
      <rect x="28" y="20" width="8" height="38" rx="3" fill="#d97706" ${OUTLINE}/>
      <path d="M12 9 H42 L52 4 Q51 13 46 15 V23 H12 Z" fill="#94a3b8" ${OUTLINE}/>
      <path d="M16 13 V19" stroke="#e2e8f0" stroke-width="2.5" stroke-linecap="round"/>
    </g>`),

  // ---- Errands ----
  cart: svg(`
    <circle cx="30" cy="13" r="7" fill="#ef4444" ${OUTLINE}/>
    <rect x="38" y="5" width="10" height="14" rx="2" fill="#facc15" ${OUTLINE}/>
    <path d="M14 16 H58 L52 38 H19 Z" fill="#38bdf8" ${OUTLINE}/>
    <path d="M27 17 L28.5 37 M37 17 V37 M47 17 L45.5 37 M17 27 H55" stroke="#e0f2fe" stroke-width="2"/>
    <path d="M4 9 H11 L19 42 Q20 46 24 46 H50" fill="none" ${OUTLINE}/>
    <circle cx="24" cy="53" r="5" fill="#334155" ${OUTLINE}/><circle cx="46" cy="53" r="5" fill="#334155" ${OUTLINE}/>`),

  envelope: svg(`
    <rect x="6" y="14" width="52" height="36" rx="4" fill="#e0f2fe" ${OUTLINE}/>
    <path d="M8 47 L26 31 M56 47 L38 31" fill="none" ${THIN}/>
    <path d="M8 16 L32 36 L56 16 Z" fill="#bae6fd" ${OUTLINE}/>
    <path d="M32 31 C27 27 27 23 29.5 22.5 C31 22 32 23 32 24 C32 23 33 22 34.5 22.5 C37 23 37 27 32 31 Z" fill="#f43f5e"/>`),

  car: svg(`
    <path d="M6 40 Q6 32 12 31 L18 20 Q20 16 25 16 H41 Q46 16 48 20 L54 31 Q60 32 60 40 V46 Q60 48 58 48 H8 Q6 48 6 46 Z" fill="#ef4444" ${OUTLINE}/>
    <path d="M21 22 Q22 20 25 20 H31 V30 H17 Z" fill="#e0f2fe" ${THIN}/>
    <path d="M35 20 H41 Q44 20 45 22 L49 30 H35 Z" fill="#e0f2fe" ${THIN}/>
    <circle cx="56" cy="37" r="2.2" fill="#facc15"/>
    <circle cx="18" cy="48" r="7" fill="#334155" ${OUTLINE}/><circle cx="18" cy="48" r="2.5" fill="#cbd5e1"/>
    <circle cx="47" cy="48" r="7" fill="#334155" ${OUTLINE}/><circle cx="47" cy="48" r="2.5" fill="#cbd5e1"/>`),

  // ---- Learning & creative ----
  pencil: svg(`
    <g transform="rotate(45 32 32)">
      <rect x="26" y="4" width="12" height="8" rx="2" fill="#f9a8d4" ${OUTLINE}/>
      <rect x="26" y="12" width="12" height="4" fill="#cbd5e1" ${OUTLINE}/>
      <rect x="26" y="16" width="12" height="30" fill="#facc15" ${OUTLINE}/>
      <path d="M32 18 V44" stroke="#eab308" stroke-width="2"/>
      <path d="M26 46 L32 60 L38 46 Z" fill="#fde68a" ${OUTLINE}/>
      <path d="M30 55.5 L32 60 L34 55.5 Z" fill="#2b2b2b"/>
    </g>`),

  palette: svg(`
    <path d="M32 6 Q58 6 58 30 Q58 42 48 42 H42 Q36 42 37 48 Q38 54 34 57 Q30 59 24 57 Q6 52 6 32 Q6 6 32 6 Z" fill="#fde68a" ${OUTLINE}/>
    <circle cx="19" cy="23" r="4.5" fill="#ef4444"/><circle cx="31" cy="15" r="4.5" fill="#3b82f6"/>
    <circle cx="44" cy="18" r="4.5" fill="#22c55e"/><circle cx="16" cy="37" r="4.5" fill="#a855f7"/>
    <circle cx="27" cy="45" r="4" fill="#fff" ${THIN}/>`),

  gradCap: svg(`
    <path d="M16 30 V42 Q32 52 48 42 V30 L32 37 Z" fill="#1e293b" ${OUTLINE}/>
    <path d="M4 24 L32 12 L60 24 L32 36 Z" fill="#334155" ${OUTLINE}/>
    <path d="M32 24 L52 30 V44" fill="none" stroke="#facc15" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M49 44 H55 L56 53 H48 Z" fill="#facc15" ${THIN}/>
    <circle cx="32" cy="24" r="2.5" fill="#facc15"/>`),

  // ---- Travel & outdoors ----
  mountain: svg(`
    <circle cx="49" cy="14" r="7" fill="#facc15" ${OUTLINE}/>
    <path d="M4 54 L24 16 L44 54 Z" fill="#64748b" ${OUTLINE}/>
    <path d="M28 54 L44 28 L60 54 Z" fill="#94a3b8" ${OUTLINE}/>
    <path d="M18 27.5 L24 16 L30 27.5 L27 25 L24 28.5 L21 25 Z" fill="#fff" ${THIN}/>
    <rect x="2" y="53" width="60" height="7" rx="3" fill="#22c55e" ${OUTLINE}/>`),

  tent: svg(`
    <path d="M32 11 V3 L40 5.5 L32 8" fill="#ef4444" ${THIN}/>
    <path d="M6 54 L32 11 L58 54 Z" fill="#f97316" ${OUTLINE}/>
    <path d="M32 24 L21 54 H43 Z" fill="#7c2d12" ${OUTLINE}/>
    <path d="M32 24 L28 54" stroke="#fdba74" stroke-width="2.5"/>
    <path d="M2 55 H62" ${OUTLINE}/>`),

  beach: svg(`
    <path d="M30 20 L37 55" stroke="#2b2b2b" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M4 53 Q32 46 60 53 V60 H4 Z" fill="#fde68a" ${OUTLINE}/>
    <path d="M7 28 Q12 7 35 7 Q57 9 56 29 Q50 23 44 27 Q38 21 32 26 Q25 20 19 25 Q13 22 7 28 Z" fill="#ef4444" ${OUTLINE}/>
    <path d="M30 8 Q23 15 19 24.5 M43 8.5 Q42 17 44 26.5" fill="none" stroke="#fff" stroke-width="3.5"/>
    <circle cx="51" cy="47" r="5" fill="#38bdf8" ${THIN}/>`),

  // ---- More fun & social ----
  pizza: svg(`
    <path d="M10 14 Q32 2 54 14 L32 60 Z" fill="#fbbf24" ${OUTLINE}/>
    <path d="M10 14 Q32 2 54 14 L51 20 Q32 9 13 20 Z" fill="#d97706" ${OUTLINE}/>
    <circle cx="26" cy="27" r="4.5" fill="#ef4444" ${THIN}/><circle cx="38" cy="30" r="4.5" fill="#ef4444" ${THIN}/>
    <circle cx="32" cy="42" r="4" fill="#ef4444" ${THIN}/><circle cx="34" cy="21" r="1.8" fill="#22c55e"/><circle cx="29" cy="35" r="1.6" fill="#22c55e"/>`),

  popcorn: svg(`
    <circle cx="20" cy="18" r="7" fill="#fef9c3" ${OUTLINE}/><circle cx="44" cy="18" r="7" fill="#fef9c3" ${OUTLINE}/>
    <circle cx="32" cy="12" r="8" fill="#fef9c3" ${OUTLINE}/><circle cx="26" cy="22" r="6" fill="#fef9c3" ${OUTLINE}/>
    <circle cx="38" cy="22" r="6" fill="#fef9c3" ${OUTLINE}/>
    <path d="M13 24 H51 L46 58 H18 Z" fill="#ef4444" ${OUTLINE}/>
    <path d="M23 25.5 H29 L28.6 56.5 H24.6 Z M35 25.5 H41 L39.4 56.5 H35.4 Z" fill="#fff"/>`),

  balloon: svg(`
    <path d="M32 47 Q29 52 33 56 Q37 60 32 63" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="25" rx="17" ry="20" fill="#ef4444" ${OUTLINE}/>
    <path d="M29 45 H35 L33.5 49 H30.5 Z" fill="#ef4444" ${THIN}/>
    <path d="M23 17 Q25 11 30 10" fill="none" stroke="#fecaca" stroke-width="3.5" stroke-linecap="round"/>`),

  guitar: svg(`
    <g transform="rotate(40 32 32)">
      <rect x="29" y="3" width="6" height="30" rx="1" fill="#92400e" ${OUTLINE}/>
      <rect x="27" y="0" width="10" height="8" rx="2" fill="#78350f" ${OUTLINE}/>
      <path d="M32 29 Q20 27 20 38 Q20 44 24 46 Q18 50 20 56 Q23 63 32 62 Q41 63 44 56 Q46 50 40 46 Q44 44 44 38 Q44 27 32 29 Z" fill="#f97316" ${OUTLINE}/>
      <circle cx="32" cy="44" r="4" fill="#2b2b2b"/>
      <rect x="27" y="52" width="10" height="3" rx="1" fill="#78350f"/>
      <path d="M31 8 V52 M33 8 V52" stroke="#fde68a" stroke-width="1"/>
    </g>`),

  wine: svg(`
    <path d="M18 6 H46 Q48 26 32 34 Q16 26 18 6 Z" fill="#fff" ${OUTLINE}/>
    <path d="M19.6 16 H44.4 Q43.5 27 32 32 Q20.5 27 19.6 16 Z" fill="#be123c"/>
    <path d="M24 19 Q24 24 27 27" fill="none" stroke="#fda4af" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M32 34 V53" ${OUTLINE}/>
    <ellipse cx="32" cy="55" rx="12" ry="3.5" fill="#fff" ${OUTLINE}/>`),

  heart: svg(`
    <path d="M32 56 C14 44 6 32 8 22 C10 12 22 8 32 18 C42 8 54 12 56 22 C58 32 50 44 32 56 Z" fill="#f43f5e" ${OUTLINE}/>
    <path d="M16 22 Q17 16 22 15" fill="none" stroke="#fecdd3" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M53 2 L55 7 L60 8 L55 10 L53 15 L51 10 L46 8 L51 7 Z" fill="#facc15"/>`),

  ticket: svg(`
    <g transform="rotate(-15 32 32)">
      <path d="M6 20 H58 V27 Q53 27 53 32 Q53 37 58 37 V44 H6 V37 Q11 37 11 32 Q11 27 6 27 Z" fill="#facc15" ${OUTLINE}/>
      <path d="M43 22 V42" stroke="#2b2b2b" stroke-width="2" stroke-dasharray="3 3"/>
      <path d="M17 28 H35 M17 36 H30" stroke="#a16207" stroke-width="3" stroke-linecap="round"/>
      <circle cx="49" cy="32" r="2.6" fill="#f97316"/>
    </g>`),

  cards: svg(`
    <g transform="rotate(-12 24 34)">
      <rect x="10" y="12" width="28" height="40" rx="4" fill="#fff" ${OUTLINE}/>
      <path d="M24 23 C30 29 32 32 30 35 C28 37 26 36 24.5 34 L26 40 H22 L23.5 34 C22 36 20 37 18 35 C16 32 18 29 24 23 Z" fill="#2b2b2b"/>
    </g>
    <g transform="rotate(10 40 32)">
      <rect x="26" y="10" width="28" height="40" rx="4" fill="#fff" ${OUTLINE}/>
      <path d="M40 38 C33 33 32 28 35 26 C37 25 39 26 40 28 C41 26 43 25 45 26 C48 28 47 33 40 38 Z" fill="#ef4444"/>
    </g>`),

  // ---- More fitness ----
  basketball: svg(`
    <circle cx="32" cy="32" r="24" fill="#f97316" ${OUTLINE}/>
    <path d="M8 32 H56 M32 8 V56" stroke="#2b2b2b" stroke-width="2.5"/>
    <path d="M15 15 Q25 32 15 49 M49 15 Q39 32 49 49" fill="none" stroke="#2b2b2b" stroke-width="2.5"/>`),

  golf: svg(`
    <ellipse cx="32" cy="53" rx="27" ry="8" fill="#22c55e" ${OUTLINE}/>
    <ellipse cx="38" cy="53" rx="4" ry="1.8" fill="#2b2b2b"/>
    <path d="M38 53 V7" stroke="#2b2b2b" stroke-width="3" stroke-linecap="round"/>
    <path d="M39 7 L56 13 L39 19 Z" fill="#ef4444" ${OUTLINE}/>
    <circle cx="19" cy="51" r="4" fill="#fff" ${THIN}/>`),

  boxing: svg(`
    <path d="M16 30 Q14 10 32 9 Q50 8 50 26 V40 Q50 48 42 48 H22 Q16 48 16 40 Z" fill="#ef4444" ${OUTLINE}/>
    <path d="M17 28 Q8 28 9 37 Q10 44 19 42" fill="#ef4444" ${OUTLINE}/>
    <rect x="18" y="46" width="30" height="12" rx="3" fill="#fff" ${OUTLINE}/>
    <path d="M22 52 H44" stroke="#ef4444" stroke-width="3"/>
    <path d="M25 16 Q30 13 37 14" fill="none" stroke="#fecaca" stroke-width="3" stroke-linecap="round"/>`),

  kettlebell: svg(`
    <path d="M22 26 V18 Q22 8 32 8 Q42 8 42 18 V26" fill="none" stroke="#2b2b2b" stroke-width="8" stroke-linecap="round"/>
    <path d="M22 26 V18 Q22 8 32 8 Q42 8 42 18 V26" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
    <path d="M32 21 Q52 21 52 40 Q52 56 40 57 H24 Q12 56 12 40 Q12 21 32 21 Z" fill="#334155" ${OUTLINE}/>
    <rect x="24" y="35" width="16" height="9" rx="2" fill="#facc15"/>
    <path d="M19 33 Q17 40 20 47" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>`),

  yoga: svg(`
    <path d="M20 34 Q14 26 20 17 Q26 26 20 34 Z" fill="#f9a8d4" ${THIN}/>
    <path d="M20 34 Q10 33 7 25 Q17 24 20 34 Z" fill="#fbcfe8" ${THIN}/>
    <path d="M20 34 Q30 33 33 25 Q23 24 20 34 Z" fill="#fbcfe8" ${THIN}/>
    <rect x="4" y="46" width="38" height="10" rx="2" fill="#a78bfa" ${OUTLINE}/>
    <circle cx="46" cy="44" r="12" fill="#8b5cf6" ${OUTLINE}/>
    <circle cx="46" cy="44" r="7" fill="none" stroke="#c4b5fd" stroke-width="2.5"/>
    <circle cx="46" cy="44" r="2.5" fill="#c4b5fd"/>`),

  stopwatch: svg(`
    <rect x="27" y="3" width="10" height="7" rx="2" fill="#94a3b8" ${OUTLINE}/>
    <path d="M47 15 L51 11" ${OUTLINE}/>
    <circle cx="32" cy="36" r="23" fill="#22c55e" ${OUTLINE}/>
    <circle cx="32" cy="36" r="17" fill="#fff" ${THIN}/>
    <path d="M32 21 V24 M47 36 H44 M32 51 V48 M17 36 H20" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 36 V25" stroke="#2b2b2b" stroke-width="3" stroke-linecap="round"/>
    <path d="M32 36 L40 41" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="32" cy="36" r="2.5" fill="#2b2b2b"/>`),

  surf: svg(`
    <g transform="rotate(30 32 30)">
      <path d="M32 2 Q44 18 42 38 Q40 54 32 58 Q24 54 22 38 Q20 18 32 2 Z" fill="#38bdf8" ${OUTLINE}/>
      <path d="M32 7 V53" stroke="#fff" stroke-width="3"/>
      <path d="M26 30 H38" stroke="#facc15" stroke-width="3"/>
    </g>
    <path d="M2 58 Q9 52 16 58 T30 58 T44 58 T58 58" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>`),

  // ---- More health ----
  glasses: svg(`
    <path d="M7 31 L3 23 M57 31 L61 23" ${OUTLINE}/>
    <circle cx="18" cy="34" r="11" fill="#e0f2fe" stroke="#2b2b2b" stroke-width="4"/>
    <circle cx="46" cy="34" r="11" fill="#e0f2fe" stroke="#2b2b2b" stroke-width="4"/>
    <path d="M29 32 Q32 27 35 32" fill="none" stroke="#2b2b2b" stroke-width="4" stroke-linecap="round"/>
    <path d="M12 31 Q13 27 17 26 M40 31 Q41 27 45 26" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`),

  syringe: svg(`
    <g transform="rotate(45 32 32)">
      <rect x="24" y="2" width="16" height="4" rx="1.5" fill="#64748b" ${OUTLINE}/>
      <rect x="30" y="6" width="4" height="9" fill="#94a3b8" ${OUTLINE}/>
      <rect x="26" y="14" width="12" height="30" rx="2" fill="#e0f2fe" ${OUTLINE}/>
      <rect x="27.5" y="28" width="9" height="14.5" fill="#7dd3fc"/>
      <path d="M26 22 H31 M26 28 H31 M26 34 H31" stroke="#64748b" stroke-width="1.5"/>
      <path d="M30 44 H34 L33 48 H31 Z" fill="#94a3b8" ${THIN}/>
      <path d="M32 48 V60" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round"/>
    </g>`),

  thermometer: svg(`
    <g transform="rotate(30 32 32)">
      <rect x="26" y="4" width="12" height="42" rx="6" fill="#fff" ${OUTLINE}/>
      <circle cx="32" cy="50" r="9" fill="#ef4444" ${OUTLINE}/>
      <rect x="29.5" y="18" width="5" height="30" rx="2.5" fill="#ef4444"/>
      <path d="M38 12 H34.5 M38 18 H35.5 M38 24 H34.5 M38 30 H35.5" stroke="#94a3b8" stroke-width="1.5"/>
    </g>`),

  toothbrush: svg(`
    <g transform="rotate(-35 32 32)">
      <rect x="6" y="31" width="40" height="8" rx="4" fill="#38bdf8" ${OUTLINE}/>
      <rect x="40" y="30" width="18" height="8" rx="3" fill="#e0f2fe" ${OUTLINE}/>
      <rect x="43" y="20" width="13" height="10" rx="1" fill="#fff" ${OUTLINE}/>
      <path d="M46.5 21.5 V28.5 M49.5 21.5 V28.5 M52.5 21.5 V28.5" stroke="#7dd3fc" stroke-width="1.5"/>
      <path d="M43 20 Q45 13 49 16 Q53 12 56 18 Q57 20 56 20 Z" fill="#a7f3d0" ${THIN}/>
    </g>`),

  bath: svg(`
    <path d="M10 29 V14 Q10 9 15 9 H19 V14" fill="none" ${OUTLINE}/>
    <circle cx="22" cy="24" r="6" fill="#bae6fd" ${THIN}/><circle cx="33" cy="20" r="7" fill="#e0f2fe" ${THIN}/>
    <circle cx="44" cy="24" r="5" fill="#bae6fd" ${THIN}/>
    <path d="M14 52 L12 59 M50 52 L52 59" ${OUTLINE}/>
    <path d="M6 32 H58 V40 Q58 52 46 52 H18 Q6 52 6 40 Z" fill="#fff" ${OUTLINE}/>
    <rect x="3" y="29" width="58" height="5" rx="2.5" fill="#e2e8f0" ${OUTLINE}/>
    <circle cx="51" cy="25.5" r="3.5" fill="#facc15" ${THIN}/>`),

  scale: svg(`
    <rect x="8" y="14" width="48" height="44" rx="10" fill="#e2e8f0" ${OUTLINE}/>
    <path d="M18 30 A14 14 0 0 1 46 30 Z" fill="#fff" ${OUTLINE}/>
    <path d="M22 26 L23.5 27.5 M32 19 V21 M42 26 L40.5 27.5" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M32 30 L37 22" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="16" y="37" width="12" height="15" rx="4" fill="#cbd5e1"/><rect x="36" y="37" width="12" height="15" rx="4" fill="#cbd5e1"/>`),

  // ---- More housework & pets ----
  iron: svg(`
    <path d="M14 22 Q11 17 14 13 M20 20 Q17 15 20 11" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M26 28 V20 Q26 16 30 16 H50 Q54 16 54 20 V28" fill="none" ${OUTLINE}/>
    <path d="M6 48 Q10 29 30 28 H50 Q56 28 56 34 V48 Z" fill="#38bdf8" ${OUTLINE}/>
    <path d="M4 48 H58 V52 Q58 54 56 54 H6 Q4 54 4 52 Z" fill="#cbd5e1" ${OUTLINE}/>
    <circle cx="42" cy="38" r="4" fill="#fff" ${THIN}/>`),

  dishes: svg(`
    <circle cx="16" cy="22" r="5" fill="#bae6fd" ${THIN}/><circle cx="24" cy="13" r="3.5" fill="#e0f2fe" ${THIN}/>
    <circle cx="12" cy="9" r="2.5" fill="#bae6fd" ${THIN}/>
    <rect x="34" y="16" width="22" height="13" rx="3" fill="#facc15" ${OUTLINE}/>
    <path d="M35.5 21 H54.5" stroke="#22c55e" stroke-width="4"/>
    <ellipse cx="32" cy="50" rx="25" ry="7" fill="#fff" ${OUTLINE}/>
    <ellipse cx="32" cy="44" rx="23" ry="6.5" fill="#e0f2fe" ${OUTLINE}/>
    <ellipse cx="32" cy="38" rx="21" ry="6" fill="#fff" ${OUTLINE}/>
    <ellipse cx="32" cy="38" rx="12" ry="3" fill="none" stroke="#bae6fd" stroke-width="2"/>`),

  lightbulb: svg(`
    <path d="M5 21 H10 M54 21 H59 M11 6 L15 10 M53 6 L49 10" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
    <path d="M32 6 Q48 6 48 22 Q48 30 41 36 V42 H23 V36 Q16 30 16 22 Q16 6 32 6 Z" fill="#fde047" ${OUTLINE}/>
    <path d="M27 30 L30 24 L32 30 L34 24 L37 30" fill="none" stroke="#f97316" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <rect x="23" y="42" width="18" height="10" rx="2" fill="#94a3b8" ${OUTLINE}/>
    <path d="M24.5 47 H39.5" stroke="#64748b" stroke-width="2"/>
    <path d="M28 52 H36 V55 Q36 58 33 58 H31 Q28 58 28 55 Z" fill="#64748b" ${THIN}/>`),

  fish: svg(`
    <circle cx="9" cy="13" r="3" fill="none" stroke="#38bdf8" stroke-width="2"/><circle cx="15" cy="6" r="2" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <path d="M40 32 L58 19 V45 Z" fill="#f97316" ${OUTLINE}/>
    <path d="M6 32 Q20 14 38 22 Q45 26 45 32 Q45 38 38 42 Q20 50 6 32 Z" fill="#fb923c" ${OUTLINE}/>
    <path d="M25 23 Q29 32 25 41 M33 23 Q36 32 33 41" fill="none" stroke="#fff" stroke-width="2.5"/>
    <circle cx="16" cy="29" r="2.5" fill="#2b2b2b"/>`),

  cat: svg(`
    <path d="M10 22 L14 6 L26 16 H38 L50 6 L54 22 Q58 30 56 40 Q52 56 32 56 Q12 56 8 40 Q6 30 10 22 Z" fill="#fb923c" ${OUTLINE}/>
    <path d="M15.5 12 L22 17 L16 20 Z M48.5 12 L42 17 L48 20 Z" fill="#fbcfe8"/>
    <ellipse cx="23" cy="32" rx="3.5" ry="4.5" fill="#22c55e" ${THIN}/><ellipse cx="41" cy="32" rx="3.5" ry="4.5" fill="#22c55e" ${THIN}/>
    <path d="M23 29.5 V34.5 M41 29.5 V34.5" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round"/>
    <path d="M29 39 H35 L32 42 Z" fill="#f472b6"/>
    <path d="M32 42 Q29 46 26 44 M32 42 Q35 46 38 44" fill="none" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round"/>
    <path d="M4 38 L19 40 M4 45 L19 43 M60 38 L45 40 M60 45 L45 43" stroke="#2b2b2b" stroke-width="1.5" stroke-linecap="round"/>`),

  bone: svg(`
    <g transform="rotate(-30 32 32)">
      <circle cx="14" cy="27" r="6.5" fill="#fef3c7" ${OUTLINE}/><circle cx="14" cy="37" r="6.5" fill="#fef3c7" ${OUTLINE}/>
      <circle cx="50" cy="27" r="6.5" fill="#fef3c7" ${OUTLINE}/><circle cx="50" cy="37" r="6.5" fill="#fef3c7" ${OUTLINE}/>
      <rect x="14" y="27" width="36" height="10" fill="#fef3c7"/>
      <path d="M19.5 27 H44.5 M19.5 37 H44.5" ${OUTLINE}/>
    </g>`),

  plant: svg(`
    <path d="M32 36 Q18 32 13 15 Q28 17 32 36 Z" fill="#22c55e" ${OUTLINE}/>
    <path d="M32 36 Q46 32 51 15 Q36 17 32 36 Z" fill="#16a34a" ${OUTLINE}/>
    <path d="M32 37 Q25 21 32 5 Q39 21 32 37 Z" fill="#4ade80" ${OUTLINE}/>
    <path d="M18 38 H46 L42 58 H22 Z" fill="#c2410c" ${OUTLINE}/>
    <rect x="15" y="34" width="34" height="7" rx="2" fill="#ea580c" ${OUTLINE}/>`),

  // ---- More errands ----
  bank: svg(`
    <path d="M5 22 L32 7 L59 22 Z" fill="#94a3b8" ${OUTLINE}/>
    <circle cx="32" cy="16" r="3" fill="#facc15"/>
    <rect x="8" y="22" width="48" height="5" fill="#cbd5e1" ${OUTLINE}/>
    <rect x="12" y="27" width="6" height="22" fill="#e2e8f0" ${OUTLINE}/><rect x="23" y="27" width="6" height="22" fill="#e2e8f0" ${OUTLINE}/>
    <rect x="35" y="27" width="6" height="22" fill="#e2e8f0" ${OUTLINE}/><rect x="46" y="27" width="6" height="22" fill="#e2e8f0" ${OUTLINE}/>
    <rect x="5" y="49" width="54" height="8" rx="1.5" fill="#94a3b8" ${OUTLINE}/>`),

  fuel: svg(`
    <path d="M38 22 H46 Q52 22 52 28 V46 Q52 50 48 50 Q44 50 44 46 V42" fill="none" stroke="#2b2b2b" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="40" y="33" width="8" height="9" rx="2" fill="#334155" ${OUTLINE}/>
    <rect x="10" y="10" width="28" height="45" rx="4" fill="#ef4444" ${OUTLINE}/>
    <rect x="15" y="16" width="18" height="12" rx="2" fill="#fff" ${THIN}/>
    <path d="M24 33 Q18 41 24 46 Q30 41 24 33 Z" fill="#facc15" ${THIN}/>
    <rect x="6" y="54" width="36" height="6" rx="2" fill="#64748b" ${OUTLINE}/>`),

  parcel: svg(`
    <path d="M8 22 L32 12 L56 22 V48 L32 58 L8 48 Z" fill="#d97706" ${OUTLINE}/>
    <path d="M8 22 L32 32 L56 22 M32 32 V58" fill="none" ${OUTLINE}/>
    <path d="M20 17 L44 27 V35" fill="none" stroke="#fde68a" stroke-width="4"/>
    <path d="M38 41 L49 36.5 V43 L38 47.5 Z" fill="#fff" ${THIN}/>`),

  key: svg(`
    <path d="M28 31 L53 56" stroke="#2b2b2b" stroke-width="9" stroke-linecap="round"/>
    <path d="M28 31 L53 56" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
    <path d="M44 47 L49 42 M49.5 52.5 L54.5 47.5" stroke="#2b2b2b" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="20" cy="23" r="13" fill="#facc15" ${OUTLINE}/>
    <circle cx="17" cy="20" r="4.5" fill="#fff" ${THIN}/>`),

  clipboard: svg(`
    <rect x="12" y="10" width="40" height="50" rx="5" fill="#d97706" ${OUTLINE}/>
    <rect x="17" y="16" width="30" height="39" rx="2" fill="#fff" ${THIN}/>
    <rect x="24" y="6" width="16" height="9" rx="3" fill="#94a3b8" ${OUTLINE}/>
    <path d="M21.5 26 L24 28.5 L28 23.5 M21.5 36 L24 38.5 L28 33.5" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 26.5 H42 M32 36.5 H42 M22 46.5 H42" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>`),

  shirt: svg(`
    <path d="M22 8 L10 14 L4 28 L13 32 L16 26 V58 H48 V26 L51 32 L60 28 L54 14 L42 8 Q32 16 22 8 Z" fill="#60a5fa" ${OUTLINE}/>
    <path d="M22 8 L27 18 L32 13 L37 18 L42 8" fill="#fff" ${OUTLINE}/>
    <circle cx="32" cy="26" r="1.8" fill="#fff"/><circle cx="32" cy="36" r="1.8" fill="#fff"/><circle cx="32" cy="46" r="1.8" fill="#fff"/>
    <path d="M38 28 H45 V34 Q41.5 36 38 34 Z" fill="none" stroke="#bfdbfe" stroke-width="2"/>`),

  // ---- More learning & creative ----
  photo: svg(`
    <path d="M22 18 L26 10 H38 L42 18" fill="#475569" ${OUTLINE}/>
    <rect x="6" y="18" width="52" height="36" rx="6" fill="#334155" ${OUTLINE}/>
    <circle cx="32" cy="36" r="12" fill="#cbd5e1" ${OUTLINE}/>
    <circle cx="32" cy="36" r="7" fill="#1e293b"/><circle cx="29" cy="33" r="2" fill="#fff"/>
    <rect x="46" y="23" width="7" height="4" rx="1" fill="#facc15"/>
    <path d="M11 25 H18" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>`),

  brush: svg(`
    <path d="M6 56 Q3 51 8 48 Q13 46 17 50 Q21 55 16 58 Q11 61 6 56 Z" fill="#3b82f6"/>
    <circle cx="22" cy="58" r="2" fill="#3b82f6"/>
    <g transform="rotate(40 32 32)">
      <rect x="28" y="2" width="8" height="30" rx="4" fill="#ef4444" ${OUTLINE}/>
      <rect x="27" y="30" width="10" height="8" fill="#cbd5e1" ${OUTLINE}/>
      <path d="M27 38 H37 Q38 50 32 58 Q26 50 27 38 Z" fill="#3b82f6" ${OUTLINE}/>
    </g>`),

  yarn: svg(`
    <path d="M38 6 L58 42" stroke="#2b2b2b" stroke-width="6" stroke-linecap="round"/>
    <path d="M38 6 L58 42" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M58 6 L42 34" stroke="#2b2b2b" stroke-width="6" stroke-linecap="round"/>
    <path d="M58 6 L42 34" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="38" cy="6" r="3.5" fill="#facc15" ${THIN}/><circle cx="58" cy="6" r="3.5" fill="#facc15" ${THIN}/>
    <path d="M44 50 Q54 52 52 58 Q50 62 60 62" fill="none" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
    <circle cx="28" cy="38" r="20" fill="#f472b6" ${OUTLINE}/>
    <path d="M12 31 Q28 35 42 22 M10 41 Q28 45 46 30 M14 50 Q30 52 47 40" fill="none" stroke="#fbcfe8" stroke-width="2.5" stroke-linecap="round"/>`),

  globe: svg(`
    <path d="M9 36 Q13 54 32 55" fill="none" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="32" cy="29" r="22" fill="#38bdf8" ${OUTLINE}/>
    <path d="M18 17 Q24 13 28 19 Q26 25 20 27 Q14 25 18 17 Z" fill="#22c55e"/>
    <path d="M34 29 Q42 25 46 31 Q44 41 36 43 Q32 37 34 29 Z" fill="#22c55e"/>
    <path d="M38 11 Q44 11 47 15 Q42 17 38 15 Z" fill="#22c55e"/>
    <path d="M32 51 V56" ${OUTLINE}/>
    <rect x="20" y="56" width="24" height="5" rx="2.5" fill="#94a3b8" ${OUTLINE}/>`),

  puzzle: svg(`
    <path d="M10 18 H25 Q22 9 31 9 Q40 9 37 18 H52 V30 Q61 27 61 36 Q61 45 52 42 V56 H10 Z" fill="#22c55e" ${OUTLINE}/>
    <path d="M16 26 Q17 23 20 22" fill="none" stroke="#bbf7d0" stroke-width="3" stroke-linecap="round"/>`),

  chess: svg(`
    <path d="M20 52 Q22 40 28 36 L18 34 Q13 32 15 27 L25 16 L27 7 L33 14 Q47 18 47 34 Q47 44 43 52 Z" fill="#334155" ${OUTLINE}/>
    <circle cx="27" cy="22" r="2.2" fill="#fff"/>
    <path d="M37 18 Q44 26 42 42" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="14" y="52" width="36" height="7" rx="2" fill="#475569" ${OUTLINE}/>`),

  // ---- More travel & outdoors ----
  train: svg(`
    <path d="M6 58 H58" ${OUTLINE}/>
    <path d="M20 50 L14 58 M44 50 L50 58" ${OUTLINE}/>
    <rect x="12" y="8" width="40" height="42" rx="8" fill="#ef4444" ${OUTLINE}/>
    <rect x="17" y="14" width="30" height="14" rx="3" fill="#e0f2fe" ${THIN}/>
    <path d="M13.5 33 H50.5" stroke="#fff" stroke-width="3"/>
    <circle cx="21" cy="42" r="3" fill="#facc15" ${THIN}/><circle cx="43" cy="42" r="3" fill="#facc15" ${THIN}/>`),

  boat: svg(`
    <path d="M32 6 V44" stroke="#2b2b2b" stroke-width="3" stroke-linecap="round"/>
    <path d="M35 8 L54 40 H35 Z" fill="#fff" ${OUTLINE}/>
    <path d="M29 14 L13 40 H29 Z" fill="#facc15" ${OUTLINE}/>
    <path d="M6 44 H58 L50 54 H14 Z" fill="#ef4444" ${OUTLINE}/>
    <path d="M2 60 Q9 55 16 60 T30 60 T44 60 T58 60" fill="none" stroke="#0ea5e9" stroke-width="3.5" stroke-linecap="round"/>`),

  suitcase: svg(`
    <circle cx="16" cy="57" r="3.5" fill="#334155"/><circle cx="48" cy="57" r="3.5" fill="#334155"/>
    <path d="M24 16 V10 Q24 7 27 7 H37 Q40 7 40 10 V16" fill="none" ${OUTLINE}/>
    <rect x="8" y="16" width="48" height="38" rx="6" fill="#0ea5e9" ${OUTLINE}/>
    <path d="M20 17.5 V52.5 M44 17.5 V52.5" stroke="#0369a1" stroke-width="4"/>
    <circle cx="32" cy="29" r="4" fill="#facc15"/><rect x="27" y="39" width="10" height="6" rx="1" fill="#f472b6"/>`),

  fishing: svg(`
    <path d="M34 52 Q41 47 48 52 T62 52" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round"/>
    <path d="M46 8 Q57 20 54 40" fill="none" stroke="#64748b" stroke-width="1.5"/>
    <path d="M8 58 L46 8" stroke="#2b2b2b" stroke-width="6" stroke-linecap="round"/>
    <path d="M8 58 L46 8" stroke="#a16207" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="19" cy="45" r="5" fill="#94a3b8" ${OUTLINE}/>
    <circle cx="54" cy="42" r="4" fill="#ef4444" ${THIN}/>`),

  campfire: svg(`
    <path d="M10 54 L54 44" stroke="#2b2b2b" stroke-width="9" stroke-linecap="round"/>
    <path d="M10 54 L54 44" stroke="#92400e" stroke-width="5" stroke-linecap="round"/>
    <path d="M10 44 L54 54" stroke="#2b2b2b" stroke-width="9" stroke-linecap="round"/>
    <path d="M10 44 L54 54" stroke="#b45309" stroke-width="5" stroke-linecap="round"/>
    <path d="M32 46 Q16 38 22 24 Q24 30 28 30 Q26 18 34 7 Q36 20 42 24 Q46 30 44 38 Q42 46 32 46 Z" fill="#f97316" ${OUTLINE}/>
    <path d="M32 44 Q24 40 27 32 Q30 36 32 34 Q32 28 36 24 Q40 32 38 38 Q37 44 32 44 Z" fill="#facc15"/>`),

  map: svg(`
    <path d="M6 14 L22 8 L42 14 L58 8 V50 L42 56 L22 50 L6 56 Z" fill="#fef3c7" ${OUTLINE}/>
    <path d="M22 9.5 L42 15.5 V54.5 L22 48.5 Z" fill="#fde68a"/>
    <path d="M22 8 V50 M42 14 V56" stroke="#2b2b2b" stroke-width="2"/>
    <path d="M12 44 Q20 36 28 40 T44 28" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4 3" stroke-linecap="round"/>
    <path d="M47 21 L53 27 M53 21 L47 27" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>`),

  // ---- Family & occasions ----
  house: svg(`
    <rect x="42" y="12" width="7" height="12" fill="#94a3b8" ${OUTLINE}/>
    <rect x="12" y="28" width="40" height="28" fill="#fde68a" ${OUTLINE}/>
    <path d="M5 31 L32 8 L59 31 Z" fill="#ef4444" ${OUTLINE}/>
    <rect x="27" y="40" width="10" height="16" rx="1" fill="#92400e" ${OUTLINE}/>
    <rect x="16" y="35" width="8" height="8" fill="#bae6fd" ${THIN}/><rect x="40" y="35" width="8" height="8" fill="#bae6fd" ${THIN}/>
    <path d="M32 24 C29 22 29 19.5 30.5 19 C31.5 18.7 32 19.5 32 20 C32 19.5 32.5 18.7 33.5 19 C35 19.5 35 22 32 24 Z" fill="#fff"/>`),

  baby: svg(`
    <path d="M27 14 Q27 4 32 4 Q37 4 37 14 Z" fill="#fbcfe8" ${OUTLINE}/>
    <rect x="22" y="14" width="20" height="7" rx="2" fill="#38bdf8" ${OUTLINE}/>
    <rect x="20" y="21" width="24" height="37" rx="7" fill="#fff" ${OUTLINE}/>
    <path d="M21.5 34 H42.5 V51 Q42.5 56.5 37 56.5 H27 Q21.5 56.5 21.5 51 Z" fill="#fef9c3"/>
    <path d="M37 28 H42 M37 36 H42 M37 44 H42" stroke="#94a3b8" stroke-width="1.5"/>`),

  rings: svg(`
    <circle cx="24" cy="40" r="14" fill="none" stroke="#2b2b2b" stroke-width="9"/>
    <circle cx="24" cy="40" r="14" fill="none" stroke="#facc15" stroke-width="4"/>
    <circle cx="41" cy="40" r="14" fill="none" stroke="#2b2b2b" stroke-width="9"/>
    <circle cx="41" cy="40" r="14" fill="none" stroke="#fde047" stroke-width="4"/>
    <path d="M35 20 L41 13 L47 20 L41 27 Z" fill="#e0f2fe" ${OUTLINE}/>
    <path d="M54 6 L55.5 9.5 L59 11 L55.5 12.5 L54 16 L52.5 12.5 L49 11 L52.5 9.5 Z" fill="#facc15"/>`),

  tree: svg(`
    <rect x="28" y="47" width="8" height="11" fill="#92400e" ${OUTLINE}/>
    <path d="M32 11 L50 33 H42 L54 49 H10 L22 33 H14 Z" fill="#16a34a" ${OUTLINE}/>
    <circle cx="26" cy="41" r="2.8" fill="#ef4444"/><circle cx="39" cy="38" r="2.8" fill="#facc15"/>
    <circle cx="32" cy="26" r="2.6" fill="#ef4444"/><circle cx="45" cy="44" r="2.6" fill="#38bdf8"/><circle cx="19" cy="45" r="2.6" fill="#facc15"/>
    <path d="M32 2 L34.2 6.8 L39.4 7.2 L35.4 10.6 L36.6 15.6 L32 12.9 L27.4 15.6 L28.6 10.6 L24.6 7.2 L29.8 6.8 Z" fill="#facc15" ${THIN}/>`),

  // UI only, not offered as event icons
  bin: svg(`
    <path d="M14 20 H50 L46 58 H18 Z" fill="#94a3b8" ${OUTLINE}/>
    <path d="M25 27 L26.5 51 M32 27 V51 M39 27 L37.5 51" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="10" y="12" width="44" height="7" rx="3" fill="#cbd5e1" ${OUTLINE}/>
    <path d="M26 12 V8 H38 V12" fill="none" ${OUTLINE}/>`),

  binFull: svg(`
    <circle cx="27" cy="20" r="6" fill="#fff" ${THIN}/>
    <circle cx="38" cy="18" r="5" fill="#fde68a" ${THIN}/>
    <path d="M14 20 H50 L46 58 H18 Z" fill="#94a3b8" ${OUTLINE}/>
    <path d="M25 27 L26.5 51 M32 27 V51 M39 27 L37.5 51" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
    <g transform="rotate(-22 12 16)">
      <rect x="10" y="9" width="44" height="7" rx="3" fill="#cbd5e1" ${OUTLINE}/>
      <path d="M26 9 V5 H38 V9" fill="none" ${OUTLINE}/>
    </g>`),

  // The Tracker button: a little heatmap.
  tracker: svg(`
    <rect x="5" y="8" width="54" height="48" rx="8" fill="#fff" ${OUTLINE}/>
    <rect x="11" y="15" width="9" height="9" rx="2" fill="#22c55e"/><rect x="23" y="15" width="9" height="9" rx="2" fill="#bbf7d0"/>
    <rect x="35" y="15" width="9" height="9" rx="2" fill="#22c55e"/><rect x="47" y="15" width="6" height="9" rx="2" fill="#e2e8f0"/>
    <rect x="11" y="27.5" width="9" height="9" rx="2" fill="#bbf7d0"/><rect x="23" y="27.5" width="9" height="9" rx="2" fill="#22c55e"/>
    <rect x="35" y="27.5" width="9" height="9" rx="2" fill="#22c55e"/><rect x="47" y="27.5" width="6" height="9" rx="2" fill="#bbf7d0"/>
    <rect x="11" y="40" width="9" height="9" rx="2" fill="#22c55e"/><rect x="23" y="40" width="9" height="9" rx="2" fill="#e2e8f0"/>
    <rect x="35" y="40" width="9" height="9" rx="2" fill="#bbf7d0"/><rect x="47" y="40" width="6" height="9" rx="2" fill="#22c55e"/>`),

  lock: svg(`
    <path d="M20 29 V20 Q20 8 32 8 Q44 8 44 20 V29" fill="none" stroke="#2b2b2b" stroke-width="5" stroke-linecap="round"/>
    <rect x="12" y="28" width="40" height="30" rx="6" fill="#facc15" ${OUTLINE}/>
    <circle cx="32" cy="40" r="4" fill="#2b2b2b"/>
    <path d="M32 42 V49" stroke="#2b2b2b" stroke-width="3.5" stroke-linecap="round"/>`),

  unlock: svg(`
    <path d="M44 29 V20 Q44 6 32 6 Q22 6 20 15" fill="none" stroke="#2b2b2b" stroke-width="5" stroke-linecap="round"/>
    <rect x="12" y="28" width="40" height="30" rx="6" fill="#86efac" ${OUTLINE}/>
    <circle cx="32" cy="40" r="4" fill="#2b2b2b"/>
    <path d="M32 42 V49" stroke="#2b2b2b" stroke-width="3.5" stroke-linecap="round"/>`),
};
