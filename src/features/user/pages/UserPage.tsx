import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { getUser, updateProfile, updateEmail, updateUserImage } from '../services/userService'
import type { UserWithRole } from '../interfaces/user.interfaces'


const inputCls = 'w-full px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors'

function Feedback({ error, success, successMsg }: { error: string | null; success: boolean; successMsg: string }) {
  if (error) return (
    <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
      {error}
    </div>
  )
  if (success) return (
    <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M20 6 9 17l-5-5" /></svg>
      {successMsg}
    </div>
  )
  return null
}

export default function UserPage() {
  const { user: authUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<UserWithRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [basic, setBasic] = useState({ name: '', last_name1: '', last_name2: '', phone_number: '', title: '' })
  const [basicSaving, setBasicSaving]   = useState(false)
  const [basicError, setBasicError]     = useState<string | null>(null)
  const [basicSuccess, setBasicSuccess] = useState(false)

  const [emailForm, setEmailForm]       = useState({ email: '', password: '' })
  const [emailSaving, setEmailSaving]   = useState(false)
  const [emailError, setEmailError]     = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState(false)

  const [imagePreview, setImagePreview]     = useState<string | null>(null)
  const [imageFile, setImageFile]           = useState<File | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError]         = useState<string | null>(null)

  async function refetch() {
    if (!authUser?.id) return
    const data = await getUser(authUser.id)
    setProfile(data)
    setBasic({
      name:         data.name,
      last_name1:   data.last_name1,
      last_name2:   data.last_name2 ?? '',
      phone_number: data.phone_number ?? '',
      title:        data.title ?? '',
    })
  }

  useEffect(() => {
    if (!authUser?.id) return
    refetch().catch(() => setBasicError('Error al cargar el perfil')).finally(() => setIsLoading(false))
  }, [authUser?.id])

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview) }
  }, [imagePreview])

  function handleBasicChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBasicSuccess(false); setBasicError(null)
    setBasic(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleBasicSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!authUser?.id) return
    setBasicSaving(true); setBasicError(null); setBasicSuccess(false)
    try {
      await updateProfile(authUser.id, {
        name:         basic.name.trim(),
        last_name1:   basic.last_name1.trim(),
        last_name2:   basic.last_name2.trim()   || null,
        phone_number: basic.phone_number.trim() || null,
        title:        basic.title.trim()        || null,
      })
      await refetch()
      setBasicSuccess(true)
    } catch {
      setBasicError('Error al guardar los cambios. Intenta de nuevo.')
    } finally {
      setBasicSaving(false)
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmailSuccess(false); setEmailError(null)
    setEmailForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!authUser?.id) return
    setEmailSaving(true); setEmailError(null); setEmailSuccess(false)
    try {
      await updateEmail(authUser.id, { email: emailForm.email.trim(), password: emailForm.password })
      await refetch()
      setEmailSuccess(true)
      setEmailForm({ email: '', password: '' })
    } catch {
      setEmailError('No se pudo actualizar el correo. Verifica tu contraseña.')
    } finally {
      setEmailSaving(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(URL.createObjectURL(file))
    setImageFile(file)
    e.target.value = ''
  }

  async function handleImageUpload() {
    if (!imageFile || !authUser?.id) return
    setImageUploading(true); setImageError(null)
    try {
      await updateUserImage(authUser.id, imageFile)
      await refetch()
      URL.revokeObjectURL(imagePreview!)
      setImagePreview(null); setImageFile(null)
    } catch {
      setImageError('Error al subir la imagen.')
    } finally {
      setImageUploading(false)
    }
  }

  function handleImageCancel() {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null); setImageFile(null); setImageError(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin text-violet-400" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    )
  }

  const displayName  = profile
    ? `${profile.name} ${profile.last_name1}${profile.last_name2 ? ` ${profile.last_name2}` : ''}`
    : authUser?.email ?? 'Usuario'
  const avatarSrc    = profile?.user_image ?? null
  const avatarLetter = (profile?.name ?? authUser?.email ?? 'U')[0].toUpperCase()

  return (
    <>
      <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Perfil</h1>
          <p className="mt-1 text-gray-500 dark:text-zinc-400 text-sm">Administra la información de tu cuenta.</p>
        </div>

        {/* ── Avatar card ── */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-lg shadow-black/20">
          {/* Clickable avatar */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            title="Cambiar foto de perfil"
          >
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              {avatarSrc
                ? <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
                : <span className="text-white text-4xl font-bold">{avatarLetter}</span>
              }
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <p className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl truncate">{displayName}</p>
            {profile?.title && (
              <p className="text-base font-semibold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {profile.title}
              </p>
            )}
          </div>
        </div>

        {/* ── Read-only info ── */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
          {[
            { label: 'ID de usuario',      value: authUser?.id },
            { label: 'Correo electrónico', value: profile?.email ?? authUser?.email },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 gap-1 not-last:border-b not-last:border-gray-200 dark:not-last:border-zinc-800">
              <span className="text-gray-400 dark:text-zinc-500 text-sm">{label}</span>
              <span className="text-gray-600 dark:text-zinc-300 text-sm font-medium break-all">{value ?? '—'}</span>
            </div>
          ))}
        </div>

        {/* ── Basic info form ── */}
        <form onSubmit={handleBasicSubmit} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
          <div className="px-5 sm:px-6 py-5 border-b border-gray-200 dark:border-zinc-800/80">
            <h2 className="text-gray-900 dark:text-white font-semibold text-base">Información personal</h2>
            <p className="text-gray-400 dark:text-zinc-500 text-sm mt-0.5">Nombre, apellidos, teléfono y título.</p>
          </div>

          <div className="px-5 sm:px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Nombre</label>
              <input id="name" name="name" type="text" value={basic.name} onChange={handleBasicChange} required className={inputCls} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="last_name1" className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Primer apellido</label>
                <input id="last_name1" name="last_name1" type="text" value={basic.last_name1} onChange={handleBasicChange} required className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="last_name2" className="text-gray-500 dark:text-zinc-400 text-sm font-medium">
                  Segundo apellido <span className="text-gray-400 dark:text-zinc-600">(opcional)</span>
                </label>
                <input id="last_name2" name="last_name2" type="text" value={basic.last_name2} onChange={handleBasicChange} className={inputCls} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone_number" className="text-gray-500 dark:text-zinc-400 text-sm font-medium">
                Teléfono <span className="text-gray-400 dark:text-zinc-600">(opcional)</span>
              </label>
              <input id="phone_number" name="phone_number" type="tel" value={basic.phone_number} onChange={handleBasicChange} placeholder="ej. +52 55 1234 5678" className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-gray-500 dark:text-zinc-400 text-sm font-medium">
                Título / cargo <span className="text-gray-400 dark:text-zinc-600">(opcional)</span>
              </label>
              <input id="title" name="title" type="text" value={basic.title} onChange={handleBasicChange} placeholder="ej. Desarrollador Full Stack" className={inputCls} />
            </div>
          </div>

          <div className="px-5 sm:px-6 py-4 border-t border-gray-200 dark:border-zinc-800/80 bg-gray-50 dark:bg-zinc-800/30 flex flex-col gap-3">
            <Feedback error={basicError} success={basicSuccess} successMsg="Información actualizada correctamente." />
            <div className="flex justify-end">
              <button type="submit" disabled={basicSaving} className="px-5 py-2.5 text-sm font-medium text-white rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {basicSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </form>

        {/* ── Email change form ── */}
        <form onSubmit={handleEmailSubmit} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
          <div className="px-5 sm:px-6 py-5 border-b border-gray-200 dark:border-zinc-800/80">
            <h2 className="text-gray-900 dark:text-white font-semibold text-base">Cambiar correo electrónico</h2>
            <p className="text-gray-400 dark:text-zinc-500 text-sm mt-0.5">Introduce el nuevo correo y tu contraseña actual para confirmar.</p>
          </div>

          <div className="px-5 sm:px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Nuevo correo</label>
              <input id="email" name="email" type="email" value={emailForm.email} onChange={handleEmailChange} required placeholder="nuevo@correo.com" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email-password" className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Contraseña actual</label>
              <input id="email-password" name="password" type="password" value={emailForm.password} onChange={handleEmailChange} required placeholder="••••••••" className={inputCls} />
            </div>
          </div>

          <div className="px-5 sm:px-6 py-4 border-t border-gray-200 dark:border-zinc-800/80 bg-gray-50 dark:bg-zinc-800/30 flex flex-col gap-3">
            <Feedback error={emailError} success={emailSuccess} successMsg="Correo actualizado. Vuelve a iniciar sesión para reflejar el cambio." />
            <div className="flex justify-end">
              <button type="submit" disabled={emailSaving} className="px-5 py-2.5 text-sm font-medium text-white rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {emailSaving ? 'Actualizando...' : 'Actualizar correo'}
              </button>
            </div>
          </div>
        </form>

      </div>

      {/* ── Image confirmation modal ── */}
      {imagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleImageCancel} />
          <div className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-sm p-6 flex flex-col gap-5 shadow-2xl shadow-black/50">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-900 dark:text-white font-semibold text-base">Confirmar foto de perfil</h2>
                <p className="text-gray-400 dark:text-zinc-500 text-sm mt-0.5">¿Deseas usar esta imagen como foto de perfil?</p>
              </div>
              <button
                type="button"
                onClick={handleImageCancel}
                disabled={imageUploading}
                className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 dark:bg-zinc-800 ring-2 ring-violet-500/30 shadow-xl shadow-violet-900/20">
                <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
            </div>

            {imageError && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
                {imageError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleImageCancel}
                disabled={imageUploading}
                className="flex-1 py-2.5 text-sm font-medium text-gray-500 dark:text-zinc-400 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl border border-gray-300 dark:border-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={imageUploading}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                {imageUploading ? 'Subiendo...' : 'Confirmar'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
