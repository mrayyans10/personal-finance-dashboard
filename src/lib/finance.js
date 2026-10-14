// Categories, currency formatting, month helpers and localStorage persistence.

export const CATEGORIES = [
  { name: 'Housing', color: '#8b5cf6' },
  { name: 'Groceries', color: '#10b981' },
  { name: 'Dining', color: '#f59e0b' },
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Utilities', color: '#06b6d4' },
  { name: 'Health', color: '#ef4444' },
  { name: 'Entertainment', color: '#ec4899' },
  { name: 'Shopping', color: '#f97316' },
  { name: 'Other', color: '#64748b' },
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

const COLOR_BY_CATEGORY = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.color]),
)

export function categoryColor(name) {
  return COLOR_BY_CATEGORY[name] ?? '#64748b'
}

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const cadFormatterWhole = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Format a number as Canadian dollars, e.g. 1234.5 -> "$1,234.50". */
export function formatCAD(amount) {
  return cadFormatter.format(Number.isFinite(amount) ? amount : 0)
}

/** Same as formatCAD but without cents, for compact axis/label use. */
export function formatCADWhole(amount) {
  return cadFormatterWhole.format(Number.isFinite(amount) ? amount : 0)
}

export function monthLabel(date = new Date()) {
  return date.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })
}

/** True when an ISO date string (YYYY-MM-DD) falls in the given month. */
export function isSameMonth(isoDate, reference = new Date()) {
  if (typeof isoDate !== 'string') return false
  const parts = isoDate.split('-')
  if (parts.length !== 3) return false
  return (
    Number(parts[0]) === reference.getFullYear() &&
    Number(parts[1]) === reference.getMonth() + 1
  )
}

/** Local-time ISO date (YYYY-MM-DD) that avoids UTC off-by-one shifts. */
export function toISODate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatExpenseDate(isoDate) {
  const parts = String(isoDate).split('-')
  if (parts.length !== 3) return ''
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

export const DEFAULT_BUDGET = 2500

/**
 * Sample expenses for a first visit. Every date is clamped into the current
 * month and never later than today, so the dashboard always looks complete.
 */
export function buildSampleExpenses() {
  const now = new Date()
  const today = now.getDate()
  const atDay = (offset) =>
    toISODate(
      new Date(now.getFullYear(), now.getMonth(), Math.max(1, today - offset)),
    )

  const samples = [
    { name: 'Rent', amount: 1450, category: 'Housing', offset: 11 },
    { name: 'Grocery run', amount: 213.47, category: 'Groceries', offset: 9 },
    { name: 'Corner store', amount: 96.2, category: 'Groceries', offset: 4 },
    { name: 'Dinner out', amount: 42.75, category: 'Dining', offset: 6 },
    { name: 'Coffee', amount: 6.5, category: 'Dining', offset: 2 },
    { name: 'Transit pass top-up', amount: 58, category: 'Transport', offset: 8 },
    { name: 'Hydro bill', amount: 84.3, category: 'Utilities', offset: 10 },
    { name: 'Internet', amount: 79.99, category: 'Utilities', offset: 7 },
    { name: 'Streaming subscription', amount: 24.99, category: 'Entertainment', offset: 5 },
    { name: 'Pharmacy', amount: 35, category: 'Health', offset: 3 },
    { name: 'Running shoes', amount: 119.99, category: 'Shopping', offset: 1 },
  ]

  return samples.map((s, index) => ({
    id: `sample-${index + 1}`,
    name: s.name,
    amount: s.amount,
    category: s.category,
    date: atDay(s.offset),
  }))
}

const EXPENSES_KEY = 'finance-dashboard:expenses'
const BUDGET_KEY = 'finance-dashboard:budget'

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Normalize anything read from storage into a valid expense, or null. */
function normalizeExpense(raw) {
  if (!raw || typeof raw !== 'object') return null
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  const amount = Number(raw.amount)
  if (!name || !Number.isFinite(amount) || amount <= 0) return null
  const category = CATEGORY_NAMES.includes(raw.category) ? raw.category : 'Other'
  const date = typeof raw.date === 'string' && raw.date.length === 10 ? raw.date : toISODate()
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : makeId(),
    name,
    amount: Math.round(amount * 100) / 100,
    category,
    date,
  }
}

/** Returns the persisted expenses, or sample data on a first visit. */
export function loadExpenses() {
  try {
    const stored = localStorage.getItem(EXPENSES_KEY)
    if (stored === null) return { expenses: buildSampleExpenses(), isSample: true }
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return { expenses: buildSampleExpenses(), isSample: true }
    return { expenses: parsed.map(normalizeExpense).filter(Boolean), isSample: false }
  } catch {
    return { expenses: buildSampleExpenses(), isSample: true }
  }
}

export function saveExpenses(expenses) {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
  } catch {
    // Storage unavailable (private mode/quota) — the app still works in-memory.
  }
}

export function loadBudget() {
  try {
    const stored = localStorage.getItem(BUDGET_KEY)
    if (stored === null) return DEFAULT_BUDGET
    const parsed = Number(stored)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_BUDGET
  } catch {
    return DEFAULT_BUDGET
  }
}

export function saveBudget(budget) {
  try {
    localStorage.setItem(BUDGET_KEY, String(budget))
  } catch {
    // Ignore storage failures.
  }
}

export function createExpense({ name, amount, category, date }) {
  return {
    id: makeId(),
    name: name.trim(),
    amount: Math.round(amount * 100) / 100,
    category: CATEGORY_NAMES.includes(category) ? category : 'Other',
    date: date || toISODate(),
  }
}

/** Total grouped by category, sorted largest first. */
export function spendingByCategory(expenses) {
  const totals = new Map()
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
  }
  return [...totals.entries()]
    .map(([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100,
      color: categoryColor(category),
    }))
    .sort((a, b) => b.total - a.total)
}

export function sortExpenses(expenses) {
  return [...expenses].sort((a, b) => {
    if (a.date === b.date) return 0
    return a.date < b.date ? 1 : -1
  })
}
