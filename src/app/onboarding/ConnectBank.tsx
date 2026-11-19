/**
 * Figma: 3-connect bank account – demo banka bağlama.
 * Gerçek banka bağlantısı yok: hesap bilgileri örnek veridir, şifre alanı yazılamaz.
 */
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { BigButton, Chevron, StackedField } from '../components/Fields'
import { useFin } from '../store'
import avatar from '../../assets/avatar-lucas.jpg'
import assistant from '../../assets/icons/assistant.svg'
import garanti from '../../assets/bank-garanti.png'
import isbank from '../../assets/bank-isbank.png'

const BANKS = [
  { id: 'garanti', name: 'Garanti BBVA Deposit Account', short: 'Garanti BBVA', logo: garanti, no: '1893 **** **** 7486' },
  { id: 'isbank', name: 'İş Bankası Checking Account', short: 'İş Bankası', logo: isbank, no: '6217 **** **** 3442' },
]

export function ConnectBank() {
  const nav = useNav()
  const setOnboarded = useFin((s) => s.setOnboarded)
  const [bank, setBank] = useState(BANKS[0])
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const pickBank = () =>
    nav.openSheet((close) => (
      <div className="flex flex-col gap-2 px-6 pb-6 pt-1">
        <h2 className="mb-1 text-[20px] font-medium text-navy">Choose your bank</h2>
        {BANKS.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setBank(b)
              close()
            }}
            className={`pressable flex items-center gap-3 rounded-card border px-4 py-3 text-left ${b.id === bank.id ? 'border-brand bg-brand/5' : 'border-black/15'}`}
          >
            <img src={b.logo} alt="" className="h-[31px] w-[31px] rounded-full" />
            <span className="text-[15px] font-light">{b.name}</span>
          </button>
        ))}
        <p className="mt-2 text-[12px] font-light text-black/45">Sample accounts for this demo.</p>
      </div>
    ))

  const connect = () => {
    setState('loading')
    setTimeout(() => setState('done'), 1100)
    setTimeout(() => setOnboarded(true), 2300)
  }

  return (
    <div className="relative flex h-full flex-col bg-bg px-[45px]" style={{ paddingTop: 'calc(var(--safe-top) + 28px)', paddingBottom: 'calc(max(var(--safe-bottom), 20px) + 36px)' }}>
      <button aria-label="AI assistant" onClick={() => toast('AI insights unlock once a bank is connected')} className="pressable absolute right-[10px]" style={{ top: 'calc(var(--safe-top) + 10px)' }}>
        <img src={assistant} alt="" className="h-[29px] w-[33px]" />
      </button>

      <div className="flex flex-col items-center">
        <img src={avatar} alt="Lucas" className="h-[99px] w-[99px] rounded-full border border-brand object-cover" />
        <h1 className="mt-[15px] text-[20px] font-medium text-navy">Welcome Lucas</h1>
      </div>

      <div className="flex-1" />

      <h2 className="text-[20px] font-medium text-navy">Connect Bank Account</h2>
      <div className="mt-[34px] flex flex-col gap-[12px]">
        <StackedField label="Bank Choice" value={bank.name} trailing={<Chevron />} onPress={pickBank} />
        <StackedField label="Account No" value={bank.no} onPress={() => toast('Sample account number for this demo')} />
        <StackedField label="Password" value="•••••••••••••••" onPress={() => toast('No password needed — this is a demo')} />
      </div>
      <p className="mt-[14px] text-[11px] font-light leading-[15px] text-black/45">Demo — no real bank connection. Details are sample data and never leave this device.</p>

      <div className="flex-1" />

      <BigButton onClick={connect} loading={state === 'loading'}>
        {state === 'loading' ? 'Connecting' : 'Connect'}
      </BigButton>

      {/* Bağlantı başarılı */}
      <AnimatePresence>
        {state === 'done' && (
          <motion.div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg/95 px-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-brand"
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden>
                <motion.path d="M9 20l7 7 13-15" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.15 }} />
              </svg>
            </motion.div>
            <p className="mt-5 text-[20px] font-medium text-navy">{bank.short} connected</p>
            <p className="mt-1 text-[13px] font-light text-black/55">Preparing your dashboard…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
