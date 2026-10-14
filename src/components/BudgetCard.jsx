import { useEffect, useState } from 'react'
import { formatCAD } from '../lib/finance.js'

export default function BudgetCard({ budget, onSaveBudget }) {
  const [draft, setDraft] = useState(String(budget))
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  // Keep the field in sync if the budget changes elsewhere.
  useEffect(() => {
    setDraft(String(budget))
  }, [budget])

  function handleSubmit(event) {
    event.preventDefault()
    const parsed = Number(draft)
    if (draft.trim() === '' || !Number.isFinite(parsed) || parsed < 0) {
      setError('Enter a valid budget of $0 or more.')
      return
    }
    setError('')
    onSaveBudget(Math.round(parsed * 100) / 100)
    setSaved(true)
  }

  useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(false), 2000)
    return () => clearTimeout(timer)
  }, [saved])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Monthly budget</h2>
      <p className="mt-1 text-sm text-slate-500">
        Currently set to {formatCAD(budget)} (CAD).
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="budget" className="sr-only">
          Monthly budget in Canadian dollars
        </label>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            $
          </span>
          <input
            id="budget"
            name="budget"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              setError('')
            }}
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-7 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            aria-invalid={Boolean(error)}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          Save budget
        </button>
      </form>

      <div className="mt-2 min-h-5 text-sm" aria-live="polite">
        {error ? (
          <span className="text-rose-600">{error}</span>
        ) : saved ? (
          <span className="text-emerald-600">Budget updated.</span>
        ) : null}
      </div>
    </section>
  )
}
