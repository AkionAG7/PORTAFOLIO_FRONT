export default function StackPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Stack tecnológico</h1>
          <p className="mt-1 text-zinc-400 text-sm">Administra las tecnologías de tu portafolio.</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Agregar tecnología
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 2 10 6.5v7L12 22 2 15.5v-7z" /><path d="M12 22v-6.5" /><path d="m22 8.5-10 7-10-7" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-zinc-300 font-medium">Sin tecnologías aún</p>
          <p className="text-zinc-500 text-sm mt-1">Agrega las herramientas que dominas.</p>
        </div>
      </div>
    </div>
  )
}
