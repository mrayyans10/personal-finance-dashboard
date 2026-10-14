import { useCallback, useEffect, useMemo, useState } from 'react'
import BudgetCard from './components/BudgetCard.jsx'
import CategoryChart from './components/CategoryChart.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import SummaryCards from './components/SummaryCards.jsx'
import {
  createExpense,
  isSameMonth,
  loadBudget,
  loadExpenses,
  saveBudget,
  saveExpenses,
  spendingByCategory,
} from './lib/finance.js'

export default function App() {
  const [expenses, setExpenses] = useState(() => loadExpenses().expenses)
  const [budget, setBudget] = useState(() => loadBudget())

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  useEffect(() => {
    saveBudget(budget)
  }, [budget])

  const addExpense = useCallback(({ name, amount, category }) => {
    setExpenses((prev) => [createExpense({ name, amount, category }), ...prev])
  }, [])

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }, [])

  const handleSaveBudget = useCallback((nextBudget) => {
    setBudget(nextBudget)
  }, [])

  const { spent, remaining, percentUsed, chartData } = useMemo(() => {
    const thisMonth = expenses.filter((expense) => isSameMonth(expense.date))
    const monthSpent = Math.round(
      thisMonth.reduce((sum, expense) => sum + expense.amount, 0) * 100,
    ) / 100

    return {
      spent: monthSpent,
      remaining: Math.round((budget - monthSpent) * 100) / 100,
      percentUsed: budget > 0 ? (monthSpent / budget) * 100 : monthSpent > 0 ? 100 : 0,
      chartData: spendingByCategory(thisMonth),
    }
  }, [expenses, budget])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Personal Finance Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Track this month&rsquo;s spending against your budget. All amounts in CAD.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SummaryCards
          spent={spent}
          budget={budget}
          remaining={remaining}
          percentUsed={percentUsed}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <ExpenseForm onAddExpense={addExpense} />
            <BudgetCard budget={budget} onSaveBudget={handleSaveBudget} />
          </div>

          <div className="space-y-6 lg:col-span-3">
            <CategoryChart data={chartData} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        <p>Created by Mohammad Rayyan</p>
        <p className="mt-1">Your expenses and budget are stored locally in this browser.</p>
      </footer>
    </div>
  )
}
