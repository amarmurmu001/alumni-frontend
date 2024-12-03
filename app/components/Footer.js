import React from 'react'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Middle - Creator Credits */}
          <div className="text-center text-white/60 font-medium">
            <span>✨ Designed and created by </span>
            <Link 
              href="https://twitter.com/AmarMurmu001" 
              className="font-mono font-bold text-white hover:text-white/90
                transition-colors underline decoration-2 
                decoration-white/30 hover:decoration-white/60"
              target="_blank"
              rel="noopener noreferrer"
            >
              @Amar Murmu
            </Link>
            <span> 🚀</span>
          </div>

          {/* Right - Social Links */}
          <div className="flex space-x-4">
            <Link
              href="https://github.com/AmarMurmu001"
              className="text-white/60 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
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