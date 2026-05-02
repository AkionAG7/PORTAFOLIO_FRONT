import MyContactsTab from '../components/MyContactsTab'

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Contacto</h1>
        <p className="mt-1 text-zinc-400 text-sm">Gestiona tus datos de contacto y redes sociales.</p>
      </div>

      <MyContactsTab />
    </div>
  )
}
