# CalendarBoy

A proof-of-concept visual calendar and habit tracker. It looks like a normal month view (think Google Calendar), but every event is a cartoon icon. Icons in the future are plans; icons in the past show whether you actually did them.

## Try it
Open `index.html` in a browser. There's nothing to install and no build step. Your changes are saved in the browser.

- **Click** an icon to mark it done (it gets a coloured ring). Past events that weren't done turn grey.
- **Double-click** an icon for details: edit it, **Duplicate** it (the copy lands on the next day) or **Remove** it.
- **Drag** icons between days, into the **Backlog** (someday), or onto the **recycling bin**. Click the bin to restore things.
- **Drag from Event types** in the sidebar onto a day to add an event.
- The sidebar shows each type's **goal** (e.g. `3 / 10 done · 3 planned`), when it was **last done**, and when it's **next due** if it repeats.
- **+ Add** creates an event type from a preset (Wash bedsheets, Dentist, Run…) or your own name, icon and colour. The pencil edits a type.
- **Today** in the header is a pretend date, so January 2027 has a past and a future to play with.
- **Show done** hides past events you didn't do.
- **Data** lets you export or import a JSON backup, or reset to the demo data.

## Scope (prototype)
January 2027 only, no animation.

## Tests
`bash tests/run-tests.sh` (Git Bash on Windows, with Microsoft Edge installed) runs the interaction tests in headless Edge.
