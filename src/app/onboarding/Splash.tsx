/** Figma: 1-home – açılış ekranı; kısa süre görünür, sonra giriş ekranına yumuşakça geçer */
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { Logo } from '../components/Logo'

export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1900)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="absolute inset-0 z-[300] flex flex-col items-center justify-center bg-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      onClick={onDone}
    >
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <Logo size={48} />
      </motion.div>
      <motion.p
        className="mt-[30px] text-[13px] font-extralight italic text-brand"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        Financial Control Is In Your Hands
      </motion.p>
    </motion.div>
  )
}
