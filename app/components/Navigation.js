'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch the username from localStorage or your state management solution
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear the token and username from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Redirect to the login page
    router.push('/auth');
  };

  return (
    <nav className="border-b border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
            Alumni Association
          </Link>
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 items-center">
            <li><Link href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
            <li><Link href="/events" className="text-gray-300 hover:text-white">Events</Link></li>
            <li><Link href="/jobs" className="text-gray-300 hover:text-white">Jobs</Link></li>
            <li><Link href="/donations" className="text-gray-300 hover:text-white">Donations</Link></li>
            {username && (
              <>
                <li className="text-white">Welcome, {username}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <ul className="flex flex-col space-y-2">
              <li><Link href="/dashboard" className="text-gray-300 hover:text-white block">Dashboard</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-white block">Events</Link></li>
              <li><Link href="/jobs" className="text-gray-300 hover:text-white block">Jobs</Link></li>
              <li><Link href="/donations" className="text-gray-300 hover:text-white block">Donations</Link></li>
              {username && (
                <>
                  <li className="text-white">Welcome, {username}</li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}