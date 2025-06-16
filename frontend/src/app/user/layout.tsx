'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authstore';
import UserHeader from './components/header'; // We'll create this next
import '../globals.css'; // Corrected path for global styles
import '../custom.css';
import { Roboto_Condensed } from "next/font/google";

const roboto = Roboto_Condensed({ subsets: ["latin"], weight: ["300", "400", "700"] });

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isLoginPage && (!isLoggedIn || user?.role !== 'USER')) {
      router.replace('/login'); // Redirect non-user or unauthenticated to user login
    }
  }, [isLoggedIn, user, router, isLoginPage]);

  if (!isLoggedIn || user?.role !== 'USER') {
    return null; // Don't render content if not a logged-in user
  }

  return (
    <div className={`${roboto.className} antialiased flex flex-col min-h-screen`}>
      <UserHeader />
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
} 