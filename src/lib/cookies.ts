const TOKEN_KEY = 'access_token'

export function setTokenCookie(token: string): void {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict${secure}`
}

export function getTokenCookie(): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${TOKEN_KEY}=`))
  return match ? match.split('=')[1] : null
}

export function removeTokenCookie(): void {
  document.cookie = `${TOKEN_KEY}=; path=/; SameSite=Strict; Max-Age=0`
}
