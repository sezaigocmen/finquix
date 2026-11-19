/** Figma: "Finquix logo" – döndürülmüş renkli işaret + "FinQuix" (Poppins 600) */
import mark from '../../assets/logo-mark.png'

export function Logo({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center" style={{ gap: size * 0.12 }}>
      <img src={mark} alt="" style={{ height: size * 1.15, width: 'auto' }} />
      <span className="font-semibold leading-none text-ink" style={{ fontSize: size }}>
        FinQuix
      </span>
    </div>
  )
}
