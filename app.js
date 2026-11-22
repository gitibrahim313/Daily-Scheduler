/**
 * Digital Weekly Planner
 * Interactive engine managing tasks, habits, dynamic SVG progress rings, and local persistence.
 */

(() => {
  'use strict';

  // Constants
  const STORAGE_KEY = 'digital_weekly_planner_clean_v3';
  const SOUND_KEY = 'digital_weekly_planner_sound_v2';
  const RADIUS = 24;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 150.796 px

  // Default Template Data with all checkboxes completely unchecked
  const DEFAULT_DATA = {
    days: [
      {
        id: 'mon',
        name: 'Monday',
        colorKey: 'mon',
        tasks: [
          { id: 'm1', time: '08:00 AM', text: 'Going to market', completed: false },
          { id: 'm2', time: '09:30 AM', text: 'Review updates', completed: false },
          { id: 'm3', time: '11:00 AM', text: 'Attend yoga class', completed: false },
          { id: 'm4', time: '01:00 PM', text: 'Clean workspace', completed: false },
          { id: 'm5', time: '02:30 PM', text: 'Follow up on emails', completed: false },
          { id: 'm6', time: '04:00 PM', text: 'Call a friend', completed: false },
          { id: 'm7', time: '05:30 PM', text: 'Family dinner', completed: false },
          { id: 'm8', time: '07:00 PM', text: 'Write blog draft', completed: false },
          { id: 'm9', time: '08:30 PM', text: 'Read for 30', completed: false }
        ]
      },
      {
        id: 'tue',
        name: 'Tuesday',
        colorKey: 'tue',
        tasks: [
          { id: 't1', time: '07:30 AM', text: 'Morning meditation', completed: false },
          { id: 't2', time: '09:00 AM', text: 'Write newsletter', completed: false },
          { id: 't3', time: '11:30 AM', text: 'Lunch with Lisa', completed: false },
          { id: 't4', time: '01:00 PM', text: 'Attend webinar', completed: false },
          { id: 't5', time: '02:30 PM', text: 'Update social media p', completed: false },
          { id: 't6', time: '04:00 PM', text: 'Staff meeting', completed: false },
          { id: 't7', time: '05:30 PM', text: 'Evening walk', completed: false },
          { id: 't8', time: '07:00 PM', text: 'Plan weekly tasks', completed: false },
          { id: 't9', time: '08:30 PM', text: 'Review daily inbox', completed: false }
        ]
      },
      {
        id: 'wed',
        name: 'Wednesday',
        colorKey: 'wed',
        tasks: [
          { id: 'w1', time: '07:00 AM', text: 'Morning run', completed: false },
          { id: 'w2', time: '08:30 AM', text: 'Follow up emails', completed: false },
          { id: 'w3', time: '10:00 AM', text: 'Call family member', completed: false },
          { id: 'w4', time: '11:30 AM', text: 'Write newsletter', completed: false },
          { id: 'w5', time: '01:30 PM', text: 'Prepare dinner', completed: false },
          { id: 'w6', time: '03:00 PM', text: 'Attend webinar', completed: false },
          { id: 'w7', time: '04:30 PM', text: 'Relax with a book', completed: false },
          { id: 'w8', time: '06:00 PM', text: 'Grocery shopping', completed: false },
          { id: 'w9', time: '07:30 PM', text: 'Plan weekend fun', completed: false }
        ]
      },
      {
        id: 'thu',
        name: 'Thursday',
        colorKey: 'thu',
        tasks: [
          { id: 'th1', time: '07:00 AM', text: 'Morning run', completed: false },
          { id: 'th2', time: '08:30 AM', text: 'Staff meeting', completed: false },
          { id: 'th3', time: '10:00 AM', text: 'Review trends', completed: false },
          { id: 'th4', time: '11:30 AM', text: 'Yoga class', completed: false },
          { id: 'th5', time: '01:30 PM', text: 'Call family', completed: false },
          { id: 'th6', time: '03:00 PM', text: 'Finish painting', completed: false },
          { id: 'th7', time: '05:00 PM', text: 'Watch documentary', completed: false },
          { id: 'th8', time: '07:00 PM', text: 'Relax with book', completed: false },
          { id: 'th9', time: '08:30 PM', text: 'Evening walk', completed: false }
        ]
      },
      {
        id: 'fri',
        name: 'Friday',
        colorKey: 'fri',
        tasks: [
          { id: 'f1', time: '08:00 AM', text: 'Water plants', completed: false },
          { id: 'f2', time: '09:30 AM', text: 'Organize files', completed: false },
          { id: 'f3', time: '11:00 AM', text: 'Evening walk', completed: false },
          { id: 'f4', time: '01:00 PM', text: 'Plan next week', completed: false },
          { id: 'f5', time: '02:30 PM', text: 'Try new recipe', completed: false },
          { id: 'f6', time: '04:00 PM', text: 'Clean living space', completed: false },
          { id: 'f7', time: '05:30 PM', text: 'Reflect on goals', completed: false },
          { id: 'f8', time: '07:00 PM', text: 'Game night', completed: false },
          { id: 'f9', time: '08:30 PM', text: 'Evening walk', completed: false }
        ]
      },
      {
        id: 'sat',
        name: 'Saturday',
        colorKey: 'sat',
        tasks: [
          { id: 's1', time: '09:00 AM', text: 'Attend local event', completed: false },
          { id: 's2', time: '10:30 AM', text: 'Home chores', completed: false },
          { id: 's3', time: '12:00 PM', text: 'Family outing', completed: false },
          { id: 's4', time: '02:00 PM', text: 'Write in journal', completed: false },
          { id: 's5', time: '03:30 PM', text: 'Plan meals', completed: false },
          { id: 's6', time: '05:00 PM', text: 'Watch movie', completed: false },
          { id: 's7', time: '06:30 PM', text: 'Catch up friend', completed: false },
          { id: 's8', time: '08:00 PM', text: 'Call relatives', completed: false },
          { id: 's9', time: '09:00 PM', text: 'Weekend relaxation', completed: false }
        ]
      },
      {
        id: 'sun',
        name: 'Sunday',
        colorKey: 'sun',
        tasks: [
          { id: 'su1', time: '08:30 AM', text: 'Meal prep', completed: false },
          { id: 'su2', time: '10:00 AM', text: 'Read for pleasure', completed: false },
          { id: 'su3', time: '11:30 AM', text: 'Plan next week', completed: false },
          { id: 'su4', time: '01:00 PM', text: 'Do laundry', completed: false },
          { id: 'su5', time: '02:30 PM', text: 'Relax and unwind', completed: false },
          { id: 'su6', time: '04:00 PM', text: 'Nature walk', completed: false },
          { id: 'su7', time: '05:30 PM', text: 'Write gratitude list', completed: false },
          { id: 'su8', time: '07:00 PM', text: 'Review finances', completed: false },
          { id: 'su9', time: '08:30 PM', text: 'Weekly retrospective', completed: false }
        ]
      }
    ],
    habits: [
      { id: 'h1', text: "Get-up Early Morning at 6 O'clock", days: [false, false, false, false, false, false, false] },
      { id: 'h2', text: 'Take One Glass of Water at least', days: [false, false, false, false, false, false, false] },
      { id: 'h3', text: 'Take Morning Sun-light at least 15 Minutes', days: [false, false, false, false, false, false, false] },
      { id: 'h4', text: '30 Minutes Workout / 5Km Running', days: [false, false, false, false, false, false, false] },
      { id: 'h5', text: 'No-Phone First 30 Minutes', days: [false, false, false, false, false, false, false] },
      { id: 'h6', text: '5-Minutes Meditation', days: [false, false, false, false, false, false, false] },
      { id: 'h7', text: 'Off-Screen 45 Minutes, before going to sleep', days: [false, false, false, false, false, false, false] },
      { id: 'h8', text: '30 Minutes Reading Books', days: [false, false, false, false, false, false, false] },
      { id: 'h9', text: 'Calling (Family, Friends)', days: [false, false, false, false, false, false, false] },
      { id: 'h10', text: '7-8 Hours of sleep', days: [false, false, false, false, false, false, false] },
      { id: 'h11', text: 'Plan Daily Task Every morning', days: [false, false, false, false, false, false, false] },
      { id: 'h12', text: 'Journal for reflection and gratitude', days: [false, false, false, false, false, false, false] }
    ],
    priorities: [
      { id: 'p1', time: '08:00 AM', text: 'Complete Project A', completed: false },
      { id: 'p2', time: '10:00 AM', text: 'Prepare for presentation', completed: false },
      { id: 'p3', time: '11:30 AM', text: 'Finish reading book', completed: false },
      { id: 'p4', time: '02:00 PM', text: 'Family time this weekend', completed: false },
      { id: 'p5', time: '04:00 PM', text: 'Submit report on Friday', completed: false },
      { id: 'p6', time: '05:30 PM', text: 'Review finances for month', completed: false },
      { id: 'p7', time: '07:00 PM', text: 'Exercise at least 30', completed: false }
    ],
    notes: [
      { id: 'n1', title: 'Review finances for month', date: '2026-10-26', dateFormatted: 'Oct. 26', description: 'Monthly expenses review, subscriptions check, and finance summary.', text: 'Review finances for month' },
      { id: 'n2', title: 'Exercise at least 30', date: '2026-10-26', dateFormatted: 'Oct. 26', description: 'Morning cardio routine and evening stretching session.', text: 'Exercise at least 30' }
    ],
    nextWeek: [
      { id: 'nw1', time: '09:00 AM', text: 'Start drafting new project proposal', completed: false },
      { id: 'nw2', time: '11:00 AM', text: 'Schedule catch-up call w/ mentor', completed: false },
      { id: 'nw3', time: '01:00 PM', text: 'Book haircut appointment', completed: false },
      { id: 'nw4', time: '03:00 PM', text: 'Follow up on pending invoices', completed: false },
      { id: 'nw5', time: '05:00 PM', text: 'Set aside time for meal prep', completed: false },
      { id: 'nw6', time: '06:30 PM', text: 'Review quarterly financial goals', completed: false }
    ]
  };

  // State Variables
  let plannerData = null;
  let weekOffset = 0;
  let visibleBaseWeek = 0; // Anchor week for continuous infinite carousel
  let soundEnabled = true;
  let modalContext = null; // { type: 'day'|'habit'|'priority'|'nextWeek', dayId?: string, targetId?: string }
  let activeEditingNoteId = null; // Currently editing note ID for Note Modal
  let currentMobileDayFilter = 'all';
  const DAY_IDS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  let activeDayId = null;
  let activeCardUid = null; // Unique identifier for infinite carousel card, e.g. "w0-tue", "w1-mon"
  let isSliderWired = false;
  const weekDataCache = new Map();

  // Audio Context for Tactile Feedback
  let audioContext = null;
  function triggerSound(isCheck = true) {
    if (!soundEnabled) return;
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      const now = audioContext.currentTime;
      if (isCheck) {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.05); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else {
        osc.frequency.setValueAtTime(440, now); // A4
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // Audio not supported or autoplay blocked
    }
  }

  // Unified tick sound caller
  const playTickSound = () => triggerSound(true);

  // HTML & Attribute Sanitization (Ultra-fast, bulletproof DOM XSS prevention)
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  const escapeMarkup = escapeHtml;

  // Safe URL sanitizer (Blocks javascript:, vbscript:, and malicious schemes)
  function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (/^(https?:|data:image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,|\/|\.\/|\.\.\/|assets\/|[a-zA-Z0-9_\-\/]+\.(mp4|webm|jpg|jpeg|png|gif|svg|webp))/i.test(trimmed)) {
      if (!/^(javascript|vbscript|data(?!:image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,)):/i.test(trimmed)) {
        return trimmed;
      }
    }
    return '';
  }

  // Quota-safe localStorage setter with automatic history-pruning recovery
  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      if (err && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED' || err.code === 22 || err.code === 1014)) {
        console.warn('Storage quota exceeded, pruning historical snapshots to reclaim space...');
        try {
          localStorage.removeItem(SNAPSHOT_KEY);
          localStorage.setItem(key, value);
          return true;
        } catch (inner) {
          console.error('Storage quota still exceeded after pruning:', inner);
          return false;
        }
      }
      console.error('Storage save error:', err);
      return false;
    }
  }

  // Dates & Week Navigation Helpers
  function getMondayOfWeek(date, offsetWeeks = 0) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + (offsetWeeks * 7);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  // Calculate week offset relative to today's current week for any target Date
  function getWeekOffsetForDate(targetDate) {
    const now = new Date();
    const currentMonday = getMondayOfWeek(now, 0);
    const targetMonday = getMondayOfWeek(targetDate, 0);
    const diffMs = targetMonday.getTime() - currentMonday.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return Math.round(diffDays / 7);
  }

  // Storage Key Resolver for Multi-Week Persistence
  function getWeekStorageKey(offset = weekOffset) {
    if (offset === 0) return STORAGE_KEY;
    const now = new Date();
    const monday = getMondayOfWeek(now, offset);
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const d = String(monday.getDate()).padStart(2, '0');
    return `${STORAGE_KEY}_w_${y}_${m}_${d}`;
  }

  // Ensure all loaded day tasks, priorities, and nextWeek items have a scheduled time
  function validateAndFillTaskTimes(data) {
    const defaultTimeSlots = ['08:00 AM', '09:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM', '08:30 PM'];
    if (data && Array.isArray(data.days)) {
      data.days.forEach(day => {
        if (Array.isArray(day.tasks)) {
          day.tasks.forEach((t, idx) => {
            if (!t.time) {
              t.time = defaultTimeSlots[idx % defaultTimeSlots.length] || '09:00 AM';
            }
          });
        }
      });
    }
    if (data && Array.isArray(data.priorities)) {
      data.priorities.forEach((p, idx) => {
        if (!p.time) {
          p.time = defaultTimeSlots[idx % defaultTimeSlots.length] || '09:00 AM';
        }
      });
    }
    if (data && Array.isArray(data.nextWeek)) {
      data.nextWeek.forEach((nw, idx) => {
        if (!nw.time) {
          nw.time = defaultTimeSlots[idx % defaultTimeSlots.length] || '10:00 AM';
        }
      });
    }
  }

  // Upgrades legacy 8-item sample habits list to the 12 modern default habits
  function upgradeHabitsIfLegacy(data) {
    if (!data || !Array.isArray(data.habits)) return false;
    const hasOldHabits = data.habits.some(h =>
      h && h.text && (
        h.text.includes('Drink pani') ||
        h.text === 'Drink pani (2L)' ||
        h.text.includes('Limit screen time') ||
        h.text.includes('Read for at least 30 minutes')
      )
    );
    if (hasOldHabits) {
      data.habits = JSON.parse(JSON.stringify(DEFAULT_DATA.habits));
      return true;
    }
    return false;
  }

  // Multi-Week Persistence & Cache Helpers for Infinite Date Carousel
  function getWeekData(offset) {
    if (offset === weekOffset && plannerData) {
      return plannerData;
    }
    if (weekDataCache.has(offset)) {
      return weekDataCache.get(offset);
    }
    const key = getWeekStorageKey(offset);
    const stored = localStorage.getItem(key);
    let data;
    if (stored) {
      try {
        data = JSON.parse(stored);
        validateAndFillTaskTimes(data);
        if (upgradeHabitsIfLegacy(data)) {
          safeSetStorage(key, JSON.stringify(data));
        }
      } catch (_) {
        data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
    } else {
      data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      if (Array.isArray(data.days)) {
        data.days.forEach(d => {
          if (Array.isArray(d.tasks)) {
            d.tasks.forEach(t => { t.completed = false; });
          }
        });
      }
      safeSetStorage(key, JSON.stringify(data));
    }
    weekDataCache.set(offset, data);
    return data;
  }

  function saveWeekData(offset, data) {
    if (!data) return;
    const key = getWeekStorageKey(offset);
    safeSetStorage(key, JSON.stringify(data));
    weekDataCache.set(offset, data);
  }

  // Persistence
  function loadStoredData() {
    try {
      const curKey = getWeekStorageKey(weekOffset);
      const stored = localStorage.getItem(curKey);
      if (stored) {
        plannerData = JSON.parse(stored);
        validateAndFillTaskTimes(plannerData);
        if (upgradeHabitsIfLegacy(plannerData)) {
          persistData(true);
        }
      } else {
        plannerData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        persistData();
      }
    } catch {
      plannerData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    weekDataCache.set(weekOffset, plannerData);

    // Initialize Today as default active day & card UID
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayKey = dayKeys[new Date().getDay()];
    activeDayId = todayKey || 'mon';
    activeCardUid = `w0-${activeDayId}`;

    try {
      const storedSound = localStorage.getItem(SOUND_KEY);
      if (storedSound !== null) {
        soundEnabled = storedSound === 'true';
      }
    } catch {
      soundEnabled = true;
    }
  }

  // Google Drive Cloud Backup Constants & State
  const GDRIVE_CLIENT_ID_KEY = 'digital_weekly_planner_gdrive_client_id';
  const GDRIVE_AUTOBACKUP_KEY = 'digital_weekly_planner_gdrive_autobackup';
  const GDRIVE_USER_KEY = 'digital_weekly_planner_gdrive_user';
  const GDRIVE_LAST_BACKUP_KEY = 'digital_weekly_planner_gdrive_last_backup';
  const GDRIVE_FILE_ID_KEY = 'digital_weekly_planner_gdrive_file_id';
  const GDRIVE_FILE_LINK_KEY = 'digital_weekly_planner_gdrive_file_link';
  const GDRIVE_BACKUP_FILENAME = 'weekly-planner-backup.json';

  const SNAPSHOT_KEY = 'digital_weekly_planner_snapshots_v2';

  let gdriveAccessToken = null;
  let gdriveTokenClient = null;
  let gdriveUserProfile = null;
  let gdriveAutoBackupEnabled = false;
  let gdriveLastBackup = null;
  let gdriveFileId = null;
  let gdriveFileLink = null;
  let autoBackupTimer = null;

  // Auto-Save Management State
  let lastSavedTimestamp = Date.now();
  let saveDebounceTimer = null;
  let snapshotDebounceTimer = null;

  function updateAutosaveUI(state = 'saved') {
    const badge = document.getElementById('autosaveBadge');
    const text = document.getElementById('autosaveText');
    if (!badge || !text) return;

    if (state === 'saving') {
      badge.classList.remove('error');
      badge.classList.add('saving');
      text.textContent = 'Saving...';
      badge.title = 'Saving changes to offline storage...';
    } else if (state === 'saved') {
      badge.classList.remove('saving', 'error');
      text.textContent = 'Auto-Saved';
      lastSavedTimestamp = Date.now();
      const timeStr = new Date(lastSavedTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      badge.title = `Auto-Save active: All changes preserved offline (Last saved at ${timeStr})`;
    } else if (state === 'error') {
      badge.classList.remove('saving');
      badge.classList.add('error');
      text.textContent = 'Save Failed';
      badge.title = 'LocalStorage write failed (storage full or disabled).';
    }
  }

  function recordAutosaveSnapshot() {
    clearTimeout(snapshotDebounceTimer);
    snapshotDebounceTimer = setTimeout(() => {
      try {
        const snapshots = JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || '[]');
        snapshots.unshift({
          timestamp: new Date().toISOString(),
          data: plannerData
        });
        const trimmed = snapshots.slice(0, 5);
        safeSetStorage(SNAPSHOT_KEY, JSON.stringify(trimmed));
      } catch (_) {
        // Storage quota safeguard
      }
    }, 4000);
  }

  function persistData(skipAutoBackup = false) {
    updateAutosaveUI('saving');
    const curKey = getWeekStorageKey(weekOffset);
    const success = safeSetStorage(curKey, JSON.stringify(plannerData));

    if (success) {
      clearTimeout(saveDebounceTimer);
      saveDebounceTimer = setTimeout(() => {
        updateAutosaveUI('saved');
      }, 350);

      recordAutosaveSnapshot();

      if (!skipAutoBackup && gdriveAutoBackupEnabled && gdriveAccessToken) {
        triggerAutoBackup();
      }
    } else {
      updateAutosaveUI('error');
      showToast('Warning: Offline auto-save failed (storage quota full)');
    }
  }

  function triggerAutoBackup() {
    clearTimeout(autoBackupTimer);
    autoBackupTimer = setTimeout(() => {
      backupToGoogleDrive(true);
    }, 4000);
  }

  // Periodic heartbeat auto-save every 45 seconds & beforeunload safety
  setInterval(() => {
    if (plannerData) {
      try {
        const curKey = getWeekStorageKey(weekOffset);
        localStorage.setItem(curKey, JSON.stringify(plannerData));
        updateAutosaveUI('saved');
      } catch (_) { }
    }
  }, 45000);

  window.addEventListener('beforeunload', () => {
    if (plannerData) {
      try {
        const curKey = getWeekStorageKey(weekOffset);
        localStorage.setItem(curKey, JSON.stringify(plannerData));
      } catch (_) { }
    }
  });

  // Toast Notification
  function showToast(msg) {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2200);
  }

  // Switch to another week with full persistence & clean default initialization
  function switchWeek(targetOffset, shouldRender = true) {
    if (targetOffset === weekOffset && shouldRender) {
      if (weekOffset === 0) {
        const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const todayKey = dayKeys[new Date().getDay()];
        setActiveCard(`w0-${todayKey}`, true, 'smooth');
      }
      return;
    }

    // 1. Save currently active week's modifications before navigating away
    if (plannerData) {
      saveWeekData(weekOffset, plannerData);
    }

    // 2. Update to new week offset & visible base week
    weekOffset = targetOffset;
    visibleBaseWeek = targetOffset;
    plannerData = getWeekData(weekOffset);

    // 3. Update active day & card UID for the new week
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayKey = dayKeys[new Date().getDay()];
    if (weekOffset === 0 && todayKey) {
      activeDayId = todayKey;
      activeCardUid = `w0-${todayKey}`;
    } else {
      activeDayId = activeDayId || 'mon';
      activeCardUid = `w${weekOffset}-${activeDayId}`;
    }

    // 4. Re-render all sections for the selected week if requested
    if (shouldRender) {
      renderDays();
      renderHabits();
      renderPriorities();
      renderNotes();
      renderNextWeek();
      updateDates();
      updateGlobalMetrics();
    }

    // 5. User feedback toast
    if (shouldRender) {
      if (weekOffset === 0) {
        showToast('Current Week loaded (Your saved data restored)');
      } else if (weekOffset === 1) {
        showToast('Next Week: All 7 days ready to customize');
      } else {
        const now = new Date();
        const mon = getMondayOfWeek(now, weekOffset);
        const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
        const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        showToast(`Switched to: ${fmt(mon)} – ${fmt(sun)}`);
      }
    }
  }

  function updateDates() {
    const now = new Date();
    const monday = getMondayOfWeek(now, weekOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const weekLabel = document.getElementById('weekRangeLabel');
    const weekTag = document.getElementById('currentWeekTag');

    if (weekLabel) {
      weekLabel.textContent = `${fmt(monday)} – ${fmt(sunday)}, ${sunday.getFullYear()}`;
    }

    if (weekTag) {
      if (weekOffset === 0) {
        weekTag.textContent = 'Current Week';
        weekTag.className = 'week-pill current-week-pill';
        weekTag.style.display = 'inline-block';
      } else if (weekOffset === 1) {
        weekTag.textContent = 'Next Week (Customizable)';
        weekTag.className = 'week-pill next-week-pill';
        weekTag.style.display = 'inline-block';
      } else if (weekOffset === -1) {
        weekTag.textContent = 'Last Week';
        weekTag.className = 'week-pill past-week-pill';
        weekTag.style.display = 'inline-block';
      } else {
        weekTag.textContent = weekOffset > 1 ? `+${weekOffset} Weeks Ahead` : `${weekOffset} Weeks Ago`;
        weekTag.className = 'week-pill past-week-pill';
        weekTag.style.display = 'inline-block';
      }
    }

    // Update each day's date
    const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    dayKeys.forEach((key, idx) => {
      const el = document.getElementById(`day-date-${key}`);
      if (el) {
        const curDate = new Date(monday);
        curDate.setDate(monday.getDate() + idx);
        el.textContent = curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    });

    // Update "For Next Week" bottom module card date range badge
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    const nextWeekDateEl = document.getElementById('nextWeekDateText');
    const nextWeekDateBadge = document.getElementById('nextWeekDateBadge');
    if (nextWeekDateEl) {
      const nextRangeStr = `${fmt(nextMonday)} – ${fmt(nextSunday)}`;
      nextWeekDateEl.textContent = nextRangeStr;
      if (nextWeekDateBadge) {
        nextWeekDateBadge.setAttribute('title', `Next Week: ${nextRangeStr}, ${nextSunday.getFullYear()} (Click to open full week)`);
      }
    }
  }

  // Donut Meter Computation
  function updateDonut(target, dayObjFallback = null) {
    let card = null;
    let dObj = dayObjFallback;

    if (typeof target === 'string') {
      card = document.getElementById(`card-${target}`) ||
        document.getElementById(`card-w${weekOffset}-${target}`) ||
        document.getElementById(target);
      if (!dObj && plannerData && plannerData.days) {
        dObj = plannerData.days.find(d => d.id === target) ||
          (card ? plannerData.days.find(d => d.id === card.getAttribute('data-day-id')) : null);
      }
    } else if (target && target.nodeType) {
      card = target;
    }

    if (!dObj && typeof target === 'string') {
      const match = target.match(/^w(-?\d+)-([a-z]+)$/);
      if (match) {
        const wOff = parseInt(match[1], 10);
        const dId = match[2];
        const wData = getWeekData(wOff);
        dObj = dObj || (wData && wData.days ? wData.days.find(d => d.id === dId) : null);
      }
    }

    if (!dObj && typeof target === 'string' && plannerData && plannerData.days) {
      dObj = plannerData.days.find(d => d.id === target);
    }
    if (!dObj) return;

    const total = dObj.tasks ? dObj.tasks.length : 0;
    const done = dObj.tasks ? dObj.tasks.filter(t => t.completed).length : 0;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    const strokeOffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

    if (card) {
      const arc = card.querySelector('.donut-val-arc');
      const num = card.querySelector('.donut-percent-num');
      const wrap = card.querySelector('.donut-meter-wrap');
      if (arc) arc.style.strokeDashoffset = strokeOffset;
      if (num) num.textContent = `${pct}%`;
      if (wrap) wrap.setAttribute('aria-label', `${dObj.name} progress: ${pct}%`);
    } else {
      const arc = document.getElementById(`donut-arc-${target}`);
      const num = document.getElementById(`donut-num-${target}`);
      if (arc) arc.style.strokeDashoffset = strokeOffset;
      if (num) num.textContent = `${pct}%`;
    }
  }

  // Interactive Controls for SaaS Dashboard in index.html
  function setupDashboardInteractive() {
    const dashView = document.getElementById('viewDashboard');
    if (!dashView) return;
    if (dashView._interactiveInitDone) return;
    dashView._interactiveInitDone = true;

    // Tabs
    dashView.querySelectorAll('.dash-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        dashView.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-tab') || tab.textContent.trim();
        showToast(`Switched to ${tabName}`);
      });
    });

    // Theme Switch
    dashView.querySelectorAll('.dash-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dashView.querySelectorAll('.dash-theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.textContent.trim();
        showToast(`Theme: ${mode} mode`);
      });
    });

    // Day Columns
    dashView.querySelectorAll('.dash-day-col').forEach(col => {
      col.addEventListener('click', () => {
        dashView.querySelectorAll('.dash-day-col').forEach(c => c.classList.remove('active'));
        col.classList.add('active');
        const day = col.querySelector('.dash-day-name')?.textContent || '';
        const num = col.querySelector('.dash-day-num')?.textContent || '';
        showToast(`Selected date: ${day} May ${num}`);
      });
    });

    // View Toggles (List vs Kanban)
    dashView.querySelectorAll('.dash-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dashView.querySelectorAll('.dash-view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const title = btn.getAttribute('title') || 'View';
        showToast(`Switched to ${title}`);
      });
    });

    // Action buttons
    dashView.querySelector('.dash-export-btn')?.addEventListener('click', () => {
      showToast('Exporting dashboard data...');
    });
    dashView.querySelector('.dash-add-board-btn')?.addEventListener('click', () => {
      showToast('Create new board');
    });
    dashView.querySelector('.dash-premium-btn')?.addEventListener('click', () => {
      showToast('Premium features unlocked!');
    });
    dashView.querySelector('.dash-btn-check')?.addEventListener('click', () => {
      showToast('UX/UI Design assignments checked');
    });
    dashView.querySelector('.dash-add-assign-btn')?.addEventListener('click', () => {
      showToast('New assignment added');
    });
    dashView.querySelector('.dash-btn-pill-gray')?.addEventListener('click', () => {
      showToast('Meeting rescheduled');
    });
    dashView.querySelector('.dash-btn-pill-purple')?.addEventListener('click', () => {
      showToast('Meeting invite accepted!');
    });
  }

  // Live Dashboard Overview Metrics
  function updateDashboardView() {
    setupDashboardInteractive();
    try {
      // 1. Planner Data (Tasks & Habits)
      let tasksTotal = 0;
      let tasksDone = 0;
      let habitsDone = 0;

      if (plannerData && Array.isArray(plannerData.days)) {
        plannerData.days.forEach(day => {
          if (Array.isArray(day.tasks)) {
            tasksTotal += day.tasks.length;
            tasksDone += day.tasks.filter(t => t.completed).length;
          }
        });
      }
      if (plannerData && Array.isArray(plannerData.habits)) {
        plannerData.habits.forEach(h => {
          if (Array.isArray(h.days)) {
            habitsDone += h.days.filter(Boolean).length;
          }
        });
      }

      const taskPct = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;
      const tasksEl = document.getElementById('dashTasksStat');
      const taskPctEl = document.getElementById('dashTaskPct');
      const habitsEl = document.getElementById('dashHabitsStat');

      if (tasksEl) tasksEl.textContent = `${tasksDone}/${tasksTotal}`;
      if (taskPctEl) taskPctEl.textContent = `${taskPct}% completed`;
      if (habitsEl) habitsEl.textContent = `${habitsDone} checkins`;

      // 2. Gym Data
      let gymTotal = 0;
      let gymDone = 0;
      const gData = gymData || (() => {
        try {
          const raw = localStorage.getItem('digital_weekly_planner_gym_v2');
          return raw ? JSON.parse(raw) : null;
        } catch (e) {
          return null;
        }
      })();

      if (gData && gData.days) {
        Object.values(gData.days).forEach(d => {
          if (Array.isArray(d.exercises)) {
            gymTotal += d.exercises.length;
            gymDone += d.exercises.filter(e => e.completed).length;
          }
        });
      }
      const gymStatEl = document.getElementById('dashGymStat');
      if (gymStatEl) gymStatEl.textContent = `${gymDone}/${gymTotal} exercises`;

      // 3. Money Data
      const moneyRaw = localStorage.getItem('digital_weekly_planner_money_v1');
      let netBalance = 0;
      if (moneyRaw) {
        try {
          const parsedMoney = JSON.parse(moneyRaw);
          if (Array.isArray(parsedMoney.transactions)) {
            parsedMoney.transactions.forEach(t => {
              const amt = parseFloat(t.amount) || 0;
              if (t.type === 'income') netBalance += amt;
              else netBalance -= amt;
            });
          }
        } catch (err) { }
      }
      const moneyStatEl = document.getElementById('dashMoneyStat');
      if (moneyStatEl) moneyStatEl.textContent = `₹${netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    } catch (e) {
      console.warn('Dashboard view update error:', e);
    }
  }

  // Overall Week Completion
  function updateGlobalMetrics() {
    let total = 0;
    let done = 0;

    plannerData.days.forEach(day => {
      total += day.tasks.length;
      done += day.tasks.filter(t => t.completed).length;
    });

    total += plannerData.priorities.length;
    done += plannerData.priorities.filter(p => p.completed).length;

    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    const statVal = document.getElementById('overallStat');
    const fillBar = document.getElementById('overallBarFill');

    if (statVal) {
      statVal.textContent = `${pct}% (${done}/${total})`;
    }
    if (fillBar) {
      fillBar.style.width = `${pct}%`;
    }

    const pBadge = document.getElementById('prioritiesBadge');
    if (pBadge) {
      const pDone = plannerData.priorities.filter(p => p.completed).length;
      pBadge.textContent = `${pDone}/${plannerData.priorities.length}`;
    }

    const nwBadge = document.getElementById('nextWeekBadge');
    if (nwBadge) {
      const nwDone = plannerData.nextWeek.filter(n => n.completed).length;
      nwBadge.textContent = `${nwDone}/${plannerData.nextWeek.length}`;
    }

    updateDashboardView();
  }

  // --------------------------------------------------------------------------
  // Infinite Date Carousel & Day Columns Engine
  // --------------------------------------------------------------------------

  // Helper: Find card closest to horizontal center of container (Layout-thrash free)
  function getCenterCard() {
    const container = document.getElementById('daysContainer');
    if (!container) return null;
    const cards = container.querySelectorAll('.day-column-card');
    if (!cards.length) return null;

    // Fast-path: calculate relative to scroll coordinates without forcing viewport layout reflow
    const isDirectOffset = cards[0].offsetParent === container;
    const targetCenterX = isDirectOffset
      ? container.scrollLeft + (container.clientWidth / 2)
      : (container.getBoundingClientRect().left + container.clientWidth / 2);

    let closestCard = null;
    let minDistance = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardCenterX = isDirectOffset
        ? card.offsetLeft + (card.offsetWidth / 2)
        : (card.getBoundingClientRect().left + card.offsetWidth / 2);
      const dist = Math.abs(cardCenterX - targetCenterX);
      if (dist < minDistance) {
        minDistance = dist;
        closestCard = card;
      }
    }

    return closestCard;
  }

  // Build a Task Row (multi-week capable with auto-persistence)
  function buildTaskRow(dayId, task, offset, cardUid, dayObj) {
    const row = document.createElement('div');
    row.className = `task-row-item ${task.completed ? 'done' : ''}`;
    row.id = `task-row-${task.id}`;

    const timeHtml = task.time
      ? `<span class="task-time-badge" title="Scheduled time: ${escapeMarkup(task.time)} (Click to edit)">${escapeMarkup(task.time)}</span>`
      : '';

    row.innerHTML = `
      <input type="checkbox" class="square-check" id="chk-${task.id}" ${task.completed ? 'checked' : ''} aria-label="${escapeHtml(task.text)}">
      <span class="task-label-text" title="Click to edit">${escapeMarkup(task.text)}</span>
      <div class="hover-actions-bar no-print">
        <button class="act-btn edit-act" title="Edit task" aria-label="Edit">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </button>
        <button class="act-btn delete-act" title="Delete task" aria-label="Delete">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      ${timeHtml}
    `;

    const chk = row.querySelector('.square-check');
    chk.addEventListener('change', () => {
      task.completed = chk.checked;
      if (task.completed) {
        row.classList.add('done');
        playTickSound();
      } else {
        row.classList.remove('done');
        playTickSound();
      }
      if (offset === weekOffset) {
        persistData();
        updateGlobalMetrics();
      } else {
        const wData = getWeekData(offset);
        saveWeekData(offset, wData);
      }
      updateDonut(cardUid, dayObj);
    });

    const lbl = row.querySelector('.task-label-text');
    const timeBadge = row.querySelector('.task-time-badge');
    const editBtn = row.querySelector('.edit-act');
    const delBtn = row.querySelector('.delete-act');

    // Slide card to center first if inactive, then allow edit/delete
    const handleTaskActionOrCenter = (actionFn) => {
      if (activeCardUid !== cardUid) {
        setActiveCard(cardUid, true, 'smooth');
        setTimeout(() => {
          if (weekOffset !== offset) {
            switchWeek(offset, false);
          }
          actionFn();
        }, 280);
        return;
      }
      if (weekOffset !== offset) {
        switchWeek(offset, false);
      }
      actionFn();
    };

    const startEdit = () => {
      handleTaskActionOrCenter(() => {
        openDialog('day', dayId, task.id, task.text, task.time);
      });
    };

    lbl.addEventListener('click', startEdit);
    timeBadge?.addEventListener('click', startEdit);
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startEdit();
    });

    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleTaskActionOrCenter(() => {
        const wData = (offset === weekOffset) ? plannerData : getWeekData(offset);
        const dObj = wData && wData.days ? wData.days.find(d => d.id === dayId) : null;
        if (dObj) {
          dObj.tasks = dObj.tasks.filter(t => t.id !== task.id);
          row.remove();
          if (offset === weekOffset) {
            persistData();
            updateGlobalMetrics();
          } else {
            saveWeekData(offset, wData);
          }
          updateDonut(cardUid, dObj);
          showToast('Task removed');
        }
      });
    });

    return row;
  }

  // Render Continuous Infinite Date Carousel
  function renderDays() {
    const container = document.getElementById('daysContainer');
    if (!container) return;

    // Ensure Today is initialized as active on default load
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayKey = dayKeys[new Date().getDay()];
    if (!activeCardUid) {
      activeDayId = (weekOffset === 0 && todayKey) ? todayKey : 'mon';
      activeCardUid = `w${weekOffset}-${activeDayId}`;
    }

    renderDaysCardsOnly();
    setupDaysDragAndSlide();
    applyMobileDayFilter(currentMobileDayFilter);

    // Initial center alignment of Today / active card
    setTimeout(() => {
      scrollActiveCardIntoCenter(activeCardUid, 'auto');
      updateSliderNavButtons();
      const activeCardEl = document.getElementById(`card-${activeCardUid}`) || getCenterCard();
      if (activeCardEl) {
        const mYear = activeCardEl.getAttribute('data-month-year');
        if (mYear) {
          syncActiveMonth(mYear, activeCardEl);
        }
      }
    }, 60);
  }

  // Active month tracking for automatic month transitions
  let currentActiveMonth = null;

  // Global drag state tracker to keep mouse drag continuous across week shifts
  const dragState = {
    isDown: false,
    startX: 0,
    scrollStartLeft: 0,
    hasMoved: false
  };

  // Populates the 5-week window cards into the container (35 consecutive days)
  function renderDaysCardsOnly() {
    const container = document.getElementById('daysContainer');
    if (!container) return;
    const fragment = document.createDocumentFragment();

    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    const dayOrderMap = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };

    // Render 5 consecutive weeks: [visibleBaseWeek - 2, visibleBaseWeek - 1, visibleBaseWeek, visibleBaseWeek + 1, visibleBaseWeek + 2]
    // 35 consecutive days provides a generous runway with seamless infinite navigation
    const weeksToRender = [
      visibleBaseWeek - 2,
      visibleBaseWeek - 1,
      visibleBaseWeek,
      visibleBaseWeek + 1,
      visibleBaseWeek + 2
    ];

    weeksToRender.forEach(offset => {
      const wData = getWeekData(offset);
      const monday = getMondayOfWeek(now, offset);

      (wData.days || []).forEach(day => {
        const total = day.tasks ? day.tasks.length : 0;
        const done = day.tasks ? day.tasks.filter(t => t.completed).length : 0;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        const strokeOffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

        const dayOffset = dayOrderMap[day.id] !== undefined ? dayOrderMap[day.id] : 0;
        const curDate = new Date(monday);
        curDate.setDate(monday.getDate() + dayOffset);

        const dayNum = curDate.getDate();
        const monthShort = curDate.toLocaleDateString('en-US', { month: 'short' });
        const monthName = curDate.toLocaleDateString('en-US', { month: 'long' });
        const yearNum = curDate.getFullYear();
        const fullDateStr = `${dayNum}-${monthShort} ${yearNum}`;
        const dayDateStr = curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const monthYearStr = `${monthName} ${yearNum}`;
        const isFirstOfMonth = curDate.getDate() === 1;
        const lastDayOfCurMonth = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0).getDate();
        const isLastOfMonth = curDate.getDate() === lastDayOfCurMonth;
        const dateIso = `${curDate.getFullYear()}-${String(curDate.getMonth() + 1).padStart(2, '0')}-${String(curDate.getDate()).padStart(2, '0')}`;

        const isToday = (
          curDate.getDate() === todayDate &&
          curDate.getMonth() === todayMonth &&
          curDate.getFullYear() === todayYear
        );

        const cardUid = `w${offset}-${day.id}`;
        const isActive = (cardUid === activeCardUid);

        const card = document.createElement('article');
        card.className = `day-column-card col-${day.colorKey}${isToday ? ' is-today-card' : ''}${isActive ? ' is-active-card' : ''}`;
        card.id = `card-${cardUid}`;
        card.setAttribute('data-card-uid', cardUid);
        card.setAttribute('data-week-offset', offset);
        card.setAttribute('data-day-id', day.id);
        card.setAttribute('data-date', dateIso);
        card.setAttribute('data-full-date', fullDateStr);
        card.setAttribute('data-short-date', dayDateStr);
        card.setAttribute('data-month-year', monthYearStr);
        card.setAttribute('data-month-short', monthShort);
        card.setAttribute('data-day-num', curDate.getDate());
        card.setAttribute('data-is-first-of-month', isFirstOfMonth ? 'true' : 'false');
        card.setAttribute('data-is-last-of-month', isLastOfMonth ? 'true' : 'false');
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'region');
        card.setAttribute('aria-label', `${day.name} schedule (${fullDateStr}, ${monthYearStr})`);
        card.setAttribute('aria-current', isActive ? 'true' : 'false');

        card.innerHTML = `
          <header class="day-column-header">
            <div class="day-header-info">
              <span class="day-title-text">${day.name}</span>
              <span class="day-date-sub" id="day-date-${cardUid}">${isActive ? fullDateStr : dayDateStr}</span>
            </div>

            ${isToday ? `<div class="today-badge-wrap"><span class="today-badge-chip">TODAY</span></div>` : ''}
            ${isFirstOfMonth && !isToday ? `<div class="month-start-wrap"><span class="month-start-chip">${monthShort.toUpperCase()} 1 · NEW MONTH</span></div>` : ''}
            ${isLastOfMonth && !isToday ? `<div class="month-end-wrap"><span class="month-end-chip">END OF ${monthShort.toUpperCase()}</span></div>` : ''}

            <div class="donut-meter-wrap" aria-label="${day.name} progress: ${pct}%">
              <svg class="donut-svg-meter" viewBox="0 0 60 60" aria-hidden="true">
                <circle class="donut-bg-track" cx="30" cy="30" r="${RADIUS}"></circle>
                <circle class="donut-val-arc" id="donut-arc-${cardUid}" cx="30" cy="30" r="${RADIUS}" style="stroke-dashoffset: ${strokeOffset};"></circle>
              </svg>
              <span class="donut-percent-num" id="donut-num-${cardUid}">${pct}%</span>
            </div>
          </header>

          <div class="day-tasks-container" id="tasks-list-${cardUid}">
            <!-- Tasks injected here -->
          </div>

          <div class="day-column-footer no-print">
            <button class="quick-add-task-btn" data-card-uid="${cardUid}" data-day="${day.id}" data-week-offset="${offset}">
              <span>+ Add Task</span>
            </button>
          </div>
        `;

        // Click card to activate and expand into center
        card.addEventListener('click', (e) => {
          if (e.target.closest('.square-check') || e.target.closest('.act-btn') || e.target.closest('.quick-add-task-btn')) {
            return;
          }
          if (activeCardUid !== cardUid) {
            setActiveCard(cardUid, true, 'smooth');
          }
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (activeCardUid !== cardUid) {
              e.preventDefault();
              setActiveCard(cardUid, true, 'smooth');
            }
          }
        });

        const tasksList = card.querySelector(`#tasks-list-${cardUid}`);
        const tasksFrag = document.createDocumentFragment();
        (day.tasks || []).forEach(task => {
          tasksFrag.appendChild(buildTaskRow(day.id, task, offset, cardUid, day));
        });
        tasksList.appendChild(tasksFrag);

        fragment.appendChild(card);
      });
    });

    container.innerHTML = '';
    container.appendChild(fragment);

    // Wire quick add buttons
    container.querySelectorAll('.quick-add-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cUid = btn.getAttribute('data-card-uid');
        const dId = btn.getAttribute('data-day');
        const wOff = parseInt(btn.getAttribute('data-week-offset'), 10);

        if (activeCardUid !== cUid) {
          setActiveCard(cUid, true, 'smooth');
          setTimeout(() => {
            if (weekOffset !== wOff) {
              switchWeek(wOff, false);
            }
            openDialog('day', dId);
          }, 280);
        } else {
          if (weekOffset !== wOff) {
            switchWeek(wOff, false);
          }
          openDialog('day', dId);
        }
      });
    });
  }

  // Synchronize Active Month Display and trigger month jump pulse
  function syncActiveMonth(monthYear, cardEl) {
    if (!monthYear) return;

    // Update active month title text
    const titleEl = document.getElementById('sliderActiveMonthTitle');
    if (titleEl && titleEl.textContent !== monthYear) {
      titleEl.textContent = monthYear;
    }

    // Update Prev / Next month button labels
    const match = monthYear.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const curMonthIdx = monthNames.indexOf(match[1]);
      if (curMonthIdx !== -1) {
        const prevIdx = (curMonthIdx - 1 + 12) % 12;
        const nextIdx = (curMonthIdx + 1) % 12;
        const prevLabel = document.getElementById('sliderPrevMonthLabel');
        const nextLabel = document.getElementById('sliderNextMonthLabel');
        if (prevLabel) prevLabel.textContent = monthNames[prevIdx].slice(0, 3);
        if (nextLabel) nextLabel.textContent = monthNames[nextIdx].slice(0, 3);
      }
    }

    // Trigger visual pulse & toast on month transition
    if (currentActiveMonth && currentActiveMonth !== monthYear) {
      const badge = document.getElementById('sliderCurrentMonthBadge');
      if (badge) {
        badge.classList.remove('month-jump-pulse');
        void badge.offsetWidth; // trigger reflow
        badge.classList.add('month-jump-pulse');
        setTimeout(() => badge.classList.remove('month-jump-pulse'), 700);
      }
      showToast(`Jumped to ${monthYear}`);
    }

    currentActiveMonth = monthYear;
  }

  // Set active center card with smooth width morphing & neighbor shift
  function setActiveCard(cardUid, shouldScroll = true, scrollBehavior = 'smooth') {
    if (!cardUid) return;
    activeCardUid = cardUid;

    let activeCardEl = null;
    const cards = document.querySelectorAll('.day-column-card');
    cards.forEach(card => {
      const cUid = card.getAttribute('data-card-uid');
      const isAct = (cUid === cardUid);
      card.classList.toggle('is-active-card', isAct);
      card.setAttribute('aria-current', isAct ? 'true' : 'false');

      const dateEl = card.querySelector('.day-date-sub');
      if (dateEl) {
        const fullDate = card.getAttribute('data-full-date');
        const shortDate = card.getAttribute('data-short-date');
        if (isAct && fullDate) {
          dateEl.textContent = fullDate;
        } else if (!isAct && shortDate) {
          dateEl.textContent = shortDate;
        }
      }

      if (isAct) activeCardEl = card;
    });

    updateSliderNavButtons();

    // Check month transition on active card
    if (activeCardEl) {
      const cardMonthYear = activeCardEl.getAttribute('data-month-year');
      if (cardMonthYear) {
        syncActiveMonth(cardMonthYear, activeCardEl);
      }
    }

    // Parse week offset and day from cardUid (e.g. "w0-tue" or "w-1-mon")
    const match = cardUid.match(/^w(-?\d+)-([a-z]+)$/);
    if (match) {
      const cardWeek = parseInt(match[1], 10);
      const cardDay = match[2];
      activeDayId = cardDay;

      // Sync active week if changed
      if (cardWeek !== weekOffset) {
        weekOffset = cardWeek;
        plannerData = getWeekData(weekOffset);
        updateDates();
        updateGlobalMetrics();
        renderHabits();
        renderPriorities();
        renderNotes();
        renderNextWeek();
      }
    }

    if (shouldScroll) {
      scrollActiveCardIntoCenter(cardUid, scrollBehavior);
    }
  }

  // Compatibility wrapper for day ID calls
  function setActiveDay(dayId, shouldScroll = true, scrollBehavior = 'smooth') {
    if (!dayId) return;
    const uid = `w${weekOffset}-${dayId}`;
    const cardEl = document.getElementById(`card-${uid}`);
    if (cardEl) {
      setActiveCard(uid, shouldScroll, scrollBehavior);
    } else {
      activeDayId = dayId;
      activeCardUid = uid;
      if (shouldScroll) {
        scrollActiveCardIntoCenter(dayId, scrollBehavior);
      }
    }
  }

  // Smooth centering of active card within horizontal slider
  function scrollActiveCardIntoCenter(target, scrollBehavior = 'smooth') {
    const container = document.getElementById('daysContainer');
    if (!container) return;

    let activeCard = null;
    if (typeof target === 'string') {
      activeCard = document.getElementById(`card-${target}`) ||
        document.getElementById(`card-w${weekOffset}-${target}`) ||
        document.getElementById(target);
    } else if (target && target.nodeType) {
      activeCard = target;
    }
    if (!activeCard) return;

    const doCenterScroll = (behavior) => {
      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;
      const cardLeft = activeCard.offsetLeft;
      const cardWidth = activeCard.offsetWidth;
      const targetScroll = cardLeft - (containerWidth / 2) + (cardWidth / 2);

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: behavior
      });
    };

    if (scrollBehavior === 'auto') {
      requestAnimationFrame(() => doCenterScroll('auto'));
    } else {
      requestAnimationFrame(() => doCenterScroll('smooth'));
    }
  }

  // Shift visible weeks window with sub-pixel anchor scroll compensation
  function shiftVisibleWeeks(delta) {
    const container = document.getElementById('daysContainer');
    if (!container) return;

    // 1. Identify active or center anchor card before re-render
    const anchorCard = document.getElementById(`card-${activeCardUid}`) || getCenterCard();
    if (!anchorCard) return;
    const anchorOffsetBefore = anchorCard.offsetLeft;
    const prevScrollLeft = container.scrollLeft;

    // 2. Temporarily disable smooth scroll behavior to prevent animation collision
    const origScrollBehavior = container.style.scrollBehavior;
    container.style.scrollBehavior = 'auto';

    // 3. Shift the base week and rebuild cards
    visibleBaseWeek += delta;
    renderDaysCardsOnly();

    // 4. Find the same anchor card after re-render and compensate scroll
    const anchorCardAfter = document.getElementById(`card-${activeCardUid}`) || getCenterCard();
    if (anchorCardAfter) {
      const anchorOffsetAfter = anchorCardAfter.offsetLeft;
      const offsetDiff = anchorOffsetAfter - anchorOffsetBefore;
      const targetScroll = prevScrollLeft + offsetDiff;
      container.scrollLeft = Math.max(0, targetScroll);

      // If mouse dragging is active, adjust scrollStartLeft so dragging doesn't jump
      if (dragState.isDown) {
        dragState.scrollStartLeft += offsetDiff;
      }
    }

    // 5. Restore original scroll behavior on next frame
    requestAnimationFrame(() => {
      container.style.scrollBehavior = origScrollBehavior || '';
    });
  }

  // Step card forward (+1) or backward (-1) infinitely across days and months
  function stepCard(direction = 1) {
    const container = document.getElementById('daysContainer');
    if (!container) return;
    const cards = Array.from(container.querySelectorAll('.day-column-card'));
    if (!cards.length) return;

    let curIdx = cards.findIndex(c => c.getAttribute('data-card-uid') === activeCardUid);
    if (curIdx === -1) {
      const center = getCenterCard();
      curIdx = center ? cards.indexOf(center) : Math.floor(cards.length / 2);
    }

    const nextIdx = curIdx + direction;

    // Approaching edge of 35-card runway (within 7 cards of either end)
    if (nextIdx >= cards.length - 7 || nextIdx <= 6) {
      shiftVisibleWeeks(direction > 0 ? 1 : -1);
      const updatedCards = Array.from(container.querySelectorAll('.day-column-card'));
      const newActiveIdx = updatedCards.findIndex(c => c.getAttribute('data-card-uid') === activeCardUid);
      const targetIdx = (newActiveIdx !== -1 ? newActiveIdx : curIdx) + direction;
      if (targetIdx >= 0 && targetIdx < updatedCards.length) {
        setActiveCard(updatedCards[targetIdx].getAttribute('data-card-uid'), true, 'smooth');
      }
      return;
    }

    if (nextIdx >= 0 && nextIdx < cards.length) {
      setActiveCard(cards[nextIdx].getAttribute('data-card-uid'), true, 'smooth');
    }
  }

  function stepDay(direction = 1) {
    stepCard(direction);
  }

  // Direct Jump to Next (+1) or Previous (-1) Month
  function jumpToMonth(direction = 1) {
    const activeCardEl = document.getElementById(`card-${activeCardUid}`) || getCenterCard();
    let curDate = new Date();
    if (activeCardEl && activeCardEl.getAttribute('data-date')) {
      const parts = activeCardEl.getAttribute('data-date').split('-');
      if (parts.length === 3) {
        curDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }

    // Target is 1st day of next or previous month
    const targetDate = new Date(curDate.getFullYear(), curDate.getMonth() + direction, 1);
    const targetOffset = getWeekOffsetForDate(targetDate);
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const targetDayKey = dayKeys[targetDate.getDay()];
    const targetCardUid = `w${targetOffset}-${targetDayKey}`;

    // If target offset is outside our 5-week window, re-anchor visibleBaseWeek
    if (targetOffset < visibleBaseWeek - 1 || targetOffset > visibleBaseWeek + 1) {
      visibleBaseWeek = targetOffset;
      renderDaysCardsOnly();
    }

    setActiveCard(targetCardUid, true, 'smooth');
  }

  // Update slider prev/next buttons (Always active & enabled in infinite carousel)
  function updateSliderNavButtons() {
    const prevBtn = document.getElementById('sliderPrevDayBtn');
    const nextBtn = document.getElementById('sliderNextDayBtn');
    if (prevBtn) {
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
      prevBtn.removeAttribute('disabled');
      prevBtn.setAttribute('title', 'Previous day (continuous carousel)');
    }
    if (nextBtn) {
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
      nextBtn.removeAttribute('disabled');
      nextBtn.setAttribute('title', 'Next day (continuous carousel)');
    }
  }

  // Jump to Today (current week, centered, expanded)
  function jumpToToday() {
    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayKey = dayKeys[new Date().getDay()];
    visibleBaseWeek = 0;
    weekOffset = 0;
    plannerData = getWeekData(0);
    activeDayId = todayKey || 'mon';
    activeCardUid = `w0-${activeDayId}`;

    renderDaysCardsOnly();
    scrollActiveCardIntoCenter(activeCardUid, 'smooth');
    updateDates();
    updateGlobalMetrics();
    renderHabits();
    renderPriorities();
    renderNotes();
    renderNextWeek();
    showToast('Jumped to Today (Current Week)');
  }

  // Smooth Drag & Slide Width Morphing Controller with Infinite Runway
  function setupDaysDragAndSlide() {
    const container = document.getElementById('daysContainer');
    if (!container || isSliderWired) return;
    isSliderWired = true;

    // Prev / Next day button clicks (infinite stepping)
    document.getElementById('sliderPrevDayBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      stepCard(-1);
    });
    document.getElementById('sliderNextDayBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      stepCard(1);
    });

    // Month Navigation & Today Jump buttons
    document.getElementById('sliderPrevMonthBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      jumpToMonth(-1);
    });
    document.getElementById('sliderNextMonthBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      jumpToMonth(1);
    });
    document.getElementById('sliderTodayJumpBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      jumpToToday();
    });

    let checkMorphThrottle = null;
    function checkAndMorphActiveCard(shouldScroll = false) {
      const centerCard = getCenterCard();
      if (centerCard) {
        const cUid = centerCard.getAttribute('data-card-uid');
        if (cUid && cUid !== activeCardUid) {
          setActiveCard(cUid, shouldScroll, 'smooth');
        }
      }
    }

    // Infinite runway checker when scrolling near edges
    function checkEdgeRunway() {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      if (container.scrollLeft > maxScroll - 600) {
        shiftVisibleWeeks(1);
      } else if (container.scrollLeft < 600) {
        shiftVisibleWeeks(-1);
      }
    }

    // Native scroll listener with RAF throttle (Handles trackpad, mousewheel & momentum scroll)
    let isScrollTicking = false;
    container.addEventListener('scroll', () => {
      if (!isScrollTicking) {
        isScrollTicking = true;
        requestAnimationFrame(() => {
          isScrollTicking = false;
          checkAndMorphActiveCard(false);
          checkEdgeRunway();
        });
      }
    }, { passive: true });

    // Mouse drag handling with sub-pixel preservation
    let lastDragTime = 0;
    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.square-check') || e.target.closest('.act-btn') || e.target.closest('.quick-add-task-btn') || e.target.closest('input')) {
        return;
      }
      dragState.isDown = true;
      dragState.hasMoved = false;
      dragState.startX = e.pageX;
      dragState.scrollStartLeft = container.scrollLeft;
      container.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragState.isDown) return;
      const deltaX = e.pageX - dragState.startX;
      if (Math.abs(deltaX) > 6) {
        dragState.hasMoved = true;
      }
      container.scrollLeft = dragState.scrollStartLeft - deltaX;

      const now = Date.now();
      if (now - lastDragTime > 60) {
        lastDragTime = now;
        checkAndMorphActiveCard(false);
        checkEdgeRunway();
      }
    });

    const finishDrag = () => {
      if (!dragState.isDown) return;
      dragState.isDown = false;
      container.classList.remove('is-dragging');

      if (dragState.hasMoved) {
        const centerCard = getCenterCard();
        if (centerCard) {
          const cUid = centerCard.getAttribute('data-card-uid');
          setActiveCard(cUid, true, 'smooth');
        }
      }
    };

    window.addEventListener('mouseup', finishDrag);

    // Touch Swipe Support
    let touchStartX = 0;
    let touchMoved = false;

    container.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      if (e.target.closest('.square-check') || e.target.closest('.act-btn') || e.target.closest('.quick-add-task-btn') || e.target.closest('input')) {
        return;
      }
      touchMoved = false;
      touchStartX = e.touches[0].pageX;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const dist = Math.abs(e.touches[0].pageX - touchStartX);
      if (dist > 8) touchMoved = true;

      const now = Date.now();
      if (now - lastDragTime > 80) {
        lastDragTime = now;
        checkAndMorphActiveCard(false);
        checkEdgeRunway();
      }
    }, { passive: true });

    container.addEventListener('touchend', () => {
      if (touchMoved) {
        setTimeout(() => {
          const centerCard = getCenterCard();
          if (centerCard) {
            const cUid = centerCard.getAttribute('data-card-uid');
            setActiveCard(cUid, true, 'smooth');
          }
        }, 50);
      }
    });

    // Wheel horizontal scrolling / Trackpad swipe
    container.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        clearTimeout(checkMorphThrottle);
        checkMorphThrottle = setTimeout(() => {
          const centerCard = getCenterCard();
          if (centerCard) {
            const cUid = centerCard.getAttribute('data-card-uid');
            setActiveCard(cUid, true, 'smooth');
          }
          checkEdgeRunway();
        }, 120);
      }
    }, { passive: true });
  }

  // Filter single or all days on mobile screen
  function applyMobileDayFilter(filterDay) {
    currentMobileDayFilter = filterDay || 'all';
    document.querySelectorAll('.day-filter-btn').forEach(btn => {
      const match = btn.getAttribute('data-day') === currentMobileDayFilter;
      btn.classList.toggle('active', match);
    });

    if (currentMobileDayFilter !== 'all') {
      const container = document.getElementById('daysContainer');
      if (container) {
        const targetCard = Array.from(container.querySelectorAll('.day-column-card')).find(c =>
          c.getAttribute('data-day-id') === currentMobileDayFilter && c.getAttribute('data-week-offset') === String(weekOffset)
        ) || Array.from(container.querySelectorAll('.day-column-card')).find(c =>
          c.getAttribute('data-day-id') === currentMobileDayFilter
        );
        if (targetCard) {
          setActiveCard(targetCard.getAttribute('data-card-uid'), true, 'smooth');
        }
      }
    }
  }

  function setupMobileDayFilter() {
    const filterButtons = document.querySelectorAll('.day-filter-btn');
    if (!filterButtons.length) return;

    const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayKey = dayKeys[new Date().getDay()];

    filterButtons.forEach(btn => {
      const d = btn.getAttribute('data-day');
      if (d === todayKey && !btn.querySelector('.today-pill-dot')) {
        const dot = document.createElement('span');
        dot.className = 'today-pill-dot';
        dot.title = 'Today';
        btn.appendChild(dot);
      }

      btn.addEventListener('click', (e) => {
        const targetDay = e.currentTarget.getAttribute('data-day') || 'all';
        applyMobileDayFilter(targetDay);
      });
    });

    applyMobileDayFilter(currentMobileDayFilter);
  }

  // Render Daily Habits
  function renderHabits() {
    const list = document.getElementById('habitsList');
    if (!list) return;
    const fragment = document.createDocumentFragment();

    plannerData.habits.forEach(habit => {
      const row = document.createElement('div');
      const allDone = habit.days.every(Boolean);
      row.className = `habit-matrix-row ${allDone ? 'all-checked' : ''}`;
      row.id = `habit-matrix-${habit.id}`;

      let checkInputs = '';
      const daySymbols = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      for (let i = 0; i < 7; i++) {
        const checked = !!habit.days[i];
        checkInputs += `
          <input type="checkbox" class="square-check habit-day-chk" data-habit="${habit.id}" data-day="${i}" ${checked ? 'checked' : ''} aria-label="${habit.text} - ${daySymbols[i]}">
        `;
      }

      row.innerHTML = `
        <div class="habit-text-wrap">
          <span class="habit-name" title="Click to edit">${escapeMarkup(habit.text)}</span>
          <div class="hover-actions-bar no-print">
            <button class="act-btn edit-act" title="Edit habit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="act-btn delete-act" title="Delete habit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
        <div class="habit-checks-group">
          ${checkInputs}
        </div>
      `;

      row.querySelectorAll('.habit-day-chk').forEach(c => {
        c.addEventListener('change', (e) => {
          const idx = parseInt(e.target.getAttribute('data-day'), 10);
          habit.days[idx] = e.target.checked;
          if (e.target.checked) triggerSound(true);

          if (habit.days.every(Boolean)) {
            row.classList.add('all-checked');
          } else {
            row.classList.remove('all-checked');
          }
          persistData();
        });
      });

      const nameEl = row.querySelector('.habit-name');
      const editBtn = row.querySelector('.edit-act');
      const startEdit = () => openDialog('habit', null, habit.id, habit.text);
      nameEl.addEventListener('click', startEdit);
      editBtn.addEventListener('click', startEdit);

      const delBtn = row.querySelector('.delete-act');
      delBtn.addEventListener('click', () => {
        plannerData.habits = plannerData.habits.filter(h => h.id !== habit.id);
        row.remove();
        persistData();
        showToast('Habit removed');
      });

      fragment.appendChild(row);
    });

    list.innerHTML = '';
    list.appendChild(fragment);
  }

  // Render Priorities
  function renderPriorities() {
    const list = document.getElementById('prioritiesList');
    if (!list) return;
    const fragment = document.createDocumentFragment();

    plannerData.priorities.forEach(priority => {
      const row = document.createElement('div');
      row.className = `task-row-item ${priority.completed ? 'done' : ''}`;
      row.id = `priority-row-${priority.id}`;

      const timeHtml = priority.time
        ? `<span class="task-time-badge" title="Scheduled time: ${escapeMarkup(priority.time)} (Click to edit)">${escapeMarkup(priority.time)}</span>`
        : '';

      row.innerHTML = `
        <input type="checkbox" class="square-check" ${priority.completed ? 'checked' : ''} aria-label="${escapeHtml(priority.text)}">
        <span class="task-label-text" title="Click to edit">${escapeMarkup(priority.text)}</span>
        <div class="hover-actions-bar no-print">
          <button class="act-btn edit-act" title="Edit priority">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="act-btn delete-act" title="Delete priority">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        ${timeHtml}
      `;

      const chk = row.querySelector('.square-check');
      chk.addEventListener('change', () => {
        priority.completed = chk.checked;
        if (priority.completed) {
          row.classList.add('done');
          triggerSound(true);
        } else {
          row.classList.remove('done');
          triggerSound(false);
        }
        persistData();
        updateGlobalMetrics();
      });

      const lbl = row.querySelector('.task-label-text');
      const timeBadge = row.querySelector('.task-time-badge');
      const editBtn = row.querySelector('.edit-act');
      const startEdit = () => openDialog('priority', null, priority.id, priority.text, priority.time);
      lbl.addEventListener('click', startEdit);
      timeBadge?.addEventListener('click', startEdit);
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startEdit();
      });

      const delBtn = row.querySelector('.delete-act');
      delBtn.addEventListener('click', () => {
        plannerData.priorities = plannerData.priorities.filter(p => p.id !== priority.id);
        row.remove();
        persistData();
        updateGlobalMetrics();
        showToast('Priority removed');
      });

      fragment.appendChild(row);
    });

    list.innerHTML = '';
    list.appendChild(fragment);
  }

  // Helper to format date string to "Oct. 26" style matching mockup
  function formatNoteDate(dateStr) {
    if (!dateStr) {
      const now = new Date();
      const m = now.toLocaleDateString('en-US', { month: 'short' });
      return `${m}. ${now.getDate()}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
      return `${monthName}. ${d}`;
    }
    return dateStr;
  }

  // Open Note Modal for Adding or Editing Note (With automatic today's date or custom date)
  function openNoteModal(noteId = null) {
    activeEditingNoteId = noteId;
    const modal = document.getElementById('noteModal');
    const titleInput = document.getElementById('noteInputTitle');
    const dateInput = document.getElementById('noteInputDate');
    const dateBadge = document.getElementById('noteModalDateBadge');
    const descTextarea = document.getElementById('noteInputDesc');
    if (!modal || !titleInput || !descTextarea) return;

    const now = new Date();
    const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (noteId) {
      const note = (plannerData.notes || []).find(n => n.id === noteId);
      if (note) {
        titleInput.value = note.title || note.text || '';
        const curDate = note.date || todayYMD;
        if (dateInput) dateInput.value = curDate;
        if (dateBadge) dateBadge.textContent = formatNoteDate(curDate);
        descTextarea.value = note.description || '';
      } else {
        titleInput.value = '';
        if (dateInput) dateInput.value = todayYMD;
        if (dateBadge) dateBadge.textContent = formatNoteDate(todayYMD);
        descTextarea.value = '';
      }
    } else {
      titleInput.value = '';
      // Automatic today's date for newly created notes
      if (dateInput) dateInput.value = todayYMD;
      if (dateBadge) dateBadge.textContent = formatNoteDate(todayYMD);
      descTextarea.value = '';
    }

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', 'true');
    }

    setTimeout(() => {
      titleInput.focus();
    }, 50);
  }

  function closeNoteModal() {
    const modal = document.getElementById('noteModal');
    if (modal) {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    }
    activeEditingNoteId = null;
  }

  // Render Notes (Lined note rows with custom/automatic date badge matching user reference screenshot)
  function renderNotes() {
    const list = document.getElementById('notesList');
    if (!list) return;

    if (!Array.isArray(plannerData.notes) || plannerData.notes.length === 0) {
      list.innerHTML = `
        <div class="empty-notes-hint" style="padding: 16px 8px; text-align: center; color: #94a3b8; font-size: 0.8rem; font-style: italic;">
          No notes yet. Click "+ Add Note" to create one.
        </div>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    plannerData.notes.forEach(note => {
      const row = document.createElement('div');
      row.className = 'note-row-item';
      row.id = `note-row-${note.id}`;
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('title', 'Click to view / edit note');

      const title = note.title || note.text || 'Untitled Note';
      const desc = note.description || '';
      const dateFormatted = note.dateFormatted || formatNoteDate(note.date);

      row.innerHTML = `
        <div class="note-row-left">
          <!-- 3-line note icon matching user reference screenshot -->
          <svg class="note-row-icon" width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
            <rect x="0" y="1" width="20" height="3" rx="0.5" fill="#0f172a"/>
            <rect x="0" y="6.5" width="20" height="3" rx="0.5" fill="#0f172a"/>
            <rect x="0" y="12" width="20" height="3" rx="0.5" fill="#0f172a"/>
            <line x1="4.5" y1="0" x2="4.5" y2="16" stroke="#ffffff" stroke-width="1.2"/>
            <line x1="15.5" y1="0" x2="15.5" y2="16" stroke="#ffffff" stroke-width="1.2"/>
          </svg>
          <div class="note-row-text-wrap">
            <span class="note-row-title">${escapeMarkup(title)}</span>
            ${desc ? `<p class="note-row-desc-preview">${escapeMarkup(desc)}</p>` : ''}
          </div>
        </div>
        <div class="note-row-right">
          <div class="hover-actions-bar no-print">
            <button type="button" class="act-btn edit-note-btn" title="Edit note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button type="button" class="act-btn delete-note-btn" title="Delete note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <span class="note-date-badge" title="Note Date: ${escapeMarkup(dateFormatted)}">${escapeMarkup(dateFormatted)}</span>
        </div>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.delete-note-btn')) {
          plannerData.notes = plannerData.notes.filter(n => n.id !== note.id);
          row.remove();
          persistData();
          showToast('Note deleted');
          if (plannerData.notes.length === 0) renderNotes();
          return;
        }
        openNoteModal(note.id);
      });

      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openNoteModal(note.id);
        }
      });

      fragment.appendChild(row);
    });

    list.innerHTML = '';
    list.appendChild(fragment);
  }

  // Render For Next Week
  function renderNextWeek() {
    const list = document.getElementById('nextWeekList');
    if (!list) return;
    const fragment = document.createDocumentFragment();

    plannerData.nextWeek.forEach(item => {
      const row = document.createElement('div');
      row.className = `task-row-item ${item.completed ? 'done' : ''}`;
      row.id = `next-week-${item.id}`;

      const timeHtml = item.time
        ? `<span class="task-time-badge" title="Scheduled time: ${escapeMarkup(item.time)} (Click to edit)">${escapeMarkup(item.time)}</span>`
        : '';

      row.innerHTML = `
        <input type="checkbox" class="square-check" ${item.completed ? 'checked' : ''} aria-label="${escapeHtml(item.text)}">
        <span class="task-label-text" title="Click to edit">${escapeMarkup(item.text)}</span>
        <div class="hover-actions-bar no-print">
          <button class="act-btn edit-act" title="Edit item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="act-btn delete-act" title="Delete item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        ${timeHtml}
      `;

      const chk = row.querySelector('.square-check');
      chk.addEventListener('change', () => {
        item.completed = chk.checked;
        if (item.completed) {
          row.classList.add('done');
          triggerSound(true);
        } else {
          row.classList.remove('done');
          triggerSound(false);
        }
        persistData();
        updateGlobalMetrics();
      });

      const lbl = row.querySelector('.task-label-text');
      const timeBadge = row.querySelector('.task-time-badge');
      const editBtn = row.querySelector('.edit-act');
      const startEdit = () => openDialog('nextWeek', null, item.id, item.text, item.time);
      lbl.addEventListener('click', startEdit);
      timeBadge?.addEventListener('click', startEdit);
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startEdit();
      });

      const delBtn = row.querySelector('.delete-act');
      delBtn.addEventListener('click', () => {
        plannerData.nextWeek = plannerData.nextWeek.filter(n => n.id !== item.id);
        row.remove();
        persistData();
        updateGlobalMetrics();
        showToast('Item removed');
      });

      fragment.appendChild(row);
    });

    list.innerHTML = '';
    list.appendChild(fragment);
  }

  // Interactive Scroll Wheel Time Picker Controller matching user mockup
  const timePicker = (() => {
    const ITEM_HEIGHT = 38;
    const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    let selectedHour = 10;
    let selectedMinute = 15;
    let selectedPeriod = 'AM';
    let isProgrammaticScroll = false;
    let hourDebounceTimer = null;
    let minuteDebounceTimer = null;

    let hourViewport = null;
    let hourList = null;
    let minuteViewport = null;
    let minuteList = null;
    let amBtn = null;
    let pmBtn = null;
    let displayVal = null;
    let hiddenInput = null;
    let hourUpBtn = null;
    let hourDownBtn = null;
    let minuteUpBtn = null;
    let minuteDownBtn = null;

    function init() {
      hourViewport = document.getElementById('hourWheelViewport');
      hourList = document.getElementById('hourWheelList');
      minuteViewport = document.getElementById('minuteWheelViewport');
      minuteList = document.getElementById('minuteWheelList');
      amBtn = document.getElementById('ampmBtnAM');
      pmBtn = document.getElementById('ampmBtnPM');
      displayVal = document.getElementById('timeDisplayVal');
      hiddenInput = document.getElementById('itemInputTime');
      hourUpBtn = document.getElementById('hourUpBtn');
      hourDownBtn = document.getElementById('hourDownBtn');
      minuteUpBtn = document.getElementById('minuteUpBtn');
      minuteDownBtn = document.getElementById('minuteDownBtn');

      if (!hourList || !minuteList) return;

      // Populate Hour Items (01 - 12)
      hourList.innerHTML = '';
      HOURS.forEach((h, idx) => {
        const item = document.createElement('div');
        item.className = 'time-wheel-item';
        item.dataset.index = idx;
        item.dataset.value = h;
        item.textContent = h;
        item.addEventListener('click', () => {
          scrollToHourIndex(idx, true);
          triggerSound(false);
        });
        hourList.appendChild(item);
      });

      // Populate Minute Items (00 - 59)
      minuteList.innerHTML = '';
      MINUTES.forEach((m, idx) => {
        const item = document.createElement('div');
        item.className = 'time-wheel-item';
        item.dataset.index = idx;
        item.dataset.value = m;
        item.textContent = m;
        item.addEventListener('click', () => {
          scrollToMinuteIndex(idx, true);
          triggerSound(false);
        });
        minuteList.appendChild(item);
      });

      // Scroll Event Listeners with live updating and smooth settling
      hourViewport?.addEventListener('scroll', () => {
        if (isProgrammaticScroll) return;
        handleHourScroll();
        clearTimeout(hourDebounceTimer);
        hourDebounceTimer = setTimeout(() => {
          handleHourScroll();
        }, 50);
      }, { passive: true });

      minuteViewport?.addEventListener('scroll', () => {
        if (isProgrammaticScroll) return;
        handleMinuteScroll();
        clearTimeout(minuteDebounceTimer);
        minuteDebounceTimer = setTimeout(() => {
          handleMinuteScroll();
        }, 50);
      }, { passive: true });

      // Chevrons Step (Up / Down)
      hourUpBtn?.addEventListener('click', () => {
        const curr = Math.round((hourViewport?.scrollTop || 0) / ITEM_HEIGHT);
        const next = curr > 0 ? curr - 1 : HOURS.length - 1;
        scrollToHourIndex(next, true);
        triggerSound(false);
      });

      hourDownBtn?.addEventListener('click', () => {
        const curr = Math.round((hourViewport?.scrollTop || 0) / ITEM_HEIGHT);
        const next = curr < HOURS.length - 1 ? curr + 1 : 0;
        scrollToHourIndex(next, true);
        triggerSound(false);
      });

      minuteUpBtn?.addEventListener('click', () => {
        const curr = Math.round((minuteViewport?.scrollTop || 0) / ITEM_HEIGHT);
        const next = curr > 0 ? curr - 1 : MINUTES.length - 1;
        scrollToMinuteIndex(next, true);
        triggerSound(false);
      });

      minuteDownBtn?.addEventListener('click', () => {
        const curr = Math.round((minuteViewport?.scrollTop || 0) / ITEM_HEIGHT);
        const next = curr < MINUTES.length - 1 ? curr + 1 : 0;
        scrollToMinuteIndex(next, true);
        triggerSound(false);
      });

      // AM / PM Button Click
      amBtn?.addEventListener('click', () => {
        setPeriod('AM');
        triggerSound(false);
      });

      pmBtn?.addEventListener('click', () => {
        setPeriod('PM');
        triggerSound(false);
      });

      // Mouse drag simulation for desktop
      enableDrag(hourViewport, (idx) => scrollToHourIndex(idx, true));
      enableDrag(minuteViewport, (idx) => scrollToMinuteIndex(idx, true));

      // Keyboard arrow navigation
      hourViewport?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); hourUpBtn?.click(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); hourDownBtn?.click(); }
      });
      minuteViewport?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); minuteUpBtn?.click(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); minuteDownBtn?.click(); }
      });
    }

    function enableDrag(viewport, onSnap) {
      if (!viewport) return;
      let isDown = false;
      let startY = 0;
      let startScrollTop = 0;

      viewport.addEventListener('mousedown', (e) => {
        isDown = true;
        startY = e.pageY;
        startScrollTop = viewport.scrollTop;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const delta = e.pageY - startY;
        viewport.scrollTop = startScrollTop - delta;
      });

      window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        const idx = Math.round(viewport.scrollTop / ITEM_HEIGHT);
        if (typeof onSnap === 'function') onSnap(idx);
      });
    }

    function handleHourScroll() {
      if (!hourViewport) return;
      const idx = Math.max(0, Math.min(HOURS.length - 1, Math.round(hourViewport.scrollTop / ITEM_HEIGHT)));
      selectedHour = parseInt(HOURS[idx], 10);
      updateHourHighlight(idx);
      updateDisplay();
    }

    function handleMinuteScroll() {
      if (!minuteViewport) return;
      const idx = Math.max(0, Math.min(MINUTES.length - 1, Math.round(minuteViewport.scrollTop / ITEM_HEIGHT)));
      selectedMinute = parseInt(MINUTES[idx], 10);
      updateMinuteHighlight(idx);
      updateDisplay();
    }

    function scrollToHourIndex(idx, smooth = false) {
      if (!hourViewport) return;
      const clamped = Math.max(0, Math.min(HOURS.length - 1, idx));
      isProgrammaticScroll = true;
      hourViewport.scrollTo({
        top: clamped * ITEM_HEIGHT,
        behavior: smooth ? 'smooth' : 'instant'
      });
      selectedHour = parseInt(HOURS[clamped], 10);
      updateHourHighlight(clamped);
      updateDisplay();
      setTimeout(() => { isProgrammaticScroll = false; }, smooth ? 250 : 50);
    }

    function scrollToMinuteIndex(idx, smooth = false) {
      if (!minuteViewport) return;
      const clamped = Math.max(0, Math.min(MINUTES.length - 1, idx));
      isProgrammaticScroll = true;
      minuteViewport.scrollTo({
        top: clamped * ITEM_HEIGHT,
        behavior: smooth ? 'smooth' : 'instant'
      });
      selectedMinute = parseInt(MINUTES[clamped], 10);
      updateMinuteHighlight(clamped);
      updateDisplay();
      setTimeout(() => { isProgrammaticScroll = false; }, smooth ? 250 : 50);
    }

    function updateHourHighlight(activeIdx) {
      if (!hourList) return;
      const items = hourList.children;
      for (let i = 0; i < items.length; i++) {
        items[i].classList.toggle('selected', i === activeIdx);
      }
    }

    function updateMinuteHighlight(activeIdx) {
      if (!minuteList) return;
      const items = minuteList.children;
      for (let i = 0; i < items.length; i++) {
        items[i].classList.toggle('selected', i === activeIdx);
      }
    }

    function setPeriod(p) {
      selectedPeriod = p === 'PM' ? 'PM' : 'AM';
      if (amBtn) amBtn.classList.toggle('active', selectedPeriod === 'AM');
      if (pmBtn) pmBtn.classList.toggle('active', selectedPeriod === 'PM');
      updateDisplay();
    }

    function getFormattedTime() {
      const h = String(selectedHour).padStart(2, '0');
      const m = String(selectedMinute).padStart(2, '0');
      return `${h}:${m} ${selectedPeriod}`;
    }

    function updateDisplay() {
      const formatted = getFormattedTime();
      if (displayVal) displayVal.textContent = formatted;
      if (hiddenInput) hiddenInput.value = formatted;
    }

    function setTime(timeStr, smooth = false) {
      if (!hourViewport) init();

      let h = 10;
      let m = 15;
      let p = 'AM';

      if (timeStr && typeof timeStr === 'string') {
        const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (match) {
          h = parseInt(match[1], 10);
          m = parseInt(match[2], 10);
          if (match[3]) {
            p = match[3].toUpperCase();
          } else {
            p = h >= 12 ? 'PM' : 'AM';
            if (h > 12) h -= 12;
            if (h === 0) h = 12;
          }
        }
      }

      if (h < 1 || h > 12) h = 9;
      if (m < 0 || m > 59) m = 0;
      p = p === 'PM' ? 'PM' : 'AM';

      const hourIdx = h - 1;
      const minuteIdx = m;

      setPeriod(p);
      scrollToHourIndex(hourIdx, smooth);
      scrollToMinuteIndex(minuteIdx, smooth);
    }

    return {
      init,
      setTime,
      getFormattedTime
    };
  })();

  // Dialog / Modal Logic
  const dialogEl = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');
  const inputEl = document.getElementById('itemInputText');
  const modalHeading = document.getElementById('modalHeading');
  const cancelBtn = document.getElementById('modalCancelBtn');

  function openDialog(type, dayId = null, targetId = null, existingText = '', existingTime = '') {
    modalContext = { type, dayId, targetId };
    const isEdit = Boolean(targetId);

    const timeFieldWrap = document.getElementById('modalTimeFieldWrap');
    const submitBtn = document.getElementById('modalSubmitBtn');
    let initialTime = '';

    if (type === 'day') {
      const dayName = plannerData.days.find(d => d.id === dayId)?.name || 'Day';
      modalHeading.textContent = isEdit ? `Edit Task (${dayName})` : `Add Task (${dayName})`;
      if (submitBtn) submitBtn.textContent = 'Save';
      if (timeFieldWrap) timeFieldWrap.style.display = 'flex';
      initialTime = existingTime || '10:15 AM';
    } else if (type === 'priority') {
      modalHeading.textContent = isEdit ? 'Edit Priority' : 'Add Priority';
      if (submitBtn) submitBtn.textContent = 'Save';
      if (timeFieldWrap) timeFieldWrap.style.display = 'flex';
      initialTime = existingTime || '09:00 AM';
    } else if (type === 'nextWeek') {
      modalHeading.textContent = isEdit ? 'Edit Next Week Task' : 'Add Next Week Task';
      if (submitBtn) submitBtn.textContent = 'Save';
      if (timeFieldWrap) timeFieldWrap.style.display = 'flex';
      initialTime = existingTime || '10:00 AM';
    } else {
      if (timeFieldWrap) timeFieldWrap.style.display = 'none';
      const timeInputEl = document.getElementById('itemInputTime');
      if (timeInputEl) timeInputEl.value = '';
      if (submitBtn) submitBtn.textContent = 'Save';
      if (type === 'habit') {
        modalHeading.textContent = isEdit ? 'Edit Habit' : 'Add New Daily Habit';
      }
    }

    inputEl.value = existingText;
    if (typeof dialogEl.showModal === 'function') {
      dialogEl.showModal();
    } else {
      dialogEl.setAttribute('open', '');
    }
    inputEl.focus();

    if (initialTime && timeFieldWrap) {
      timePicker.setTime(initialTime, false);
      requestAnimationFrame(() => {
        timePicker.setTime(initialTime, false);
      });
      setTimeout(() => {
        timePicker.setTime(initialTime, false);
      }, 50);
    }
  }

  function closeDialog() {
    if (typeof dialogEl.close === 'function') {
      dialogEl.close();
    } else {
      dialogEl.removeAttribute('open');
    }
    modalContext = null;
    inputEl.value = '';
    const timeInputEl = document.getElementById('itemInputTime');
    if (timeInputEl) timeInputEl.value = '';
    const submitBtn = document.getElementById('modalSubmitBtn');
    if (submitBtn) submitBtn.textContent = 'Save';
  }

  cancelBtn?.addEventListener('click', closeDialog);

  editForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = inputEl.value.trim();
    const timeVal = (document.getElementById('itemInputTime')?.value || '').trim();
    if (!val || !modalContext) return;

    const { type, dayId, targetId } = modalContext;

    if (type === 'day') {
      const dayObj = plannerData.days.find(d => d.id === dayId);
      if (dayObj) {
        if (targetId) {
          const t = dayObj.tasks.find(item => item.id === targetId);
          if (t) {
            t.text = val;
            if (timeVal) t.time = timeVal;
          }
        } else {
          dayObj.tasks.push({
            id: 't_' + Date.now(),
            time: timeVal || '09:00 AM',
            text: val,
            completed: false
          });
        }
        persistData();
        renderDays();
        updateDates();
        updateGlobalMetrics();
      }
    } else if (type === 'priority') {
      if (targetId) {
        const p = plannerData.priorities.find(item => item.id === targetId);
        if (p) {
          p.text = val;
          if (timeVal) p.time = timeVal;
        }
      } else {
        plannerData.priorities.push({
          id: 'p_' + Date.now(),
          time: timeVal || '09:00 AM',
          text: val,
          completed: false
        });
      }
      persistData();
      renderPriorities();
      updateGlobalMetrics();
    } else if (type === 'nextWeek') {
      if (targetId) {
        const nw = plannerData.nextWeek.find(item => item.id === targetId);
        if (nw) {
          nw.text = val;
          if (timeVal) nw.time = timeVal;
        }
      } else {
        plannerData.nextWeek.push({
          id: 'nw_' + Date.now(),
          time: timeVal || '10:00 AM',
          text: val,
          completed: false
        });
      }
      persistData();
      renderNextWeek();
      updateGlobalMetrics();
    } else if (type === 'habit') {
      if (targetId) {
        const h = plannerData.habits.find(item => item.id === targetId);
        if (h) h.text = val;
      } else {
        plannerData.habits.push({
          id: 'h_' + Date.now(),
          text: val,
          days: [false, false, false, false, false, false, false]
        });
      }
      persistData();
      renderHabits();
    }

    closeDialog();
    showToast('Saved');
  });

  // Setup Bottom Module Add Buttons
  function setupModuleAddButtons() {
    document.getElementById('addHabitBtn')?.addEventListener('click', () => {
      openDialog('habit');
    });

    document.getElementById('addPriorityBtn')?.addEventListener('click', () => {
      openDialog('priority');
    });

    document.getElementById('addNoteBtn')?.addEventListener('click', () => {
      openNoteModal(null);
    });

    // Note Modal Form & Buttons (Title & Description Popup)
    const noteForm = document.getElementById('noteForm');
    const noteModal = document.getElementById('noteModal');
    const noteModalCancelBtn = document.getElementById('noteModalCancelBtn');

    noteModalCancelBtn?.addEventListener('click', () => {
      closeNoteModal();
    });

    noteModal?.addEventListener('click', (e) => {
      if (e.target === noteModal) {
        closeNoteModal();
      }
    });

    const noteInputDate = document.getElementById('noteInputDate');
    const noteModalDateBadge = document.getElementById('noteModalDateBadge');

    noteInputDate?.addEventListener('input', () => {
      if (noteModalDateBadge && noteInputDate.value) {
        noteModalDateBadge.textContent = formatNoteDate(noteInputDate.value);
      }
    });

    noteForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('noteInputTitle');
      const dateInput = document.getElementById('noteInputDate');
      const descTextarea = document.getElementById('noteInputDesc');
      const title = titleInput ? titleInput.value.trim() : '';
      const desc = descTextarea ? descTextarea.value.trim() : '';

      const now = new Date();
      const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const chosenDate = (dateInput && dateInput.value) ? dateInput.value : todayYMD;
      const formattedDate = formatNoteDate(chosenDate);

      if (!title && !desc) {
        closeNoteModal();
        return;
      }

      const finalTitle = title || 'Untitled Note';

      if (activeEditingNoteId) {
        const note = (plannerData.notes || []).find(n => n.id === activeEditingNoteId);
        if (note) {
          note.title = finalTitle;
          note.date = chosenDate;
          note.dateFormatted = formattedDate;
          note.description = desc;
          note.text = finalTitle;
        }
        showToast('Note updated');
      } else {
        const newId = 'n_' + Date.now();
        if (!Array.isArray(plannerData.notes)) {
          plannerData.notes = [];
        }
        plannerData.notes.push({
          id: newId,
          title: finalTitle,
          date: chosenDate,
          dateFormatted: formattedDate,
          description: desc,
          text: finalTitle
        });
        showToast('Note added');
      }

      persistData();
      renderNotes();
      closeNoteModal();
    });

    document.getElementById('addNextWeekBtn')?.addEventListener('click', () => {
      openDialog('nextWeek');
    });
  }

  // Setup Toolbar Controls
  function setupToolbar() {
    // Week navigation with full persistence & week switcher
    document.getElementById('prevWeekBtn')?.addEventListener('click', () => {
      switchWeek(weekOffset - 1);
    });

    document.getElementById('nextWeekBtn')?.addEventListener('click', () => {
      switchWeek(weekOffset + 1);
    });

    document.getElementById('todayBtn')?.addEventListener('click', () => {
      if (plannerMain && plannerMain.style.display === 'none') {
        switchRailView('daily-routine');
      }
      jumpToToday();
    });

    // Go To Date (Jump to previous week or any specific date via calendar)
    const goToDateBtn = document.getElementById('goToDateBtn');
    const goToDateInput = document.getElementById('goToDateInput');

    if (goToDateBtn && goToDateInput) {
      goToDateBtn.addEventListener('click', () => {
        // Pre-fill input with currently viewed week's active day date
        const now = new Date();
        const mon = getMondayOfWeek(now, weekOffset);
        const dayOrderMap = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
        const offsetDays = dayOrderMap[activeDayId] !== undefined ? dayOrderMap[activeDayId] : 0;
        const curDate = new Date(mon);
        curDate.setDate(mon.getDate() + offsetDays);

        const y = curDate.getFullYear();
        const m = String(curDate.getMonth() + 1).padStart(2, '0');
        const d = String(curDate.getDate()).padStart(2, '0');
        goToDateInput.value = `${y}-${m}-${d}`;

        if (typeof goToDateInput.showPicker === 'function') {
          try {
            goToDateInput.showPicker();
            return;
          } catch (_) { }
        }
        goToDateInput.focus();
        goToDateInput.click();
      });

      goToDateInput.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;

        const [y, m, d] = val.split('-').map(Number);
        const targetDate = new Date(y, m - 1, d);
        const targetMonday = getMondayOfWeek(targetDate, 0);
        const currentMonday = getMondayOfWeek(new Date(), 0);

        const diffMs = targetMonday.getTime() - currentMonday.getTime();
        const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));

        // Switch to the target week and center picked date in infinite carousel
        visibleBaseWeek = diffWeeks;
        switchWeek(diffWeeks);

        const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const pickedDayKey = dayKeys[targetDate.getDay()];
        if (pickedDayKey) {
          setActiveCard(`w${diffWeeks}-${pickedDayKey}`, true, 'smooth');
        }

        const dateFormatted = targetDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        if (diffWeeks < 0) {
          showToast(`Jumped to: ${dateFormatted} (${Math.abs(diffWeeks)} week${Math.abs(diffWeeks) > 1 ? 's' : ''} ago)`);
        } else if (diffWeeks > 0) {
          showToast(`Jumped to: ${dateFormatted} (+${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ahead)`);
        } else {
          showToast(`Jumped to: ${dateFormatted} (Current Week)`);
        }
      });
    }

    const jumpToNextWeekFull = () => {
      switchWeek(weekOffset + 1);
      const daysWrapper = document.querySelector('.days-slider-wrapper');
      if (daysWrapper) {
        daysWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    document.getElementById('planNextWeekFullBtn')?.addEventListener('click', jumpToNextWeekFull);
    document.getElementById('nextWeekDateBadge')?.addEventListener('click', jumpToNextWeekFull);

    // Sound toggle (if present in DOM)
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      const soundOn = document.getElementById('soundIconOn');
      const soundOff = document.getElementById('soundIconOff');

      const updateSoundUI = () => {
        if (soundEnabled) {
          soundOn?.classList.remove('hidden');
          soundOff?.classList.add('hidden');
          soundBtn?.setAttribute('title', 'Sound effects: ON');
        } else {
          soundOn?.classList.add('hidden');
          soundOff?.classList.remove('hidden');
          soundBtn?.setAttribute('title', 'Sound effects: OFF');
        }
      };
      updateSoundUI();

      soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem(SOUND_KEY, soundEnabled);
        updateSoundUI();
        if (soundEnabled) triggerSound(true);
        showToast(soundEnabled ? 'Sound enabled' : 'Sound muted');
      });
    }

    // Share Dropdown Toggle & Interaction Management
    const shareWrap = document.getElementById('shareDropdownWrap');
    const shareBtn = document.getElementById('shareTriggerBtn');
    const shareMenu = document.getElementById('shareDropdownMenu');

    if (shareBtn && shareMenu) {
      const toggleShareMenu = (forceState) => {
        const isOpen = forceState !== undefined ? forceState : !shareMenu.classList.contains('is-open');
        if (isOpen) {
          shareMenu.classList.add('is-open');
          shareBtn.classList.add('active');
          shareBtn.setAttribute('aria-expanded', 'true');
        } else {
          shareMenu.classList.remove('is-open');
          shareBtn.classList.remove('active');
          shareBtn.setAttribute('aria-expanded', 'false');
        }
      };

      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleShareMenu();
      });

      // Close dropdown when clicking an item inside (with small delay so click handlers execute)
      shareMenu.addEventListener('click', () => {
        setTimeout(() => toggleShareMenu(false), 80);
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!shareWrap?.contains(e.target)) {
          toggleShareMenu(false);
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && shareMenu.classList.contains('is-open')) {
          toggleShareMenu(false);
          shareBtn.focus();
        }
      });
    }

    // Print
    document.getElementById('printBtn')?.addEventListener('click', () => {
      window.print();
    });

    // Top Left Brand Logo (Smooth scroll to top)
    document.querySelector('.toolbar-brand-wrap')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Save to Excel button in toolbar
    document.getElementById('excelExportBtn')?.addEventListener('click', () => {
      downloadBackupExcel();
    });

    // Auto-Save status badge click: Manual trigger & status confirmation
    document.getElementById('autosaveBadge')?.addEventListener('click', () => {
      persistData(true);
      const timeStr = new Date(lastSavedTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      showToast(`Auto-Save active: All changes saved offline at ${timeStr}`);
    });

    // Export Button (Opens Backup & Export Center with Excel, CSV, JSON, Drive)
    document.getElementById('exportBtn')?.addEventListener('click', () => {
      updateGDriveUI();
      checkDriveBackupFile();
      document.getElementById('gdriveModal')?.showModal();
    });

    // Import JSON Backup
    const importInput = document.getElementById('importInput');
    importInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported && Array.isArray(imported.days) && Array.isArray(imported.habits) && Array.isArray(imported.priorities)) {
            validateAndFillTaskTimes(imported);
            plannerData = imported;
            persistData(true);
            init();
            showToast('Planner restored from backup');
          } else {
            alert('Invalid backup format: missing required planner collections.');
          }
        } catch {
          alert('Could not read JSON file.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // Reset Planner (2-Step Inline Confirmation Guard REQ-017 / TASK-001)
    const resetBtn = document.getElementById('resetBtn');
    const resetWrap = document.getElementById('resetWrap');
    const resetConfirmInline = document.getElementById('resetConfirmInline');
    const resetConfirmYesBtn = document.getElementById('resetConfirmYesBtn');
    const resetConfirmNoBtn = document.getElementById('resetConfirmNoBtn');

    const showResetConfirm = () => {
      if (resetBtn && resetConfirmInline) {
        resetBtn.style.display = 'none';
        resetConfirmInline.style.display = 'inline-flex';
        resetConfirmYesBtn?.focus();
      }
    };

    const hideResetConfirm = () => {
      if (resetBtn && resetConfirmInline) {
        resetConfirmInline.style.display = 'none';
        resetBtn.style.display = 'inline-flex';
      }
    };

    resetBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showResetConfirm();
    });

    resetConfirmNoBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      hideResetConfirm();
    });

    resetConfirmYesBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      hideResetConfirm();

      plannerData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      // Guarantee every single checkbox is unchecked across all days & modules
      (plannerData.days || []).forEach(d => {
        (d.tasks || []).forEach(t => { t.completed = false; });
      });
      (plannerData.habits || []).forEach(h => {
        h.days = [false, false, false, false, false, false, false];
      });
      (plannerData.priorities || []).forEach(p => { p.completed = false; });
      (plannerData.nextWeek || []).forEach(nw => { nw.completed = false; });

      weekDataCache.clear();
      persistData();
      init();
      showToast('Reset complete: All checkboxes unchecked');
    });

    // Dismiss confirmation on click outside or Escape
    document.addEventListener('click', (e) => {
      if (resetWrap && !resetWrap.contains(e.target)) {
        hideResetConfirm();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resetConfirmInline && resetConfirmInline.style.display !== 'none') {
        hideResetConfirm();
        resetBtn?.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Google Drive Cloud Backup Module
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // Universal Bulletproof Download Handler (Chrome, Edge, Firefox, Safari, Mobile)
  // --------------------------------------------------------------------------

  function triggerBrowserDownload(content, fileName, mimeType = 'application/octet-stream') {
    try {
      const blob = (content instanceof Blob)
        ? content
        : new Blob([content], { type: mimeType });

      // Method 1: Standard URL.createObjectURL with delayed cleanup
      if (window.URL && typeof window.URL.createObjectURL === 'function') {
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = objectUrl;
        a.download = fileName;
        a.setAttribute('download', fileName);
        document.body.appendChild(a);

        // Synthetic click to trigger browser download manager
        a.click();

        // Delay revoke by 60s so browser download manager has finished streaming
        setTimeout(() => {
          try {
            document.body.removeChild(a);
          } catch (_) { }
          try {
            window.URL.revokeObjectURL(objectUrl);
          } catch (_) { }
        }, 60000);
        return true;
      }

      // Method 2: FileReader Data URL fallback for restricted webviews or iframes
      const reader = new FileReader();
      reader.onload = () => {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = reader.result;
        a.download = fileName;
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          try { document.body.removeChild(a); } catch (_) { }
        }, 5000);
      };
      reader.readAsDataURL(blob);
      return true;
    } catch (err) {
      console.error('Download error:', err);
      showToast('Error initiating download');
      return false;
    }
  }

  // Export JSON Backup
  function downloadBackupJson() {
    try {
      const currentData = plannerData || DEFAULT_DATA;
      const dataStr = JSON.stringify(currentData, null, 2);
      const fileName = `weekly-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
      triggerBrowserDownload(dataStr, fileName, 'application/json');
      showToast('Backup JSON downloaded');
    } catch (err) {
      console.error('JSON export error:', err);
      showToast('Error exporting JSON backup');
    }
  }

  // Export universal CSV file
  function downloadBackupCsv() {
    try {
      const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        const s = String(str).replace(/"/g, '""');
        return '"' + s + '"';
      };

      const currentData = plannerData || DEFAULT_DATA;
      const now = new Date();
      const monday = getMondayOfWeek(now, weekOffset);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const weekRangeText = `${fmt(monday)} - ${fmt(sunday)}, ${sunday.getFullYear()}`;

      const lines = [];
      lines.push(`"DIGITAL WEEKLY PLANNER - ${weekRangeText}"`);
      lines.push('');

      lines.push('--- WEEKLY SCHEDULE TASKS ---');
      lines.push(['Day', 'Task #', 'Scheduled Time', 'Task Description', 'Status'].map(escapeCsv).join(','));
      (currentData.days || []).forEach(d => {
        (d.tasks || []).forEach((t, i) => {
          lines.push([d.name, i + 1, t.time || '', t.text, t.completed ? 'Completed' : 'Pending'].map(escapeCsv).join(','));
        });
      });

      lines.push('');
      lines.push('--- DAILY HABITS TRACKER ---');
      lines.push(['Habit Name', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Completed Days', 'Goal'].map(escapeCsv).join(','));
      (currentData.habits || []).forEach(h => {
        const days = (h.days || []).map(d => d ? 'YES' : 'NO');
        const doneCount = (h.days || []).filter(Boolean).length;
        lines.push([h.text, ...days, doneCount, '7'].map(escapeCsv).join(','));
      });

      lines.push('');
      lines.push('--- WEEKLY PRIORITIES ---');
      lines.push(['#', 'Scheduled Time', 'Priority Description', 'Status'].map(escapeCsv).join(','));
      (currentData.priorities || []).forEach((p, i) => {
        lines.push([i + 1, p.time || '', p.text, p.completed ? 'Completed' : 'Pending'].map(escapeCsv).join(','));
      });

      lines.push('');
      lines.push('--- FOR NEXT WEEK ---');
      lines.push(['#', 'Scheduled Time', 'Task Description', 'Status'].map(escapeCsv).join(','));
      (currentData.nextWeek || []).forEach((nw, i) => {
        lines.push([i + 1, nw.time || '', nw.text, nw.completed ? 'Completed' : 'Pending'].map(escapeCsv).join(','));
      });

      lines.push('');
      lines.push('--- NOTES ---');
      lines.push(['#', 'Note Content'].map(escapeCsv).join(','));
      (currentData.notes || []).forEach((n, i) => {
        lines.push([i + 1, n.text].map(escapeCsv).join(','));
      });

      const csvContent = '\uFEFF' + lines.join('\r\n');
      const fileName = `weekly-planner-data-${new Date().toISOString().slice(0, 10)}.csv`;
      triggerBrowserDownload(csvContent, fileName, 'text/csv;charset=utf-8');
      showToast('App data saved to CSV file (.csv)');
    } catch (err) {
      console.error('CSV export error:', err);
      showToast('Error exporting CSV file');
    }
  }

  // Save complete app data in multi-sheet Excel spreadsheet (.xls / .xlsx)
  function downloadBackupExcel() {
    try {
      const escapeXml = (str) => {
        if (str === null || str === undefined) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      const currentData = plannerData || DEFAULT_DATA;
      const days = [
        { key: 'mon', name: 'Monday' },
        { key: 'tue', name: 'Tuesday' },
        { key: 'wed', name: 'Wednesday' },
        { key: 'thu', name: 'Thursday' },
        { key: 'fri', name: 'Friday' },
        { key: 'sat', name: 'Saturday' },
        { key: 'sun', name: 'Sunday' }
      ];

      const now = new Date();
      const monday = getMondayOfWeek(now, weekOffset);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const weekRangeText = `${fmt(monday)} - ${fmt(sunday)}, ${sunday.getFullYear()}`;

      let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Digital Weekly Planner - ${escapeXml(weekRangeText)}</Title>
  <Author>Weekly Planner</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1e293b"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#e2e8f0"/>
   </Borders>
  </Style>
  <Style ss:ID="MainTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="13" ss:Bold="1" ss:Color="#ffffff"/>
   <Interior ss:Color="#0f172a" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="ColHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#ffffff"/>
   <Interior ss:Color="#334155" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DayHeader">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0f172a"/>
   <Interior ss:Color="#f1f5f9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DoneCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Bold="1" ss:Color="#047857"/>
   <Interior ss:Color="#ecfdf5" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="PendingCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#b45309"/>
   <Interior ss:Color="#fffbeb" ss:Pattern="Solid"/>
  </Style>
 </Styles>
`;

      // 1. Daily Schedule Sheet
      xml += ` <Worksheet ss:Name="Daily Schedule">
  <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
   <Column ss:Width="110"/>
   <Column ss:Width="95"/>
   <Column ss:Width="300"/>
   <Column ss:Width="110"/>
   <Row ss:Height="26">
    <Cell ss:MergeAcross="3" ss:StyleID="MainTitle"><Data ss:Type="String">DAILY SCHEDULE (${escapeXml(weekRangeText)})</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Day</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Time</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Task Description</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Status</Data></Cell>
   </Row>
`;

      days.forEach(day => {
        const dayObj = (currentData.days || []).find(d => d.id === day.key);
        const tasks = dayObj ? dayObj.tasks : [];
        if (!tasks || tasks.length === 0) {
          xml += `   <Row>
    <Cell ss:StyleID="DayHeader"><Data ss:Type="String">${day.name}</Data></Cell>
    <Cell><Data ss:Type="String">—</Data></Cell>
    <Cell><Data ss:Type="String">(No tasks recorded)</Data></Cell>
    <Cell ss:StyleID="PendingCell"><Data ss:Type="String">—</Data></Cell>
   </Row>\n`;
        } else {
          tasks.forEach((t, idx) => {
            const status = t.completed ? 'Completed' : 'Pending';
            const styleId = t.completed ? 'DoneCell' : 'PendingCell';
            xml += `   <Row>
    <Cell ss:StyleID="DayHeader"><Data ss:Type="String">${idx === 0 ? day.name : ''}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(t.time || '')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(t.text)}</Data></Cell>
    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${status}</Data></Cell>
   </Row>\n`;
          });
        }
      });
      xml += `  </Table>\n </Worksheet>\n`;

      // 2. Daily Habits Sheet
      xml += ` <Worksheet ss:Name="Daily Habits">
  <Table ss:DefaultColumnWidth="45" ss:DefaultRowHeight="20">
   <Column ss:Width="180"/>
   <Column ss:Width="45"/>
   <Column ss:Width="45"/>
   <Column ss:Width="45"/>
   <Column ss:Width="45"/>
   <Column ss:Width="45"/>
   <Column ss:Width="45"/>
   <Column ss:Width="45"/>
   <Column ss:Width="100"/>
   <Row ss:Height="26">
    <Cell ss:MergeAcross="8" ss:StyleID="MainTitle"><Data ss:Type="String">DAILY HABITS TRACKER</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Habit Name</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Mon</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Tue</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Wed</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Thu</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Fri</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Sat</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Sun</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Completion</Data></Cell>
   </Row>
`;

      (currentData.habits || []).forEach(h => {
        const completedDays = (h.days || []).filter(Boolean).length;
        const pct = Math.round((completedDays / 7) * 100);
        xml += `   <Row>\n    <Cell><Data ss:Type="String">${escapeXml(h.text)}</Data></Cell>\n`;
        for (let i = 0; i < 7; i++) {
          const isDone = !!(h.days && h.days[i]);
          const styleId = isDone ? 'DoneCell' : 'PendingCell';
          xml += `    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${isDone ? '✓ Done' : '—'}</Data></Cell>\n`;
        }
        xml += `    <Cell ss:StyleID="${completedDays === 7 ? 'DoneCell' : 'PendingCell'}"><Data ss:Type="String">${completedDays}/7 (${pct}%)</Data></Cell>\n   </Row>\n`;
      });
      xml += `  </Table>\n </Worksheet>\n`;

      // 3. Priorities & Next Week Sheet
      xml += ` <Worksheet ss:Name="Priorities &amp; Next Week">
  <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="300"/>
   <Column ss:Width="110"/>
   <Row ss:Height="26">
    <Cell ss:MergeAcross="3" ss:StyleID="MainTitle"><Data ss:Type="String">PRIORITIES &amp; UPCOMING TASKS</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Section</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Scheduled Time</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Task Description</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Status</Data></Cell>
   </Row>
`;
      (currentData.priorities || []).forEach((p, idx) => {
        const status = p.completed ? 'Completed' : 'Pending';
        const styleId = p.completed ? 'DoneCell' : 'PendingCell';
        xml += `   <Row>
    <Cell ss:StyleID="DayHeader"><Data ss:Type="String">${idx === 0 ? 'Priorities' : ''}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(p.time || '')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(p.text)}</Data></Cell>
    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${status}</Data></Cell>
   </Row>\n`;
      });
      (currentData.nextWeek || []).forEach((n, idx) => {
        const status = n.completed ? 'Completed' : 'Pending';
        const styleId = n.completed ? 'DoneCell' : 'PendingCell';
        xml += `   <Row>
    <Cell ss:StyleID="DayHeader"><Data ss:Type="String">${idx === 0 ? 'For Next Week' : ''}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(n.time || '')}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(n.text)}</Data></Cell>
    <Cell ss:StyleID="${styleId}"><Data ss:Type="String">${status}</Data></Cell>
   </Row>\n`;
      });
      xml += `  </Table>\n </Worksheet>\n`;

      // 4. Notes Sheet
      xml += ` <Worksheet ss:Name="Notes">
  <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="20">
   <Column ss:Width="50"/>
   <Column ss:Width="450"/>
   <Row ss:Height="26">
    <Cell ss:MergeAcross="1" ss:StyleID="MainTitle"><Data ss:Type="String">NOTES &amp; MEMOS</Data></Cell>
   </Row>
   <Row ss:Height="22">
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">#</Data></Cell>
    <Cell ss:StyleID="ColHeader"><Data ss:Type="String">Note Content</Data></Cell>
   </Row>
`;
      (currentData.notes || []).forEach((n, idx) => {
        xml += `   <Row>
    <Cell ss:StyleID="DayHeader"><Data ss:Type="Number">${idx + 1}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(n.text)}</Data></Cell>
   </Row>\n`;
      });
      xml += `  </Table>\n </Worksheet>\n</Workbook>`;

      const fileName = `weekly-planner-data-${new Date().toISOString().slice(0, 10)}.xls`;
      triggerBrowserDownload(xml, fileName, 'application/vnd.ms-excel;charset=utf-8');
      showToast('App data saved to Excel file (.xls)');
    } catch (err) {
      console.error('Excel export error:', err);
      showToast('Error exporting Excel file');
    }
  }

  function loadGDriveSettings() {
    try {
      const storedClient = localStorage.getItem(GDRIVE_CLIENT_ID_KEY);
      const input = document.getElementById('gdriveClientIdInput');
      if (input && storedClient) {
        input.value = storedClient;
      }

      gdriveAutoBackupEnabled = localStorage.getItem(GDRIVE_AUTOBACKUP_KEY) === 'true';
      const toggle = document.getElementById('gdriveAutoSyncToggle');
      if (toggle) toggle.checked = gdriveAutoBackupEnabled;

      const storedUser = localStorage.getItem(GDRIVE_USER_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === 'object') {
          gdriveUserProfile = parsed;
        }
      }

      gdriveLastBackup = localStorage.getItem(GDRIVE_LAST_BACKUP_KEY);
      gdriveFileId = localStorage.getItem(GDRIVE_FILE_ID_KEY);
      gdriveFileLink = localStorage.getItem(GDRIVE_FILE_LINK_KEY);
    } catch (err) {
      console.warn('Error loading GDrive settings:', err);
    }
    updateGDriveUI();
  }

  function updateGDriveUI() {
    const isConnected = !!gdriveAccessToken;
    const hasCachedProfile = !!gdriveUserProfile;

    // Status dot in toolbar
    const statusDot = document.getElementById('gdriveStatusDot');
    const gdriveBtn = document.getElementById('gdriveBtn');
    if (statusDot) {
      statusDot.className = 'status-dot' + (isConnected ? ' connected' : '');
      const title = isConnected
        ? `Drive: Connected as ${gdriveUserProfile?.name || 'Google User'}`
        : 'Drive: Click to connect & backup';
      statusDot.setAttribute('title', title);
      gdriveBtn?.setAttribute('title', `Google Drive Cloud Backup (${isConnected ? 'Connected' : 'Not Connected'})`);
    }

    // Modal UI elements
    const nameEl = document.getElementById('gdriveUserName');
    const emailEl = document.getElementById('gdriveUserEmail');
    const avatarEl = document.getElementById('gdriveAvatar');
    const authBtn = document.getElementById('gdriveAuthBtn');
    const authBtnText = document.getElementById('gdriveAuthBtnText');
    const lastBackupText = document.getElementById('gdriveLastBackupText');
    const viewFileLink = document.getElementById('gdriveViewFileLink');

    if (isConnected && gdriveUserProfile) {
      if (nameEl) nameEl.textContent = gdriveUserProfile.name || 'Google User';
      if (emailEl) emailEl.textContent = gdriveUserProfile.email || 'Connected';
      if (avatarEl) {
        const safePic = gdriveUserProfile.picture ? sanitizeUrl(gdriveUserProfile.picture) : '';
        if (safePic) {
          avatarEl.innerHTML = `<img src="${escapeMarkup(safePic)}" alt="User Avatar" referrerpolicy="no-referrer">`;
        } else {
          avatarEl.innerHTML = `<span style="font-weight:700; color:#1a73e8;">${(gdriveUserProfile.name || 'U').charAt(0).toUpperCase()}</span>`;
        }
      }
      if (authBtn) {
        authBtn.className = 'btn-gdrive-primary disconnect';
        if (authBtnText) authBtnText.textContent = 'Disconnect';
      }
    } else if (hasCachedProfile && !isConnected) {
      if (nameEl) nameEl.textContent = `${gdriveUserProfile.name || 'Google User'}`;
      if (emailEl) emailEl.textContent = 'Click Reconnect to authorize cloud sync';
      if (avatarEl) {
        const safePic = gdriveUserProfile.picture ? sanitizeUrl(gdriveUserProfile.picture) : '';
        if (safePic) {
          avatarEl.innerHTML = `<img src="${escapeMarkup(safePic)}" alt="User Avatar" referrerpolicy="no-referrer" style="opacity: 0.65;">`;
        }
      }
      if (authBtn) {
        authBtn.className = 'btn-gdrive-primary';
        if (authBtnText) authBtnText.textContent = 'Reconnect';
      }
    } else {
      if (nameEl) nameEl.textContent = 'Google Drive Not Connected';
      if (emailEl) emailEl.textContent = 'Connect your Google account to enable cloud sync';
      if (avatarEl) {
        avatarEl.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `;
      }
      if (authBtn) {
        authBtn.className = 'btn-gdrive-primary';
        if (authBtnText) authBtnText.textContent = 'Connect';
      }
    }

    if (lastBackupText) {
      if (gdriveLastBackup) {
        try {
          const date = new Date(gdriveLastBackup);
          lastBackupText.textContent = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch {
          lastBackupText.textContent = gdriveLastBackup;
        }
      } else {
        lastBackupText.textContent = 'Never';
      }
    }

    if (viewFileLink) {
      const safeLink = sanitizeUrl(gdriveFileLink);
      if (safeLink) {
        viewFileLink.href = safeLink;
        viewFileLink.setAttribute('rel', 'noopener noreferrer');
        viewFileLink.classList.remove('hidden');
      } else {
        viewFileLink.classList.add('hidden');
      }
    }

    // Check protocol
    const protocolNotice = document.getElementById('gdriveProtocolNotice');
    if (protocolNotice) {
      if (window.location.protocol === 'file:') {
        protocolNotice.classList.remove('hidden');
      } else {
        protocolNotice.classList.add('hidden');
      }
    }
  }

  function connectGoogleDrive(onSuccess) {
    if (window.location.protocol === 'file:') {
      alert('Google OAuth requires running the page through an HTTP server (e.g. VS Code Live Server on http://127.0.0.1:5500 or npx serve).\n\nWhen running locally as file://, you can click "Download Local JSON" and upload it to Google Drive manually.');
      return;
    }

    const clientId = (localStorage.getItem(GDRIVE_CLIENT_ID_KEY) || '').trim();
    if (!clientId) {
      const details = document.getElementById('gdriveConfigDetails');
      if (details) details.open = true;
      document.getElementById('gdriveClientIdInput')?.focus();
      showToast('Please enter your Google OAuth Client ID first');
      return;
    }

    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
      alert('Google Identity Services library is not loaded. Please verify your internet connection.');
      return;
    }

    try {
      gdriveTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('Google Auth Error:', tokenResponse);
            showToast('Google Sign-in failed: ' + (tokenResponse.error_description || tokenResponse.error));
            return;
          }
          gdriveAccessToken = tokenResponse.access_token;
          await fetchGoogleUserProfile();
          updateGDriveUI();
          checkDriveBackupFile();
          showToast('Connected to Google Drive');
          if (typeof onSuccess === 'function') {
            onSuccess();
          }
        }
      });

      gdriveTokenClient.requestAccessToken({ prompt: '' });
    } catch (err) {
      console.error('Failed to init Google OAuth client:', err);
      alert('Failed to initialize Google Sign-in: ' + err.message);
    }
  }

  async function fetchGoogleUserProfile() {
    if (!gdriveAccessToken) return;
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${gdriveAccessToken}` }
      });
      if (res.ok) {
        gdriveUserProfile = await res.json();
        localStorage.setItem(GDRIVE_USER_KEY, JSON.stringify(gdriveUserProfile));
      }
    } catch (err) {
      console.warn('Could not fetch user profile:', err);
    }
  }

  function disconnectGoogleDrive() {
    if (confirm('Disconnect Google Drive from Weekly Planner?')) {
      if (gdriveAccessToken && window.google?.accounts?.oauth2?.revoke) {
        try {
          google.accounts.oauth2.revoke(gdriveAccessToken, () => { });
        } catch { }
      }
      gdriveAccessToken = null;
      gdriveUserProfile = null;
      localStorage.removeItem(GDRIVE_USER_KEY);
      updateGDriveUI();
      showToast('Disconnected from Google Drive');
    }
  }

  async function backupToGoogleDrive(silent = false) {
    if (!gdriveAccessToken) {
      if (!silent) {
        connectGoogleDrive(() => backupToGoogleDrive(false));
      }
      return;
    }

    const backupBtn = document.getElementById('gdriveBackupNowBtn');
    const spinner = document.getElementById('gdriveBackupSpinner');
    const statusDot = document.getElementById('gdriveStatusDot');

    if (!silent && backupBtn) {
      backupBtn.disabled = true;
      spinner?.classList.remove('hidden');
    }
    if (statusDot) {
      statusDot.className = 'status-dot syncing';
    }

    try {
      // 1. Search for existing file
      const q = encodeURIComponent(`name = '${GDRIVE_BACKUP_FILENAME}' and trashed = false`);
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime,webViewLink)`, {
        headers: { Authorization: `Bearer ${gdriveAccessToken}` }
      });

      if (searchRes.status === 401) {
        gdriveAccessToken = null;
        updateGDriveUI();
        if (!silent) {
          showToast('Google session expired. Reconnecting...');
          connectGoogleDrive(() => backupToGoogleDrive(false));
        }
        return;
      }

      const searchData = await searchRes.json();
      const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

      // 2. Prepare Multipart body
      const metadata = {
        name: GDRIVE_BACKUP_FILENAME,
        mimeType: 'application/json',
        description: 'Weekly Planner Backup Data'
      };
      const boundary = '-------weekly_planner_' + Date.now();
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelim = "\r\n--" + boundary + "--";

      const multipartBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(plannerData, null, 2) +
        closeDelim;

      let uploadRes;
      if (existingFile) {
        uploadRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart&fields=id,name,modifiedTime,webViewLink`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${gdriveAccessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartBody
        });
      } else {
        uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime,webViewLink', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${gdriveAccessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartBody
        });
      }

      if (!uploadRes.ok) {
        throw new Error(`Upload failed with HTTP ${uploadRes.status}`);
      }

      const uploadData = await uploadRes.json();
      gdriveFileId = uploadData.id;
      gdriveFileLink = uploadData.webViewLink || 'https://drive.google.com';
      gdriveLastBackup = new Date().toISOString();

      localStorage.setItem(GDRIVE_FILE_ID_KEY, gdriveFileId);
      localStorage.setItem(GDRIVE_FILE_LINK_KEY, gdriveFileLink);
      localStorage.setItem(GDRIVE_LAST_BACKUP_KEY, gdriveLastBackup);

      updateGDriveUI();
      checkDriveBackupFile();

      if (!silent) {
        triggerSound(true);
        showToast('Saved to Google Drive!');
      }
    } catch (err) {
      console.error('Google Drive backup error:', err);
      if (!silent) {
        showToast('Backup error: ' + err.message);
      }
    } finally {
      if (backupBtn) backupBtn.disabled = false;
      spinner?.classList.add('hidden');
      if (statusDot) {
        statusDot.className = 'status-dot' + (gdriveAccessToken ? ' connected' : '');
      }
    }
  }

  async function restoreFromGoogleDrive() {
    if (!gdriveAccessToken) {
      connectGoogleDrive(() => restoreFromGoogleDrive());
      return;
    }

    const restoreBtn = document.getElementById('gdriveRestoreNowBtn');
    const spinner = document.getElementById('gdriveRestoreSpinner');

    if (restoreBtn) {
      restoreBtn.disabled = true;
      spinner?.classList.remove('hidden');
    }

    try {
      const q = encodeURIComponent(`name = '${GDRIVE_BACKUP_FILENAME}' and trashed = false`);
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime,size)`, {
        headers: { Authorization: `Bearer ${gdriveAccessToken}` }
      });

      if (searchRes.status === 401) {
        gdriveAccessToken = null;
        updateGDriveUI();
        showToast('Google session expired. Reconnecting...');
        connectGoogleDrive(() => restoreFromGoogleDrive());
        return;
      }

      const searchData = await searchRes.json();
      const file = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

      if (!file) {
        showToast('No backup file found on Google Drive');
        return;
      }

      const dateStr = file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : 'recently';
      const confirmed = confirm(`Restore Weekly Planner from Google Drive?\n\nBackup date: ${dateStr}\n\nNote: This will replace current planner items.`);
      if (!confirmed) return;

      const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
        headers: { Authorization: `Bearer ${gdriveAccessToken}` }
      });

      if (!downloadRes.ok) {
        throw new Error(`Download failed with HTTP ${downloadRes.status}`);
      }

      const imported = await downloadRes.json();
      if (imported.days && imported.habits && imported.priorities) {
        plannerData = imported;
        persistData(true);
        init();
        triggerSound(true);
        showToast('Planner restored from Google Drive!');
        document.getElementById('gdriveModal')?.close();
      } else {
        alert('Invalid planner backup format on Google Drive.');
      }
    } catch (err) {
      console.error('Google Drive restore error:', err);
      showToast('Restore error: ' + err.message);
    } finally {
      if (restoreBtn) restoreBtn.disabled = false;
      spinner?.classList.add('hidden');
    }
  }

  async function checkDriveBackupFile() {
    if (!gdriveAccessToken) {
      const statusEl = document.getElementById('gdriveFileStatusText');
      if (statusEl) statusEl.textContent = 'Sign in to check';
      return;
    }

    try {
      const q = encodeURIComponent(`name = '${GDRIVE_BACKUP_FILENAME}' and trashed = false`);
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime,size)`, {
        headers: { Authorization: `Bearer ${gdriveAccessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        const statusEl = document.getElementById('gdriveFileStatusText');
        if (statusEl) {
          if (data.files && data.files.length > 0) {
            const file = data.files[0];
            const d = new Date(file.modifiedTime);
            statusEl.textContent = `Available (${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})`;
          } else {
            statusEl.textContent = 'No file found yet';
          }
        }
      }
    } catch (err) {
      console.warn('Could not check drive file:', err);
    }
  }

  function setupGDriveModule() {
    loadGDriveSettings();

    // Toolbar GDrive button
    const gdriveBtn = document.getElementById('gdriveBtn');
    const gdriveModal = document.getElementById('gdriveModal');
    gdriveBtn?.addEventListener('click', () => {
      updateGDriveUI();
      checkDriveBackupFile();
      gdriveModal?.showModal();
    });

    // Close button
    document.getElementById('gdriveModalCloseBtn')?.addEventListener('click', () => {
      gdriveModal?.close();
    });

    // Close on backdrop click
    gdriveModal?.addEventListener('click', (e) => {
      const rect = gdriveModal.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        gdriveModal.close();
      }
    });

    // Connect/Disconnect button
    document.getElementById('gdriveAuthBtn')?.addEventListener('click', () => {
      if (gdriveAccessToken) {
        disconnectGoogleDrive();
      } else {
        connectGoogleDrive();
      }
    });

    // Backup Now button
    document.getElementById('gdriveBackupNowBtn')?.addEventListener('click', () => {
      backupToGoogleDrive(false);
    });

    // Restore Now button
    document.getElementById('gdriveRestoreNowBtn')?.addEventListener('click', () => {
      restoreFromGoogleDrive();
    });

    // Auto-sync Toggle
    document.getElementById('gdriveAutoSyncToggle')?.addEventListener('change', (e) => {
      gdriveAutoBackupEnabled = e.target.checked;
      localStorage.setItem(GDRIVE_AUTOBACKUP_KEY, gdriveAutoBackupEnabled);
      showToast(gdriveAutoBackupEnabled ? 'Auto-backup enabled' : 'Auto-backup disabled');
      if (gdriveAutoBackupEnabled && gdriveAccessToken) {
        backupToGoogleDrive(true);
      }
    });

    // Save Client ID button
    document.getElementById('gdriveSaveClientIdBtn')?.addEventListener('click', () => {
      const input = document.getElementById('gdriveClientIdInput');
      const val = (input?.value || '').trim();
      if (!val) {
        alert('Please enter a valid Google Client ID.');
        return;
      }
      localStorage.setItem(GDRIVE_CLIENT_ID_KEY, val);
      showToast('Client ID saved! Click Connect to authenticate.');
      connectGoogleDrive();
    });

    // Download Excel button inside modal
    document.getElementById('gdriveDownloadExcelBtn')?.addEventListener('click', () => {
      downloadBackupExcel();
    });

    // Download CSV button inside modal
    document.getElementById('gdriveDownloadCsvBtn')?.addEventListener('click', () => {
      downloadBackupCsv();
    });

    // Download Local JSON button inside modal
    document.getElementById('gdriveDownloadJsonBtn')?.addEventListener('click', () => {
      downloadBackupJson();
    });

    // Save Offline (LocalStorage) button inside modal
    document.getElementById('saveOfflineNowBtn')?.addEventListener('click', () => {
      persistData(true);
      showToast('All data saved offline in LocalStorage');
    });
  }

  // --------------------------------------------------------------------------
  // Gym & Workout Module (Faithfully matching reference image)
  // --------------------------------------------------------------------------
  const GYM_STORAGE_KEY = 'digital_weekly_planner_gym_v2';

  const DEFAULT_GYM_DATA = {
    activeDay: 'mon',
    days: {
      mon: {
        split: 'Chest & Triceps',
        exercises: [],
        guides: [
          { id: 'guide_pushup', title: 'Push-Up', duration: '0:24', muscle: 'Chest & Delts', video: 'video1.mp4', image: 'gym_pushup.jpg', color: '#f97316', type: 'pushup' },
          { id: 'guide_dumbbell', title: 'Doumbell Press', duration: '0:41', muscle: 'Pectorals', video: 'video2.mp4', image: 'gym_dumbbell.jpg', color: '#22c55e', type: 'dumbbell' },
          { id: 'guide_tricep', title: 'Tricep Dips', duration: '0:28', muscle: 'Triceps', video: 'video3.mp4', image: 'gym_tricep.jpg', color: '#38bdf8', type: 'tricep' },
          { id: 'guide_incline', title: 'Incline Push-up', duration: '0:32', muscle: 'Upper Chest', video: 'video4.mp4', image: 'gym_incline.jpg', color: '#eab308', checked: true, type: 'incline' }
        ]
      },
      tue: {
        split: 'Back & Biceps',
        exercises: [],
        guides: [
          { id: 'guide_pullup', title: 'Pull-Up', duration: '0:30', muscle: 'Lats & Rhomboids', color: '#3b82f6', type: 'pullup' },
          { id: 'guide_lat', title: 'Lat Pulldown', duration: '0:35', muscle: 'Upper Lats', color: '#8b5cf6', type: 'lat' },
          { id: 'guide_row', title: 'Barbell Row', duration: '0:40', muscle: 'Mid-Back', color: '#ec4899', type: 'row' },
          { id: 'guide_curl', title: 'Bicep Curl', duration: '0:25', muscle: 'Biceps Brachii', color: '#10b981', checked: false, type: 'curl' }
        ]
      },
      wed: {
        split: 'Legs & Calves',
        exercises: [],
        guides: [
          { id: 'guide_squat', title: 'Barbell Squat', duration: '0:45', muscle: 'Quadriceps', color: '#f59e0b', type: 'squat' },
          { id: 'guide_lunge', title: 'Walking Lunges', duration: '0:30', muscle: 'Glutes & Quads', color: '#ef4444', type: 'lunge' },
          { id: 'guide_legpress', title: 'Leg Press', duration: '0:35', muscle: 'Hamstrings & Quads', color: '#06b6d4', type: 'legpress' },
          { id: 'guide_calves', title: 'Calf Raises', duration: '0:25', muscle: 'Gastrocnemius', color: '#84cc16', checked: false, type: 'calves' }
        ]
      },
      thu: {
        split: 'Shoulders & Traps',
        exercises: [],
        guides: [
          { id: 'guide_ohp', title: 'Overhead Press', duration: '0:35', muscle: 'Anterior Delts', color: '#6366f1', type: 'ohp' },
          { id: 'guide_latraise', title: 'Lateral Raises', duration: '0:25', muscle: 'Lateral Delts', color: '#14b8a6', type: 'latraise' },
          { id: 'guide_facepull', title: 'Face Pulls', duration: '0:30', muscle: 'Rear Delts', color: '#f43f5e', type: 'facepull' },
          { id: 'guide_shrug', title: 'Dumbbell Shrugs', duration: '0:20', muscle: 'Trapezius', color: '#a855f7', checked: false, type: 'shrug' }
        ]
      },
      fri: {
        split: 'Full Body & Core',
        exercises: [],
        guides: [
          { id: 'guide_deadlift', title: 'Deadlift', duration: '0:40', muscle: 'Posterior Chain', color: '#d97706', type: 'deadlift' },
          { id: 'guide_dips', title: 'Chest Dips', duration: '0:28', muscle: 'Chest & Arms', color: '#0ea5e9', type: 'dips' },
          { id: 'guide_legraise', title: 'Leg Raises', duration: '0:25', muscle: 'Lower Abs', color: '#10b981', type: 'legraise' },
          { id: 'guide_plank', title: 'Plank Hold', duration: '1:00', muscle: 'Core & Transverse', color: '#ec4899', checked: true, type: 'plank' }
        ]
      },
      sat: {
        split: 'Cardio & Abs',
        exercises: [],
        guides: [
          { id: 'guide_jumprope', title: 'Jump Rope', duration: '2:00', muscle: 'Cardiovascular', color: '#f97316', type: 'jumprope' },
          { id: 'guide_twist', title: 'Russian Twists', duration: '0:35', muscle: 'Obliques', color: '#8b5cf6', type: 'twist' },
          { id: 'guide_crunches', title: 'Bicycle Crunches', duration: '0:30', muscle: 'Rectus Abdominis', color: '#06b6d4', type: 'crunches' },
          { id: 'guide_walk', title: 'Incline Walk', duration: '25:00', muscle: 'Aerobic Stamina', color: '#22c55e', checked: false, type: 'walk' }
        ]
      },
      sun: {
        split: 'Rest & Mobility',
        exercises: [],
        guides: [
          { id: 'guide_stretch', title: 'Full Body Stretch', duration: '15:00', muscle: 'Joint Mobility', color: '#38bdf8', type: 'stretch' },
          { id: 'guide_foam', title: 'Foam Roller', duration: '10:00', muscle: 'Myofascial Release', color: '#a855f7', type: 'foam' },
          { id: 'guide_hip', title: 'Hip Mobility', duration: '5:00', muscle: 'Hip Flexors', color: '#10b981', type: 'hip' },
          { id: 'guide_lightwalk', title: 'Recovery Walk', duration: '30:00', muscle: 'Active Recovery', color: '#eab308', checked: true, type: 'lightwalk' }
        ]
      }
    }
  };

  let gymData = null;
  let editingGymExId = null;
  let gymDemoInterval = null;
  let gymDemoSeconds = 24;
  let gymDemoRunning = false;

  function loadGymData() {
    try {
      // Clear any legacy v1 mock data if present
      localStorage.removeItem('digital_weekly_planner_gym_v1');
      const raw = localStorage.getItem(GYM_STORAGE_KEY);
      if (raw) {
        gymData = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse gym data from localStorage', e);
    }
    if (!gymData || !gymData.days) {
      gymData = JSON.parse(JSON.stringify(DEFAULT_GYM_DATA));
    }
  }

  function persistGymData() {
    try {
      localStorage.setItem(GYM_STORAGE_KEY, JSON.stringify(gymData));
      updateDashboardView();
    } catch (e) {
      console.error('Failed to save gym data', e);
    }
  }

  function renderGym() {
    const listEl = document.getElementById('gymExercisesList');
    const guidesEl = document.getElementById('gymGuidesGrid');
    const splitTitleEl = document.getElementById('gymSplitTitle');
    const progressSummaryEl = document.getElementById('gymProgressSummary');
    const itemsCountEl = document.getElementById('gymItemsCountBadge');
    if (!listEl || !gymData) return;

    const activeDayKey = gymData.activeDay || 'mon';
    const currentDayData = gymData.days[activeDayKey] || gymData.days.mon;

    // 1. Update Day Tabs active state
    document.querySelectorAll('.gym-day-tab').forEach(tab => {
      const day = tab.getAttribute('data-gym-day');
      if (day === activeDayKey) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Update Split Banner
    const dayNames = {
      mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'
    };
    const dayDisplay = dayNames[activeDayKey] || 'Mon';
    if (splitTitleEl) {
      splitTitleEl.innerHTML = `${dayDisplay} &bull; ${escapeMarkup(currentDayData.split)}`;
    }

    // 3. Calculate Completion
    const exercises = currentDayData.exercises || [];
    const totalCount = exercises.length;
    const completedCount = exercises.filter(ex => ex.completed).length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if (progressSummaryEl) {
      progressSummaryEl.innerHTML = `${completedCount} of ${totalCount} completed &bull; ${pct}%`;
    }
    if (itemsCountEl) {
      itemsCountEl.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;
    }

    // 4. Render Exercises List
    if (exercises.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 36px 16px; text-align: center; color: #94a3b8; font-size: 0.88rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.65;">
            <path d="M2 10v4M6 7v10M18 7v10M22 10v4M6 12h12"/>
          </svg>
          <span style="font-weight: 600; color: #64748b; font-size: 0.95rem;">No exercises added for ${dayDisplay}</span>
          <span style="font-size: 0.8rem; color: #94a3b8;">Click "+ Add Exercise" above to start your workout routine!</span>
        </div>
      `;
    } else {
      listEl.innerHTML = exercises.map((ex, idx) => {
        const isDone = Boolean(ex.completed);
        return `
          <div class="gym-exercise-row ${isDone ? 'completed' : ''}" data-ex-id="${ex.id}">
            <div class="gym-ex-left">
              <span class="gym-ex-num">${idx + 1}</span>
              <button type="button" class="gym-check-box ${isDone ? 'checked' : ''}" data-action="toggle-check" data-ex-id="${ex.id}" aria-label="Toggle exercise">
                ${isDone ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
              </button>
              <div class="gym-ex-info">
                <span class="gym-ex-name">${escapeMarkup(ex.name)}</span>
                <div class="gym-ex-meta">
                  <span>${escapeMarkup(ex.sets)}</span>
                  <span class="gym-guide-badge">GUIDE</span>
                </div>
              </div>
            </div>
            <div class="gym-ex-actions">
              <button type="button" class="gym-demo-pill-btn" data-action="demo" data-ex-id="${ex.id}" data-guide-id="${ex.guideId || ''}" title="View Exercise Demo">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>Demo</span>
              </button>
              <button type="button" class="gym-icon-action-btn" data-action="edit" data-ex-id="${ex.id}" title="Edit Exercise">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button type="button" class="gym-icon-action-btn delete" data-action="delete" data-ex-id="${ex.id}" title="Delete Exercise">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // 5. Render 4 Visual Guide Cards (faithfully matching reference image!)
    const guides = currentDayData.guides || [];
    if (guidesEl) {
      guidesEl.innerHTML = guides.slice(0, 4).map(g => {
        const matchingEx = exercises.find(e => e.guideId === g.id || e.name.toLowerCase() === g.title.toLowerCase());
        const isChecked = matchingEx ? matchingEx.completed : Boolean(g.checked);
        const safeVideo = g.video ? sanitizeUrl(g.video) : '';
        const safeImage = g.image ? sanitizeUrl(g.image) : '';
        const cardMedia = safeVideo ? `
          <video class="gym-guide-img gym-guide-video" autoplay loop muted playsinline preload="metadata">
            <source src="${escapeHtml(safeVideo)}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        ` : safeImage ? `
          <img src="${escapeHtml(safeImage)}" alt="${escapeHtml(g.title)}" class="gym-guide-img" width="113" height="201">
        ` : `
          <div class="gym-visual-illustration">
            <svg class="gym-visual-svg" viewBox="0 0 160 210" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="145" width="110" height="12" rx="4" fill="#334155"/>
              <ellipse cx="80" cy="110" rx="30" ry="40" fill="${g.color || '#38bdf8'}" fill-opacity="0.3"/>
              <circle cx="80" cy="50" r="10" fill="#94a3b8"/>
            </svg>
          </div>
        `;
        return `
          <div class="gym-guide-item" data-guide-id="${g.id}">
            <div class="gym-guide-header-title">${escapeMarkup(g.title)}</div>
            <div class="gym-guide-card" data-action="open-demo" data-guide-id="${g.id}">
              <div class="gym-guide-top-bar">
                <span class="gym-guide-timer-badge">${escapeMarkup(g.duration || '0:30')}</span>
                ${isChecked ? '<span class="gym-guide-check-badge">&#10003;</span>' : '<span></span>'}
              </div>
              ${cardMedia}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function triggerGymDemo(exId, guideId) {
    const activeDayKey = gymData.activeDay || 'mon';
    const currentDayData = gymData.days[activeDayKey];
    let guide = null;
    let exercise = null;

    if (exId) {
      exercise = currentDayData.exercises.find(e => e.id === exId);
    }
    if (guideId) {
      guide = currentDayData.guides.find(g => g.id === guideId);
    } else if (exercise && exercise.guideId) {
      guide = currentDayData.guides.find(g => g.id === exercise.guideId);
    }
    if (!guide && currentDayData.guides.length > 0) {
      guide = currentDayData.guides[0];
    }
    if (!guide) return;

    // Highlight the card on page
    const cardEl = document.querySelector(`.gym-guide-item[data-guide-id="${guide.id}"] .gym-guide-card`);
    if (cardEl) {
      document.querySelectorAll('.gym-guide-card').forEach(c => c.classList.remove('highlight'));
      cardEl.classList.add('highlight');
      setTimeout(() => cardEl.classList.remove('highlight'), 3000);
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Open Demo Dialog
    const modal = document.getElementById('gymDemoModal');
    const titleEl = document.getElementById('gymDemoTitle');
    const muscleEl = document.getElementById('gymDemoMuscle');
    const canvasEl = document.getElementById('gymDemoCanvas');
    const timerEl = document.getElementById('gymDemoTimer');
    const playPauseBtn = document.getElementById('gymDemoPlayPauseBtn');

    if (titleEl) titleEl.textContent = exercise ? exercise.name : guide.title;
    if (muscleEl) muscleEl.textContent = `Target: ${guide.muscle || currentDayData.split}`;
    if (canvasEl) {
      const safeVideo = guide.video ? sanitizeUrl(guide.video) : '';
      const safeImage = guide.image ? sanitizeUrl(guide.image) : '';
      if (safeVideo) {
        canvasEl.innerHTML = `<video src="${escapeHtml(safeVideo)}" autoplay loop muted playsinline controls style="max-height: 250px; max-width: 100%; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.6);"></video>`;
      } else if (safeImage) {
        canvasEl.innerHTML = `<img src="${escapeHtml(safeImage)}" alt="${escapeHtml(guide.title)}" style="max-height: 250px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.6);">`;
      } else {
        canvasEl.innerHTML = `<div style="color: #38bdf8; font-size: 1.1rem; font-weight: 700;">Demonstrating ${escapeHtml(guide.title)}</div>`;
      }
    }

    let durationSec = 24;
    if (guide.duration) {
      const parts = guide.duration.split(':');
      if (parts.length === 2) {
        durationSec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
    }
    gymDemoSeconds = durationSec;
    if (timerEl) {
      const m = String(Math.floor(gymDemoSeconds / 60)).padStart(2, '0');
      const s = String(gymDemoSeconds % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }

    if (playPauseBtn) playPauseBtn.textContent = 'Pause';
    startGymDemoTimer();

    if (modal) {
      modal.showModal();
    }
  }

  function startGymDemoTimer() {
    stopGymDemoTimer();
    gymDemoRunning = true;
    gymDemoInterval = setInterval(() => {
      if (gymDemoSeconds > 0) {
        gymDemoSeconds--;
        const timerEl = document.getElementById('gymDemoTimer');
        if (timerEl) {
          const m = String(Math.floor(gymDemoSeconds / 60)).padStart(2, '0');
          const s = String(gymDemoSeconds % 60).padStart(2, '0');
          timerEl.textContent = `${m}:${s}`;
        }
      } else {
        stopGymDemoTimer();
        try { triggerSound(true); } catch (_) { }
        showToast('Set Complete! Great job!');
      }
    }, 1000);
  }

  function stopGymDemoTimer() {
    if (gymDemoInterval) {
      clearInterval(gymDemoInterval);
      gymDemoInterval = null;
    }
    gymDemoRunning = false;
  }

  function toggleGymDemoPlayPause() {
    const btn = document.getElementById('gymDemoPlayPauseBtn');
    if (gymDemoRunning) {
      stopGymDemoTimer();
      if (btn) btn.textContent = 'Resume';
    } else {
      startGymDemoTimer();
      if (btn) btn.textContent = 'Pause';
    }
  }

  function resetGymDemoTimer() {
    gymDemoSeconds = 30;
    const timerEl = document.getElementById('gymDemoTimer');
    if (timerEl) timerEl.textContent = '00:30';
    startGymDemoTimer();
    const btn = document.getElementById('gymDemoPlayPauseBtn');
    if (btn) btn.textContent = 'Pause';
  }

  function openGymExerciseModal(exId) {
    editingGymExId = exId;
    const modal = document.getElementById('gymExerciseModal');
    const heading = document.getElementById('gymModalHeading');
    const badge = document.getElementById('gymModalDayBadge');
    const nameInput = document.getElementById('gymExNameInput');
    const setsInput = document.getElementById('gymExSetsInput');
    const repsInput = document.getElementById('gymExRepsInput');
    const daySelect = document.getElementById('gymExDaySelect');

    const activeDay = gymData.activeDay || 'mon';
    if (badge) {
      badge.textContent = `${activeDay.toUpperCase()} • ${gymData.days[activeDay].split}`;
    }
    if (daySelect) daySelect.value = activeDay;

    if (exId) {
      if (heading) heading.textContent = 'Edit Exercise';
      const ex = gymData.days[activeDay].exercises.find(i => i.id === exId);
      if (ex) {
        if (nameInput) nameInput.value = ex.name || '';
        const parts = (ex.sets || '').split('×').map(s => s.trim());
        if (setsInput) setsInput.value = parts[0] || '3 sets';
        if (repsInput) repsInput.value = parts[1] || '12 reps';
      }
    } else {
      if (heading) heading.textContent = 'Add Exercise';
      if (nameInput) nameInput.value = '';
      if (setsInput) setsInput.value = '3 sets';
      if (repsInput) repsInput.value = '12 reps';
    }

    if (modal) modal.showModal();
    nameInput?.focus();
  }

  function saveGymExercise() {
    const modal = document.getElementById('gymExerciseModal');
    const nameInput = document.getElementById('gymExNameInput');
    const setsInput = document.getElementById('gymExSetsInput');
    const repsInput = document.getElementById('gymExRepsInput');
    const daySelect = document.getElementById('gymExDaySelect');

    const name = nameInput?.value.trim() || 'New Exercise';
    const sets = setsInput?.value.trim() || '3 sets';
    const reps = repsInput?.value.trim() || '12 reps';
    const day = daySelect?.value || gymData.activeDay || 'mon';
    const setsCombined = `${sets} × ${reps}`;

    if (editingGymExId) {
      const activeDay = gymData.activeDay || 'mon';
      const ex = gymData.days[activeDay].exercises.find(i => i.id === editingGymExId);
      if (ex) {
        ex.name = name;
        ex.sets = setsCombined;
      }
      showToast('Exercise updated');
    } else {
      const newId = 'ex_' + day + '_' + Date.now();
      if (!gymData.days[day]) gymData.days[day] = { split: 'Workout Routine', exercises: [], guides: [] };
      gymData.days[day].exercises.push({
        id: newId,
        name: name,
        sets: setsCombined,
        guideId: 'guide_pushup',
        completed: false
      });
      gymData.activeDay = day;
      showToast('Exercise added');
    }

    persistGymData();
    renderGym();
    modal?.close();
  }

  function saveGymVideo() {
    const modal = document.getElementById('gymVideoModal');
    const titleInput = document.getElementById('gymGuideTitleInput');
    const muscleInput = document.getElementById('gymGuideMuscleInput');
    const durationInput = document.getElementById('gymGuideDurationInput');

    const title = titleInput?.value.trim() || 'Custom Guide';
    const muscle = muscleInput?.value.trim() || 'Target Muscles';
    const duration = durationInput?.value.trim() || '0:30';
    const activeDay = gymData.activeDay || 'mon';

    const newGuide = {
      id: 'guide_' + Date.now(),
      title: title,
      duration: duration,
      muscle: muscle,
      image: 'gym_pushup.jpg',
      color: '#06b6d4',
      type: 'dumbbell',
      checked: false
    };

    if (gymData.days[activeDay].guides) {
      gymData.days[activeDay].guides.unshift(newGuide);
    }
    persistGymData();
    renderGym();
    modal?.close();
    showToast('Video Guide added');
  }

  function initGymModule() {
    loadGymData();

    // 1. Day Navigation Tabs
    document.querySelectorAll('.gym-day-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const day = e.currentTarget.getAttribute('data-gym-day');
        if (day && gymData.days[day]) {
          gymData.activeDay = day;
          persistGymData();
          renderGym();
        }
      });
    });

    // 2. Exercise Actions (Delegation on #gymExercisesList)
    const listEl = document.getElementById('gymExercisesList');
    if (listEl) {
      listEl.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-action="toggle-check"]');
        const exRow = e.target.closest('.gym-exercise-row');
        const isActionBtn = e.target.closest('.gym-ex-actions');

        // Toggle checkbox if clicked directly on checkbox button OR the exercise info text
        if (toggleBtn || (exRow && !isActionBtn)) {
          const exId = toggleBtn ? toggleBtn.getAttribute('data-ex-id') : exRow.getAttribute('data-ex-id');
          if (!exId) return;

          let ex = null;
          const activeDay = gymData.activeDay || 'mon';
          if (gymData.days[activeDay] && Array.isArray(gymData.days[activeDay].exercises)) {
            ex = gymData.days[activeDay].exercises.find(i => i.id === exId);
          }
          if (!ex) {
            for (const d of Object.values(gymData.days)) {
              if (Array.isArray(d.exercises)) {
                const found = d.exercises.find(i => i.id === exId);
                if (found) { ex = found; break; }
              }
            }
          }

          if (ex) {
            ex.completed = !ex.completed;
            playTickSound();
            persistGymData();
            renderGym();
          }
          return;
        }

        const demoBtn = e.target.closest('[data-action="demo"]');
        if (demoBtn) {
          const exId = demoBtn.getAttribute('data-ex-id');
          const guideId = demoBtn.getAttribute('data-guide-id');
          triggerGymDemo(exId, guideId);
          return;
        }

        const editBtn = e.target.closest('[data-action="edit"]');
        if (editBtn) {
          const exId = editBtn.getAttribute('data-ex-id');
          openGymExerciseModal(exId);
          return;
        }

        const deleteBtn = e.target.closest('[data-action="delete"]');
        if (deleteBtn) {
          const exId = deleteBtn.getAttribute('data-ex-id');
          const activeDay = gymData.activeDay || 'mon';
          gymData.days[activeDay].exercises = gymData.days[activeDay].exercises.filter(i => i.id !== exId);
          persistGymData();
          renderGym();
          showToast('Exercise deleted');
          return;
        }
      });
    }

    // 3. Right Guide Cards Click -> Trigger Demo
    const guidesEl = document.getElementById('gymGuidesGrid');
    if (guidesEl) {
      guidesEl.addEventListener('click', (e) => {
        const card = e.target.closest('.gym-guide-card');
        if (card) {
          const guideId = card.getAttribute('data-guide-id');
          triggerGymDemo(null, guideId);
        }
      });
    }

    // 4. Uncheck All Button
    document.getElementById('gymUncheckBtn')?.addEventListener('click', () => {
      const activeDay = gymData.activeDay || 'mon';
      if (gymData.days[activeDay]) {
        gymData.days[activeDay].exercises.forEach(e => e.completed = false);
        playTickSound();
        persistGymData();
        renderGym();
        showToast('All exercises unchecked for today');
      }
    });

    // 4b. Clear Exercises Button
    document.getElementById('gymClearAllBtn')?.addEventListener('click', () => {
      const activeDay = gymData.activeDay || 'mon';
      if (gymData.days[activeDay]) {
        gymData.days[activeDay].exercises = [];
        persistGymData();
        renderGym();
        showToast('Exercises cleared for today');
      }
    });

    // 5. Reset All Button
    document.getElementById('gymResetAllBtn')?.addEventListener('click', () => {
      gymData = JSON.parse(JSON.stringify(DEFAULT_GYM_DATA));
      persistGymData();
      renderGym();
      showToast('All workouts reset & cleared');
    });

    // 6. Add Exercise Button & Modal
    document.getElementById('gymAddExerciseBtn')?.addEventListener('click', () => {
      openGymExerciseModal(null);
    });

    document.getElementById('gymCancelExBtn')?.addEventListener('click', () => {
      document.getElementById('gymExerciseModal')?.close();
    });

    document.getElementById('gymExerciseForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGymExercise();
    });

    // 7. Add Videos Button & Modal
    document.getElementById('gymAddVideoBtn')?.addEventListener('click', () => {
      document.getElementById('gymVideoModal')?.showModal();
    });

    document.getElementById('gymCancelVideoBtn')?.addEventListener('click', () => {
      document.getElementById('gymVideoModal')?.close();
    });

    document.getElementById('gymVideoForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGymVideo();
    });

    function closeGymDemoModal() {
      stopGymDemoTimer();
      const modal = document.getElementById('gymDemoModal');
      const canvasEl = document.getElementById('gymDemoCanvas');
      if (canvasEl) {
        const video = canvasEl.querySelector('video');
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        canvasEl.innerHTML = '';
      }
      modal?.close();
    }

    // 8. Demo Modal Controls
    document.getElementById('gymCloseDemoBtn')?.addEventListener('click', closeGymDemoModal);
    document.getElementById('gymDemoBottomCloseBtn')?.addEventListener('click', closeGymDemoModal);

    // Backdrop click closes modal
    document.getElementById('gymDemoModal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        closeGymDemoModal();
      }
    });

    document.getElementById('gymDemoPlayPauseBtn')?.addEventListener('click', toggleGymDemoPlayPause);
    document.getElementById('gymDemoResetTimerBtn')?.addEventListener('click', resetGymDemoTimer);
  }

  // Setup 120px Left Navigation Bar Interactivity & View Switching
  function setupLeftRailNav() {
    const rail = document.getElementById('plannerLeftRail');
    if (!rail) return;

    const railButtons = rail.querySelectorAll('.rail-btn');
    const plannerMain = document.getElementById('plannerMain');
    const allViews = document.querySelectorAll('.planner-view-section');

    function switchRailView(targetKey, isInitialLoad = false) {
      try {
        if (targetKey && targetKey !== 'profile' && targetKey !== 'notifications') {
          localStorage.setItem('planner_active_view', targetKey);
        }
      } catch (e) {}
      if (targetKey === 'profile') {
        showToast('Profile: James');
        return;
      }
      if (targetKey === 'notifications') {
        showToast('Notifications: 2 new items');
        return;
      }

      const isDaily = targetKey === 'daily-routine' || targetKey === 'daily';

      if (isDaily) {
        // Show <main class="planner-main" id="plannerMain">
        if (plannerMain) {
          plannerMain.classList.remove('is-hidden');
          plannerMain.style.display = 'flex';
        }
        allViews.forEach(v => {
          v.classList.remove('active');
          v.style.display = 'none';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!isInitialLoad) {
          showToast('Daily Planner');
        }
        if (activeCardUid || activeDayId) {
          setTimeout(() => scrollActiveCardIntoCenter(activeCardUid || activeDayId, 'auto'), 50);
          setTimeout(() => scrollActiveCardIntoCenter(activeCardUid || activeDayId, 'smooth'), 180);
        }
      } else {
        // Hide plannerMain and show the targeted view
        if (plannerMain) {
          plannerMain.style.display = 'none';
        }
        allViews.forEach(v => {
          const vKey = v.getAttribute('data-view');
          if (vKey === targetKey) {
            v.classList.add('active');
            v.style.display = 'flex';
          } else {
            v.classList.remove('active');
            v.style.display = 'none';
          }
        });

        if (targetKey === 'gym') {
          renderGym();
        } else if (targetKey === 'dashboard') {
          updateDashboardView();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!isInitialLoad) {
          const toastLabels = {
            'dashboard': 'Dashboard Overview',
            'gym': '2. Gym (Workout Routine)',
            'routine': '3. Routine (Weekly Priorities)',
            'good-habit': '5. Good Habit (Daily Tracker)'
          };
          if (toastLabels[targetKey]) {
            showToast(toastLabels[targetKey]);
          }
        }
      }

      // Update active highlight on navigation buttons
      railButtons.forEach(b => {
        const bTarget = b.getAttribute('data-rail-target');
        if (bTarget === targetKey || (isDaily && bTarget === 'daily-routine')) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }

    // Attach click listener to each rail button
    railButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-rail-target');
        if (!target) return; // Allow natural link navigation (e.g. href="money.html")
        switchRailView(target);
      });
    });

    // Wire any "Open Daily Planner" buttons inside view panels
    document.querySelectorAll('.btn-open-daily').forEach(btn => {
      btn.addEventListener('click', () => {
        switchRailView('daily-routine');
      });
    });

    // Wire any data-jump-view buttons
    document.querySelectorAll('[data-jump-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vKey = e.currentTarget.getAttribute('data-jump-view');
        if (vKey) switchRailView(vKey);
      });
    });

    // Toolbar controls (Today, Next Week) jump back to Daily if currently viewing another section
    document.getElementById('todayBtn')?.addEventListener('click', () => {
      if (plannerMain && plannerMain.style.display === 'none') {
        switchRailView('daily-routine');
      }
    });


    // View restoration and hash routing (index.html is the Daily Schedule Planner by default)
    let initialTarget = 'daily-routine';
    const hash = (window.location.hash || '').replace('#', '').trim().toLowerCase();
    const validTargets = ['dashboard', 'daily-routine', 'daily', 'gym', 'routine', 'good-habit'];
    if (hash && validTargets.includes(hash)) {
      initialTarget = hash === 'daily' ? 'daily-routine' : hash;
    }

    switchRailView(initialTarget, true);
  }

  // Initialization
  function init() {
    renderDays();
    renderHabits();
    renderPriorities();
    renderNotes();
    renderNextWeek();
    updateDates();
    updateGlobalMetrics();
    renderGym();
    updateDashboardView();
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadStoredData();
    timePicker.init();
    initGymModule();
    init();
    setupModuleAddButtons();
    setupToolbar();
    setupGDriveModule();
    setupMobileDayFilter();
    setupLeftRailNav();
  });
})();
