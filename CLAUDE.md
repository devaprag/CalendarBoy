# CLAUDE.md

Guidance for AI assistants (and humans) picking up this project.

## What this is
**Calendar Boy**: a visual calendar that looks like a normal month-view app (modelled on Google Calendar), but every event is drawn as a **cartoon icon** instead of a text bar. It doubles as a **habit tracker**:
- Future icons are plans.
- Past icons show whether you actually did them.

The owner is building it for fun. Repo: https://github.com/devaprag/CalendarBoy (branch `main`).

**Status:**
- Phase 1 (visual proof of concept): done.
- Phase 2 (habit tracker): **built**, see [Phase 2 spec](#phase-2-spec-habit-tracker).
- Still a proof of concept, still **January 2027 only**, still **no animation**.

## Tech
- Plain HTML/CSS/vanilla JS, no build step, no dependencies. Open `index.html` straight in a browser (`file://` works). Don't add tooling unless the owner asks, because "just open the file" is part of the appeal.
- Files:
  - `index.html`: markup skeleton only.
  - `styles.css`
  - `icons.js`: SVG strings.
  - `data.js`: palette, icon library, presets, seed data.
  - `app.js`: state, rendering, interactions.
- These load with **plain `<script src>` tags in that order**. On `file://`, **ES modules** fail with CORS errors and **`fetch()`** is blocked, so don't use either. That's also why seed data is a `.js` file, not `.json`.

## Code map
- **`icons.js`**
  - `OUTLINE` / `THIN` stroke attributes give the cartoon outline.
  - `svg()` wraps a 64×64 body.
  - `ICONS` maps name → SVG string.
  - `PLANE` is shared by `planeTakeoff` (rotated -24°) and `planeLanding` (+16°, with wheels).
  - `bin` / `binFull` are UI-only icons.
- **`data.js`**
  - `COLORS` is the 8-colour palette, `{ c, tint }`.
  - `ICON_LIBRARY` lists the icons offered in the type editor. `planeLanding` and the bins are excluded.
  - `PRESET_TYPES` holds the predefined types.
  - `SEED` is the demo state, and `seedEvent()` is a helper for building it.
- **`app.js`**, in section order:
  1. State and storage: `loadState` / `saveState` / `commit()`. `commit()` means "save and fully re-render".
  2. Date helpers. Dates are `YYYY-MM-DD` string keys, compared as strings. `parseDate` builds a *local* Date; never use `new Date('2027-01-14')`, which parses as UTC.
  3. Queries: `isPast`, `isMissed`, `isHidden`, `typeStats`…
  4. Render: `renderWeeks`, `renderTripSegment` (with trip lanes), `renderTypes`, `renderBacklog`, `renderBin`.
  5. Event changes: `toggleDone`, `moveTo`, `unschedule`, `addEvent`, `duplicateEvent`, `removeEvent`.
  6. Popover: one shared element with `popoverView` = `event` | `day` | `bin`. Field edits go through a delegated `change` listener.
  7. Type editor: a native `<dialog>` rebuilt per open.
  8. Export / import / reset.
  9. Clicks: a single delegated handler. `[data-action]` elements map to the `ACTIONS` table. Otherwise, a `.event` / `.trip` click toggles done, and `dblclick` opens the popup.
  10. Drag and drop: Pointer Events.

## Data model
Stored in localStorage key `calendarBoy.v1`. Export uses the same JSON shape.
```js
{
  version: 1,
  settings: { pretendToday: '2027-01-18', showDoneOnly: false },
  types: [{ id, name, icon, color, goalPerMonth|null, cycleDays|null, multiDay?, endIcon? }],
  events: [{ id, typeId, title, start|null, end|null, time, notes, done, deletedAt|null, days? }]
}
```
- `start: null` means the event is in the **backlog**.
- `deletedAt` set means it is in the **bin**.
- `end` is set only for multi-day (trip) events.
- `days` remembers a trip's length while it sits in the backlog.
- Past / missed are **derived** from pretend-today; never store them.
- If the shape changes, bump `version`. `isValidState()` rejects other versions, and the app falls back to the seed.

## Phase 2 spec (habit tracker)
Decisions made with the owner. These are built, so keep them unless the owner changes them.

| Topic | Decision |
|---|---|
| "Today" | A **pretend-today** date picker in the header (default 18 Jan 2027). **Today counts as the past**: "past" means on or before pretend-today. |
| Storage | localStorage + **Export / Import JSON** + Reset demo data (the header "Data" menu). |
| Single click on an icon | **Toggles done / not done**, for past *and* future events. |
| Double-click on an icon | Opens the **details popup**. It does **not** duplicate. |
| Popup actions | Done toggle, **Duplicate** (the copy lands on the following day, not done), **Remove** (to the bin), edit title / time / notes / date. Trips have start and end dates. An empty date sends a single-day event to the backlog. |
| Adding events | **Drag an icon from the Event types sidebar** onto a day (or onto the backlog). |
| Done / not-done icons | The **same icon**; only the styling differs (see below). |
| Show done filter | Hides **past not-done** icons only. Future icons always stay visible. |
| Goals | Per type, optional, shown as `6 / 10 done · 3 planned` + progress bar. |
| Last done / cycle | Per type: last done date, `Every 2 weeks · next due 29 Jan` / `due today` / `overdue since …` (red). |
| Deleting a type | Deletes **all its events permanently** (not to the bin), after a confirm showing the count. |
| Trips | Count like any other event for done, goals and cycles. Dragging moves the whole trip and keeps its length. |
| Tentative state | **Dropped for now.** It could come back later. |

Visual states (CSS classes on `.event` / `.trip`):

| | Not done | Done (`.done`) |
|---|---|---|
| **Past (incl. today)** | `.missed`: grey (grayscale + 45% opacity), no ring | Solid ring in the type colour |
| **Future** | Normal, no ring | Solid ring |

## Conventions
- **Icon style**: flat fills, thick dark outline (`OUTLINE`), 64×64 viewBox, readable at 26px. New icons go in `ICONS`, plus `ICON_LIBRARY` if users should be able to pick them.
- **Colours**:
  - A type's colour is a `COLORS` key. `colorVars(type)` sets `--c` (strong colour: ring, path, progress bar) and `--tint` (chip background) inline.
  - Don't name a CSS variable `--bg`, because that's the page background token.
  - Page-level tokens live on `:root` in `styles.css`.
- **Markup**: rendered with template strings. User-visible text **must** go through `esc()`.
- **Dates**: `en-GB` format (`Thu 14 Jan`). Weeks start on **Sunday**.
- **Comments**: match the existing density (sparse; only where something isn't obvious). CSS sections are marked `/* ---------- Name ---------- */`, with one `@media (max-width: 800px)` block at the end.

## Gotchas (don't reintroduce)
- **Click vs double-click**:
  - `toggleDone` updates classes **in place** and re-renders only the sidebar types. A full re-render would replace the element between the two clicks, and `dblclick` would never fire.
  - A double-click is two clicks, so the toggles cancel out and then the popup opens.
- **Drag vs click**:
  - A drag starts after the pointer moves 6px.
  - After a drop, `suppressClick` swallows the click the browser fires. It is reset by `setTimeout(0)`, because the source element is usually re-rendered away and that click never reaches it.
- **Trips during drag**:
  - `.dragging .trip { pointer-events: none }`, so `elementFromPoint` finds the day cell under a trip strip.
  - `grabOffset()` remembers which day of the trip was grabbed.
- `[data-drag]` needs `touch-action: none`, or touch drags scroll the page.
- **Popup and resize**: the popup closes on resize only if the **width** changes. The phone keyboard changes the height while you edit a field.
- **Layout**:
  - `.week` must be `flex: 1 0 auto`.
  - Grid columns must be `repeat(7, minmax(0, 1fr))`, or busy rows overflow and narrow screens scroll sideways.

## Verifying changes
- **Interaction tests**: run `bash tests/run-tests.sh` (Git Bash).
  - It loads the real page in headless Edge with `tests/interaction-tests.js`, which fires synthetic pointer, click and dblclick events, and prints PASS/FAIL lines (31 tests at the time of writing).
  - Each run uses a fresh browser profile, so state starts from `SEED`.
  - Add a test when you add a behaviour.
- **Screenshots**:
  ```bash
  E="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  "$E" --headless=new --disable-gpu --window-size=1440,1250 --screenshot="<scratch>/desk.png" "file:///D:/coding%20for%20fun/calendar_boy/index.html"
  ```
  - Headless Edge won't go below a ~492px viewport, and smaller `--window-size` captures are just cropped. For a true phone check, use a real browser's device toolbar.
  - `--screenshot` resizes the window before capturing, which closes the popup. To photograph a popup, reopen it from a `resize` listener in a throwaway script.
- **Not covered by the tests**: real touch input, and Export/Import (needs a real file dialog). Say so if you change those parts.

## Environment and git
- Windows 11. Both Git Bash and PowerShell are available. Git warns about LF→CRLF, which is harmless.
- `gh` CLI is **not installed**. Pushing uses Git Credential Manager over HTTPS. If a push fails with an auth error, the owner has to sign in. Don't work around it.
- Commit only when asked or as part of an agreed workflow. Never force-push.

## Ideas for later phases (not agreed yet; ask the owner first)
- Animation (e.g. the plane taking off on load, icons wobbling on hover). The owner explicitly deferred this.
- Navigating months, and week/day views. A cycle's "next due" can already point past January.
- The tentative state (dropped in phase 2).
- Icon refinement: the plane angles are subtle at small sizes.
- More multi-day icon pairs (road trip, hospital stay). Custom types are single-day only for now, and `multiDay` / `endIcon` exist only on the seeded holiday type.
- Real file storage (File System Access API, or a tiny local server) if localStorage + export isn't enough.
