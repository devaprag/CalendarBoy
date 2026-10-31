# CLAUDE.md

Guidance for AI assistants (and humans) picking up this project.

## What this is
**Calendar Boy**: a visual calendar that looks like a normal month-view app (modelled on Google Calendar), but every event is drawn as a **cartoon icon** instead of a text bar. It doubles as a **habit tracker**: each event is *to do*, *done* or *abandoned*.

The owner is building it for fun and tests it on a Samsung phone as well as a PC. Repo: https://github.com/devaprag/CalendarBoy (branch `main`).

**Status:**
- Phase 1 (visual proof of concept): done.
- Phase 2 (habit tracker): done.
- **Phase 3 (changes after phone testing): built.** See [Behaviour spec](#behaviour-spec).
- All months can be browsed. The demo "playground" data covers **Nov 2026 – Mar 2027**.
- Still a proof of concept. The **only animation is the month slide** (the owner asked for it because instant month changes felt jarring). Other animation is still deferred.

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
  - `PLANE` is shared by `planeTakeoff` / `planeLanding`.
  - `bin`, `binFull`, `lock` and `unlock` are UI-only icons.
- **`data.js`**
  - `COLORS` is the 8-colour palette, `{ c, tint }`.
  - `ICON_LIBRARY` lists the icons the type editor offers.
  - `PRESET_TYPES` holds the predefined types.
  - `SEED` is **generated** by an IIFE:
    - Gym Mon/Wed/Fri, groceries Saturday, Gran call Sunday, and bedsheets every 2 weeks, from Nov 2026 to Mar 2027. Routines are skipped while away on a trip.
    - Three trips: Lisbon at Christmas, Tokyo in January, skiing in March.
    - A list of one-off events and 3 backlog items.
    - Past statuses come from a fixed pattern, so the demo is stable.
- **`app.js`**, in section order:
  1. State and storage, including `migrate()` from older formats.
  2. Date helpers, including month helpers.
  3. Queries.
  4. Render: the header bits, the shelf (lock, palette, backlog), the types sidebar, the month grid with trip lanes, and the bin.
  5. Event changes.
  6. Popover.
  7. Type editor.
  8. Export / import / reset.
  9. Clicks (the `ACTIONS` table).
  10. Press handling: tap, long-press, drag.

## Data model
Stored in localStorage key `calendarBoy.v1`. The key name is historical; the object carries `version`. Export uses the same JSON shape.
```js
{
  version: 3,
  settings: { pretendToday: '2027-01-18'|null, viewMonth: '2027-01', showDoneOnly: false, locked: true, statsCollapsed? },
  types: [{ id, name, icon, color, goalPerMonth|null, cycleDays|null, multiDay?, endIcon? }],
  events: [{ id, typeId, title, start|null, end|null, time, notes, status: 'todo'|'done'|'abandoned', deletedAt|null, seq, days? }]
}
```
- `pretendToday: null` means **follow the real date**. That's the normal setting for real use; "Start fresh" and "Use the real date" set it.
- `start: null` means the event is in the **backlog**. Backlog **order comes from `seq`**, not array position, so it survives item-by-item syncing. `placeInBacklog()` gives a moved event a `seq` between its new neighbours.
- `deletedAt` set means it is in the **bin**.
- `end` is set only for trips. `days` remembers a trip's length while it sits in the backlog.
- Past/future is **derived** from `pretendToday` (today counts as past); never store it.
- When the shape changes: bump `STATE_VERSION`, and add a step to `migrate()` so saved data on the owner's phone survives. `migrate()` already handles v1 (`done: bool`) → v2 (`status`) → v3 (`seq`). Import goes through `migrate()` too.
- **The owner uses this for real now.** Never ship a change that could lose or silently reset their saved data.

## Cloud sync (`sync.js`, Firebase)
- **Setup**: Google sign-in + Firestore, loaded from the gstatic CDN (compat build, pinned version) **only** when `firebase-config.js` has a config and the page is served over http(s). On `file://` sync is off, because Google sign-in needs a real domain. The owner's setup steps are in the README.
- **Data layout**: `users/{uid}/types/{id}` and `users/{uid}/events/{id}`, one document per item (the `id` field is left out of the document). Settings are **per device and not synced**.
- **Push**: `syncHook` runs `pushChanges()` after every `saveState()`. It diffs `state` against `synced` (id → canonical JSON of what the cloud holds) and batch-writes only the differences: sets, and deletes for items that disappeared. So every way of changing data syncs without special cases.
- **Pull**: `onSnapshot` listeners → `applyRemote()`.
  - On the **first snapshot after sign-in**, the account's copy replaces local data for that collection. An empty first snapshot *from the device cache* is ignored.
  - After that, changes are applied one item at a time. An item whose JSON matches `synced` is our own write echoing back, and is skipped.
- **First sign-in on a device** (`SYNCED_UID_KEY` in localStorage differs): if the account is empty, the device uploads its calendar. Otherwise the owner chooses: take the account's calendar, or add this device's events to it. Signing out clears the key, so the next sign-in asks again.
- **Offline**: Firestore persistence (`enablePersistence`) keeps a device copy and queues writes.
- **Conflicts**: different items merge; the same item edited on two devices = last write wins.
- **Rendering**: events can arrive before their types, so `live()` skips events with no type.
- **Status dot** on the Data button: green synced, amber syncing/offline, red error. The menu shows details and Sign in / Sign out.
- **Cost**: free Spark plan. Each app open that's more than 30 minutes after the last one re-reads every document, so thousands of events times many opens a day could approach the 50k reads/day free limit. That's fine for years of personal use; revisit if it grows.
- **Tests** cover the sync logic with a fake Firestore. Real Firebase and Google sign-in are **not** covered.

## Behaviour spec
Decided with the owner. Keep these unless the owner changes them.

| Topic | Decision |
|---|---|
| Statuses | **To do → Done → Abandoned**. A **single tap/click cycles** through them in that order. New events start as To do. |
| Looks (past *and* future alike) | To do = **coloured ring**. Done = **plain icon**. Abandoned = **greyed out**. |
| Details popup | **Long-press** (500ms) on touch or mouse, or **right-click** on desktop. Double-click was dropped because two taps cycle the status twice. The popup has status buttons, title/time/notes/date fields, **Duplicate** (the copy lands on the next day as To do) and **Remove** (to the bin). |
| Lock | The 🔒 button: in the shelf on desktop, and a **floating round button bottom-left on phones** (mirroring the bin bottom-right). **Locked by default**, and remembered. When locked nothing can be dragged, so scrolling on a phone never moves icons. Tap and long-press still work. |
| Shelf (top of the calendar) | Lock + **Add palette** (type icons to drag onto a day or the backlog) + **Backlog** (drop zone; drag items into a new **order**). On phones the "Add" label is a **+ Add button** that opens the new-event-type dialog. |
| Trips | Drag the **takeoff** icon to move **only the start**. Drag the **landing** icon to move **only the end** (start ≤ end is enforced). Drag the **dashed middle** to move the **whole trip**. The popup's start/end fields behave the same way. |
| Months | All months: ‹ › arrows plus a **Today** button (jumps to pretend-today's month). Overflow days from neighbouring months show events and accept drops. |
| Month by gesture | **Phone**: a horizontal swipe on the calendar (left = next, right = previous). When unlocked, swipes that start on an icon drag it instead. **Desktop**: the mouse wheel over the calendar changes month once the month's top/bottom edge is on screen; before that it scrolls the page. One wheel gesture = one month. |
| Month slide | Changing month slides the old grid out and the new one in (260ms): **sideways** for swipes, arrows and Today; **up/down** for the wheel. Skipped when the device asks for reduced motion. |
| Drag to the edge | While dragging, holding the icon within 36px of the calendar's left/right edge turns the month after 0.6s, and keeps turning every 0.9s while held. A blue edge strip with an arrow just above the finger shows it's about to turn. Hovering the bin (which overlaps the bottom-right corner on phones) never counts as the edge. |
| "Today" | The **"Today is" date picker** sets a pretend today (default 18 Jan 2027, so the playground has a past). Data → "Use the real date as today". |
| Show done filter | Shows **only done** events, past and future alike. To do and abandoned are hidden. The backlog is unaffected. |
| Sidebar | Event types with **counts for the month on screen** (`5 / 12 done · 4 planned`, plus a progress bar when there's a goal), last done, and repeat cycle / next due / **overdue** (red). On phones it sits below the calendar and **collapses/expands** by tapping its heading (`settings.statsCollapsed`, remembered; expanded by default). On desktop it is always open. |
| Deleting a type | Deletes all its events permanently, after a confirm showing the count. |
| Other | The recycling bin (bottom right) restores items or empties. Data menu: sync status + Sign in/out, Use the real date, **Start fresh** (empty calendar, keeps types, real date), Export / Import JSON, Reset demo data. |

## Conventions
- **Icon style**: flat fills, thick dark outline (`OUTLINE`), 64×64 viewBox, readable at 26px. New icons go in `ICONS`, plus `ICON_LIBRARY` if users should be able to pick them.
- **Colours**:
  - A type's colour is a `COLORS` key. `colorVars(type)` sets `--c` (ring, path, progress bar) and `--tint` (chip background) inline.
  - Don't name a CSS variable `--bg`, because that's the page background token.
- **Status classes**: `.todo`, `.done` and `.abandoned` on `.event` / `.trip` (and on `.pop-head`). CSS styles the `.chip` inside.
- **Markup**: rendered with template strings. User-visible text **must** go through `esc()`.
- **Dates**: `YYYY-MM-DD` string keys, compared as strings. `parseDate` builds a *local* Date; never `new Date('2027-01-14')` (that's UTC). Display is `en-GB`. Weeks start on **Sunday**.
- **Comments**: match the existing density (sparse; only where something isn't obvious). CSS sections are marked `/* ---------- Name ---------- */`, with one `@media (max-width: 800px)` block at the end.

## Releasing (cache busting)
- **Every release that changes CSS or JS must bump the version** in two places:
  1. The `?v=` on all the asset links in `index.html`.
  2. `APP_VERSION` at the top of `app.js`.
- **Why:** GitHub Pages serves files with `max-age=600`, and Chrome on Android keeps using cached scripts even after a pull-to-refresh. Once, the owner's phone ran the new `index.html` with the old `app.js`: no lock, no Add icons, dead month buttons, no long-press.
- The Data menu shows `Version x` from `app.js`, so the owner can check which code their phone is running. If the menu says "Old app.js still cached", the HTML and JS are out of step.

## Gotchas (don't reintroduce)
- **Status changes update classes in place** (`setStatus`) and re-render only the sidebar. The icon stays put while you cycle it, even if Show done would now hide it.
- **Press handling** (`pointerdown` → `press`):
  - Moving more than 6px starts a drag, or does nothing when locked, so the browser scrolls.
  - Holding for 500ms opens the details.
  - After a long-press or a drop, `suppressClick` swallows the browser's follow-up click. It is cleared with `setTimeout(0)` after `pointerup`, because the source element is often re-rendered away and that click never reaches it.
- **Android long-press** also fires `contextmenu`. The handler calls `preventDefault()` and avoids opening the same popup twice. `-webkit-touch-callout: none` stops the system callout.
- **Touch scrolling**: `touch-action: none` is applied to `[data-drag]` **only when unlocked** (`body:not(.locked)`). Otherwise phones couldn't scroll when a swipe starts on an icon.
- **Trips during drag**:
  - `.dragging .trip { pointer-events: none }`, so `elementFromPoint` finds the day under a trip strip.
  - `press.part` is `start`, `end` or `whole`.
  - `grabOffset()` keeps the grabbed day under the pointer for whole-trip moves.
- **Month gestures**:
  - Swipes use **touch events**, not pointer events: when locked, the browser takes the touch for scrolling and fires `pointercancel`.
  - `main` has `touch-action: pan-y pinch-zoom`, so horizontal moves reach the page.
  - The wheel handler is non-passive so it can `preventDefault()`. `WHEEL_PAUSE_MS` keeps trackpad momentum from skipping several months.
- **Month slide** (`goToMonth` → `snapshotWeeks` → `slideMonth`):
  - Before re-rendering, a clone of `#weeks` is taken. It is made lifeless: `inert`, `pointer-events: none`, and the `data-id`/`data-drop`/`data-drag`/`data-action` attributes are stripped, so queries, drops and clicks never hit it.
  - The clone slides out over the new grid inside `.weeks-wrap` (`overflow: hidden`).
  - It is removed by a **timer**, not `onfinish`. Paused animations (background tabs, headless tests) would otherwise leave it behind.
  - The clone's animation **must keep `fill: 'forwards'`** and end at opacity 0. Otherwise it snaps back over the new month between the end of the slide and the timer, which the owner saw as an icon flicker.
  - Any month change must go through `goToMonth()`.
- **Popup and resize**: the popup closes on resize only if the **width** changes. The phone keyboard changes the height while editing.
- **Layout**:
  - `.week` must be `flex: 1 0 auto`.
  - Grid columns must be `repeat(7, minmax(0, 1fr))`.

## Verifying changes
- **Interaction tests**: run `bash tests/run-tests.sh` (Git Bash).
  - It loads the real page in headless Edge with `tests/interaction-tests.js`, which fires synthetic pointer, click and contextmenu events, and prints PASS/FAIL lines (73 at the time of writing).
  - The tests are async (long-press waits); `--virtual-time-budget` lets them finish.
  - Each run uses a fresh profile, so state starts from `SEED`.
  - Add a test when you add a behaviour.
  - Call `settle()` (finishes running animations) before measuring positions after a month change. Headless Edge doesn't reliably run animation frames, so a mid-slide grid gives off-screen coordinates and flaky tests.
- **Screenshots**:
  ```bash
  E="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  "$E" --headless=new --disable-gpu --user-data-dir="<scratch>/profile" --window-size=1440,1150 --screenshot="<scratch>/desk.png" "file:///D:/coding%20for%20fun/calendar_boy/index.html"
  ```
  - Use a throwaway `--user-data-dir`, or you get stale localStorage.
  - Headless Edge won't go below a ~492px viewport, and smaller captures are just cropped.
  - `--screenshot` resizes the window, which closes popups. Reopen them from a `resize` listener in a throwaway script.
- **Phone testing** (owner has a Samsung):
  - Enable GitHub Pages (Settings → Pages → `main` / root), giving https://devaprag.github.io/CalendarBoy/
  - Or run `npx serve -l 8000` and open `http://<PC IPv4>:8000` on the same Wi-Fi.
- **Not covered by the tests**: real touch input (long-press timing, scrolling while locked), and Export/Import (needs a real file dialog). Say so if you change those parts.

## Environment and git
- Windows 11. Both Git Bash and PowerShell are available. Node is installed. Git warns about LF→CRLF, which is harmless.
- `gh` CLI is **not installed**. Pushing uses Git Credential Manager over HTTPS. If a push fails with an auth error, the owner has to sign in. Don't work around it.
- Commit only when asked or as part of an agreed workflow. Never force-push.

## Ideas for later (not agreed yet; ask the owner first)
- More animation (e.g. the plane taking off on load, icons wobbling on hover). The owner deferred this; only the month slide exists.
- A swipe that follows the finger (drag the month along, then let go) instead of a fixed slide.
- Week/day views.
- Icon refinement: the plane angles are subtle at small sizes.
- More multi-day icon pairs (road trip, hospital stay). Custom types are single-day only for now, and `multiDay` / `endIcon` exist only on the seeded holiday type.

