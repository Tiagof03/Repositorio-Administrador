import api from '@/lib/axios'

export interface UploadResult {
  secureUrl: string
  publicId: string
  width: number
  height: number
  format: string
}

export async function subirImagen(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/uploads/imagen', formData)
  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  }
}

export async function eliminarImagen(publicId: string): Promise<void> {
  await api.delete(`/uploads/imagen/${publicId}`)
}
