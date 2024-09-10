'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/utils/api';
import EventList from '@/app/events/EventList';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [events, userData] = await Promise.all([
          api.events.getEvents({ page: 1, limit: 3, sortBy: 'date', sortOrder: 'desc' }),
          api.user.getProfile().catch(error => {
            if (error.message === 'Unauthorized') {
              router.push('/auth');
              return null;
            }
            throw error;
          })
        ]);

        if (userData) {
          setDashboardData({ events });
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      setError(`Logout failed: ${error.message}. Please try again or contact support if the issue persists.`);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!dashboardData || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className=" shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Graduation Year:</strong> {user.graduationYear}</p>
        <p><strong>Major:</strong> {user.major}</p>
        {user.currentJob && <p><strong>Current Job:</strong> {user.currentJob}</p>}
        {user.location && <p><strong>Location:</strong> {user.location}</p>}
        <button
          onClick={() => router.push('/profile/edit')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Edit Profile
        </button>
      </div>
     
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}