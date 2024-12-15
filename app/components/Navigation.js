'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Clear the token and username from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    // Redirect to the login page
    router.push('/auth');
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/events', label: 'Events' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/donations', label: 'Donations' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
            Alumni Association
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-gray-300 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
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
            className="md:hidden text-white z-50 relative"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <motion.div
                className="w-6 h-6 flex flex-col justify-center items-center"
                animate={isMobileMenuOpen ? "open" : "closed"}
              >
                <motion.span
                  className="w-6 h-0.5 bg-white block transition-all"
                  variants={{
                    closed: { rotate: 0, translateY: 0 },
                    open: { rotate: 45, translateY: 8 }
                  }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-white block my-1.5"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-white block transition-all"
                  variants={{
                    closed: { rotate: 0, translateY: 0 },
                    open: { rotate: -45, translateY: -8 }
                  }}
                />
              </motion.div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              style={{ top: '64px' }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <ul className="space-y-6">
                    {menuItems.map((item) => (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="text-gray-300 hover:text-white text-2xl font-semibold block"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                {username && (
                  <div className="border-t border-gray-800 px-6 py-8">
                    <div className="text-white text-lg mb-4">Welcome, {username}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}