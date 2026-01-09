'use client'

import { Home, Heart, Save, Calendar } from 'lucide-react'

interface BudgetOverviewProps {
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

export default function BudgetOverview({ 
  income, 
  needs, 
  wants, 
  savings, 
  allocations, 
  colors, 
  formatPeso,
  isWeekly = false 
}: BudgetOverviewProps) {
  const needsPercentage = allocations.needs > 0 ? (needs / allocations.needs) * 100 : 0
  const wantsPercentage = allocations.wants > 0 ? (wants / allocations.wants) * 100 : 0
  const savingsPercentage = allocations.savings > 0 ? (savings / allocations.savings) * 100 : 0

  // Monthly projections
  const monthlyNeeds = needs * 4
  const monthlyWants = wants * 4
  const monthlySavings = savings * 4
  const monthlyAllocationNeeds = allocations.needs * 4
  const monthlyAllocationWants = allocations.wants * 4
  const monthlyAllocationSavings = allocations.savings * 4

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: colors.darkGreen }}>
        {isWeekly ? 'Weekly' : 'Monthly'} Budget Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Needs Card */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.lightGreen }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: colors.darkGreen }}>
                <Home className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: colors.darkGreen }}>Needs</h3>
                <div className="text-sm" style={{ color: colors.darkGreen }}>50% of allowance</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: colors.darkGreen }}>{formatPeso(needs)}</div>
              <div className="text-sm" style={{ color: colors.darkGreen }}>
                of {formatPeso(allocations.needs)}
                {isWeekly && <div className="mt-1">Monthly: {formatPeso(monthlyNeeds)}</div>}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: colors.darkGreen }}>Progress</span>
              <span style={{ color: colors.darkGreen }}>{needsPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-3">
              <div 
                className="h-3 rounded-full"
                style={{ 
                  width: `${Math.min(needsPercentage, 100)}%`,
                  backgroundColor: colors.darkGreen
                }}
              ></div>
            </div>
            <div className="text-sm" style={{ color: colors.darkGreen }}>
              {needsPercentage >= 100 ? 'Over budget!' : `${formatPeso(allocations.needs - needs)} remaining`}
              {isWeekly && needsPercentage < 100 && (
                <div className="mt-1 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  Monthly savings: {formatPeso(monthlyAllocationNeeds - monthlyNeeds)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wants Card */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.palePink }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: colors.pink }}>
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: colors.pink }}>Wants</h3>
                <div className="text-sm" style={{ color: colors.pink }}>30% of allowance</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: colors.pink }}>{formatPeso(wants)}</div>
              <div className="text-sm" style={{ color: colors.pink }}>
                of {formatPeso(allocations.wants)}
                {isWeekly && <div className="mt-1">Monthly: {formatPeso(monthlyWants)}</div>}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: colors.pink }}>Progress</span>
              <span style={{ color: colors.pink }}>{wantsPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-3">
              <div 
                className="h-3 rounded-full"
                style={{ 
                  width: `${Math.min(wantsPercentage, 100)}%`,
                  backgroundColor: colors.pink
                }}
              ></div>
            </div>
            <div className="text-sm" style={{ color: colors.pink }}>
              {wantsPercentage >= 100 ? 'Over budget!' : `${formatPeso(allocations.wants - wants)} remaining`}
              {isWeekly && wantsPercentage < 100 && (
                <div className="mt-1 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  Monthly rollover: {formatPeso(monthlyAllocationWants - monthlyWants)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Savings Card */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.cream, border: `2px solid ${colors.olive}` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: colors.olive }}>
                <Save className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: colors.olive }}>Savings</h3>
                <div className="text-sm" style={{ color: colors.olive }}>20% of allowance</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: colors.olive }}>{formatPeso(savings)}</div>
              <div className="text-sm" style={{ color: colors.olive }}>
                of {formatPeso(allocations.savings)}
                {isWeekly && <div className="mt-1">Monthly: {formatPeso(monthlySavings)}</div>}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: colors.olive }}>Progress</span>
              <span style={{ color: colors.olive }}>{savingsPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-3">
              <div 
                className="h-3 rounded-full"
                style={{ 
                  width: `${Math.min(savingsPercentage, 100)}%`,
                  backgroundColor: colors.olive
                }}
              ></div>
            </div>
            <div className="text-sm" style={{ color: colors.olive }}>
              {savingsPercentage >= 100 ? 'Goal reached! 🎉' : `${formatPeso(allocations.savings - savings)} to goal`}
              {isWeekly && (
                <div className="mt-1 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  Monthly projection: {formatPeso(monthlySavings)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}