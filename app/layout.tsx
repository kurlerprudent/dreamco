import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HiddenGems - Empowering African Football Talent',
  description: 'From the Streets to the Stadiums: Giving Every Footballer a Chance. Connecting players, scouts, coaches, and investors across Africa.',
  keywords: 'African football, talent scouting, football players, coaches, scouts, agents, investors',
  openGraph: {
    title: 'HiddenGems - Empowering African Football Talent',
    description: 'From the Streets to the Stadiums: Giving Every Footballer a Chance',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-inter bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
