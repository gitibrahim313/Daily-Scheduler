/**
 * Digital Weekly Planner — Dashboard Overview Module (dashboard.js)
 * Standalone, zero-dependency controller for dashboard.html
 */
(() => {
  'use strict';

  function showToast(msg) {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.display = 'block';
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 200);
    }, 2200);
  }

  function initDashboard() {
    // 1. Read stats from localStorage
    try {
      const plannerRaw = localStorage.getItem('digital_weekly_planner_clean_v3');
      let tasksTotal = 0;
      let tasksDone = 0;
      let habitsDone = 0;

      if (plannerRaw) {
        const parsed = JSON.parse(plannerRaw);
        if (parsed.days) {
          Object.values(parsed.days).forEach(day => {
            if (Array.isArray(day.tasks)) {
              tasksTotal += day.tasks.length;
              tasksDone += day.tasks.filter(t => t.completed).length;
            }
          });
        }
        if (Array.isArray(parsed.habits)) {
          parsed.habits.forEach(h => {
            if (Array.isArray(h.days)) {
              habitsDone += h.days.filter(Boolean).length;
            }
          });
        }
      }

      const taskPct = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 90;
      const tasksEl = document.getElementById('dashTasksStat');
      const taskPctEl = document.getElementById('dashTaskPct');
      const habitsEl = document.getElementById('dashHabitsStat');

      if (tasksEl) tasksEl.textContent = `${tasksDone}/${tasksTotal}`;
      if (taskPctEl) taskPctEl.textContent = `${taskPct}% completed`;
      if (habitsEl) habitsEl.textContent = `${habitsDone} checkins`;

      // 2. Gym Data
      const gymRaw = localStorage.getItem('digital_weekly_planner_gym_v2');
      let gymTotal = 0;
      let gymDone = 0;
      if (gymRaw) {
        const parsedGym = JSON.parse(gymRaw);
        if (parsedGym.days) {
          Object.values(parsedGym.days).forEach(d => {
            if (Array.isArray(d.exercises)) {
              gymTotal += d.exercises.length;
              gymDone += d.exercises.filter(e => e.completed).length;
            }
          });
        }
      }
      const gymStatEl = document.getElementById('dashGymStat');
      if (gymStatEl) gymStatEl.textContent = `${gymDone}/${gymTotal} exercises`;

      // 3. Money Data
      const moneyRaw = localStorage.getItem('digital_weekly_planner_money_v1');
      let netBalance = 0;
      if (moneyRaw) {
        const parsedMoney = JSON.parse(moneyRaw);
        if (Array.isArray(parsedMoney.transactions)) {
          parsedMoney.transactions.forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            if (t.type === 'income') netBalance += amt;
            else netBalance -= amt;
          });
        }
      }
      const moneyStatEl = document.getElementById('dashMoneyStat');
      if (moneyStatEl) moneyStatEl.textContent = `₹${netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    } catch (e) {
      console.warn('Dashboard stats loader error', e);
    }

    // Interactive Navigation Tabs in Header
    const tabs = document.querySelectorAll('.dash-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-tab') || tab.textContent.trim();
        showToast(`Switched to ${tabName}`);
      });
    });

    // Theme Switch
    const themeBtns = document.querySelectorAll('.dash-theme-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.textContent.trim();
        showToast(`Theme: ${mode} mode`);
      });
    });

    // Calendar strip day selection
    const dayCols = document.querySelectorAll('.dash-day-col');
    dayCols.forEach(col => {
      col.addEventListener('click', () => {
        dayCols.forEach(c => c.classList.remove('active'));
        col.classList.add('active');
        const day = col.querySelector('.dash-day-name')?.textContent || '';
        const num = col.querySelector('.dash-day-num')?.textContent || '';
        showToast(`Selected date: ${day} May ${num}`);
      });
    });

    // View toggles
    const viewBtns = document.querySelectorAll('.dash-view-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const title = btn.getAttribute('title') || 'View';
        showToast(`Switched to ${title}`);
      });
    });

    // Actions
    document.querySelector('.dash-export-btn')?.addEventListener('click', () => showToast('Exporting dashboard data...'));
    document.querySelector('.dash-add-board-btn')?.addEventListener('click', () => showToast('Create new board'));
    document.querySelector('.dash-premium-btn')?.addEventListener('click', () => showToast('Premium features unlocked!'));
    document.querySelector('.dash-btn-check')?.addEventListener('click', () => showToast('UX/UI Design assignments checked'));

    // Rail links
    document.querySelector('a[href="#profile"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Profile: James');
    });
    document.querySelector('a[href="#notifications"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Notifications: 2 new items');
    });
  }

  document.addEventListener('DOMContentLoaded', initDashboard);
})();
