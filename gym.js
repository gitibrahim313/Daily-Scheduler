/**
 * Digital Weekly Planner — Gym & Workout Module (gym.js)
 * Standalone, zero-dependency controller for gym.html
 */
(() => {
  'use strict';

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
  let audioCtx = null;

  function escapeMarkup(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function playTickSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch (e) {
      // Audio fallback silent
    }
  }

  function showToast(message) {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  function loadGymData() {
    try {
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

    // 1. Day Navigation Tabs
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

    // 2. Split Banner
    const dayNames = {
      mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'
    };
    const dayDisplay = dayNames[activeDayKey] || 'Mon';
    if (splitTitleEl) {
      splitTitleEl.innerHTML = `${dayDisplay} &bull; ${escapeMarkup(currentDayData.split)}`;
    }

    // 3. Completion Metric
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

    // 5. Visual Guide Cards
    const guides = currentDayData.guides || [];
    if (guidesEl) {
      guidesEl.innerHTML = guides.slice(0, 4).map(g => {
        const matchingEx = exercises.find(e => e.guideId === g.id || e.name.toLowerCase() === g.title.toLowerCase());
        const isChecked = matchingEx ? matchingEx.completed : Boolean(g.checked);
        const cardMedia = g.video ? `
          <video class="gym-guide-img gym-guide-video" autoplay loop muted playsinline preload="metadata">
            <source src="${g.video}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        ` : g.image ? `
          <img src="${g.image}" alt="${escapeMarkup(g.title)}" class="gym-guide-img" width="113" height="201">
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

    // Highlight card
    const cardEl = document.querySelector(`.gym-guide-item[data-guide-id="${guide.id}"] .gym-guide-card`);
    if (cardEl) {
      document.querySelectorAll('.gym-guide-card').forEach(c => c.classList.remove('highlight'));
      cardEl.classList.add('highlight');
      setTimeout(() => cardEl.classList.remove('highlight'), 3000);
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const modal = document.getElementById('gymDemoModal');
    const titleEl = document.getElementById('gymDemoTitle');
    const muscleEl = document.getElementById('gymDemoMuscle');
    const canvasEl = document.getElementById('gymDemoCanvas');
    const timerEl = document.getElementById('gymDemoTimer');
    const playPauseBtn = document.getElementById('gymDemoPlayPauseBtn');

    if (titleEl) titleEl.textContent = exercise ? exercise.name : guide.title;
    if (muscleEl) muscleEl.textContent = `Target: ${guide.muscle || currentDayData.split}`;
    if (canvasEl) {
      if (guide.video) {
        canvasEl.innerHTML = `<video src="${guide.video}" autoplay loop muted playsinline controls style="max-height: 250px; max-width: 100%; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.6);"></video>`;
      } else if (guide.image) {
        canvasEl.innerHTML = `<img src="${guide.image}" alt="${escapeMarkup(guide.title)}" style="max-height: 250px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.6);">`;
      } else {
        canvasEl.innerHTML = `<div style="color: #38bdf8; font-size: 1.1rem; font-weight: 700;">Demonstrating ${escapeMarkup(guide.title)}</div>`;
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
        const playPauseBtn = document.getElementById('gymDemoPlayPauseBtn');
        if (playPauseBtn) playPauseBtn.textContent = 'Finished';
      }
    }, 1000);
  }

  function stopGymDemoTimer() {
    gymDemoRunning = false;
    if (gymDemoInterval) {
      clearInterval(gymDemoInterval);
      gymDemoInterval = null;
    }
  }

  function toggleGymDemoPlayPause() {
    const playPauseBtn = document.getElementById('gymDemoPlayPauseBtn');
    if (gymDemoRunning) {
      stopGymDemoTimer();
      if (playPauseBtn) playPauseBtn.textContent = 'Resume';
    } else {
      if (gymDemoSeconds <= 0) gymDemoSeconds = 30;
      startGymDemoTimer();
      if (playPauseBtn) playPauseBtn.textContent = 'Pause';
    }
  }

  function resetGymDemoTimer() {
    gymDemoSeconds = 30;
    const timerEl = document.getElementById('gymDemoTimer');
    const playPauseBtn = document.getElementById('gymDemoPlayPauseBtn');
    if (timerEl) timerEl.textContent = '00:30';
    if (playPauseBtn) playPauseBtn.textContent = 'Pause';
    startGymDemoTimer();
  }

  function openGymExerciseModal(exId) {
    editingGymExId = exId;
    const modal = document.getElementById('gymExerciseModal');
    const nameInput = document.getElementById('gymExNameInput');
    const setsInput = document.getElementById('gymExSetsInput');
    const repsInput = document.getElementById('gymExRepsInput');
    const daySelect = document.getElementById('gymExDaySelect');
    const activeDay = gymData.activeDay || 'mon';

    if (daySelect) daySelect.value = activeDay;

    if (exId) {
      const ex = gymData.days[activeDay].exercises.find(i => i.id === exId);
      if (ex) {
        if (nameInput) nameInput.value = ex.name;
        const setParts = ex.sets.split('×').map(s => s.trim());
        if (setsInput) setsInput.value = setParts[0] || '3 sets';
        if (repsInput) repsInput.value = setParts[1] || '12 reps';
      }
    } else {
      if (nameInput) nameInput.value = '';
      if (setsInput) setsInput.value = '3 sets';
      if (repsInput) repsInput.value = '12 reps';
    }

    if (modal) {
      modal.showModal();
      nameInput?.focus();
    }
  }

  function saveGymExercise() {
    const modal = document.getElementById('gymExerciseModal');
    const nameInput = document.getElementById('gymExNameInput');
    const setsInput = document.getElementById('gymExSetsInput');
    const repsInput = document.getElementById('gymExRepsInput');
    const daySelect = document.getElementById('gymExDaySelect');

    const name = nameInput ? nameInput.value.trim() : '';
    const sets = setsInput ? setsInput.value.trim() : '3 sets';
    const reps = repsInput ? repsInput.value.trim() : '12 reps';
    const targetDay = daySelect ? daySelect.value : (gymData.activeDay || 'mon');

    if (!name) return;

    const formattedSets = `${sets} × ${reps}`;

    if (editingGymExId) {
      const ex = gymData.days[targetDay].exercises.find(i => i.id === editingGymExId);
      if (ex) {
        ex.name = name;
        ex.sets = formattedSets;
        showToast('Exercise updated');
      }
    } else {
      const newEx = {
        id: `ex_${targetDay}_${Date.now()}`,
        name,
        sets: formattedSets,
        completed: false
      };
      if (!gymData.days[targetDay].exercises) {
        gymData.days[targetDay].exercises = [];
      }
      gymData.days[targetDay].exercises.push(newEx);
      showToast('New exercise added');
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
    const urlInput = document.getElementById('gymGuideUrlInput');

    const title = titleInput ? titleInput.value.trim() : '';
    const muscle = muscleInput ? muscleInput.value.trim() : 'Chest & Arms';
    const duration = durationInput ? durationInput.value.trim() : '0:30';
    const url = urlInput ? urlInput.value.trim() : '';

    if (!title) return;

    const activeDay = gymData.activeDay || 'mon';
    const newGuide = {
      id: `guide_${Date.now()}`,
      title,
      muscle,
      duration: duration || '0:30',
      video: url || '',
      color: '#38bdf8'
    };

    if (gymData.days[activeDay]) {
      if (!gymData.days[activeDay].guides) gymData.days[activeDay].guides = [];
      gymData.days[activeDay].guides.push(newGuide);
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

  document.addEventListener('DOMContentLoaded', () => {
    initGymModule();
    renderGym();
  });
})();
