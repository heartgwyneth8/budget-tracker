'use client'

import { useState } from 'react'
import { TrendingUp, Edit2, Check, X, Calendar } from 'lucide-react'

interface IncomeInputProps {
  income: number
  onIncomeChange: (income: number) => void
  colors: any
  formatPeso: (amount: number) => string
  isWeekly?: boolean
}

export default function IncomeInput({ income, onIncomeChange, colors, formatPeso, isWeekly = false }: IncomeInputProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempIncome, setTempIncome] = useState(income.toString())

  const handleSave = () => {
    const newIncome = parseFloat(tempIncome) || 0
    onIncomeChange(newIncome)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempIncome(income.toString())
    setIsEditing(false)
  }

  // Calculate monthly projection
  const monthlyProjection = income * 4

  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: colors.lightPink, border: `2px solid ${colors.pink}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="mr-3" style={{ color: colors.pink }} size={24} />
          <div>
            <h3 className="font-bold text-lg" style={{ color: colors.pink }}>
              {isWeekly ? 'Weekly Allowance' : 'Monthly Income'}
            </h3>
            <p className="text-sm" style={{ color: colors.pink }}>
              Set your {isWeekly ? 'weekly allowance' : 'monthly income'} to calculate 50/30/20 budgets
            </p>
          </div>
        </div>
        
        {!isEditing ? (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: colors.pink }}>{formatPeso(income)}</div>
              <div className="text-sm" style={{ color: colors.pink }}>
                {isWeekly ? 'Per week' : 'Per month'}
                {isWeekly && <div className="mt-1">({formatPeso(monthlyProjection)} per month)</div>}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.pink, color: 'white' }}
              title="Edit allowance"
            >
              <Edit2 size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.pink }}>₱</span>
              <input
                type="number"
                value={tempIncome}
                onChange={(e) => setTempIncome(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg"
                style={{ borderColor: colors.pink, color: colors.darkGreen }}
                placeholder="Enter amount"
                autoFocus
              />
            </div>
            <button
              onClick={handleSave}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.darkGreen, color: 'white' }}
              title="Save"
            >
              <Check size={20} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.lightPink, color: colors.pink }}
              title="Cancel"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* 50/30/20 Breakdown */}
      <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: colors.palePink }}>
        <div className="text-sm font-medium mb-2" style={{ color: colors.pink }}>50/30/20 Budget Breakdown:</div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: colors.darkGreen }}>{formatPeso(income * 0.5)}</div>
            <div className="text-sm" style={{ color: colors.darkGreen }}>
              Needs (50%)
              {isWeekly && <div className="mt-1">Monthly: {formatPeso(income * 0.5 * 4)}</div>}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: colors.pink }}>{formatPeso(income * 0.3)}</div>
            <div className="text-sm" style={{ color: colors.pink }}>
              Wants (30%)
              {isWeekly && <div className="mt-1">Monthly: {formatPeso(income * 0.3 * 4)}</div>}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: colors.olive }}>{formatPeso(income * 0.2)}</div>
            <div className="text-sm" style={{ color: colors.olive }}>
              Savings (20%)
              {isWeekly && <div className="mt-1">Monthly: {formatPeso(income * 0.2 * 4)}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}