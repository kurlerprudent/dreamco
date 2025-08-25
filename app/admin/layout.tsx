import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HiddenGems Admin Dashboard',
  description: 'Administrative dashboard for HiddenGems survey analytics',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {children}
    </div>
  )
}
