'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../utils/api';

// Define an interface for the user object
interface User {
  firstName: string;
  lastName: string;
  email: string;
  graduationYear: string;
  major: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        if (!token) {
          console.log('No token found, redirecting to auth');
          router.push('/auth');
          return;
        }

        console.log('Fetching user profile...');
        const userData = await api.user.getProfile();
        console.log('User data received:', userData);
        if (Object.keys(userData).length === 0) {
          throw new Error('Empty user data received');
        }
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  console.log('Rendering dashboard, user:', user); // New log

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Graduation Year:</strong> {user.graduationYear}</p>
        <p><strong>Major:</strong> {user.major}</p>
      </div>
      {/* Add more dashboard content here */}
    </div>
  );
}