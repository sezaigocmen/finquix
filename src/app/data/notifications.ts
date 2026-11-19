/** Bildirim kutusu – demo verisiyle uyumlu başlangıç bildirimleri */

export type Notif = {
  id: string
  kind: 'alarm' | 'income' | 'goal' | 'budget' | 'tip'
  title: string
  body: string
  /** zaman damgası (ms) */
  at: number
  read: boolean
}

const MIN = 60_000
const now = Date.now()

export const NOTIFS_SEED: Notif[] = [
  { id: 'n1', kind: 'alarm', title: 'Food reached its alarm', body: 'You’ve spent $380 of your $400 Food budget (95%).', at: now - 30 * MIN, read: false },
  { id: 'n2', kind: 'goal', title: '+$25 added to Summer Trip', body: '40% done — $1,200 to go for Greece.', at: now - 32 * MIN, read: false },
  { id: 'n3', kind: 'tip', title: 'You spent 7% less than last month', body: '$1,920 this month vs $2,060 in the previous one. Nice work!', at: now - 5 * 60 * MIN, read: false },
  { id: 'n4', kind: 'income', title: 'Salary received', body: '+$3,320.00 to Garanti BBVA *****7486.', at: now - 3 * 24 * 60 * MIN, read: true },
  { id: 'n5', kind: 'budget', title: 'Subscriptions renew this week', body: 'Netflix, Spotify and Microsoft 365 — $45 in total.', at: now - 4 * 24 * 60 * MIN, read: true },
]

/** "Just now", "30 min ago", "5 h ago", "Yesterday", "3 days ago" */
export function ago(at: number, t = Date.now()) {
  const m = Math.max(0, Math.round((t - at) / MIN))
  if (m < 1) return 'Just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  return d === 1 ? 'Yesterday' : `${d} days ago`
}
