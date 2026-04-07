import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerService } from '../services/authService'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

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

const inputClass =
  'w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200'

export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    last_name1: '',
    last_name2: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsLoading(true)

    try {
      await registerService({
        name: form.name,
        last_name1: form.last_name1,
        last_name2: form.last_name2,
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err: unknown) {
      const status =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'status' in err.response
          ? (err.response as { status: number }).status
          : null

      if (status === 400) {
        setError('Este correo ya está registrado.')
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const { name, last_name1, last_name2, email, phone_number, password, confirmPassword } = form
  const isDisabled = isLoading || !name || !last_name1 || !last_name2 || !email || !phone_number || !password || !confirmPassword

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* ── Left decorative panel ── */}
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

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-white font-semibold text-lg">Portfolio Manager</span>
          </div>

          <h2 className="text-3xl font-bold text-white tracking-tight">Crear cuenta</h2>
          <p className="mt-2 text-zinc-400">Completa tus datos para registrarte</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-300">Nombre</label>
              <input id="name" name="name" type="text" autoComplete="given-name" required
                value={form.name} onChange={handleChange} placeholder="Juan"
                className={inputClass} />
            </div>

            {/* Last names — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="last_name1" className="text-sm font-medium text-zinc-300">Primer apellido</label>
                <input id="last_name1" name="last_name1" type="text" autoComplete="family-name" required
                  value={form.last_name1} onChange={handleChange} placeholder="García"
                  className={inputClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="last_name2" className="text-sm font-medium text-zinc-300">Segundo apellido</label>
                <input id="last_name2" name="last_name2" type="text" autoComplete="additional-name" required
                  value={form.last_name2} onChange={handleChange} placeholder="López"
                  className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300">Correo electrónico</label>
              <input id="email" name="email" type="email" autoComplete="email" required
                value={form.email} onChange={handleChange} placeholder="tu@email.com"
                className={inputClass} />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone_number" className="text-sm font-medium text-zinc-300">Teléfono</label>
              <input id="phone_number" name="phone_number" type="tel" autoComplete="tel" required
                value={form.phone_number} onChange={handleChange} placeholder="+52 55 0000 0000"
                className={inputClass} />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-300">Contraseña</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" required value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300">Confirmar contraseña</label>
              <div className="relative">
                <input id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password" required value={form.confirmPassword} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200" />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isDisabled}
              className="mt-1 w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 cursor-pointer">
              {isLoading ? (
                <>
                  <Spinner />
                  Creando cuenta…
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
