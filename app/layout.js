import './globals.css'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata = {
  title: 'MargaDarshak — Find the Right College',
  description: 'AI-powered college guidance for JEE & MHT-CET students.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
