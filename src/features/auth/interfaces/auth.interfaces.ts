export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface AuthUser {
  id: string
  email: string
  rol: string
}

export interface MessageResponse {
  message: string
}
