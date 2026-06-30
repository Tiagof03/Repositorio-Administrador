export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

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

export type Role = 'admin' | 'pedidos' | 'cajero' | 'stock' | 'cliente'

export interface LoginResponse {
  user: {
    id: number
    nombre: string
    apellido: string
    email: string
    celular: string | null
  }
  token: string
  rol: Role
}