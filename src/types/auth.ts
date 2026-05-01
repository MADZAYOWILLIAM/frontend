export type AuthRole = 'member' | 'admin'

export type AuthSession = {
  email: string
  name: string
  role: AuthRole
}
