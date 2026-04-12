import type { UserWithRole } from '../../user/interfaces/user.interfaces'

export interface LanguageItem {
  id: string
  name: string
  status: boolean
}

export interface UserLanguageResponse {
  user_id: string
  language_id: string
  language_name: string
  level: string
  status: boolean
}

export interface UserLanguageEntry {
  user: UserWithRole
  languages: UserLanguageResponse[]
}
