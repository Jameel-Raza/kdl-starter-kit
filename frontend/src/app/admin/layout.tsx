"use client";

import { useState, useEffect } from 'react';
import { Roboto_Condensed } from "next/font/google";
import "../globals.css";
import "../custom.css";
import { usePathname, useRouter } from 'next/navigation';

import Header from './components/header';
import Sidebar from './components/sidebar';
import Footer from './components/footer';

import { SettingProvider, useSettings } from '../../context/settingscontext';
import { useAuthStore } from '../../stores/authstore'; // ✅ Adjust this import path if needed

const roboto = Roboto_Condensed({ subsets: ["latin"], weight: ["300", "400", "700"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { settings, loading } = useSettings();

  const { isLoggedIn, user } = useAuthStore(); // Get user data from store
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Add role-based protection
  useEffect(() => {
    if (!isLoginPage) {
      if (!isLoggedIn) {
        // Not logged in, redirect to login
        router.replace('/admin/login');
      } else if (user?.role !== 'ADMIN') {
        // Logged in but not admin, redirect to home
        router.replace('/');
      }
    } else if (isLoginPage && isLoggedIn && user?.role === 'ADMIN') {
      // Already logged in as admin, redirect to dashboard
      router.replace('/admin/dashboard');
    }
  }, [isLoginPage, isLoggedIn, user?.role, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Don't render admin layout for non-admin users
  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className={`${roboto.className} antialiased min-h-screen bg-slate-50`}>
      <Header onSidebarToggle={toggleSidebar} />
      <Sidebar isSidebarExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${isSidebarExpanded ? 'pl-64' : 'pl-20'}`}>
        {loading ? (
          <div className="p-4"></div>
        ) : (
          <>
            {/* You can now use `settings` anywhere inside this layout */}
            {children}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingProvider>
      <LayoutContent children={children} />
    </SettingProvider>
  );
}