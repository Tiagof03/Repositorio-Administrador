export interface AdminUser {
  id: number
  email: string
  nombre: string
  apellido: string
  celular: string | null
  roles: string[]
  created_at: string
  deleted_at: string | null
}
export interface AdminUserUpdate {
  nombre?: string | null
  apellido?: string | null
  celular?: string | null
}
export interface Rol {
  codigo: string
  nombre: string
  descripcion: string | null
}