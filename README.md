# CalendarBoy

A proof-of-concept visual calendar and habit tracker. It looks like a normal month view (think Google Calendar), but every event is a cartoon icon, and each event is **to do**, **done** or **abandoned**.

## Try it
Open `index.html` in a browser. There's nothing to install and no build step. Your changes are saved in the browser.

- **Tap** an icon to cycle its status: To do (coloured ring) → Done (plain) → Abandoned (grey).
- **Long-press** (or right-click) an icon for details: edit it, set its status, **Duplicate** it (the copy lands on the next day) or **Remove** it.
- **🔒 Lock / unlock** (top left of the calendar): icons can only be dragged when unlocked, so scrolling on a phone never moves them by accident.
- When unlocked, you can:
  - drag icons between days;
  - drag them into the **Backlog** (someday), or into a new order within it;
  - drop them on the **recycling bin**. Tap the bin to restore things.
- **Add**: drag a type icon from the shelf at the top onto a day or into the backlog.
- **Trips**:
  - Drag the takeoff plane to change the start date.
  - Drag the landing plane to change the end date.
  - Drag the dashed line to move the whole trip.
- **‹ ›** browse months, or **swipe left/right** on a phone, or **scroll the mouse wheel** over the calendar on a computer. The demo data covers **Nov 2026 – Mar 2027**.
- **Today is …** sets a pretend today, so the demo has a past and a future. **Today** jumps back to that month.
- **Show done** hides past events that weren't done.
- The sidebar shows, for each event type:
  - its **goal** for the month (e.g. `5 / 12 done · 4 planned`);
  - when it was **last done**;
  - when it's **next due**, if it repeats.
- **+ Add** creates an event type from a preset or your own name, icon and colour. The pencil edits a type.
- **Data**: export or import a JSON backup, reset to the demo data, or switch to the real date.

## Tests
`bash tests/run-tests.sh` (Git Bash on Windows, with Microsoft Edge installed) runs the interaction tests in headless Edge.
