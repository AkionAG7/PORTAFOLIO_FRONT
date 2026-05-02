export interface CreateProjectDto {
  name: string
  description: string
  repository_link?: string
  deploy_link?: string
  files?: File[]
}
