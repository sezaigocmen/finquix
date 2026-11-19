/** Figma: 4-dashboard – yuvarlak uçlu çubuk grafik, seçili çubuk renkli + üstünde değer etiketi */
import { motion } from 'motion/react'
import { useState } from 'react'

export function InfoDot({ onClick }: { onClick?: () => void }) {
  return (
    <button aria-label="Info" onClick={onClick} className="pressable inline-flex h-[12px] w-[12px] items-center justify-center rounded-full border border-black/40 align-middle">
      <span className="text-[8px] leading-none text-black/50">i</span>
    </button>
  )
}

/** "Month ⌄" hap seçici */
export function PeriodPill({ value, onClick }: { value: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="pressable flex h-[17px] items-center gap-[3px] rounded-pill border border-black/50 px-[8px] text-[11px] font-extralight text-ink">
      {value}
      <svg width="7" height="4" viewBox="0 0 7 4" fill="none" aria-hidden>
        <path d="M.5.5l3 3 3-3" stroke="#000" strokeOpacity=".6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export function BarChart({
  values,
  labels,
  color,
  format,
  height = 120,
  initial,
}: {
  values: number[]
  labels: string[]
  color: string
  format: (v: number) => string
  height?: number
  initial?: number
}) {
  const [sel, setSel] = useState(initial ?? values.length - 1)
  const max = Math.max(...values)
  return (
    <div>
      <div className="relative flex items-end justify-between" style={{ height: height + 28 }}>
        {values.map((v, i) => {
          const h = Math.max(14, (v / max) * height)
          const on = i === sel
          return (
            <button key={i} onClick={() => setSel(i)} className="relative flex h-full w-[27px] items-end justify-center" aria-label={`${labels[i]}: ${format(v)}`}>
              {on && (
                <motion.span
                  layoutId={`pill-${color}`}
                  className="absolute z-10 whitespace-nowrap rounded-pill border border-black/50 bg-bg px-[7px] text-[11px] font-extralight leading-[15px] text-ink"
                  style={{ bottom: h + 7 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                >
                  {format(v)}
                </motion.span>
              )}
              <motion.span
                className="block w-[15px] rounded-pill"
                initial={{ height: 0 }}
                animate={{ height: h, backgroundColor: on ? color : '#D9D9D9' }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: [0.32, 0.72, 0, 1] }}
              />
            </button>
          )
        })}
      </div>
      <div className="mt-[4px] flex justify-between">
        {labels.map((l, i) => (
          <span key={i} className={`w-[27px] text-center text-[11px] font-extralight leading-[14px] tracking-[-0.3px] ${i === sel ? 'text-ink' : 'text-black/70'}`}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
