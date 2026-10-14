import { formatCAD, monthLabel } from '../lib/finance.js'

function StatCard({ label, value, sublabel, accent = 'default' }) {
  const valueColor =
    accent === 'danger'
      ? 'text-rose-600'
      : accent === 'success'
        ? 'text-emerald-600'
        : 'text-slate-900'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-3 truncate text-2xl font-semibold sm:text-3xl ${valueColor}`}>
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500">{sublabel}</p>
    </div>
  )
}

export default function SummaryCards({ spent, budget, remaining, percentUsed }) {
  const remainingAccent = remaining < 0 ? 'danger' : 'success'
  const barColor =
    percentUsed > 100 ? 'bg-rose-500' : percentUsed >= 75 ? 'bg-amber-500' : 'bg-emerald-500'

  return (
    <section aria-label="Monthly summary" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Spent this month"
          value={formatCAD(spent)}
          sublabel={monthLabel()}
        />
        <StatCard
          label="Monthly budget"
          value={formatCAD(budget)}
          sublabel={`${percentUsed.toFixed(0)}% of budget used`}
        />
        <StatCard
          label="Remaining"
          value={formatCAD(remaining)}
          sublabel={remaining < 0 ? 'Over budget' : 'Available to spend'}
          accent={remainingAccent}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-medium text-slate-700">Budget used</span>
          <span className="text-sm text-slate-500">
            {formatCAD(spent)} of {formatCAD(budget)}
          </span>
        </div>
        <div
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(100, Math.round(percentUsed))}
          aria-label="Percentage of monthly budget used"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${barColor}`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
        {remaining < 0 && (
          <p className="mt-3 text-sm font-medium text-rose-600">
            You are {formatCAD(Math.abs(remaining))} over your monthly budget.
          </p>
        )}
      </div>
    </section>
  )
}
