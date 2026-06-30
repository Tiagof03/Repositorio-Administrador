import { useState } from "react"

export default function Navbar() {

  const [search, setSearch] = useState('')

  return (
    <header className="fixed top-0 right-0 z-40 bg-surface border-b border-outline-variant/30 flex justify-between items-center h-16 px-margin-desktop w-[calc(100%-16rem)]">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md pl-11 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
            <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          </div>
        </div>
      </div>
    </header>
  )
}
