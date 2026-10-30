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
};
