'use client'

import { useState } from 'react'
import { Plus, Trash2, TrendingDown, Calendar } from 'lucide-react'
import { Expense, CategoryType } from './types'

interface ExpenseTrackerProps {
  expenses: Expense[]
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void
  onDeleteExpense: (id: string) => void
  colors: any
  formatPeso: (amount: number) => string
}

export default function ExpenseTracker({ 
  expenses, 
  onAddExpense, 
  onDeleteExpense, 
  colors, 
  formatPeso 
}: ExpenseTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: 'need' as CategoryType,
    recurring: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExpense.amount || !newExpense.description) return

    onAddExpense({
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category,
      recurring: newExpense.recurring,
      weekId: ''
    })

    setNewExpense({
      amount: '',
      description: '',
      category: 'need',
      recurring: false
    })
    setShowForm(false)
  }

  const getCategoryColor = (category: CategoryType) => {
    switch(category) {
      case 'need': return colors.darkGreen
      case 'want': return colors.pink
      case 'savings': return colors.olive
    }
  }

  const getCategoryBgColor = (category: CategoryType) => {
    switch(category) {
      case 'need': return colors.lightGreen
      case 'want': return colors.palePink
      case 'savings': return colors.cream
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.darkGreen }}>Expense Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl font-medium flex items-center hover:opacity-90 transition-opacity"
          style={{ backgroundColor: colors.pink, color: 'white' }}
        >
          <Plus size={20} className="mr-2" />
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: colors.palePink, border: `2px solid ${colors.pink}` }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.pink }}>Add New Expense</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2" style={{ color: colors.pink }}>Amount (₱)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.pink }}>₱</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl"
                    style={{ borderColor: colors.pink, color: colors.darkGreen }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2" style={{ color: colors.pink }}>Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value as CategoryType})}
                  className="w-full px-4 py-3 border rounded-xl"
                  style={{ borderColor: colors.pink, color: colors.darkGreen, backgroundColor: 'white' }}
                >
                  <option value="need">Need</option>
                  <option value="want">Want</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ color: colors.pink }}>Description</label>
              <input
                type="text"
                placeholder="What was this expense for?"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl"
                style={{ borderColor: colors.pink, color: colors.darkGreen }}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="recurring"
                checked={newExpense.recurring}
                onChange={(e) => setNewExpense({...newExpense, recurring: e.target.checked})}
                className="w-5 h-5 rounded"
                style={{ color: colors.pink }}
              />
              <label htmlFor="recurring" className="ml-2 font-medium" style={{ color: colors.pink }}>
                Recurring expense (monthly)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.pink }}
            >
              Add Expense
            </button>
          </form>
        </div>
      )}

      {/* Expense List */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.lightGreen }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: colors.darkGreen }}>Recent Expenses</h3>
          <div className="text-sm font-medium" style={{ color: colors.darkGreen }}>
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <TrendingDown size={48} className="mx-auto mb-4" style={{ color: colors.darkGreen }} />
            <p className="text-lg" style={{ color: colors.darkGreen }}>No expenses yet</p>
            <p className="text-sm mt-2" style={{ color: colors.darkGreen }}>Add your first expense to get started</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {expenses.map(expense => (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: getCategoryBgColor(expense.category) }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  >
                    <TrendingDown className="text-white" size={18} />
                  </div>
                  <div>
                    <div className="font-bold" style={{ color: getCategoryColor(expense.category) }}>
                      {expense.description}
                    </div>
                    <div className="text-sm flex items-center" style={{ color: getCategoryColor(expense.category) }}>
                      <span className="capitalize mr-2">{expense.category}</span>
                      <Calendar size={12} className="mr-1" />
                      {expense.date}
                      {expense.recurring && ' • 🔄'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="font-bold" style={{ color: getCategoryColor(expense.category) }}>
                    {formatPeso(expense.amount)}
                  </div>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-1.5 hover:bg-white/30 rounded-lg transition-colors"
                    style={{ color: getCategoryColor(expense.category) }}
                    title="Delete expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

}
