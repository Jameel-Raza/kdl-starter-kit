'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from '@/app/frontend/components/MobileMenu';
import { useAuthStore } from '../../../stores/authstore';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.svg"
            alt="F9 Tech Logo"
            width={40}
            height={40}
            className="w-[150px] sm:w-[200px] md:w-[250px]" // Responsive logo width
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex text-xl gap-[5vw]" role="navigation" aria-label="Main navigation">
          <Link href="/" className="text-black hover:text-blue-600 transition-colors font-500">
            Home
          </Link>
          <Link href="/about" className="text-black hover:text-blue-600 transition-colors font-500">
            About
          </Link>
          <Link href="/services" className="text-black hover:text-blue-600 transition-colors font-500">
            Services
          </Link>
          <Link href="/contact" className="text-black hover:text-blue-600 transition-colors font-500">
            Contact
          </Link>
          <Link href="/submit-project" className="text-black hover:text-blue-600 transition-colors font-500">
            Submit Project Idea
          </Link>
        </nav>

        {/* Login/Register/Logout Buttons (Desktop) */}
        <div className="hidden md:block relative">
          {!isLoggedIn ? (
            <>
              <Link
                href="/register"
                className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors mr-2"
              >
                Register
              </Link>
              <button
                onClick={toggleDropdown}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Login
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <Link
                    href="/admin/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    Admin Login
                  </Link>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    User Login
                  </Link>
                </div>
              )}
            </>
          ) : (
            user?.role === 'USER' && (
              <button
                onClick={handleLogout}
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <MobileMenu />
      </div>
    </header>
  );
}

// Create a new file for MobileMenu component
// This will be created in a separate step