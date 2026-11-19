/** Demo'da gerçek karşılığı olmayan işlemler için kısa bilgi paneli */
import type { NavApi } from '../../shell/navigation'

export function openDemoNotice(nav: NavApi, title: string, text?: string) {
  nav.openSheet((close) => (
    <div className="flex flex-col gap-3 px-6 pb-6 pt-1">
      <h2 className="text-[20px] font-medium text-navy">{title}</h2>
      <p className="text-[14px] font-light leading-[21px] text-black/70">
        {text ??
          'FinQuix is a portfolio demo. Sign-in and bank connections are simulated with a sample account — no real credentials are needed, and nothing you see leaves this device.'}
      </p>
      <button onClick={close} className="pressable mt-2 h-[46px] rounded-btn bg-brand text-[16px] font-medium text-white">
        Got it
      </button>
    </div>
  ))
}
