/** Uygulama seviyesinde onay penceresi: alt menü dahil tüm ekranı bulanıklaştırır */
import { create } from 'zustand'
import { Dialog } from '../../shell/Dialog'

type ConfirmReq = { title: string; message?: string; confirm: string; onConfirm: () => void }

const useConfirm = create<{ req: ConfirmReq | null }>(() => ({ req: null }))
export const openConfirm = (req: ConfirmReq) => useConfirm.setState({ req })
const close = () => useConfirm.setState({ req: null })

export function ConfirmHost() {
  const req = useConfirm((s) => s.req)
  return (
    <Dialog
      open={req !== null}
      title={req?.title ?? ''}
      message={req?.message}
      colors={{ primary: '#144748', secondary: '#BA0808' }}
      onClose={close}
      buttons={[
        { label: 'Cancel', tone: 'primary', onClick: close },
        {
          label: req?.confirm ?? 'OK',
          tone: 'secondary',
          onClick: () => {
            const fn = req?.onConfirm
            close()
            fn?.()
          },
        },
      ]}
    />
  )
}
