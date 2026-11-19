/** Figma: "chart" – kalın halka grafik; dilime ya da lejanta dokununca ortada o kalemin tutarı görünür */
import { AnimatePresence, motion } from 'motion/react'

export type Slice = { id: string; label: string; value: number; color: string }

const SIZE = 135
const STROKE = 22
const R = (SIZE - STROKE) / 2
const C = 2 * Math.PI * R
const GAP = 2 // dilimler arası boşluk (px, çevre üzerinde)

export function Donut({ slices, selected, onSelect, center }: { slices: Slice[]; selected: string | null; onSelect: (id: string | null) => void; center: React.ReactNode }) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1
  let offset = 0
  return (
    <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        {slices.map((s, i) => {
          const len = Math.max(0, (s.value / total) * C - GAP)
          const dash = `${len} ${C - len}`
          const o = -offset
          offset += (s.value / total) * C
          const dim = selected && selected !== s.id
          return (
            <motion.circle
              key={s.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={selected === s.id ? STROKE + 4 : STROKE}
              strokeDashoffset={o}
              initial={{ strokeDasharray: `0 ${C}` }}
              animate={{ strokeDasharray: dash, opacity: dim ? 0.35 : 1 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => onSelect(selected === s.id ? null : s.id)}
              style={{ cursor: 'pointer' }}
            />
          )
        })}
      </svg>
      <div className="pointer-events-none absolute inset-[26px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div key={selected ?? 'all'} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {center}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
