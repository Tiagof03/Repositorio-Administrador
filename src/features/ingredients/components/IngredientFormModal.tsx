import { useForm } from '@tanstack/react-form'
import type { Ingredient, IngredientFormData } from '@/features/ingredients/types'

interface Props {
  ingredient: Ingredient | null // null = crear, con datos = editar
  onSubmit: (data: IngredientFormData) => void
  onClose: () => void
  isSubmitting: boolean
}

export default function IngredientFormModal({
  ingredient,
  onSubmit,
  onClose,
  isSubmitting,
}: Props) {
  const form = useForm<IngredientFormData>({
    defaultValues: {
      nombre: ingredient?.nombre ?? '',
      es_alergeno: ingredient?.es_alergeno ?? false,
      descripcion: ingredient?.descripcion ?? '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  const isEditing = ingredient !== null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-container border border-outline-variant/20 w-full max-w-md mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
          <h2 className="text-headline-md font-bold text-on-surface">
            {isEditing ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-col"
        >
          <div className="px-6 py-6 flex flex-col gap-5">
            {/* Campo: Nombre */}
            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim().length === 0) return 'El nombre es obligatorio'
                  if (value.trim().length < 2) return 'Mínimo 2 caracteres'
                  if (value.trim().length > 100) return 'Máximo 100 caracteres'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="nombre"
                    className="text-label-md font-label-md text-on-surface-variant"
                  >
                    Nombre del ingrediente
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Ej: Solomillo de Ternera"
                    className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-label-sm font-label-sm text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
            {/* Campo: Descripción */}
            <form.Field
              name="descripcion"
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="descripcion"
                    className="text-label-md font-label-md text-on-surface-variant"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    value={field.state.value ?? ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Descripción opcional del ingrediente..."
                    rows={3}
                    className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40 resize-none"
                  />
                </div>
              )}
            </form.Field>

            {/* Campo: Es Alérgeno */}
            <form.Field name="es_alergeno">
              {(field) => (
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-label-md font-label-md text-on-surface-variant">
                      ¿Es alérgeno?
                    </span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant/50">
                      Marcar si puede causar reacciones alérgicas
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={field.state.value}
                    onClick={() => field.handleChange(!field.state.value)}
                    className={`relative w-12 h-7 transition-colors cursor-pointer ${
                      field.state.value
                        ? 'bg-primary-container'
                        : 'bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-on-surface transition-transform ${
                        field.state.value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )}
            </form.Field>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary-container text-on-primary-container text-label-md font-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar Cambios'
              ) : (
                'Crear Ingrediente'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}