import type { UserWithRole } from '../../user/interfaces/user.interfaces'

export interface StackItem {
  id: string
  name: string
  status: boolean
}

export interface UserStackResponse {
  user_id: string
  stack_id: string
  stack_name: string
  status: boolean
}

export interface UserStackEntry {
  user: UserWithRole
  stacks: UserStackResponse[]
}
