import React from 'react'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Middle - Creator Credits */}
          <div className="text-center sm:text-left text-white/60 font-medium text-sm md:text-base">
            <span className="whitespace-nowrap">✨ Designed and created by </span>
            <Link 
              href="https://twitter.com/AmarMurmu001" 
              className="font-mono font-bold text-white hover:text-white/90
                transition-colors underline decoration-2 
                decoration-white/30 hover:decoration-white/60 inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Amar Murmu
            </Link>
            <span className="whitespace-nowrap"> 🚀</span>
          </div>

          {/* Right - Social Links */}
          <div className="flex space-x-4">
            <Link
              href="https://github.com/AmarMurmu001"
              className="text-white/60 hover:text-white transition-colors p-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <FaGithub className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer