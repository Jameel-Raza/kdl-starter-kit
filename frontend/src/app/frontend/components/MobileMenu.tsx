'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../stores/authstore';
import { useRouter } from 'next/navigation';

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      <button
        className="md:hidden text-gray-600 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {isMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-4">
          <Link
            href="/"
            className="block text-black hover:text-blue-600 transition-colors font-500 mb-2"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block text-black hover:text-blue-600 transition-colors font-500 mb-2"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            href="/services"
            className="block text-black hover:text-blue-600 transition-colors font-500 mb-2"
            onClick={toggleMenu}
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="block text-black hover:text-blue-600 transition-colors font-500 mb-2"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <Link
            href="/submit-project"
            className="block text-black hover:text-blue-600 transition-colors font-500 mb-2"
            onClick={toggleMenu}
          >
            Submit Project Idea
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                href="/register"
                className="block bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors mb-2"
                onClick={toggleMenu}
              >
                Register
              </Link>
              <Link
                href="/admin/login"
                className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mb-2"
                onClick={toggleMenu}
              >
                Admin Login
              </Link>
              <Link
                href="/login"
                className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={toggleMenu}
              >
                User Login
              </Link>
            </>
          ) : (
            user?.role === 'USER' && (
              <button
                onClick={handleLogout}
                className="block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
            )
          )}
        </nav>
      )}
    </>
  );
}
