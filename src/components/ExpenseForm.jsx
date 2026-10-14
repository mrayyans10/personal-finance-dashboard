import { useState } from 'react'
import { CATEGORIES } from '../lib/finance.js'

const EMPTY = { name: '', amount: '', category: CATEGORIES[0].name }

export default function ExpenseForm({ onAddExpense }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [added, setAdded] = useState('')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const name = form.name.trim()
    const amount = Number(form.amount)
    const nextErrors = {}

    if (!name) nextErrors.name = 'Enter an expense name.'
    if (form.amount.trim() === '' || !Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = 'Enter an amount greater than $0.'
    }
    if (!form.category) nextErrors.category = 'Choose a category.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setAdded('')
      return
    }

    onAddExpense({ name, amount, category: form.category })
    setForm((prev) => ({ ...EMPTY, category: prev.category }))
    setErrors({})
    setAdded(`${name} added.`)
  }

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Add an expense</h2>
      <p className="mt-1 text-sm text-slate-500">Amounts are in Canadian dollars (CAD).</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
        <div>
          <label
            htmlFor="expense-name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Expense name
          </label>
          <input
            id="expense-name"
            name="expense-name"
            type="text"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="e.g. Grocery run"
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="mt-1.5 text-sm text-rose-600">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="expense-amount"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Amount (CAD)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                $
              </span>
              <input
                id="expense-amount"
                name="expense-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) => update('amount', event.target.value)}
                placeholder="0.00"
                className={`${inputClass} pl-7`}
                aria-invalid={Boolean(errors.amount)}
              />
            </div>
            {errors.amount && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="expense-category"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Category
            </label>
            <select
              id="expense-category"
              name="expense-category"
              value={form.category}
              onChange={(event) => update('category', event.target.value)}
              className={inputClass}
              aria-invalid={Boolean(errors.category)}
            >
              {CATEGORIES.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            Add expense
          </button>
          <span className="text-sm text-emerald-600" aria-live="polite">
            {added}
          </span>
        </div>
      </form>
    </section>
  )
}
