/** Pocket Goals demo verisi (Figma: 7-Hedefler). Bu ayki birikim işlemleri toplamı = Dashboard'daki $380. */
import type { Txn } from './finance'

export type Goal = { id: string; name: string; saved: number; target: number }

export const GOALS_SEED: Goal[] = [
  // Persona: "Save $2,000 for a family vacation to Greece" – %40'ta
  { id: 'summer', name: 'Summer Trip', saved: 800, target: 2000 },
  { id: 'wedding', name: 'Wedding', saved: 325, target: 980 },
  { id: 'car', name: 'New Car', saved: 970, target: 4200 },
  { id: 'pc', name: 'Gaming PC', saved: 170, target: 260 },
]

export const DEPOSITS_SEED: Txn[] = [
  { id: 'd1', title: 'Summer Trip', goal: 'summer', amount: 25, kind: 'saving', account: 'garanti', daysAgo: 0, minutesAgo: 30 },
  { id: 'd2', title: 'Wedding', goal: 'wedding', amount: 180, kind: 'saving', account: 'garanti', daysAgo: 8 },
  { id: 'd3', title: 'Wedding', goal: 'wedding', amount: 100, kind: 'saving', account: 'isbank', daysAgo: 12 },
  { id: 'd4', title: 'New Car', goal: 'car', amount: 75, kind: 'saving', account: 'isbank', daysAgo: 15 },
]

/** Hedefe göre AI ipucu (Figma slaytı: "AI Insights: Receive tips to reach your goals faster") */
export function goalTip(g: Goal) {
  const left = Math.max(0, g.target - g.saved)
  if (left === 0) return `You did it! 🎉 ${g.name} is fully funded.`
  const weekly = Math.ceil(left / 26 / 5) * 5
  if (g.id === 'summer') return `Cut two coffee runs a week to save ~$50/month — that gets your ${g.name} funded about a month sooner.`
  return `Saving about $${weekly} a week gets you to ${g.name} in roughly 6 months.`
}
