export interface ProjectItem {
  id: string
  name: string
  description: string
  repository_link?: string
  deploy_link?: string
  image_link?: string[]
  status?: boolean
  user_id: string
}
