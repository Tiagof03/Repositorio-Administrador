import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <span className="material-symbols-outlined text-[80px] text-on-surface-variant/30">
        error_outline
      </span>
      <h1 className="text-headline-lg text-on-surface font-bold">404</h1>
      <p className="text-body-md text-on-surface-variant text-center max-w-md">
        La página que buscás no existe o fue movida.
      </p>
      <button
        type="button"
        onClick={() => navigate('/productos')}
        className="px-6 py-3 bg-primary-container text-on-primary-container text-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
      >
        Volver al inicio
      </button>
    </div>
  )
}
