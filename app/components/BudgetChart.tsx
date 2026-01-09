'use client'

import { PieChart as PieChartIcon, BarChart3, TrendingUp, Calendar } from 'lucide-react'

interface BudgetChartProps {
  income: number
  needs: number
  wants: number
  savings: number
  allocations: {
    needs: number
    wants: number
    savings: number
  }
  colors: any
  formatPeso: (amount: number) => string
  isWeekly?: boolean
}

export default function BudgetChart({ 
  income, 
  needs, 
  wants, 
  savings, 
  allocations, 
  colors, 
  formatPeso,
  isWeekly = false 
}: BudgetChartProps) {
  const totalSpent = needs + wants + savings
  const remaining = income - totalSpent

  // Monthly projections
  const monthlyIncome = income * 4
  const monthlyNeeds = needs * 4
  const monthlyWants = wants * 4
  const monthlySavings = savings * 4
  const monthlyAllocationNeeds = allocations.needs * 4
  const monthlyAllocationWants = allocations.wants * 4
  const monthlyAllocationSavings = allocations.savings * 4

  // Pie chart data
  const pieData = [
    { name: 'Needs', value: needs, monthlyValue: monthlyNeeds, color: colors.darkGreen, allocation: allocations.needs },
    { name: 'Wants', value: wants, monthlyValue: monthlyWants, color: colors.pink, allocation: allocations.wants },
    { name: 'Savings', value: savings, monthlyValue: monthlySavings, color: colors.olive, allocation: allocations.savings },
    { name: 'Remaining', value: Math.max(remaining, 0), monthlyValue: Math.max(remaining * 4, 0), color: colors.lightPink, allocation: 0 }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: colors.darkGreen }}>
        {isWeekly ? 'Weekly' : 'Monthly'} Budget Visualization
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Spending Distribution */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.cream, border: `2px solid ${colors.olive}` }}>
          <div className="flex items-center mb-6">
            <PieChartIcon className="mr-3" style={{ color: colors.olive }} size={24} />
            <h3 className="text-xl font-bold" style={{ color: colors.olive }}>
              {isWeekly ? 'Weekly Spending' : 'Spending Distribution'}
            </h3>
          </div>
          
          <div className="space-y-6">
            {pieData.map((item, index) => {
              if (item.value === 0) return null
              
              const percentage = income > 0 ? (item.value / income) * 100 : 0
              const allocationPercentage = item.allocation > 0 ? (item.value / item.allocation) * 100 : 0
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-3"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-medium" style={{ color: colors.darkGreen }}>{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: item.color }}>{formatPeso(item.value)}</div>
                      <div className="text-sm" style={{ color: item.color }}>
                        {percentage.toFixed(1)}% of allowance
                        {isWeekly && <div className="mt-1">Monthly: {formatPeso(item.monthlyValue)}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly Projection */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.lightPink }}>
          <div className="flex items-center mb-6">
            <Calendar className="mr-3" style={{ color: colors.pink }} size={24} />
            <h3 className="text-xl font-bold" style={{ color: colors.pink }}>Monthly Projection</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium" style={{ color: colors.darkGreen }}>Monthly Needs</span>
                <div className="text-right">
                  <div style={{ color: colors.darkGreen }}>
                    {formatPeso(monthlyNeeds)} / {formatPeso(monthlyAllocationNeeds)}
                  </div>
                  <div className="text-sm" style={{ color: colors.darkGreen }}>
                    {monthlyAllocationNeeds > 0 ? `${(monthlyNeeds / monthlyAllocationNeeds * 100).toFixed(1)}% of budget` : 'No budget set'}
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3">
                <div 
                  className="h-3 rounded-full"
                  style={{ 
                    width: `${Math.min((monthlyNeeds / monthlyAllocationNeeds) * 100, 100)}%`,
                    backgroundColor: colors.darkGreen
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium" style={{ color: colors.pink }}>Monthly Wants</span>
                <div className="text-right">
                  <div style={{ color: colors.pink }}>
                    {formatPeso(monthlyWants)} / {formatPeso(monthlyAllocationWants)}
                  </div>
                  <div className="text-sm" style={{ color: colors.pink }}>
                    {monthlyAllocationWants > 0 ? `${(monthlyWants / monthlyAllocationWants * 100).toFixed(1)}% of budget` : 'No budget set'}
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3">
                <div 
                  className="h-3 rounded-full"
                  style={{ 
                    width: `${Math.min((monthlyWants / monthlyAllocationWants) * 100, 100)}%`,
                    backgroundColor: colors.pink
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium" style={{ color: colors.olive }}>Monthly Savings</span>
                <div className="text-right">
                  <div style={{ color: colors.olive }}>
                    {formatPeso(monthlySavings)} / {formatPeso(monthlyAllocationSavings)}
                  </div>
                  <div className="text-sm" style={{ color: colors.olive }}>
                    {monthlyAllocationSavings > 0 ? `${(monthlySavings / monthlyAllocationSavings * 100).toFixed(1)}% of goal` : 'No goal set'}
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3">
                <div 
                  className="h-3 rounded-full"
                  style={{ 
                    width: `${Math.min((monthlySavings / monthlyAllocationSavings) * 100, 100)}%`,
                    backgroundColor: colors.olive
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: colors.pink }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp className="mr-2" style={{ color: colors.darkGreen }} size={20} />
                  <span className="font-bold" style={{ color: colors.darkGreen }}>Total Monthly</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold" style={{ color: colors.darkGreen }}>{formatPeso(monthlyIncome)}</div>
                  <div className="text-sm" style={{ color: colors.darkGreen }}>
                    {totalSpent > 0 ? `${((monthlyNeeds + monthlyWants + monthlySavings) / monthlyIncome * 100).toFixed(1)}% spent` : 'No spending yet'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}