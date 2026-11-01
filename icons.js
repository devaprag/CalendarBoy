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
