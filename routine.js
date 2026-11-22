/**
 * Digital Weekly Planner — Routine & Priorities Module (routine.js)
 * Standalone, zero-dependency controller for routine.html
 */
(() => {
  'use strict';

  const ROUTINE_STORAGE_KEY = 'digital_weekly_planner_routine_v1';

  const DEFAULT_ROUTINE_DATA = {
    morning: [
      { id: 'm_1', text: 'Wake up at 6:30 AM', completed: true },
      { id: 'm_2', text: 'Drink 500ml warm water with lemon', completed: true },
      { id: 'm_3', text: '10 minutes mindfulness meditation', completed: false },
      { id: 'm_4', text: 'Light stretching or mobility work', completed: false },
      { id: 'm_5', text: 'Review today’s top 3 priorities', completed: false }
    ],
    evening: [
      { id: 'e_1', text: 'Wrap up work & clear desk', completed: false },
      { id: 'e_2', text: 'Review completed tasks & accomplishments', completed: false },
      { id: 'e_3', text: 'Turn off screens 45 mins before sleep', completed: false },
      { id: 'e_4', text: 'Read 15-20 pages of a book', completed: false },
      { id: 'e_5', text: 'Prep outfit & workout gear for tomorrow', completed: false }
    ],
    priorities: [
      { id: 'p_1', text: 'Complete weekly project roadmap delivery', completed: false },
      { id: 'p_2', text: 'Maintain 4x gym sessions this week', completed: false },
      { id: 'p_3', text: 'Review monthly personal financial budget', completed: false }
    ]
  };

  let routineData = null;

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

  function loadRoutineData() {
    try {
      const raw = localStorage.getItem(ROUTINE_STORAGE_KEY);
      if (raw) {
        routineData = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse routine data from localStorage', e);
    }
    if (!routineData || !routineData.morning) {
      routineData = JSON.parse(JSON.stringify(DEFAULT_ROUTINE_DATA));
    }
  }

  function persistRoutineData() {
    try {
      localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(routineData));
    } catch (e) {
      console.error('Failed to save routine data', e);
    }
  }

  function renderList(containerId, items, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
      container.innerHTML = `<div style="padding: 16px; text-align: center; color: #94a3b8; font-size: 0.85rem;">No items added yet. Click "+ Add Item" below.</div>`;
      return;
    }

    container.innerHTML = items.map((item, idx) => {
      const isDone = Boolean(item.completed);
      return `
        <div class="gym-exercise-row ${isDone ? 'completed' : ''}" data-category="${category}" data-id="${item.id}" style="padding: 10px 14px;">
          <div class="gym-ex-left" style="gap: 12px;">
            <button type="button" class="gym-check-box ${isDone ? 'checked' : ''}" data-action="toggle-check" aria-label="Toggle item">
              ${isDone ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </button>
            <span style="font-size: 0.88rem; font-weight: 500; color: ${isDone ? '#94a3b8' : '#1e293b'}; ${isDone ? 'text-decoration: line-through;' : ''}">${escapeMarkup(item.text)}</span>
          </div>
          <div class="gym-ex-actions">
            <button type="button" class="gym-icon-action-btn delete" data-action="delete" title="Delete Item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderAll() {
    renderList('routineMorningList', routineData.morning, 'morning');
    renderList('routineEveningList', routineData.evening, 'evening');
    renderList('routinePrioritiesList', routineData.priorities, 'priorities');
  }

  function initRoutineModule() {
    loadRoutineData();
    renderAll();

    // Checkbox and delete delegation
    ['routineMorningList', 'routineEveningList', 'routinePrioritiesList'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      el.addEventListener('click', (e) => {
        const row = e.target.closest('[data-category]');
        if (!row) return;

        const cat = row.getAttribute('data-category');
        const itemId = row.getAttribute('data-id');
        if (!cat || !itemId || !routineData[cat]) return;

        const toggleBtn = e.target.closest('[data-action="toggle-check"]');
        if (toggleBtn) {
          const item = routineData[cat].find(i => i.id === itemId);
          if (item) {
            item.completed = !item.completed;
            persistRoutineData();
            renderAll();
          }
          return;
        }

        const deleteBtn = e.target.closest('[data-action="delete"]');
        if (deleteBtn) {
          routineData[cat] = routineData[cat].filter(i => i.id !== itemId);
          persistRoutineData();
          renderAll();
          showToast('Item deleted');
          return;
        }
      });
    });

    // Add item buttons
    document.querySelectorAll('[data-add-cat]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-add-cat');
        const text = prompt(`Enter new item for ${cat}:`);
        if (text && text.trim()) {
          const newItem = {
            id: `${cat}_${Date.now()}`,
            text: text.trim(),
            completed: false
          };
          if (!routineData[cat]) routineData[cat] = [];
          routineData[cat].push(newItem);
          persistRoutineData();
          renderAll();
          showToast('Item added');
        }
      });
    });

    // Reset button
    document.getElementById('routineResetBtn')?.addEventListener('click', () => {
      routineData = JSON.parse(JSON.stringify(DEFAULT_ROUTINE_DATA));
      persistRoutineData();
      renderAll();
      showToast('Routine reset to defaults');
    });
  }

  document.addEventListener('DOMContentLoaded', initRoutineModule);
})();
