import { formatCAD, formatCADWhole } from '../lib/finance.js'

export default function CategoryChart({ data }) {
  const max = data.reduce((highest, row) => Math.max(highest, row.total), 0)
  const total = data.reduce((sum, row) => sum + row.total, 0)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">Spending by category</h2>
        {total > 0 && (
          <span className="text-sm text-slate-500">{formatCADWhole(total)} total</span>
        )}
      </header>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No spending recorded for this month yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-3.5">
          {data.map((row) => {
            const share = total > 0 ? (row.total / total) * 100 : 0
            const width = max > 0 ? (row.total / max) * 100 : 0

            return (
              <li key={row.category}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-700">
                    {row.category}
                  </span>
                  <span className="shrink-0 tabular-nums text-slate-500">
                    {formatCAD(row.total)}
                    <span className="ml-1.5 text-xs text-slate-400">
                      {share.toFixed(0)}%
                    </span>
                  </span>
                </div>
                <div
                  className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"
                  role="img"
                  aria-label={`${row.category}: ${formatCAD(row.total)}, ${share.toFixed(0)} percent of spending`}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${Math.max(width, 2)}%`, backgroundColor: row.color }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
