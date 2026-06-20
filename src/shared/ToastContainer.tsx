import useToastStore from '@/store/toastStore'

const ICONS: Record<string, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
}

const BG_CLASSES: Record<string, string> = {
  success: 'bg-surface-container border border-primary shadow-[0px_4px_20px_rgba(0,0,0,0.04)]',
  error: 'bg-surface-container border border-error shadow-[0px_4px_20px_rgba(0,0,0,0.04)]',
  info: 'bg-surface-container border border-primary shadow-[0px_4px_20px_rgba(0,0,0,0.04)]',
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
           className={`${BG_CLASSES[t.type]} px-4 py-3 flex items-center gap-3 animate-slide-in`}
        >
          <span className="material-symbols-outlined text-[20px] text-primary">{ICONS[t.type]}</span>
          <span className="text-label-md font-bold uppercase tracking-wider text-primary flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="text-on-surface-variant/50 hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ))}
    </div>
  )
}
