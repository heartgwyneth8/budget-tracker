export type TransactionType = 'income' | 'expense'
export type CategoryType = 'need' | 'want' | 'savings'

export interface Expense {
  id: string
  amount: number
  description: string
  category: CategoryType
  date: string
  recurring?: boolean
  weekId: string // Add week identifier
}

export interface BudgetAllocation {
  needs: number
  wants: number
  savings: number
}

export interface WeekSummary {
  id: string
  weekNumber: number
  year: number
  startDate: string
  endDate: string
  allowance: number
  needs: number
  wants: number
  savings: number
  totalSpent: number
  remaining: number
}