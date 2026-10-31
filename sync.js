// ---------- Cloud sync: Google sign-in + Firestore ----------
// Each type and event is its own document under users/{uid}/types and users/{uid}/events, so edits to
// different events on two devices merge; the same event edited on both = last write wins.
// Per-device settings (pretend today, month on screen, lock, filter, panel) are not synced.
const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const SYNCED_UID_KEY = 'calendarBoy.syncedUid'; // the account this device's data is in step with
const COLLECTIONS = ['types', 'events'];
const BATCH_LIMIT = 400; // Firestore allows 500 writes per batch

let fb = null;                // { auth, db, user, unsubscribe }
let synced = emptySynced();   // per collection: id -> canonical JSON of what the cloud holds
let fresh = {};               // per collection: true until its first snapshot has arrived
let pending = {}, fromCache = {};
let ready = false;            // no pushes until the cloud's copy has been loaded
let syncStatus = { state: 'off', detail: '' };

function emptySynced() { return { types: new Map(), events: new Map() }; }

// JSON with sorted keys, so equal data compares equal whatever order Firestore returns fields in.
function canon(v) {
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  return JSON.stringify(v);
}
// Firestore rejects undefined (a JSON round trip drops it), and the id is the document id, not a field.
function toDoc(item) { const { id, ...rest } = item; return JSON.parse(JSON.stringify(rest)); }
const col = name => fb.db.collection('users').doc(fb.user.uid).collection(name);

// ---------- Push: local changes -> cloud ----------
// Runs after every save. Compares state with what the cloud holds and writes only the difference,
// so it doesn't matter how a change happened (tap, drag, import, start fresh...).
function pushChanges() {
  if (!fb?.user || !ready) return;
  const ops = [];
  COLLECTIONS.forEach(name => {
    const seen = new Set();
    state[name].forEach(item => {
      seen.add(item.id);
      const data = toDoc(item), json = canon(data);
      if (synced[name].get(item.id) === json) return;
      synced[name].set(item.id, json);
      ops.push(batch => batch.set(col(name).doc(item.id), data));
    });
    [...synced[name].keys()].filter(id => !seen.has(id)).forEach(id => {
      synced[name].delete(id);
      ops.push(batch => batch.delete(col(name).doc(id)));
    });
  });
  for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
    const batch = fb.db.batch();
    ops.slice(i, i + BATCH_LIMIT).forEach(op => op(batch));
    // Offline, commit() waits until reconnected; Firestore keeps the writes queued on the device meanwhile.
    batch.commit().catch(err => setSyncStatus('error', err.message));
  }
  if (ops.length) setSyncStatus('syncing');
}

// ---------- Pull: cloud changes -> local ----------
function applyRemote(name, snap) {
  let changed = false;
  // An empty first answer from the device cache just means nothing is cached yet; wait for the server.
  if (fresh[name] && snap.metadata.fromCache && snap.empty) return;
  if (fresh[name]) {
    // First snapshot since sign-in: the account's copy is the truth for this collection.
    fresh[name] = false;
    synced[name] = new Map();
    state[name] = snap.docs.map(d => {
      synced[name].set(d.id, canon(d.data()));
      return { id: d.id, ...d.data() };
    });
    changed = true;
    if (!ready && COLLECTIONS.every(n => !fresh[n])) ready = true;
  } else {
    snap.docChanges().forEach(ch => {
      const id = ch.doc.id, i = state[name].findIndex(x => x.id === id);
      if (ch.type === 'removed') {
        synced[name].delete(id);
        if (i !== -1) { state[name].splice(i, 1); changed = true; }
        return;
      }
      const data = ch.doc.data(), json = canon(data);
      if (i !== -1 && synced[name].get(id) === json) return; // our own write coming back
      synced[name].set(id, json);
      if (i === -1) state[name].push({ id, ...data });
      else state[name][i] = { id, ...data };
      changed = true;
    });
  }
  pending[name] = snap.metadata.hasPendingWrites;
  fromCache[name] = snap.metadata.fromCache;
  setSyncStatus(COLLECTIONS.some(n => pending[n]) ? 'syncing' : COLLECTIONS.some(n => fromCache[n]) ? 'offline' : 'synced');
  if (changed) {
    saveState(); // pushes nothing: everything now matches the cloud
    render();
    if (popoverView?.kind === 'event' && !byId(popoverView.id)) closePopover();
  }
}

// ---------- Sign-in and start-up ----------
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

async function initSync() {
  if (location.protocol === 'file:') return setSyncStatus('local');
  if (!FIREBASE_CONFIG) return setSyncStatus('off');
  setSyncStatus('connecting');
  try {
    for (const f of ['firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js']) await loadScript(FIREBASE_SDK + f);
  } catch (err) {
    return setSyncStatus('error', "Couldn't load sync (offline?). Reload to try again.");
  }
  firebase.initializeApp(FIREBASE_CONFIG);
  const db = firebase.firestore();
  // Keeps a copy on the device so the app works offline and queued changes survive a reload.
  try { await db.enablePersistence({ synchronizeTabs: true }); } catch (err) { /* unsupported: online-only */ }
  fb = { auth: firebase.auth(), db, user: null, unsubscribe: [] };
  fb.auth.getRedirectResult().catch(err => setSyncStatus('error', err.message));
  fb.auth.onAuthStateChanged(user => (user ? startSync(user) : stopSync()));
}

async function startSync(user) {
  fb.user = user;
  syncAccount = user.email;
  synced = emptySynced();
  fresh = { types: true, events: true };
  ready = false;
  setSyncStatus('syncing');
  if (localStorage.getItem(SYNCED_UID_KEY) !== user.uid && !(await firstSyncOnThisDevice())) return;
  fb.unsubscribe = COLLECTIONS.map(name => col(name).onSnapshot({ includeMetadataChanges: true },
    snap => applyRemote(name, snap), err => setSyncStatus('error', err.message)));
}

// The first time this device syncs with the account: upload its calendar if the account is empty,
// otherwise either take the account's calendar or add this device's events to it.
async function firstSyncOnThisDevice() {
  let snaps;
  try {
    snaps = await Promise.all(COLLECTIONS.map(name => col(name).get({ source: 'server' })));
  } catch (err) {
    setSyncStatus('error', 'Connect to the internet to finish setting up sync, then reload.');
    return false;
  }
  const cloudEvents = snaps[1].size;
  const takeCloud = !snaps.every(s => s.empty) && confirm(
    `Your account already has a calendar (${cloudEvents} events).\n\n` +
    "OK: show your account's calendar on this device (replaces what's here now).\n" +
    "Cancel: add this device's events to your account's calendar.");
  if (!takeCloud) {
    COLLECTIONS.forEach((name, i) => snaps[i].docs.forEach(d => {
      synced[name].set(d.id, canon(d.data()));
      if (!state[name].some(x => x.id === d.id)) state[name].push({ id: d.id, ...d.data() });
    }));
    fresh = { types: false, events: false };
    ready = true;
    commit(); // uploads this device's events
  }
  localStorage.setItem(SYNCED_UID_KEY, fb.user.uid);
  return true;
}

function stopSync() {
  fb?.unsubscribe.forEach(unsub => unsub());
  if (fb) { fb.user = null; fb.unsubscribe = []; }
  syncAccount = null;
  ready = false;
  setSyncStatus(fb ? 'signed-out' : 'off');
}

async function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await fb.auth.signInWithPopup(provider);
  } catch (err) {
    if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(err.code)) await fb.auth.signInWithRedirect(provider);
    else if (err.code !== 'auth/popup-closed-by-user') setSyncStatus('error', err.message);
  }
}

function signOut() {
  if (!confirm("Sign out? This device keeps its calendar but stops syncing. When you sign in again you'll be asked how to combine it with your account.")) return;
  localStorage.removeItem(SYNCED_UID_KEY);
  fb.auth.signOut();
}

// ---------- Status display (Data button dot + menu) ----------
const SYNC_LABEL = {
  off: 'Cloud sync is not set up',
  local: 'Open the online version to sync',
  connecting: 'Connecting…',
  'signed-out': 'Not syncing',
  syncing: 'Syncing…',
  synced: 'Synced',
  offline: 'Offline: changes will sync later',
  error: 'Sync problem',
};

function setSyncStatus(state, detail = '') {
  syncStatus = { state, detail };
  renderSync();
}

function renderSync() {
  const { state: s, detail } = syncStatus;
  const badge = $('sync-badge');
  badge.className = 'sync-badge ' + s;
  badge.title = SYNC_LABEL[s] + (detail ? `: ${detail}` : '');
  let html = `<p class="menu-note"><span class="sync-badge ${s}"></span>${SYNC_LABEL[s]}${detail ? `<br><small>${esc(detail)}</small>` : ''}`;
  if (syncAccount) html += `<br><small>${esc(syncAccount)}</small>`;
  html += '</p>';
  if (s === 'signed-out' || (s === 'error' && fb && !fb.user)) html += '<button data-action="sign-in">Sign in with Google to sync</button>';
  if (fb?.user) html += '<button data-action="sign-out">Sign out</button>';
  $('sync-menu').innerHTML = html;
}

ACTIONS['sign-in'] = signIn;
ACTIONS['sign-out'] = signOut;
syncHook = pushChanges;
initSync();
