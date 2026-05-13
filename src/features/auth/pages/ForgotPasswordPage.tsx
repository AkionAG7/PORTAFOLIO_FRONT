import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/authService'

function Spinner() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

const features = [
  { icon: '◈', text: 'Gestiona tus proyectos' },
  { icon: '◎', text: 'Administra tu stack tecnológico' },
  { icon: '◉', text: 'Controla tus contactos y redes' },
]

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await forgotPassword({ email })
      setSent(true)
    } catch {
      setError('Error al conectar con el servidor. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-950 to-zinc-950 flex-col items-center justify-center px-16">
        <div className="absolute top-1/4 -left-12 w-80 h-80 bg-violet-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start gap-8 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white text-2xl font-bold tracking-tight">P</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
              Portfolio<br />Manager
            </h1>
            <p className="mt-3 text-zinc-400 text-lg leading-relaxed">
              Tu portafolio profesional,<br />centralizado y siempre listo.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-violet-400 text-lg">{f.icon}</span>
                <span className="text-zinc-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-gray-900 dark:text-white font-semibold text-lg">Portfolio Manager</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">¿Olvidaste tu contraseña?</h2>
          <p className="mt-2 text-gray-500 dark:text-zinc-400">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>

          {sent ? (
            <div className="mt-8 px-4 py-5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm leading-relaxed">
              Si ese correo está registrado, recibirás un enlace de restablecimiento en los próximos minutos. Revisa también tu carpeta de spam.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-600 dark:text-zinc-300">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="mt-1 w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Enviando…
                  </>
                ) : (
                  'Enviar enlace'
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-800 text-center">
            <p className="text-gray-400 dark:text-zinc-500 text-sm">
              <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
                Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
