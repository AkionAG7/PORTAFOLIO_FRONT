export interface UserWithRole {
  id: string
  name: string
  last_name1: string
  last_name2?: string | null
  email: string
  phone_number?: string | null
  title?: string | null
  rol: string
  status: boolean
  user_image?: string | null
}

export interface UpdateProfileDto {
  name: string
  last_name1: string
  last_name2?: string | null
  phone_number?: string | null
  title?: string | null
}

export interface UpdateEmailDto {
  email: string
  password: string
}
