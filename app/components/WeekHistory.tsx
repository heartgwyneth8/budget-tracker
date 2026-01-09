'use client'

import { History, Calendar, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react'
import { WeekSummary } from './types'

interface WeekHistoryProps {
  weekHistory: WeekSummary[]
  currentWeekId: string
  onLoadWeek: (weekId: string) => void
  colors: any
  formatPeso: (amount: number) => string
}

export default function WeekHistory({ 
  weekHistory, 
  currentWeekId, 
  onLoadWeek, 
  colors, 
  formatPeso 
}: WeekHistoryProps) {
  if (weekHistory.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <History className="mr-3" style={{ color: colors.darkGreen }} size={24} />
        <h2 className="text-2xl font-bold" style={{ color: colors.darkGreen }}>Week History</h2>
      </div>

      <div className="rounded-2xl p-6" style={{ backgroundColor: colors.cream, border: `2px solid ${colors.olive}` }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ color: colors.olive }}>
                <th className="text-left py-3 px-4 font-bold">Week</th>
                <th className="text-left py-3 px-4 font-bold">Allowance</th>
                <th className="text-left py-3 px-4 font-bold">Needs</th>
                <th className="text-left py-3 px-4 font-bold">Wants</th>
                <th className="text-left py-3 px-4 font-bold">Savings</th>
                <th className="text-left py-3 px-4 font-bold">Status</th>
                <th className="text-left py-3 px-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weekHistory.map((week) => {
                const isCurrent = week.id === currentWeekId
                const isOnBudget = week.remaining >= 0
                const savingsPercentage = week.allowance > 0 ? (week.savings / week.allowance) * 100 : 0
                
                return (
                  <tr 
                    key={week.id} 
                    className={`border-t ${isCurrent ? 'font-bold' : ''}`}
                    style={{ 
                      borderColor: colors.lightGreen,
                      color: isCurrent ? colors.darkGreen : colors.darkGreen
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" style={{ color: colors.olive }} />
                        <div>
                          <div>Week {week.weekNumber}</div>
                          <div className="text-xs" style={{ color: colors.olive }}>
                            {week.startDate} - {week.endDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ color: colors.darkGreen }}>
                      {formatPeso(week.allowance)}
                    </td>
                    <td className="py-3 px-4">
                      <div style={{ color: colors.darkGreen }}>{formatPeso(week.needs)}</div>
                      <div className="text-xs" style={{ color: colors.darkGreen }}>
                        {(week.needs / week.allowance * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div style={{ color: colors.pink }}>{formatPeso(week.wants)}</div>
                      <div className="text-xs" style={{ color: colors.pink }}>
                        {(week.wants / week.allowance * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div style={{ color: colors.olive }}>{formatPeso(week.savings)}</div>
                      <div className="text-xs" style={{ color: colors.olive }}>
                        {savingsPercentage.toFixed(0)}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {isOnBudget ? (
                          <>
                            <CheckCircle size={16} className="mr-1 text-green-500" />
                            <span className="text-green-600">On Budget</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="mr-1 text-red-500" />
                            <span className="text-red-600">Over Budget</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs" style={{ color: colors.olive }}>
                        {formatPeso(Math.abs(week.remaining))} {week.remaining >= 0 ? 'left' : 'over'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onLoadWeek(week.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${isCurrent ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
                        style={{ 
                          backgroundColor: isCurrent ? colors.lightGreen : colors.olive,
                          color: isCurrent ? colors.darkGreen : 'white'
                        }}
                        disabled={isCurrent}
                      >
                        {isCurrent ? 'Current' : 'View'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {weekHistory.length === 0 && (
          <div className="text-center py-8">
            <History size={48} className="mx-auto mb-4" style={{ color: colors.olive }} />
            <p className="text-lg" style={{ color: colors.olive }}>No week history yet</p>
            <p className="text-sm mt-2" style={{ color: colors.olive }}>
              Start tracking your weeks to see your progress over time
            </p>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.lightGreen }}>
          <div className="flex items-center mb-4">
            <TrendingUp className="mr-3" style={{ color: colors.darkGreen }} size={24} />
            <h3 className="font-bold text-lg" style={{ color: colors.darkGreen }}>Best Saving Week</h3>
          </div>
          {weekHistory.length > 0 ? (
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.darkGreen }}>
                {formatPeso(Math.max(...weekHistory.map(w => w.savings)))}
              </div>
              <div className="text-sm" style={{ color: colors.darkGreen }}>
                Highest savings in a single week
              </div>
            </div>
          ) : (
            <div className="text-sm" style={{ color: colors.darkGreen }}>No data yet</div>
          )}
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.palePink }}>
          <div className="flex items-center mb-4">
            <TrendingDown className="mr-3" style={{ color: colors.pink }} size={24} />
            <h3 className="font-bold text-lg" style={{ color: colors.pink }}>Average Spending</h3>
          </div>
          {weekHistory.length > 0 ? (
            <div>
              <div className="text-2xl font-bold" style={{ color: colors.pink }}>
                {formatPeso(weekHistory.reduce((sum, w) => sum + w.totalSpent, 0) / weekHistory.length)}
              </div>
              <div className="text-sm" style={{ color: colors.pink }}>
                Per week average
              </div>
            </div>
          ) : (
            <div className="text-sm" style={{ color: colors.pink }}>No data yet</div>
          )}
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: colors.cream, border: `2px solid ${colors.olive}` }}>
          <div className="flex items-center mb-4">
            <History className="mr-3" style={{ color: colors.olive }} size={24} />
            <h3 className="font-bold text-lg" style={{ color: colors.olive }}>Total Weeks Tracked</h3>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: colors.olive }}>
              {weekHistory.length}
            </div>
            <div className="text-sm" style={{ color: colors.olive }}>
              Weeks of budgeting history
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}