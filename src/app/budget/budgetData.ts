/** Bütçe hesapları: harcanan / limit / kalan / alarm – tek yerden */
import { CATEGORIES, inPeriod, spentByCategory, TRANSACTIONS, type CategoryId } from '../data/finance'
import { useFin } from '../store'

export type Period = 'Month' | 'Week'

export type BudgetRow = {
  id: CategoryId
  name: string
  color: string
  spent: number
  limit: number
  remaining: number
  pct: number
  alarm?: number
  alarmHit: boolean
  over: boolean
}

export function useBudget(period: Period): BudgetRow[] {
  const limits = useFin((s) => s.limits)
  const alarms = useFin((s) => s.alarms)
  const spent = spentByCategory(inPeriod(TRANSACTIONS, period))
  const k = period === 'Week' ? 7 / 30 : 1
  return CATEGORIES.map((c) => {
    const limit = Math.round(limits[c.id] * k)
    const alarm = alarms[c.id] !== undefined ? Math.round(alarms[c.id]! * k) : undefined
    const s = spent[c.id]
    return {
      id: c.id,
      name: c.name,
      color: c.color,
      spent: s,
      limit,
      remaining: limit - s,
      pct: limit ? (s / limit) * 100 : 0,
      alarm,
      alarmHit: alarm !== undefined && s >= alarm,
      over: s > limit,
    }
  })
}
