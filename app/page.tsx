'use client'

import { useState, useEffect } from 'react'
import { Wallet, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import IncomeInput from './components/IncomeInput'
import BudgetOverview from './components/BudgetOverview'
import ExpenseTracker from './components/ExpenseTracker'
import BudgetChart from './components/BudgetChart'
import WeekHistory from './components/WeekHistory'
import { Expense, WeekSummary } from './components/types'

// Your color palette
const COLORS = {
  pink: '#c66f80',
  lightPink: '#f4c7d0',
  palePink: '#fcebf1',
  darkGreen: '#4a6644',
  olive: '#9faa74',
  lightGreen: '#d7dab3',
  cream: '#ece3d2'
}

// Format currency in Philippine Peso
const formatPeso = (amount: number) => {
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

// Get current week number
const getCurrentWeek = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + start.getDay() + 1) / 7)
}

// Get week start and end dates
const getWeekDates = (weekNumber: number, year: number) => {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = (weekNumber - 1) * 7
  const weekStart = new Date(firstDayOfYear)
  weekStart.setDate(firstDayOfYear.getDate() + daysOffset - firstDayOfYear.getDay())
  
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  return {
    startDate: weekStart.toISOString().split('T')[0],
    endDate: weekEnd.toISOString().split('T')[0]
  }
}

// LocalStorage keys
const STORAGE_KEYS = {
  WEEKLY_ALLOWANCE: 'budget-tracker-weekly-allowance',
  EXPENSES: 'budget-tracker-expenses',
  WEEK_HISTORY: 'budget-tracker-week-history',
  CURRENT_WEEK: 'budget-tracker-current-week',
  CURRENT_YEAR: 'budget-tracker-current-year'
}

export default function BudgetTracker() {
  // Load initial data from localStorage
  const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  const saveToLocalStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  // Initialize state with data from localStorage
  const [weeklyAllowance, setWeeklyAllowance] = useState<number>(() => 
    loadFromLocalStorage(STORAGE_KEYS.WEEKLY_ALLOWANCE, 0)
  )
  const [currentWeek, setCurrentWeek] = useState<number>(() => 
    loadFromLocalStorage(STORAGE_KEYS.CURRENT_WEEK, getCurrentWeek())
  )
  const [currentYear, setCurrentYear] = useState<number>(() => 
    loadFromLocalStorage(STORAGE_KEYS.CURRENT_YEAR, new Date().getFullYear())
  )
  const [weekHistory, setWeekHistory] = useState<WeekSummary[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.WEEK_HISTORY, [])
  )
  const [expenses, setExpenses] = useState<Expense[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.EXPENSES, [])
  )

  // Save data to localStorage whenever state changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.WEEKLY_ALLOWANCE, weeklyAllowance)
  }, [weeklyAllowance])

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.CURRENT_WEEK, currentWeek)
  }, [currentWeek])

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.CURRENT_YEAR, currentYear)
  }, [currentYear])

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.WEEK_HISTORY, weekHistory)
  }, [weekHistory])

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.EXPENSES, expenses)
  }, [expenses])

  // Get current week's expenses
  const currentWeekExpenses = expenses.filter(expense => 
    expense.weekId === `${currentYear}-${currentWeek}`
  )

  const handleAddExpense = (expense: Omit<Expense, 'id' | 'date' | 'weekId'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weekId: `${currentYear}-${currentWeek}`
    }
    const updatedExpenses = [newExpense, ...expenses]
    setExpenses(updatedExpenses)
  }

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id)
    setExpenses(updatedExpenses)
  }

  // Calculate totals for current week
  const needs = currentWeekExpenses
    .filter(e => e.category === 'need')
    .reduce((sum, e) => sum + e.amount, 0)

  const wants = currentWeekExpenses
    .filter(e => e.category === 'want')
    .reduce((sum, e) => sum + e.amount, 0)

  const savings = currentWeekExpenses
    .filter(e => e.category === 'savings')
    .reduce((sum, e) => sum + e.amount, 0)

  const totalSpent = needs + wants + savings
  const remaining = weeklyAllowance - totalSpent
  const budgetUsed = weeklyAllowance > 0 ? (totalSpent / weeklyAllowance) * 100 : 0

  // 50/30/20 allocations based on weekly allowance
  const allocations = {
    needs: weeklyAllowance * 0.5,
    wants: weeklyAllowance * 0.3,
    savings: weeklyAllowance * 0.2
  }

  // Calculate monthly projections (4 weeks)
  const monthlyProjection = weeklyAllowance * 4
  const monthlySavings = savings * 4

  // Start new week
  const startNewWeek = () => {
    if (weeklyAllowance === 0) {
      alert('Please set your weekly allowance first!')
      return
    }

    // Save current week to history
    const weekDates = getWeekDates(currentWeek, currentYear)
    const weekSummary: WeekSummary = {
      id: `${currentYear}-${currentWeek}`,
      weekNumber: currentWeek,
      year: currentYear,
      startDate: weekDates.startDate,
      endDate: weekDates.endDate,
      allowance: weeklyAllowance,
      needs,
      wants,
      savings,
      totalSpent,
      remaining
    }

    const updatedWeekHistory = [weekSummary, ...weekHistory]
    setWeekHistory(updatedWeekHistory)
    
    // Move to next week
    let nextWeek = currentWeek + 1
    let nextYear = currentYear
    
    if (nextWeek > 52) {
      nextWeek = 1
      nextYear += 1
    }
    
    setCurrentWeek(nextWeek)
    setCurrentYear(nextYear)
    
    alert(`Week ${currentWeek} saved! Starting Week ${nextWeek}.`)
  }

  // Load a specific week from history
  const loadWeek = (weekId: string) => {
    const [year, week] = weekId.split('-').map(Number)
    setCurrentWeek(week)
    setCurrentYear(year)
  }

  // Get week dates for display
  const currentWeekDates = getWeekDates(currentWeek, currentYear)

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.cream }}>
      <div className="container mx-auto px-3 sm:px-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Wallet className="h-7 w-7 sm:h-8 sm:w-8" style={{ color: COLORS.pink }} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.darkGreen }}>
                  Weekly Budget Tracker
                </h1>
                <p className="text-sm sm:text-base text-gray-700">
                  Track your weekly allowance using the 50/30/20 budgeting rule
                </p>
              </div>
            </div>
            
            {/* Week Navigation - Only show if allowance is set */}
            {weeklyAllowance > 0 && (
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => loadWeek(`${currentYear}-${currentWeek - 1}`)}
                    className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: COLORS.lightPink, color: COLORS.pink }}
                    title="Previous week"
                  >
                    <ChevronLeft size={18} className="sm:size-5" />
                  </button>
                  
                  <div className="text-center">
                    <div className="font-bold text-base sm:text-lg" style={{ color: COLORS.pink }}>
                      Week {currentWeek}, {currentYear}
                    </div>
                    <div className="text-xs sm:text-sm" style={{ color: COLORS.pink }}>
                      {currentWeekDates.startDate} to {currentWeekDates.endDate}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => loadWeek(`${currentYear}-${currentWeek + 1}`)}
                    className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: COLORS.lightPink, color: COLORS.pink }}
                    title="Next week"
                  >
                    <ChevronRight size={18} className="sm:size-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Start New Week Button - Only show if allowance is set */}
          {weeklyAllowance > 0 && (
            <div className="flex justify-end mb-4 sm:mb-6">
              <button
                onClick={startNewWeek}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold flex items-center hover:opacity-90 transition-opacity text-sm sm:text-base"
                style={{ backgroundColor: COLORS.olive, color: 'white' }}
              >
                <Calendar size={18} className="sm:size-5 mr-1 sm:mr-2" />
                Start New Week
              </button>
            </div>
          )}
        </div>

        {/* Summary Stats - Only show if allowance is set */}
        {weeklyAllowance > 0 && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
              <div className="rounded-xl p-3 sm:p-4 col-span-1" style={{ backgroundColor: COLORS.lightPink }}>
                <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.pink }}>Weekly Allowance</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: COLORS.darkGreen }}>{formatPeso(weeklyAllowance)}</p>
              </div>
              <div className="rounded-xl p-3 sm:p-4 col-span-1" style={{ backgroundColor: COLORS.lightPink }}>
                <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.pink }}>Total Spent</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: COLORS.darkGreen }}>{formatPeso(totalSpent)}</p>
              </div>
              <div className="rounded-xl p-3 sm:p-4 col-span-1" style={{ backgroundColor: COLORS.lightPink }}>
                <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.pink }}>Remaining</p>
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${remaining < 0 ? 'text-red-600' : ''}`} style={{ color: remaining >= 0 ? COLORS.darkGreen : undefined }}>
                  {formatPeso(remaining)}
                </p>
              </div>
              <div className="rounded-xl p-3 sm:p-4 col-span-1" style={{ backgroundColor: COLORS.lightPink }}>
                <p className="text-xs sm:text-sm font-medium" style={{ color: COLORS.pink }}>Budget Used</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: COLORS.darkGreen }}>
                  {budgetUsed.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Monthly Projection */}
            <div className="rounded-xl p-3 sm:p-4 mb-6 sm:mb-8" style={{ backgroundColor: COLORS.lightGreen, border: `2px solid ${COLORS.darkGreen}` }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className="font-bold text-base sm:text-lg" style={{ color: COLORS.darkGreen }}>Monthly Projection</h3>
                  <p className="text-xs sm:text-sm" style={{ color: COLORS.darkGreen }}>Based on 4 weeks of savings</p>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: COLORS.darkGreen }}>{formatPeso(monthlySavings)}</div>
                  <div className="text-xs sm:text-sm" style={{ color: COLORS.darkGreen }}>
                    {formatPeso(savings)} saved this week × 4 weeks
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          <IncomeInput 
            income={weeklyAllowance} 
            onIncomeChange={setWeeklyAllowance}
            colors={COLORS}
            formatPeso={formatPeso}
            isWeekly={true}
          />

          {weeklyAllowance > 0 ? (
            <>
              <BudgetOverview
                income={weeklyAllowance}
                needs={needs}
                wants={wants}
                savings={savings}
                allocations={allocations}
                colors={COLORS}
                formatPeso={formatPeso}
                isWeekly={true}
              />

              <ExpenseTracker
                expenses={currentWeekExpenses}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                colors={COLORS}
                formatPeso={formatPeso}
              />

              <BudgetChart
                income={weeklyAllowance}
                needs={needs}
                wants={wants}
                savings={savings}
                allocations={allocations}
                colors={COLORS}
                formatPeso={formatPeso}
                isWeekly={true}
              />

              {/* Week History - Only show if there's history */}
              {weekHistory.length > 0 && (
                <WeekHistory
                  weekHistory={weekHistory}
                  currentWeekId={`${currentYear}-${currentWeek}`}
                  onLoadWeek={loadWeek}
                  colors={COLORS}
                  formatPeso={formatPeso}
                />
              )}
            </>
          ) : (
            /* Empty State - Show when no allowance is set */
            <div className="rounded-2xl p-6 sm:p-8 lg:p-12 text-center" style={{ backgroundColor: COLORS.lightPink }}>
              <Wallet size={48} className="sm:size-64 mx-auto mb-4 sm:mb-6" style={{ color: COLORS.pink }} />
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: COLORS.pink }}>
                Welcome to Your Budget Tracker! 🎉
              </h2>
              <p className="text-base sm:text-lg mb-4 sm:mb-6" style={{ color: COLORS.pink }}>
                Start by setting your weekly allowance above to begin tracking your expenses
                using the 50/30/20 budgeting rule.
              </p>
              <div className="max-w-2xl mx-auto text-left space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 rounded-xl" style={{ backgroundColor: COLORS.palePink }}>
                  <h3 className="font-bold mb-2 text-sm sm:text-base" style={{ color: COLORS.pink }}>How it works:</h3>
                  <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base" style={{ color: COLORS.pink }}>
                    <li>1. <strong>Set your weekly allowance</strong> - Enter how much you receive each week</li>
                    <li>2. <strong>Add expenses</strong> - Track everything you spend</li>
                    <li>3. <strong>Follow 50/30/20 rule</strong> - 50% Needs, 30% Wants, 20% Savings</li>
                    <li>4. <strong>Start new weeks</strong> - Save progress and track over time</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
