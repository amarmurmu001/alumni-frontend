import localFont from 'next/font/local'
import Navigation from "./components/Navigation.js"
import Footer from "./components/Footer.js"
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})

export const metadata = {
  title: 'Alumni Association',
  description: 'Connect with your alumni network',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} bg-black`}>
      <body className="min-h-screen flex flex-col antialiased text-white">
        <header>
          <Navigation />
        </header>
        <main className="flex-grow container mx-auto px-6 py-8">
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  )
}
