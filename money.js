/**
 * Digital Weekly Planner — Money Flow Module (money.js)
 * Standalone, zero-dependency controller for money.html
 */
(() => {
  'use strict';

  const MONEY_STORAGE_KEY = 'digital_weekly_planner_money_v1';

  const DEFAULT_MONEY_DATA = {
    currency: '₹',
    budgetLimit: 0,
    savingsTarget: 0,
    transactions: []
  };

  let moneyData = null;

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

  function loadMoneyData() {
    try {
      const raw = localStorage.getItem(MONEY_STORAGE_KEY);
      if (raw) {
        moneyData = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse money data from localStorage', e);
    }
    if (!moneyData || !Array.isArray(moneyData.transactions)) {
      moneyData = JSON.parse(JSON.stringify(DEFAULT_MONEY_DATA));
    }
    // Remove legacy mock/sample transactions if present
    const mockTitles = new Set([
      'Weekly Salary',
      'Monthly Salary',
      'Grocery Shopping',
      'Internet & Mobile Bill',
      'Gym Membership',
      'Dining Out'
    ]);
    if (Array.isArray(moneyData.transactions)) {
      const hadMockData = moneyData.transactions.some(t => mockTitles.has(t.title) || /^tx_[1-5]$/.test(t.id));
      if (hadMockData) {
        moneyData.transactions = moneyData.transactions.filter(t => !mockTitles.has(t.title) && !/^tx_[1-5]$/.test(t.id));
        persistMoneyData();
      }
    }
    // Clean mock default budget/savings limits if no user transactions exist
    if ((moneyData.budgetLimit === 25000 || moneyData.budgetLimit === 2500) && (!moneyData.transactions || moneyData.transactions.length === 0)) {
      moneyData.budgetLimit = 0;
      persistMoneyData();
    }
    if ((moneyData.savingsTarget === 10000 || moneyData.savingsTarget === 1000) && (!moneyData.transactions || moneyData.transactions.length === 0)) {
      moneyData.savingsTarget = 0;
      persistMoneyData();
    }
    // Auto-migrate legacy dollar currency to INR (₹)
    if (moneyData.currency === '$' || !moneyData.currency) {
      moneyData.currency = '₹';
      persistMoneyData();
    }
  }

  function persistMoneyData() {
    try {
      localStorage.setItem(MONEY_STORAGE_KEY, JSON.stringify(moneyData));
    } catch (e) {
      console.error('Failed to save money data', e);
    }
  }

  function renderMoney() {
    const transactions = moneyData.transactions || [];
    const sym = moneyData.currency || '₹';

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const budgetPct = moneyData.budgetLimit > 0 ? Math.min(100, Math.round((totalExpense / moneyData.budgetLimit) * 100)) : 0;
    const savingsPct = moneyData.savingsTarget > 0 ? Math.min(100, Math.round((Math.max(0, netSavings) / moneyData.savingsTarget) * 100)) : 0;

    // Update Top Summary Cards
    const totalBalanceEl = document.getElementById('moneyTotalBalance');
    const totalIncomeEl = document.getElementById('moneyTotalIncome');
    const totalExpenseEl = document.getElementById('moneyTotalExpense');
    const netSavingsEl = document.getElementById('moneyNetSavings');
    const budgetBarEl = document.getElementById('moneyBudgetBar');
    const budgetRatioEl = document.getElementById('moneyBudgetRatio');
    const savingsBarEl = document.getElementById('moneySavingsBar');
    const savingsRatioEl = document.getElementById('moneySavingsRatio');

    if (totalBalanceEl) totalBalanceEl.textContent = `${sym}${netSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (totalIncomeEl) totalIncomeEl.textContent = `+${sym}${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (totalExpenseEl) totalExpenseEl.textContent = `-${sym}${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (netSavingsEl) netSavingsEl.textContent = `${sym}${Math.max(0, netSavings).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    if (budgetBarEl) budgetBarEl.style.width = `${budgetPct}%`;
    if (budgetRatioEl) {
      budgetRatioEl.textContent = `${sym}${totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ${sym}${Number(moneyData.budgetLimit || 0).toLocaleString('en-IN')} (${budgetPct}%)`;
    }

    if (savingsBarEl) savingsBarEl.style.width = `${savingsPct}%`;
    if (savingsRatioEl) {
      savingsRatioEl.textContent = `${sym}${Math.max(0, netSavings).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ${sym}${Number(moneyData.savingsTarget || 0).toLocaleString('en-IN')} (${savingsPct}%)`;
    }

    // Render Transaction List
    const tableBody = document.getElementById('moneyTxTableBody');
    const emptyState = document.getElementById('moneyTxEmpty');
    const countBadge = document.getElementById('moneyTxCountBadge');

    if (countBadge) countBadge.textContent = `${transactions.length} record${transactions.length === 1 ? '' : 's'}`;

    if (!tableBody) return;

    if (transactions.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      tableBody.innerHTML = transactions.map((t, idx) => {
        const isIncome = t.type === 'income';
        const amtSign = isIncome ? '+' : '-';
        const colorClass = isIncome ? 'tx-amount-income' : 'tx-amount-expense';
        return `
          <tr class="money-tx-row" data-tx-id="${t.id}">
            <td class="tx-col-date">${escapeMarkup(t.date || 'Today')}</td>
            <td class="tx-col-desc">
              <span class="tx-title">${escapeMarkup(t.title)}</span>
              <span class="tx-category-badge">${escapeMarkup(t.category || 'General')}</span>
            </td>
            <td class="tx-col-type">
              <span class="tx-type-pill ${isIncome ? 'income' : 'expense'}">${isIncome ? 'Income' : 'Expense'}</span>
            </td>
            <td class="tx-col-amount ${colorClass}">${amtSign}${sym}${parseFloat(t.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="tx-col-action">
              <button type="button" class="tx-btn-delete" data-action="delete-tx" data-tx-id="${t.id}" title="Delete transaction">&times;</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  function addTransaction(type, title, category, amount, date) {
    if (!title || !amount) return;
    const newTx = {
      id: `tx_${Date.now()}`,
      type: type || 'expense',
      title: title.trim(),
      category: category ? category.trim() : 'General',
      amount: parseFloat(amount) || 0,
      date: date || new Date().toISOString().split('T')[0]
    };
    moneyData.transactions.unshift(newTx);
    persistMoneyData();
    renderMoney();
    showToast(`${newTx.type === 'income' ? 'Income' : 'Expense'} recorded`);
  }

  function initMoneyModule() {
    loadMoneyData();

    // Add Transaction Modal
    const addTxModal = document.getElementById('moneyTxModal');
    const openAddBtn = document.getElementById('moneyAddTxBtn');
    const cancelBtn = document.getElementById('moneyCancelTxBtn');
    const form = document.getElementById('moneyTxForm');

    openAddBtn?.addEventListener('click', () => {
      if (form) form.reset();
      const dateInput = document.getElementById('moneyTxDateInput');
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      addTxModal?.showModal();
    });

    cancelBtn?.addEventListener('click', () => {
      addTxModal?.close();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('moneyTxTypeSelect')?.value || 'expense';
      const title = document.getElementById('moneyTxTitleInput')?.value || '';
      const category = document.getElementById('moneyTxCategorySelect')?.value || 'General';
      const amount = document.getElementById('moneyTxAmountInput')?.value || 0;
      const date = document.getElementById('moneyTxDateInput')?.value || '';

      addTransaction(type, title, category, amount, date);
      addTxModal?.close();
    });

    // Delete Transaction Delegation
    document.getElementById('moneyTxTableBody')?.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('[data-action="delete-tx"]');
      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-tx-id');
        if (id) {
          moneyData.transactions = moneyData.transactions.filter(t => t.id !== id);
          persistMoneyData();
          renderMoney();
          showToast('Transaction removed');
        }
      }
    });

    // Set Budget Limit on click
    document.getElementById('moneyBudgetRatio')?.parentElement?.addEventListener('click', () => {
      const current = moneyData.budgetLimit || 0;
      const input = prompt('Enter monthly budget spend limit (₹):', current ? String(current) : '');
      if (input !== null) {
        const val = parseFloat(input);
        moneyData.budgetLimit = isNaN(val) || val < 0 ? 0 : val;
        persistMoneyData();
        renderMoney();
        showToast('Monthly budget updated');
      }
    });

    // Set Savings Target on click
    document.getElementById('moneySavingsRatio')?.parentElement?.addEventListener('click', () => {
      const current = moneyData.savingsTarget || 0;
      const input = prompt('Enter monthly savings target (₹):', current ? String(current) : '');
      if (input !== null) {
        const val = parseFloat(input);
        moneyData.savingsTarget = isNaN(val) || val < 0 ? 0 : val;
        persistMoneyData();
        renderMoney();
        showToast('Savings target updated');
      }
    });

    // Reset All Transactions
    document.getElementById('moneyResetBtn')?.addEventListener('click', () => {
      moneyData = JSON.parse(JSON.stringify(DEFAULT_MONEY_DATA));
      persistMoneyData();
      renderMoney();
      showToast('Money data reset to clean defaults');
    });

    // Clear All Transactions
    document.getElementById('moneyClearBtn')?.addEventListener('click', () => {
      moneyData.transactions = [];
      persistMoneyData();
      renderMoney();
      showToast('All transactions cleared');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMoneyModule();
    renderMoney();
  });
})();
