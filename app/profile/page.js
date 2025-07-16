'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, 
         HiOutlineLocationMarker, HiOutlineMail, HiPencil } from 'react-icons/hi';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.user.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.message === 'Unauthorized') {
        router.push('/auth');
        return;
      }
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-1 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button 
          onClick={fetchProfile}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start border-b border-gray-800 pb-8">
          <div>
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {profile?.firstName} {profile?.lastName}
            </motion.h1>
            
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/profile/edit')}
            className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            <HiPencil className="w-4 h-4 mr-2" />
            Edit Profile
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Academic Information */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Academic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <HiOutlineAcademicCap className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Major</p>
                  <p>{profile?.major || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <HiOutlineAcademicCap className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Graduation Year</p>
                  <p>{profile?.graduationYear || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Professional Information */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <HiOutlineOfficeBuilding className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Current Job</p>
                  <p>{profile?.currentJob || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <HiOutlineLocationMarker className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Location</p>
                  <p>{profile?.location || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-gray-800"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
          <div className="flex items-center text-gray-300">
            <HiOutlineMail className="w-5 h-5 mr-3" />
            <div>
              <p className="font-medium">Email</p>
              <p>{profile?.email}</p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
} 