# CLAUDE.md

Guidance for AI assistants (and humans) picking up this project.

## What this is
**Calendar Boy**: a visual calendar that looks like a normal month-view app (modelled on Google Calendar), but every event is drawn as a **cartoon icon** instead of a text bar. The owner is building it for fun.

**Current phase: proof of concept, done.** The owner reviewed it and was happy with the look. Repo: https://github.com/devaprag/CalendarBoy (branch `main`).

### Phase 1 scope (deliberately limited)
- January 2027 only, hard-coded sample data
- No animation
- Fixed set of 5 event types, and users cannot add new types
- View only: click an icon to see a details popover. No create, edit or delete.

## Tech
- **One file: `index.html`** with inline CSS and vanilla JS. No build step, no dependencies, no frameworks.
- Open it straight in a browser (`file://` works). Don't add tooling unless the owner asks for it, because the "just open the file" property is part of the appeal.

## Layout of `index.html`
In order:
1. **`<style>`**
   - Colour tokens on `:root`: `--<type>` for the strong colour and `--<type>-bg` for the chip tint.
   - Sections are marked `/* ---------- Name ---------- */`.
   - A single `@media (max-width: 800px)` block holds the narrow-screen rules.
2. **Markup**: header (Today and prev/next buttons are *disabled* on purpose, since there is only one month), sidebar legend, weekday header, `#weeks` container, and one shared `#popover`.
3. **`<script>`**
   - `OUTLINE`: the shared stroke attributes that give every icon its cartoon outline (`#2b2b2b`, width 3, round joins).
   - `PLANE`: a shared plane body drawn nose-right. `planeTakeoff` rotates it -24° over a runway with dust puffs; `planeLanding` rotates it +16° and adds wheels.
   - `ICONS`: icon name → inline SVG string (viewBox `0 0 64 64`).
   - `TYPES`: event type → `{ name, icon }`. The `holiday` type uses `planeTakeoff` as its "representative" icon in the legend and popover.
   - `EVENTS`: sample data, `{ id, type, title, start: 'YYYY-MM-DD', end?, time, notes }`. An event **with `end` is multi-day** and is drawn as a trip strip. Without `end` it is a single-day icon.
   - Date helpers: `parseDate` builds a *local* Date from `YYYY-MM-DD`. Don't use `new Date('2027-01-14')`, which parses as UTC and can shift the day.
   - `renderWeeks()` builds 6 week rows × 7 day cells. `MAX_VISIBLE = 3`: if a day has more events than that, it shows `MAX_VISIBLE - 1` of them plus a "+N more" button.
   - `renderTripSegment()` draws one absolutely positioned strip per week row a trip covers:
     - The takeoff chip appears only in the row containing the start day.
     - The dashed `.path` runs to the row edge (`to-edge`) or from it (`from-edge`) when the trip wraps.
     - The landing chip appears in the end row; other rows get a `›` arrow.
     - The label says "(cont.)" on continuation rows.
     - Rows with a trip get the class `has-trip`, which reserves a fixed-height `.lane` in every cell so single-day icons sit below the strip.
   - Popover:
     - One delegated `document` click handler covers `.event`, `.trip` and `.more`.
     - Clicking an event inside the "+N more" list swaps the content in place, so the popover doesn't jump.
     - Esc, an outside click or a window resize closes it.

## Conventions
- **Icon style**: flat fills, thick dark outline (`OUTLINE`), 64×64 viewBox, readable at 26px. Each type has one hue (Tailwind-ish palette): movie purple `#8b5cf6`, holiday sky `#0ea5e9`, gym orange `#f97316`, shopping pink `#ec4899`, call green `#22c55e`. Icons sit on a rounded chip tinted with the `-bg` token.
- **Markup**: rendered with template strings. User-visible text goes through `esc()`.
- **Dates**: in `en-GB` format (`Thu 14 Jan`). Weeks start on **Sunday**.
- Match the existing comment density (sparse; comments only where something isn't obvious).

## How to…
- **Add an event type** (if the owner changes the "no new types" rule):
  1. Add the SVG to `ICONS`.
  2. Add an entry to `TYPES`.
  3. Add `--x` / `--x-bg` tokens and a `.chip.x` rule.
- **Add another multi-day icon pair** (e.g. a road trip with a car leaving and arriving): today `renderTripSegment` and `eventDetail` hard-code `planeTakeoff` / `planeLanding` / `holiday`. Generalise by adding `startIcon` / `endIcon` to `TYPES`.
- **Support more months**:
  1. Make `YEAR` / `MONTH` state.
  2. Re-run `renderWeeks()` on prev/next.
  3. Enable the header buttons and the Today button.
  4. Note that `gridStart` is already derived from the month, and the grid always shows 6 rows.

## Gotchas already hit (don't reintroduce)
- `.week` must be `flex: 1 0 auto`. With plain `flex: 1`, busy rows shrink and their events overflow into the next week.
- Grid columns must be `repeat(7, minmax(0, 1fr))`. Plain `1fr` lets content force horizontal scroll on narrow screens.
- Only one trip per row is laid out cleanly right now. Overlapping multi-day events would stack on top of each other, so add lanes if that's ever needed.

## Verifying changes
There are no tests. Check visually with headless Edge (installed on the owner's Windows machine), then look at the PNG:
```bash
E="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$E" --headless=new --disable-gpu --window-size=1400,1100 --screenshot="<scratch>/desk.png" "file:///D:/coding%20for%20fun/calendar_boy/index.html"
```
- **Caveat:** headless Edge won't go below a ~492px viewport, and a `--window-size=390,...` capture is just *cropped*, which looks like overflow but isn't. For a true phone check, use a real browser's device toolbar.
- Clicks and popovers can't be checked with screenshots, so say they're untested unless a real browser was used.
- Check list: 1 Jan on Friday, 31 Jan on Sunday; trip takeoff on the 14th, wrapping at the week break, landing on the 20th; "+2 more" on the 13th.

## Environment and git
- Windows 11. Both Git Bash and PowerShell are available. Git warns about LF→CRLF, which is harmless.
- `gh` CLI is **not installed**. Pushing uses Git Credential Manager over HTTPS. If a push fails with an auth error, the owner has to sign in. Don't try to work around it.
- Commit only when asked or as part of an agreed workflow. Never force-push.

## Ideas for next phases (not agreed yet; ask the owner first)
- Simple, frame-based animation (e.g. the plane taking off when the month loads, wobbling icons on hover). The owner explicitly deferred animation to "a later stage".
- Navigating months, and week/day views.
- Creating and editing events from the 5 fixed types (stored in localStorage).
- Icon refinement: the plane angles are subtle at small sizes, and the owner hasn't commented on them yet.
- More multi-day pairs (road trip, hospital stay) and multiple trips per row.
