/**
 * Form alanları (Figma: 2-log in ve 3-connect bank account).
 * DEMO GÜVENLİĞİ: Alanlar salt okunur, önceden doldurulmuş demo değerleri gösterir.
 * Gerçek e-posta, şifre ya da banka bilgisi yazılamaz ve hiçbir yere gönderilmez.
 */
import type { ReactNode } from 'react'

/** Giriş ekranı: etiket çerçevenin üst çizgisinin üstünde (çentikli) */
export function NotchedField({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <button type="button" onClick={onPress} className="relative block h-[49px] w-full rounded-btn border border-brand text-left">
      <span className="absolute -top-[9px] left-[40px] bg-bg px-[8px] text-[12px] font-medium leading-[18px] text-brand">{label}</span>
      <span className="absolute left-[26px] top-1/2 -translate-y-1/2 text-[13px] font-extralight text-ink">{value}</span>
    </button>
  )
}

/** Banka bağlama ekranı: etiket alanın üstünde, ince alan */
export function StackedField({ label, value, trailing, onPress }: { label: string; value: string; trailing?: ReactNode; onPress?: () => void }) {
  return (
    <div>
      <span className="block pl-[12px] text-[12px] font-medium leading-[18px] text-brand">{label}</span>
      <button type="button" onClick={onPress} className="pressable flex h-[34px] w-full items-center justify-between rounded-btn border border-brand pl-[15px] pr-[14px] text-left">
        <span className="text-[13px] font-extralight text-ink">{value}</span>
        {trailing}
      </button>
    </div>
  )
}

/** Figma: Rectangle 13 – 303×49 koyu yeşil hap buton */
export function BigButton({ children, onClick, loading }: { children: ReactNode; onClick: () => void; loading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="pressable flex h-[49px] w-full items-center justify-center gap-3 rounded-btn bg-brand text-[24px] font-semibold text-white disabled:opacity-90"
    >
      {loading && <span className="h-[20px] w-[20px] animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  )
}

export const Chevron = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
    <path d="M1 1l4 4 4-4" stroke="#000" strokeOpacity=".5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
