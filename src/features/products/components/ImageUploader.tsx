import { useRef, useState } from 'react'
import { subirImagen } from '@/services/upload.service'

interface Props {
  currentUrl: string
  onUrlChange: (url: string) => void
}

export default function ImageUploader({ currentUrl, onUrlChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(currentUrl)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file: File | null) => {
    setError(null)
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Solo se permiten JPG, PNG o WebP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5 MB')
      return
    }
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setError(null)
    try {
      const result = await subirImagen(selectedFile)
      onUrlChange(result.secureUrl)
      setPreview(result.secureUrl)
      setSelectedFile(null)
    } catch {
      setError('Error al subir la imagen. Verificá que el backend tenga credenciales de Cloudinary configuradas.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    setSelectedFile(null)
    onUrlChange('')
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const hasChanges = selectedFile !== null
  const showPreview = preview && !hasChanges

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]) }}
        onClick={() => fileInputRef.current?.click()}
        className={`aspect-square bg-surface-variant/40 border-2 border-dashed overflow-hidden flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
          dragOver ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-primary/40'
        }`}
      >
        {showPreview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <>
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant/30">
              {uploading ? 'cloud_upload' : 'add_photo_alternate'}
            </span>
            <p className="text-label-sm text-on-surface-variant/50 text-center px-4">
              {uploading ? 'Subiendo...' : 'Hacé clic o arrastrá una imagen'}
            </p>
          </>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-white animate-spin text-[32px]">progress_activity</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
      />

      {error && (
        <p className="text-label-sm text-error">{error}</p>
      )}

      <div className="flex gap-2">
        {hasChanges && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-primary-container text-on-primary-container text-label-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                Subiendo...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                Subir
              </>
            )}
          </button>
        )}
        {(showPreview || hasChanges) && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="px-4 py-2 border border-outline-variant/30 text-on-surface-variant text-label-sm hover:bg-surface-variant/30 transition-all cursor-pointer disabled:opacity-50"
          >
            Eliminar
          </button>
        )}
      </div>

      {currentUrl && !hasChanges && (
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-variant/20 border border-outline-variant/20">
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50">link</span>
          <span className="text-[10px] text-on-surface-variant/50 truncate flex-1">{currentUrl}</span>
        </div>
      )}
    </div>
  )
}
