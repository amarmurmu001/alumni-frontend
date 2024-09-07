'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../services/api';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  graduationYear: number;
  major: string;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    } else {
      fetchUserData();
    }
  }, [router]);

  const fetchUserData = async () => {
    try {
      const data = await api.user.getProfile();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If there's an error (e.g., invalid token), remove the token and redirect to auth
      localStorage.removeItem('token');
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userData?.firstName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p><strong>Name:</strong> {userData?.firstName} {userData?.lastName}</p>
          <p><strong>Email:</strong> {userData?.email}</p>
          <p><strong>Graduation Year:</strong> {userData?.graduationYear}</p>
          <p><strong>Major:</strong> {userData?.major}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link href="/events" className="text-blue-400 hover:underline">Upcoming Events</Link></li>
            <li><Link href="/jobs" className="text-blue-400 hover:underline">Job Opportunities</Link></li>
            <li><Link href="/donations" className="text-blue-400 hover:underline">Make a Donation</Link></li>
          </ul>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}