import { Outlet } from 'react-router-dom'
import Navbar from '@/shared/Navbar'
import Sidebar from '@/shared/Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)] bg-background p-margin-desktop">
        <Outlet />
      </main>
    </div>
  )
}
