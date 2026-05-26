export interface LoginRequest {
  email: string
  password: string
}
// Lo que devuelve POST /auth/token
export interface TokenResponse {
  access_token: string
  token_type: string
}
// Lo que devuelve GET /auth/me
export interface MeResponse {
  id: number
  email: string
  nombre: string
  apellido: string
  celular: string | null
  roles: string[]
}
export interface RegisterRequest {
  email: string
  nombre: string
  apellido: string
  celular?: string
  password: string
}
// Lo que devuelve nuestro service unificado (token + me)
export type Role = 'admin' | 'empleado' | 'cajero'
export interface LoginResponse {
  user: {
    id: number
    nombre: string
    email: string
  }
  token: string
  rol: Role
}