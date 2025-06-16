'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../../../stores/authstore';
import { useRouter } from 'next/navigation';

export default function UserHeader() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to home page after logout
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/user/dashboard" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png" // You might want to use a dynamic logo here
              alt="Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <span className="text-sm font-medium">Hi {user?.name || 'User'}</span>
            <svg
              className="w-4 h-4 ml-1 transform transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
              <Link
                href="/user/profile"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 