/**
 * FinQuix demo veri seti – persona: Lucas Mores (aylık gelir ~$4,000, Yunanistan tatili için birikim).
 * Tüm ekranlar (Dashboard, Analysis, Pocket Goals, Budget) bu tek kaynağı kullanır, toplamlar birbirini tutar.
 */

export type CategoryId = 'food' | 'subscriptions' | 'market' | 'shopping' | 'gasoline' | 'taxes'

export type Category = { id: CategoryId; name: string; color: string; limit: number }

/** Bütçe kategorileri (Figma: 9-Bütçe_2) – renkler Figma'daki kategori ikon renklerinden */
export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', color: '#0B95A2', limit: 400 },
  { id: 'subscriptions', name: 'Subscriptions', color: '#BA0808', limit: 420 },
  { id: 'market', name: 'Market', color: '#9FBD0A', limit: 450 },
  { id: 'shopping', name: 'Shopping', color: '#DD6617', limit: 400 },
  { id: 'gasoline', name: 'Gasoline', color: '#2E7C2C', limit: 250 },
  { id: 'taxes', name: 'Taxes', color: '#1346C7', limit: 450 },
]
export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!

export type Account = { id: 'garanti' | 'isbank'; bank: string; mask: string; balance: number; type: string }

/** Bağlı hesaplar – toplam bakiye Figma'daki $1,280.75 */
export const ACCOUNTS: Account[] = [
  { id: 'garanti', bank: 'Garanti BBVA', mask: '*****7486', balance: 860.5, type: 'Deposit Account' },
  { id: 'isbank', bank: 'İş Bankası', mask: '*****3442', balance: 420.25, type: 'Checking Account' },
]
export const TOTAL_BALANCE = ACCOUNTS.reduce((a, b) => a + b.balance, 0)

export type Txn = {
  id: string
  title: string
  amount: number // gider negatif, gelir pozitif
  category?: CategoryId
  kind: 'expense' | 'income' | 'saving'
  goal?: string
  source?: IncomeSourceId
  account: Account['id']
  /** bugünden kaç gün önce (0 = bugün) */
  daysAgo: number
  /** bugünkü işlemler için "x min ago" */
  minutesAgo?: number
  logo?: string
}

/** Bu ayın işlemleri – kategori toplamları aşağıdaki SPENT değerlerini verir */
export const TRANSACTIONS: Txn[] = [
  // Food (380)
  { id: 't1', title: 'Shake Shack', amount: -64, category: 'food', kind: 'expense', account: 'garanti', daysAgo: 0, minutesAgo: 30, logo: 'shakeshack' },
  { id: 't2', title: 'Blue Bottle Coffee', amount: -18, category: 'food', kind: 'expense', account: 'isbank', daysAgo: 1 },
  { id: 't3', title: 'Sushi Ota', amount: -96, category: 'food', kind: 'expense', account: 'garanti', daysAgo: 4 },
  { id: 't4', title: 'Chipotle', amount: -42, category: 'food', kind: 'expense', account: 'isbank', daysAgo: 7 },
  { id: 't5', title: 'Little Italy Trattoria', amount: -160, category: 'food', kind: 'expense', account: 'garanti', daysAgo: 11 },
  // Subscriptions (320)
  { id: 't6', title: 'Amazon Prime', amount: -15, category: 'subscriptions', kind: 'expense', account: 'garanti', daysAgo: 0, minutesAgo: 95 },
  { id: 't7', title: 'Dribbble Pro', amount: -90, category: 'subscriptions', kind: 'expense', account: 'garanti', daysAgo: 3, logo: 'dribbble' },
  { id: 't8', title: 'Netflix', amount: -23, category: 'subscriptions', kind: 'expense', account: 'isbank', daysAgo: 6 },
  { id: 't9', title: 'Microsoft 365', amount: -10, category: 'subscriptions', kind: 'expense', account: 'isbank', daysAgo: 9 },
  { id: 't10', title: 'Adobe Creative Cloud', amount: -60, category: 'subscriptions', kind: 'expense', account: 'garanti', daysAgo: 12 },
  { id: 't11', title: 'Spotify', amount: -12, category: 'subscriptions', kind: 'expense', account: 'isbank', daysAgo: 14 },
  { id: 't12', title: 'Equinox Gym', amount: -100, category: 'subscriptions', kind: 'expense', account: 'garanti', daysAgo: 16 },
  { id: 't13', title: 'iCloud+', amount: -10, category: 'subscriptions', kind: 'expense', account: 'isbank', daysAgo: 17 },
  // Market (290)
  { id: 't14', title: 'Walmart', amount: -112, category: 'market', kind: 'expense', account: 'isbank', daysAgo: 2, logo: 'walmart' },
  { id: 't15', title: 'Trader Joe’s', amount: -89, category: 'market', kind: 'expense', account: 'garanti', daysAgo: 8 },
  { id: 't16', title: 'Whole Foods', amount: -89, category: 'market', kind: 'expense', account: 'garanti', daysAgo: 15 },
  // Shopping (360)
  { id: 't17', title: 'Apple Store', amount: -45, category: 'shopping', kind: 'expense', account: 'garanti', daysAgo: 0, minutesAgo: 180, logo: 'apple' },
  { id: 't18', title: 'Zara', amount: -128, category: 'shopping', kind: 'expense', account: 'isbank', daysAgo: 5 },
  { id: 't19', title: 'Amazon', amount: -62, category: 'shopping', kind: 'expense', account: 'garanti', daysAgo: 10 },
  { id: 't20', title: 'Target', amount: -125, category: 'shopping', kind: 'expense', account: 'isbank', daysAgo: 13 },
  // Gasoline (140)
  { id: 't21', title: 'Shell', amount: -58, category: 'gasoline', kind: 'expense', account: 'isbank', daysAgo: 3 },
  { id: 't22', title: 'Chevron', amount: -82, category: 'gasoline', kind: 'expense', account: 'garanti', daysAgo: 12 },
  // Taxes (430)
  { id: 't23', title: 'Property Tax', amount: -310, category: 'taxes', kind: 'expense', account: 'garanti', daysAgo: 6 },
  { id: 't24', title: 'Vehicle Registration', amount: -120, category: 'taxes', kind: 'expense', account: 'isbank', daysAgo: 16 },
  // Gelir (4,000)
  { id: 'i1', title: 'Jerry Helord', amount: 450, kind: 'income', source: 'freelance', account: 'isbank', daysAgo: 0, minutesAgo: 20, logo: 'jerry' },
  { id: 'i2', title: 'Salary Payment', amount: 3320, kind: 'income', source: 'salary', account: 'garanti', daysAgo: 1, logo: 'salary' },
  { id: 'i3', title: 'Etsy Payment', amount: 230, kind: 'income', source: 'etsy', account: 'isbank', daysAgo: 9, logo: 'etsy' },
]

/** Gelir kaynakları (Figma: 5-Analiz_1 – renkler Figma'daki lejanttan) */
export type IncomeSourceId = 'salary' | 'freelance' | 'etsy'
export const INCOME_SOURCES: { id: IncomeSourceId; name: string; color: string }[] = [
  { id: 'freelance', name: 'Jerry Helord', color: '#144748' },
  { id: 'salary', name: 'Salary', color: '#308DBE' },
  { id: 'etsy', name: 'Etsy Paym.', color: '#EA6B32' },
]

/** Seçili dönemdeki işlemler: ay = tümü, hafta = son 7 gün */
export const inPeriod = (txns: Txn[], period: 'Month' | 'Week') => (period === 'Month' ? txns : txns.filter((t) => t.daysAgo < 7))

/** Bu ay kategorilere göre harcanan */
export function spentByCategory(txns: Txn[] = TRANSACTIONS): Record<CategoryId, number> {
  const out = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0])) as Record<CategoryId, number>
  for (const t of txns) if (t.kind === 'expense' && t.category) out[t.category] += -t.amount
  return out
}

export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** Son 10 ayın toplam harcama ve birikimi (sonuncusu bu ay) */
export const SPENDING_HISTORY = [2310, 1980, 2140, 1760, 2050, 2420, 1890, 1710, 2060, 1920]
export const SAVINGS_HISTORY = [240, 310, 280, 420, 300, 180, 350, 460, 390, 380]
/** Son 10 hafta (haftalık görünüm) */
export const SPENDING_WEEKLY = [480, 530, 410, 620, 455, 390, 505, 470, 540, 445]
export const SAVINGS_WEEKLY = [60, 95, 80, 120, 70, 85, 110, 90, 105, 95]

/** Son n ayın kısa adları (bu ay sonda) */
export function lastMonths(n: number, now = new Date()) {
  return Array.from({ length: n }, (_, i) => new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1).toLocaleDateString('en-US', { month: 'short' }))
}
export function lastWeeks(n: number, now = new Date()) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - 7 * (n - 1 - i))
    return `${d.getDate()}/${d.getMonth() + 1}`
  })
}

/** Para biçimi: $1,280.75 */
export const money = (v: number, opts: { sign?: boolean; cents?: boolean } = {}) => {
  const abs = Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: opts.cents === false ? 0 : 2, maximumFractionDigits: opts.cents === false ? 0 : 2 })
  const sign = v < 0 ? '-' : opts.sign && v > 0 ? '+' : ''
  return `${sign}$${abs}`
}

/** "30 min ago", "Yesterday", "11 Nov 2026" */
export function when(t: Pick<Txn, 'daysAgo' | 'minutesAgo'>, now = new Date()) {
  if (t.daysAgo === 0) {
    const m = t.minutesAgo ?? 60
    return m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`
  }
  if (t.daysAgo === 1) return 'Yesterday'
  const d = new Date(now)
  d.setDate(d.getDate() - t.daysAgo)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
