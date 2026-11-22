/**
 * Digital Weekly Planner — Good Habits Module (habits.js)
 * Standalone, zero-dependency controller for habits.html
 */
(() => {
  'use strict';

  const PLANNER_STORAGE_KEY = 'digital_weekly_planner_clean_v3';

  const DEFAULT_HABITS = [
    { id: 'h1', name: "Get-up Early Morning at 6 O'clock", text: "Get-up Early Morning at 6 O'clock", days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h2', name: 'Take One Glass of Water at least', text: 'Take One Glass of Water at least', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h3', name: 'Take Morning Sun-light at least 15 Minutes', text: 'Take Morning Sun-light at least 15 Minutes', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h4', name: '30 Minutes Workout / 5Km Running', text: '30 Minutes Workout / 5Km Running', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h5', name: 'No-Phone First 30 Minutes', text: 'No-Phone First 30 Minutes', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h6', name: '5-Minutes Meditation', text: '5-Minutes Meditation', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h7', name: 'Off-Screen 45 Minutes, before going to sleep', text: 'Off-Screen 45 Minutes, before going to sleep', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h8', name: '30 Minutes Reading Books', text: '30 Minutes Reading Books', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h9', name: 'Calling (Family, Friends)', text: 'Calling (Family, Friends)', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h10', name: '7-8 Hours of sleep', text: '7-8 Hours of sleep', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h11', name: 'Plan Daily Task Every morning', text: 'Plan Daily Task Every morning', days: [false, false, false, false, false, false, false], streak: 0 },
    { id: 'h12', name: 'Journal for reflection and gratitude', text: 'Journal for reflection and gratitude', days: [false, false, false, false, false, false, false], streak: 0 }
  ];

  let habitsList = [];

  function escapeMarkup(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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

  function loadHabitsData() {
    try {
      const raw = localStorage.getItem(PLANNER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.habits) && parsed.habits.length > 0) {
          const hasOld = parsed.habits.some(h => {
            const val = h.name || h.text || '';
            return val.includes('Drink 2.5L') || val.includes('Drink pani') || val.includes('Limit screen time');
          });
          if (!hasOld) {
            habitsList = parsed.habits;
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse habits data', e);
    }
    habitsList = JSON.parse(JSON.stringify(DEFAULT_HABITS));
  }

  function persistHabitsData() {
    try {
      let fullPlanner = {};
      const raw = localStorage.getItem(PLANNER_STORAGE_KEY);
      if (raw) fullPlanner = JSON.parse(raw);
      fullPlanner.habits = habitsList;
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(fullPlanner));
    } catch (e) {
      console.error('Failed to save habits data', e);
    }
  }

  function renderHabits() {
    const tableBody = document.getElementById('habitsTableBody');
    if (!tableBody) return;

    const daysShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    tableBody.innerHTML = habitsList.map((habit, hIdx) => {
      const dayChecks = (habit.days || [false, false, false, false, false, false, false]);
      const doneCount = dayChecks.filter(Boolean).length;
      const pct = Math.round((doneCount / 7) * 100);

      const checkPills = dayChecks.map((checked, dIdx) => `
        <button type="button" class="gym-check-box ${checked ? 'checked' : ''}" data-action="toggle-habit-day" data-h-idx="${hIdx}" data-d-idx="${dIdx}" style="width: 22px; height: 22px;">
          ${checked ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </button>
      `).join('');

      return `
        <tr class="money-tx-row" data-h-idx="${hIdx}">
          <td style="font-weight: 600; color: #0f172a;">
            ${escapeMarkup(habit.name || habit.text)}
          </td>
          <td style="text-align: center;">
            <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
              ${checkPills}
            </div>
          </td>
          <td style="text-align: center; font-weight: 700; color: #0284c7;">
            ${doneCount}/7 (${pct}%)
          </td>
          <td style="text-align: center;">
            <button type="button" class="tx-btn-delete" data-action="delete-habit" data-h-idx="${hIdx}" title="Delete habit">&times;</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function initHabitsModule() {
    loadHabitsData();
    renderHabits();

    document.getElementById('habitsTableBody')?.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-action="toggle-habit-day"]');
      if (toggleBtn) {
        const hIdx = parseInt(toggleBtn.getAttribute('data-h-idx'), 10);
        const dIdx = parseInt(toggleBtn.getAttribute('data-d-idx'), 10);
        if (habitsList[hIdx] && Array.isArray(habitsList[hIdx].days)) {
          habitsList[hIdx].days[dIdx] = !habitsList[hIdx].days[dIdx];
          persistHabitsData();
          renderHabits();
        }
        return;
      }

      const deleteBtn = e.target.closest('[data-action="delete-habit"]');
      if (deleteBtn) {
        const hIdx = parseInt(deleteBtn.getAttribute('data-h-idx'), 10);
        if (habitsList[hIdx]) {
          habitsList.splice(hIdx, 1);
          persistHabitsData();
          renderHabits();
          showToast('Habit removed');
        }
      }
    });

    document.getElementById('habitsAddBtn')?.addEventListener('click', () => {
      const name = prompt('Enter new habit name:');
      if (name && name.trim()) {
        habitsList.push({
          id: `h_${Date.now()}`,
          name: name.trim(),
          days: [false, false, false, false, false, false, false]
        });
        persistHabitsData();
        renderHabits();
        showToast('Habit added');
      }
    });

    document.getElementById('habitsResetBtn')?.addEventListener('click', () => {
      habitsList = JSON.parse(JSON.stringify(DEFAULT_HABITS));
      persistHabitsData();
      renderHabits();
      showToast('Habits reset to defaults');
    });
  }

  document.addEventListener('DOMContentLoaded', initHabitsModule);
})();
