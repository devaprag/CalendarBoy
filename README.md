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
- **Show done** shows only events that are done (past and future).
- The sidebar shows, for each event type:
  - its **goal** for the month (e.g. `5 / 12 done · 4 planned`);
  - when it was **last done**;
  - when it's **next due**, if it repeats.
- **+ Add** creates an event type from a preset or your own name, icon and colour. The pencil edits a type.
- **Data**: export or import a JSON backup, reset to the demo data, or switch to the real date.

## Using it for real
**Data → Start fresh** deletes the demo events (event types are kept) and makes "today" follow the real date.

## Cloud sync (phone ↔ desktop, automatic backup)
Sign in with Google from the **Data** menu, on each device. Changes then sync within seconds, the app keeps working offline, and your account's copy is the backup. The dot on the Data button shows the state: green = synced, amber = syncing or offline, red = problem. Sync only works on the online version (https://devaprag.github.io/CalendarBoy/), not when `index.html` is opened as a file.

One-time setup (free Firebase project):
1. Go to https://console.firebase.google.com and **create a project** (e.g. "calendar-boy"). Google Analytics isn't needed.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**, choose your email as the support email, then **Save**.
3. **Authentication → Settings → Authorized domains → Add domain**: `devaprag.github.io`.
4. **Build → Firestore Database → Create database**. Pick the location nearest you and start in **production mode**.
5. **Firestore → Rules**: replace the rules with the following, then click **Publish**. They make your data readable and writable only by you.
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
6. **Project settings (gear icon) → General → Your apps → Web (`</>`)**. Register an app (no Firebase Hosting needed) and copy the `firebaseConfig = { ... }` object into `firebase-config.js` as `const FIREBASE_CONFIG = { ... };`. These values aren't secret, so they can be committed.

## Tests
`bash tests/run-tests.sh` (Git Bash on Windows, with Microsoft Edge installed) runs the interaction tests in headless Edge.
