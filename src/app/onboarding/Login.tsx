/**
 * Figma: 2-log in – demo hesapla giriş.
 * Alanlar önceden doldurulmuş ve salt okunur: gerçek e-posta/şifre istenmez, girilemez.
 */
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { Logo } from '../components/Logo'
import { BigButton, NotchedField } from '../components/Fields'
import { openDemoNotice } from '../components/DemoNotice'

export function Login() {
  const nav = useNav()
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const prefilled = () => toast('Demo account is prefilled — just tap Log In')

  const login = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      nav.push('connect')
    }, 900)
  }

  return (
    <div className="flex h-full flex-col bg-bg px-[45px]" style={{ paddingTop: 'calc(var(--safe-top) + 92px)', paddingBottom: 'calc(max(var(--safe-bottom), 20px) + 36px)' }}>
      <motion.div className="flex justify-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Logo size={48} />
      </motion.div>

      <div className="flex-1" />

      <div className="flex flex-col gap-[27px]">
        <NotchedField label="Email" value="lucasmores@icloud.com" onPress={prefilled} />
        <NotchedField label="Password" value="•••••••••••••••" onPress={prefilled} />
      </div>

      <div className="mt-[14px] flex items-center justify-between text-[12px] font-light text-brand">
        <button onClick={() => setRemember(!remember)} className="pressable flex items-center gap-[6px]" aria-pressed={remember}>
          <span className={`flex h-[12px] w-[12px] items-center justify-center rounded-full border ${remember ? 'border-brand bg-brand' : 'border-brand/40'}`}>
            {remember && <span className="h-[4px] w-[4px] rounded-full bg-white" />}
          </span>
          Remember For 30 Days
        </button>
        <button onClick={() => openDemoNotice(nav, 'Forgot password?')} className="pressable">
          Forgot Password
        </button>
      </div>

      <p className="mt-[38px] text-[11px] font-light leading-[15px] text-brand">
        This information will be securely saved as per the{' '}
        <button className="underline underline-offset-2" onClick={() => openDemoNotice(nav, 'Terms of Service')}>
          terms of service
        </button>{' '}
        &{' '}
        <button className="underline underline-offset-2" onClick={() => openDemoNotice(nav, 'Privacy Policy')}>
          Privacy Policy
        </button>
        .
      </p>

      <div className="flex-1" />

      <p className="mb-[10px] text-center text-[11px] font-light text-black/45">Demo account · no real sign-in</p>
      <BigButton onClick={login} loading={loading}>
        Log In
      </BigButton>
    </div>
  )
}
