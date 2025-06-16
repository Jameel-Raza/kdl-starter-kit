'use client';

import { useAuthStore } from '@/stores/authstore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserLayout from '../../user/layout'; // Assuming you'll have a UserLayout

export default function UserDashboard() {
  const { user, isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login'); // Redirect to user login if not logged in
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading user dashboard...</p>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-[calc(100vh-6rem)] pt-32 pb-6 px-4 bg-[#eff0fa] text-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            This is your personalized dashboard. Here you can find all your important information and manage your activities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-blue-700">My Projects</h2>
              <p className="text-gray-600">View and manage your ongoing projects.</p>
              <button className="mt-4 text-blue-600 hover:underline">View Projects</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-green-700">Notifications</h2>
              <p className="text-gray-600">Check your latest notifications and updates.</p>
              <button className="mt-4 text-green-600 hover:underline">View Notifications</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-purple-700">Account Settings</h2>
              <p className="text-gray-600">Update your profile and preferences.</p>
              <button className="mt-4 text-purple-600 hover:underline">Go to Settings</button>
            </div>
          </div>

          <div className="mt-10 p-6 bg-white rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Quick Access</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Access your recent documents</li>
              <li>Submit a new request</li>
              <li>Contact support</li>
            </ul>
          </div>
        </div>
      </div>
    </UserLayout>
  );
} 