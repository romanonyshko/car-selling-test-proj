import { Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-full">
      <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuOpen={() => setIsMobileMenuOpen(true)} />
        <main className="relative flex-1 overflow-y-auto bg-canvas px-4 pt-4 pb-6 sm:px-[34px] sm:pt-5 sm:pb-[34px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
