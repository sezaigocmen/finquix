/** Figma: Transactions satırı – logo, başlık + zaman, tutar + banka rozeti. Dokununca detay paneli. */
import type { NavApi } from '../../shell/navigation'
import { ACCOUNTS, categoryById, money, when, type Txn } from '../data/finance'
import garanti from '../../assets/bank-garanti.png'
import isbank from '../../assets/bank-isbank.png'

const logos = import.meta.glob('../../assets/logos/*.svg', { eager: true, import: 'default' }) as Record<string, string>
const logo = (name: string) => logos[`../../assets/logos/${name}.svg`]
export const BANK_LOGO = { garanti, isbank }

/** İşlemin logosu: varsa marka logosu, yoksa kategori ikonu */
export function txnLogo(t: Txn) {
  if (t.logo && logo(t.logo)) return logo(t.logo)
  if (t.category) return logo(`cat-${t.category}`)
  return logo('salary')
}
export const categoryIcon = (id: string) => logo(`cat-${id}`)

export function TxnRow({ t, onPress, showSign, sub, hideLogo }: { t: Txn; onPress?: () => void; showSign?: boolean; sub?: string; hideLogo?: boolean }) {
  return (
    <button onClick={onPress} className="pressable flex w-full items-center gap-[8px] py-[4px] text-left">
      {!hideLogo && <img src={txnLogo(t)} alt="" className="h-[38px] w-[38px] shrink-0" />}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-light leading-[20px]">{t.title}</span>
        <span className="text-[11px] font-extralight leading-[14px]">{sub ?? when(t)}</span>
      </span>
      <span className="text-[14px]">{money(t.amount, { sign: showSign, cents: !Number.isInteger(t.amount) })}</span>
      <img src={BANK_LOGO[t.account]} alt="" className="h-[16px] w-[16px] rounded-full object-cover" />
    </button>
  )
}

/** İşlem detayı (sheet) */
export function openTxn(nav: NavApi, t: Txn) {
  const acc = ACCOUNTS.find((a) => a.id === t.account)!
  const rows: [string, string][] = [
    ['Category', t.category ? categoryById(t.category).name : t.kind === 'income' ? 'Income' : 'Savings'],
    ['Account', `${acc.bank} ${acc.mask}`],
    ['Date', when(t)],
    ['Status', 'Completed'],
  ]
  nav.openSheet(() => (
    <div className="flex flex-col items-center px-6 pb-8 pt-1">
      <img src={txnLogo(t)} alt="" className="h-[56px] w-[56px]" />
      <p className="mt-2 text-[17px] font-medium">{t.title}</p>
      <p className={`mt-1 text-[32px] font-semibold ${t.amount < 0 ? 'text-expense' : 'text-income'}`}>{money(t.amount, { sign: true })}</p>
      <dl className="mt-4 w-full divide-y divide-black/10 rounded-card border border-black/10">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between px-4 py-[10px] text-[14px]">
            <dt className="font-light text-black/55">{k}</dt>
            <dd className="font-normal">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  ))
}
