import { categoryColor, formatCAD, formatExpenseDate, sortExpenses } from '../lib/finance.js'

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 5.5h14M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M5.5 5.5l.7 10.2a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9l.7-10.2" />
    </svg>
  )
}

export default function ExpenseList({ expenses, onDeleteExpense }) {
  const sorted = sortExpenses(expenses)
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Expenses</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} ·{' '}
            {formatCAD(total)} total
          </p>
        </div>
      </header>

      {sorted.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500">
          No expenses yet. Add one above to see it here.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {sorted.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50/70"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: categoryColor(expense.category) }}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {expense.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {expense.category} · {formatExpenseDate(expense.date)}
                </p>
              </div>

              <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">
                {formatCAD(expense.amount)}
              </span>

              <button
                type="button"
                onClick={() => onDeleteExpense(expense.id)}
                aria-label={`Delete ${expense.name}`}
                title={`Delete ${expense.name}`}
                className="shrink-0 rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-1"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
